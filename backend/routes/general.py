from fastapi import APIRouter, Depends, HTTPException, status
from .control import temp_stats, humid_stats
from schemas.schema import *

import requests 
from datetime import datetime
import asyncio

import bcrypt
from database.db import db
from utils.general_helper import *
from auth.auth import create_access_token, token_blacklist, oauth2_scheme
from fastapi.security import OAuth2PasswordRequestForm
router = APIRouter()


# Last Saved Temperature and Humidity sensor value
@router.get("/", summary="Home")
async def home():

    last_temperature, last_humidity = await asyncio.gather(temp_stats(), humid_stats())


    return {
        "temperature": last_temperature[-1]['value'],
        "humidity": last_humidity[-1]['value'],
    }


# Environment info
@router.get("/env-info", summary="environment info")
async def environment_info():
    """
    Get current time, location (based on IP), and temperature.
    """
    try:
        location_response = requests.get("http://ipinfo.io")
        location_data = location_response.json()
        city = location_data.get("city", "Unknown")
        region = location_data.get("region", "Unknown")
        country = location_data.get("country", "Unknown")
        latitude, longitude = location_data.get("loc","Unknown, Unknown").split(",")

        weather_response = requests.get(
            f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current_weather=true"
        )
        weather_data = weather_response.json()
        temperature = weather_data.get("current_weather", {}).get("temperature", "Unknown")

        # Get current time
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        return {
            "time": current_time,
            "location": f"{city}, {region}, {country}",
            "temperature": f"{temperature} °C"
        }
    except Exception as e:
        return {"error": str(e)}

user_collection = db["Users"]

@router.post("/login", summary="User Login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await user_collection.find_one({"email": form_data.username})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not bcrypt.checkpw(form_data.password.encode(), user["password"].encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": str(user["user_id"])})
    return {"access_token": access_token, "token_type": "bearer"}


#User Logout
@router.post("/logout", summary="User Logout")
async def logout(token: str = Depends(oauth2_scheme)):
    token_blacklist.add(token)
    return {"message": "Logged out successfully"}


#User Signup
@router.post("/signup", summary="User Signup")
async def signup(data: UserSignupInput):
    existing_user = await user_collection.find_one({"email": data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email already in use"
        )

    current_user_count = await user_collection.count_documents({})
    user_id = current_user_count + 1

    hashed_password = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    new_user = {
        "user_id": user_id,
        "fname": data.fname,
        "lname": data.lname,
        "phone": data.phone,
        "email": data.email,
        "password": hashed_password,  
        "birth": data.birth,
        "gender": data.gender,
        "created_at": datetime.now(),
        "countdown": {
            "status": "off",   
            "time": 15      
        }, 
        "wake_word": {
            "status": "off",
            "text": ""
        },
        "noti": {
            "status": "off",
            "platform": "",
            "temp": 50.0
        }, 
        "devices": [1,2,3,4,5,6]
    }

    await user_collection.insert_one(new_user)

    return {"message": "User registered successfully", "user_id": user_id}


# Get user profile
@router.get("/me", summary="Get User Profile")
async def profile():
    """
    Retrieves the profile of the authenticated user.
    """
    user = await db.Users.find_one({"user_id": user_id_ctx.get()}, {'_id': 0, 'noti': 0, 'user_id': 0, 'devices': 0, 'countdown': 0, 'wake_word': 0})
    return user


# Save edited user profile
@router.post("/save/me", summary="Save edited User Profile")
async def save_profile(data: UserProfile):
    result = await user_collection.update_one(
        {'user_id': data.user_id},
        {
            "$set": data.model_dump(exclude={'user_id'})
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(404, "User not found")
    
    return "successfully"


# Get all notifications
@router.get("/notifications", summary="Get All Notifications", response_model=list[Notification])
async def notifications():
    """
    Retrieves a list of all notifications.
    """
    cursor = db.Notifications.find({"user_id": user_id_ctx.get()}, {'_id': 0, 'user_id': 0}).batch_size(100)
    notifs = []
    async for doc in cursor:
        notifs.append(doc)

    return notifs


# Change notif status - on/off
@router.post("/notif/on", summary="Turn On Notif")
async def change_notif_status(status: str, platform: str):
    result = await user_collection.update_one(
        {"user_id": user_id_ctx.get()},
        {
            "$set": {
                "noti.status": status,
                "noti.platform": platform,
            }
        },
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "Notification updated successfully"}    



# Search notifications
@router.get("/notifications/search", summary="Search Notifications", response_model=list[Notification])
async def search_notifications(query: str):
    """
    Searches notifications based on a query string.
    Covered in FE
    """
    pass


# Change password
@router.post("/update-password", summary="Change user password")
async def update_password(data: PasswordUpdate):
    user = await user_collection.find_one({"user_id": data.user_id})
    
    if not user or not bcrypt.checkpw(data.old_password.encode(), user["password"].encode()):
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    hashed_password = bcrypt.hashpw(data.new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    await user_collection.update_one({"user_id": data.user_id}, {"$set": {"password": hashed_password}})
    return {"message": "password updated"}


# Get settings
@router.get("/configuration", summary="Get Settings")
async def settings():
    """
    Retrieves all current application settings.
    """
    user = await user_collection.find_one({"user_id": user_id_ctx.get()}, {"noti": 1, "countdown": 1, "wake_word": 1})

    cursor = db.AutomationRule.find({'user_id': user_id_ctx.get()})
    autorule = {}

    async for doc in cursor:
        rule = {}

        time_rule = extract_rule(doc, timeRule_fields)

        if time_rule:
            rule['time_rule'] = time_rule 

        if doc.get('type') == 'Fan':
            htsensor_rule = extract_rule(doc, htsensorRule_fields)
            if htsensor_rule:
                rule['htsensor_rule'] = htsensor_rule 

        elif doc.get('type') == 'Light':
            motion_rule = extract_rule(doc, motionRule_fields)
            if motion_rule:
                rule['motion_rule'] = motion_rule 

            lightsensor_rule = extract_rule(doc, lightsensorRule_fields)
            if lightsensor_rule:
                rule['lightsensor_rule'] = lightsensor_rule 
        else:
            continue
        
        if not rule:
            continue

        if doc.get('type') in autorule.keys():
            autorule[doc['type']].append({doc['device_id']: rule})
        else:
            autorule[doc['type']] = [{doc['device_id']: rule}]

    return {
        'noti': user['noti'],
        'countdown': user['countdown'],
        'wake_word': user['wake_word'],
        'fan_autorule': autorule.get('Fan'),
        'light_autorule': autorule.get('Light'),
    }


# Save Edited settings
@router.post("/save/configuration", summary="Save Edited Settings")
async def save_settings():
    """
    Updates the application settings.
    """
    pass


# Device/app FCM token
@router.post("/register_token", summary="Device/App FCM token")
async def register_token(token: str):
    user = await user_collection.find_one({'user_id': user_id_ctx.get()})

    if user:
        fcm_tokens = user.get('fcm_tokens', [])
        print(fcm_tokens)
        if token not in fcm_tokens:
            fcm_tokens.append(token)
            await user_collection.update_one(
                {'user_id': user_id_ctx.get()},
                {'$set': {'fcm_tokens': fcm_tokens}}
            )

        return {"message": "FCM token saved"}

    raise HTTPException(404, "User not found")

