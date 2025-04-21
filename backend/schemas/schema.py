from datetime import date, datetime
from pydantic import BaseModel, model_validator 
from typing import Optional
from config.ai_cfg import LLMConfig
from config.general_cfg import *
from contextvars import ContextVar

user_id_ctx: ContextVar[int] = ContextVar("user_id", default=None)

class UserModel(BaseModel):
    user_id: int 

    @model_validator(mode='before')
    @classmethod
    def set_user_id(cls, data: dict) -> dict:
        data['user_id'] = user_id_ctx.get()
        return data


class ModelResponse(BaseModel):
    assistant: str = ""
    calling_result: list[str] = [""]
    wakeword_token: Optional[str] = ""

class LoginInput(BaseModel):
    email: str
    password: str

class UserSignupInput(BaseModel):
    fname: str
    lname: str
    phone: str
    email: str
    password: str
    birth: date
    gender: str

class UserProfile(UserModel):
    fname: str
    lname: str
    phone: str
    email: str
    birth: date
    gender: str

class PasswordUpdate(UserModel):
    old_password: str
    new_password: str 

class Notification(BaseModel):
    device_id: int
    message: str
    timestamp: datetime

class Statistics(BaseModel):
    fan_usage: float
    light_usage: float


class FanControlResponse(BaseModel):
    status: str
    message: str

class LightControlResponse(BaseModel):
    status: str
    message: str

class CountdownUpdateRequest(UserModel):
    status: str 
    time: int

class WakeWordUpdateRequest(UserModel):
    status: str 
    text: str

class FireNotiUpdateRequest(UserModel):
    status: str 
    platform: str
    temp: float

class TimeFrameUpdateRequest(UserModel):
    device_id: int
    start_time: datetime 
    end_time: datetime
    repeat: int

class LightSensorRule(UserModel):
    device_id: int
    mode: Optional[str] = "Default"
    light_intensity: Optional[float] = LIGHT_INTENSITY_THRESHOLD
    color: Optional[str] = LIGHTCOLOR_DEFAULT
    level: Optional[int] = LIGHTLEVEL_DEFAULT

class HTSensorRule(UserModel):
    device_id: int
    mode: Optional[str] = "Default"
    humidity: Optional[float] = FAN_HUMIDITY_THRESHOLD
    temperature: Optional[float] = FAN_TEMPERATURE_THRESHOLD
    level: Optional[int] = FAN_AUTOSPEED

class ActionLog(UserModel):
    device_id: int
    action: int # Trạng thái hiện tại hoặc muốn điều chỉnh của thiết bị, 0 = Off, 1 = On
    level: Optional[int] = None # Với quạt, level chỉnh là speed [1,100], với đèn, level chính là level [1,4]
    color: Optional[str] = "" # Màu đèn
    # timestamp: Optional[datetime] = None


class SensorData(UserModel):
    device_id: int
    value: float
    # timestamp: Optional[datetime] = None


class ModelRequest(UserModel):
    msg: str
    model_name: Optional[str] = LLMConfig.MODEL_NAME
    wakeword_token: Optional[str] = ""