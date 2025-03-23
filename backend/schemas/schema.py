from datetime import datetime
from pydantic import BaseModel 
from typing import Optional

class ModelResponse(BaseModel):
    assistant: str = ""
    calling_result: str = ""

class LoginInput(BaseModel):
    username: str
    password: str

class UserProfile(BaseModel):
    name: str
    email: str

class Notification(BaseModel):
    id: int
    message: str
    timestamp: str

class Statistics(BaseModel):
    fan_usage: float
    light_usage: float

class Settings(BaseModel):
    theme: str
    notifications_enabled: bool

class FanControlResponse(BaseModel):
    status: str
    message: str

class LightControlResponse(BaseModel):
    status: str
    message: str




class ActionLog(BaseModel):
    user_id: int
    device_id: int
    action: int # Trạng thái hiện tại hoặc muốn điều chỉnh của thiết bị, 0 = Off, 1 = On
    level: Optional[int] = None # Với quạt, level chỉnh là speed [1,100], với đèn, level chính là level [1,4]
    color: Optional[str] = "" # Màu đèn
    # timestamp: Optional[datetime] = None


class SensorData(BaseModel):
    user_id: int
    device_id: int
    value: float
    # timestamp: Optional[datetime] = None

