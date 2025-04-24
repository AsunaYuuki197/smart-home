import sys 
from pathlib import Path
from datetime import datetime, timedelta, timezone

sys.path.append(str(Path(__file__).parent))

from fastapi import APIRouter, HTTPException, Query
from schemas.schema import *
from database.db import db
from utils.redis_service import is_paused, pause_user, resume_user
from background.tasks import schedule_countdown, celery
from celery.result import AsyncResult
router = APIRouter()

user_collection = db["Users"]
automationrule_collection = db["AutomationRule"]

@router.get("/countdown", summary="Countdown Timer For Restarting Automatic Rule")
async def countdown():
    countdown_user = await user_collection.find_one({"user_id": user_id_ctx.get()}, {"_id": 0, "countdown": 1})
    
    if countdown_user.get("countdown") is None:
        raise HTTPException(status_code=404, detail="Countdown not found for user")

    if not countdown_user['countdown'].get("task_id") is None:
        task = AsyncResult(countdown_user['countdown'].get("task_id"))
        eta = countdown_user['countdown'].get('eta')
        if task.state in ['PENDING', 'STARTED'] and eta:
            remaining_time = (eta - datetime.now(timezone.utc)).total_seconds()
            countdown_user['countdown']['remaining_time'] = max(remaining_time, 0)
        elif task.state == 'SUCCESS':
            countdown_user['countdown']['remaining_time'] = 0
        else:
            countdown_user['countdown']['remaining_time'] = None

    return countdown_user


@router.post("/save/countdown", summary="Saving Countdown Timer")
async def save_countdown(payload: CountdownUpdateRequest):
    end_time = datetime.now(timezone.utc) + timedelta(seconds=payload.time)
    user = await user_collection.find_one({"user_id": payload.user_id, "countdown.status": "on"}, {'countdown': 1})

    '''
    Check mode by redis is_paused

    Automode - task_id and eta no need, so we check if it exists, we revoke it all, also we don't trigger schedule_countdown here cuz its triggered by manual action. By manual action, we will save to db the new schedule_countdown task_id with new endtime and eta.

    Manual mode means there might/mightn't the running countdown (task_id), we revoke it, also save to db the new schedule_countdown task_id with new endtime and eta in case running countdown. 
    '''
    if user and user['countdown'].get('task_id'):
        AsyncResult(user['countdown'].get('task_id'), app=celery).revoke(wait=True,timeout=3)
            
    if payload.status == "on":
        task_id = schedule_countdown(payload.user_id, end_time) if await is_paused(payload.user_id) else None

        result = await user_collection.update_one(
            {"user_id": payload.user_id},
            {
                "$set": {
                    "countdown.status": payload.status,
                    "countdown.time": payload.time,
                    "countdown.task_id": task_id,
                    "countdown.eta": end_time.isoformat() if task_id else None,
                }
            },
            upsert=True
        )
        return {"message": "Countdown started", "task_id": task_id}
    

    if payload.status == "off":
        result = await user_collection.update_one(
            {"user_id": payload.user_id},
            {
                "$set": {
                    "countdown.status": payload.status,
                    "countdown.time": payload.time,
                    "countdown.task_id": None,
                    "countdown.eta": None,
                }
            },
            upsert=True
        )

        return {"message": "Countdown updated successfully"}


    raise HTTPException(status_code=404, detail="No countdown to cancel")        


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


@router.post("/save/notify", summary="Saving Edited Hot Notify Method")
async def save_notify(payload: FireNotiUpdateRequest):
    result = await user_collection.update_one(
        {"user_id": payload.user_id},
        {
            "$set": {
                "noti.hot_notif": payload.status,
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
                "level": payload.level,
                "mode": payload.mode
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
                "light_intensity": None, "color": None, "level": None, "mode": None
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
                "level": payload.level,
                "mode": payload.mode
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
                "humidity": None, "temperature": None, "level": None, "mode": None
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(404, "User or device not found")
    
    return {"message": "Humid & Temp sensor rule deleted successfully"}



@router.get("/pause", summary="Pause auto mode")
async def pause_auto():
    await pause_user(user_id_ctx.get())
    return {"message": f"Manual command for user {user_id_ctx.get()}. Auto mode paused."}


@router.get("/resume", summary="Resume auto mode")
async def resume_auto():
    await resume_user(user_id_ctx.get())
    return {"message": f"Auto mode resumed for user {user_id_ctx.get()}."}
