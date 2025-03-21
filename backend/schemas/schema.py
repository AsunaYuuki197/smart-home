from pydantic import BaseModel 

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