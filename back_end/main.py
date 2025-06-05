from fastapi import FastAPI, Query
from db import Base, engine, SessionLocal, text
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from pydantic import BaseModel
from typing import Optional, List
from model import DeviceTrafficLog

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cria as tabelas no banco de dados, se ainda não existirem
Base.metadata.create_all(bind=engine)

# Dependency para obter a sessão do banco
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/activities", tags=["Logs de Atividades"])
def read_activities():
    session = SessionLocal()
    try:
        result = session.execute(text("SELECT * FROM dbo.Activities"))
        return [dict(row._mapping) for row in result]
    finally:
        session.close()

@app.get("/devices", tags=["Dispositivos"])
def read_devices():
    session = SessionLocal()
    try:
        result = session.execute(text("SELECT * FROM dbo.Devices"))
        return [dict(row._mapping) for row in result]
    finally:
        session.close()


class DateRequest(BaseModel):
    date: str

@app.get("/device_traffic_logs", tags=["Logs de Tráfego"])
def read_device_traffic_logs(
    date: str = Query(..., description="Data no formato dd/MM/yyyy"),
    skip: int = Query(0),
    limit: int = Query(10),
    sortKey: Optional[str] = Query("LogDate"),  # valor padrão
    sortDirection: Optional[str] = Query("desc"),  # valor padrão
):
    session = SessionLocal()
    try:
        log_date = datetime.strptime(date, "%d/%m/%Y")

        # Colunas permitidas para ordenação — evite SQL Injection
        allowed_sort_keys = {
            "UploadMB": "l.UploadMB",
            "DownloadMB": "l.DownloadMB",
            "LogDate": "l.LogDate",
            "LogId": "l.LogId",
            "DeviceIP": "d.DeviceIP",
            "DeviceName": "d.DeviceName",
            "RouterIP": "d.RouterIP",
            "Description": "a.Description",
            "ProtocolName": "p.ProtocolName",
            "DepartmentName": "dp.DepartmentName",
        }

        # Validação do sortKey e sortDirection
        sort_column = allowed_sort_keys.get(sortKey, "l.LogDate")
        direction = "DESC" if sortDirection.lower() == "desc" else "ASC"

        # Query com ordenação dinâmica
        query = f"""
            SELECT l.UploadMB, l.DownloadMB, l.LogDate, l.LogId, d.DeviceIP, d.DeviceName, d.RouterIP, 
            a.Description, p.ProtocolName, dp.DepartmentName
            FROM dbo.DeviceTrafficLogsSource l
            LEFT JOIN dbo.Activities a on l.ActivityId = a.ActivityId
            LEFT JOIN dbo.Devices d on l.DeviceId = d.DeviceId
            LEFT JOIN dbo.Protocols p on l.ProtocolId = p.ProtocolId
            LEFT JOIN dbo.Departments dp on l.DepartmentId = dp.DepartmentId
            WHERE CAST(l.LogDate AS DATE) = :log_date
            ORDER BY {sort_column} {direction}
            OFFSET :skip ROWS FETCH NEXT :limit ROWS ONLY;
        """

        stmt = text(query)
        result = session.execute(stmt, {
            "log_date": log_date.date(),
            "skip": skip,
            "limit": limit
        })

        return [dict(row._mapping) for row in result]

    finally:
        session.close()

@app.get("/device_traffic_logs/count", tags=["Quantidade de Logs de Tráfego"])
def read_device_traffic_logs(date: str = Query(..., description="Data no formato dd/MM/yyyy"),):
    session = SessionLocal()
    log_date = datetime.strptime(date, "%d/%m/%Y")
    try:
        result = session.execute(text("SELECT COUNT(*) as total FROM dbo.DeviceTrafficLogsSource WHERE CAST(LogDate AS DATE) = :log_date"), {"log_date": log_date.date()})
        total = result.fetchone()[0]
        return {"total": total}
    finally:
        session.close()

@app.get("/device_traffic_logs/dates", tags=["Datas dos Logs de Tráfego"])
def read_device_traffic_logs():
    session = SessionLocal()
    try:
        result = session.execute(text("SELECT DISTINCT LogDate from dbo.DeviceTrafficLogsSource ORDER BY LogDate DESC"))
        return [dict(row._mapping) for row in result]
    finally:
        session.close()


@app.get("/protocols'", tags=["Protocolos"])
def read_protocols():
    session = SessionLocal()
    try:
        result = session.execute(text("SELECT * FROM dbo.Protocols"))
        return [dict(row._mapping) for row in result]
    finally:
        session.close()


@app.get("/departments'", tags=["Departments"])
def read_protocols():
    session = SessionLocal()
    try:
        result = session.execute(text("SELECT * FROM dbo.Departments"))
        return [dict(row._mapping) for row in result]
    finally:
        session.close()


@app.post("/device_traffic_logs", tags=["Logs de Tráfego"])
def insert_device_traffic_logs(logs: List[DeviceTrafficLog]):
    session = SessionLocal()
    try:
        for log in logs:
            log_date = datetime.strptime(log.log_date, "%d/%m/%Y").date()

            session.execute(text("""
                INSERT INTO dbo.DeviceTrafficLogs (
                    UploadMB, DownloadMB, LogDate, DeviceId, ActivityId, ProtocolId, DepartmentId
                ) VALUES (
                    :upload_mb,
                    :download_mb,
                    :log_date,
                    (SELECT DeviceId FROM dbo.Devices WHERE DeviceIP = :device_ip),
                    (SELECT ActivityId FROM dbo.Activities WHERE Description = :description),
                    (SELECT ProtocolId FROM dbo.Protocols WHERE ProtocolName = :protocol_name),
                    (SELECT DepartmentId FROM dbo.Departments WHERE DepartmentName = :department_name)
                )
            """), {
                "upload_mb": log.upload_mb,
                "download_mb": log.download_mb,
                "log_date": log_date,
                "device_ip": log.device_ip,
                "description": log.description,
                "protocol_name": log.protocol_name,
                "department_name": log.department_name
            })
        
        session.commit()
        return {"message": "Logs inseridos com sucesso."}

    except Exception as e:
        session.rollback()
        return {"error": str(e)}
    finally:
        session.close()
