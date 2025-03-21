import sys 
from pathlib import Path

sys.path.append(str(Path(__file__).parent))

from fastapi import APIRouter
from schemas.schema import *

router = APIRouter()

# Turn on fan
@router.post("/fan/on", summary="Turn On Fan")
async def turn_on_fan():
    pass


# Turn off fan
@router.post("/fan/off", summary="Turn Off Fan")
async def turn_off_fan():
    pass


# Change fan speed
@router.post("/fan/speed", summary="Change Fan Speed")
async def change_fan_speed(speed: int):
    pass


# Turn on light
@router.post("/light/on", summary="Turn On Light")
async def turn_on_light():
    pass


# Turn off light
@router.post("/light/off", summary="Turn Off Light")
async def turn_off_light():
    pass


# Change light color
@router.post("/light/color", summary="Change Light Color")
async def change_light_color(color: str):
    pass

# Change light level
@router.post("/light/level", summary="Change Light Level")
async def change_light_level(level: int):
    pass


# Turn on pump
@router.post("/pump/on", summary="Turn On pump")
async def turn_on_pump():
    pass


# Turn off pump
@router.post("/pump/off", summary="Turn Off pump")
async def turn_off_pump():
    pass


# Fan statistics
@router.get("/fan/statistics", summary="Fan Usage Statistics", response_model=Statistics)
async def fan_statistics():
    """
    Retrieves statistics of fan usage.
    """
    pass


# Light statistics
@router.get("/light/statistics", summary="Light Usage Statistics", response_model=Statistics)
async def light_statistics():
    """
    Retrieves statistics of light usage.
    """
    pass


# Temperature & Humidity sensor statistics
@router.get("/temp_hum_sensor/statistics", summary="Temperature & Humidity sensor statistics", response_model=Statistics)
async def fan_statistics():
    """
    Retrieves statistics of temperature and humidity sensor.
    """
    pass



