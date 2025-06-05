from pydantic import BaseModel

class DeviceTrafficLog(BaseModel):
    device_name: str
    device_ip: str
    upload_mb: float
    download_mb: float
    description: str
    protocol_name: str
    department_name: str
    log_date: str  # formato: dd/MM/yyyy