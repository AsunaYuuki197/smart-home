import sys 
from pathlib import Path

sys.path.append(str(Path(__file__).parent))

from fastapi import APIRouter, HTTPException, Query
from schemas.schema import *
from database.db import db

router = APIRouter()

user_collection = db["Users"]
automationrule_collection = db["AutomationRule"]

@router.get("/countdown", summary="Countdown Timer For Restarting Automatic Rule")
async def countdown():
    countdown = await user_collection.find_one({"user_id": user_id_ctx.get()}, {"_id": 0, "countdown": 1})
    
    if not countdown:
        raise HTTPException(status_code=404, detail="Countdown not found for user")

    return countdown


@router.post("/save/countdown", summary="Saving Countdown Timer")
async def save_countdown(payload: CountdownUpdateRequest):
    result = await user_collection.update_one(
        {"user_id": payload.user_id},
        {
            "$set": {
                "countdown.status": payload.status,
                "countdown.time": payload.time
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "Countdown updated successfully"}


@router.get("/wakeword", summary="Wake Word For AI")
async def wakeword():
    wake_word = await user_collection.find_one({"user_id": user_id_ctx.get()}, {"_id": 0, "wake_word": 1})
    
    if not wake_word:
        raise HTTPException(status_code=404, detail="Wake word not found for user")

    return wake_word


@router.post("/save/wakeword", summary="Saving Edited Wake Word For AI")
async def save_wakeword(payload: WakeWordUpdateRequest):
    result = await user_collection.update_one(
        {"user_id": payload.user_id},
        {
            "$set": {
                "wake_word.status": payload.status,
                "wake_word.text": payload.text
            }
        },
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "Wake word updated successfully"}


@router.post("/save/notify", summary="Saving Edited Notify Method")
async def save_notify(payload: FireNotiUpdateRequest):
    result = await user_collection.update_one(
        {"user_id": payload.user_id},
        {
            "$set": {
                "noti.status": payload.status,
                "noti.platform": payload.platform,
                "noti.temp": payload.temp
            }
        },
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "Fire notification updated successfully"}


@router.post("/create/timeframe", summary="Set Timeframe For Operating Device Automatically.")
async def new_timeframe(payload: TimeFrameUpdateRequest):
    device_typ = await db.Devices.find_one({'device_id': payload.device_id},{'type': 1}) 

    result = await automationrule_collection.update_one(
        {"user_id": payload.user_id, "device_id": payload.device_id},
        {
            "$set": {
                "type": device_typ['type'],
                "start_time": payload.start_time,
                "end_time": payload.end_time,
                "repeat": payload.repeat
            }
        },
        upsert=True
    )

    return {"message": "Time frame updated successfully"}


@router.delete("/delete/timeframe", summary="Delete Timeframe.")
async def remove_timeframe(
    device_id: int = Query(..., description="Device ID")
):
    result = await automationrule_collection.update_one(
        {"user_id": user_id_ctx.get(), "device_id": device_id},
        {
            "$set": {
                "start_time": None,
                "end_time": None,
                "repeat": None
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User or device not found")

    return {"message": "Time frame deleted successfully"}


@router.post("/create/motion", summary="Set Motion Dectector For Operating Device Automatically.")
async def new_motion(device_id: int):

    device_typ = await db.Devices.find_one({'device_id': device_id},{'type': 1}) 

    result = await automationrule_collection.update_one(
        {"user_id": user_id_ctx.get(), "device_id": device_id},
        {   
            "$set": {
                "type": device_typ['type'],
                "motion_trigger": "on"
            }
        },
        upsert=True
    )

  
    return {"message": "Motion trigger updated successfully"}


@router.delete("/delete/motion", summary="Delete Motion Dectector.")
async def remove_motion(device_id: int):
    result = await automationrule_collection.update_one(
        {'user_id': user_id_ctx.get(), 'device_id': device_id},
        {
            "$set": {
                "motion_trigger": None
            }
        }
    )
    if result.matched_count == 0:
        raise HTTPException(404, "User or device not found")
    
    return {"message": "Motion Trigger deleted successfully"}


@router.post("/create/light-sensor", summary="Set Light Sensor Rule For Operating Device Automatically.")
async def new_light_sensor(payload: LightSensorRule):
    device_typ = await db.Devices.find_one({'device_id': payload.device_id},{'type': 1}) 
    result = await automationrule_collection.update_one(
        {'user_id': payload.user_id, 'device_id': payload.device_id},
        {
            "$set": {
                "type": device_typ['type'],
                "light_intensity": payload.light_intensity, 
                "color": payload.color, 
                "level": payload.level
            }
        },
        upsert=True
    )

    return {"message": "Light sensor rule updated successfully"}


@router.delete("/delete/light-sensor", summary="Delete Light Sensor Rule.")
async def remove_light_sensor(device_id: int):
    result = await automationrule_collection.update_one(
        {'user_id': user_id_ctx.get(), 'device_id': device_id},
        {
            "$set": {
                "light_intensity": None, "color": None, "level": None
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(404, "User or device not found")
    
    return {"message": "Light sensor rule deleted successfully"}


@router.post("/create/ht-sensor", summary="Set Humidity & Temp Sensor Rule For Operating Device Automatically.")
async def new_ht_sensor(payload: HTSensorRule):
    device_typ = await db.Devices.find_one({'device_id': payload.device_id},{'type': 1}) 
    result = await automationrule_collection.update_one(
        {'user_id': payload.user_id, 'device_id': payload.device_id},
        {
            "$set": {
                "type": device_typ['type'],
                "humidity": payload.humidity, 
                "temperature": payload.temperature, 
                "level": payload.level
            }
        },
        upsert=True
    )

    return {"message": "Humid & Temp sensor rule updated successfully"}

@router.delete("/delete/ht-sensor", summary="Delete Humidity & Temp Sensor Rule.")
async def remove_ht_sensor(device_id: int):
    result = await automationrule_collection.update_one(
        {'user_id': user_id_ctx.get(), 'device_id': device_id},
        {
            "$set": {
                "humidity": None, "temperature": None, "level": None
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(404, "User or device not found")
    
    return {"message": "Humid & Temp sensor rule deleted successfully"}

