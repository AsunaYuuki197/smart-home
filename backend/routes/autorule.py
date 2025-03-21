import sys 
from pathlib import Path

sys.path.append(str(Path(__file__).parent))

from fastapi import APIRouter
from schemas.schema import *

router = APIRouter()


@router.get("/countdown", summary="Countdown Timer For Restarting Automatic Rule")
def countdown():
    """
    Input: user id
    """
    pass


@router.post("/save/countdown", summary="Saving Countdown Timer")
def save_countdown():
    """
    Input: user id, status of countdown (off/on - false/true), time (countdown time)   
    """
    pass


@router.get("/wakeword", summary="Wake Word For AI")
def wakeword():
    """
    Input: user id
    """
    pass


@router.post("/save/wakeword", summary="Saving Edited Wake Word For AI")
def save_wakeword():
    """
    Input: user id, status of wakeword (off/on - false/true), text (wake word text)   
    """
    pass



@router.post("/save/notify", summary="Saving Edited Notify Method")
def save_notify():
    """
    Input: user id, status of notify (off/on - false/true), platform (notify method)   
    """
    pass


@router.post("/create/timeframe", summary="Set Timeframe For Operating Device Automatically.")
def new_timeframe():
    """
    Input: User Id, Device id, Start time, End time, Repeat
    """
    pass


@router.delete("/delete/timeframe", summary="Delete Timeframe.")
def remove_timeframe():
    """
    Input: User Id, Device id
    """
    pass



@router.post("/create/motion", summary="Set Motion Dectector For Operating Device Automatically.")
def new_motion():
    """
    Input: User Id, Device id
    """
    pass


@router.delete("/delete/motion", summary="Delete Motion Dectector.")
def remove_motion():
    """
    Input: User Id, Device id
    """
    pass


@router.post("/create/light-sensor", summary="Set Light Sensor Rule For Operating Device Automatically.")
def new_light_sensor():
    """
    Input: User Id, Device id, Light Intensity, Color, Level
    """
    pass


@router.delete("/delete/light-sensor", summary="Delete Light Sensor Rule.")
def remove_light_sensor():
    """
    Input: User Id, Device id
    """
    pass


@router.post("/create/ht-sensor", summary="Set Humidity & Temp Sensor Rule For Operating Device Automatically.")
def new_ht_sensor():
    """
    Input: User Id, Device id, Light Intensity, Color, Level
    """
    pass


@router.delete("/delete/ht-sensor", summary="Delete Humidity & Temp Sensor Rule.")
def remove_ht_sensor():
    """
    Input: User Id, Device id
    """
    pass

