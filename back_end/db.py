from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.engine import URL

connection_string = URL.create(
    "mssql+pyodbc",
    host="localhost",
    database="DeviceDataUsageTracker",
    query={
        "driver": "ODBC Driver 17 for SQL Server",
        "Trusted_Connection": "yes"
    }
)

engine = create_engine(connection_string)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

