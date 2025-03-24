from fastapi import APIRouter
from .control import temp_stats, humid_stats
from schemas.schema import *

import requests 
from datetime import datetime
import asyncio

router = APIRouter()


# Last Saved Temperature and Humidity sensor value
@router.get("/", summary="Home")
async def home(user_id: int):

    last_temperature, last_humidity = await asyncio.gather(temp_stats(user_id), humid_stats(user_id))


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


# User login
@router.post("/login", summary="User Login")
async def login(data: LoginInput):
    pass


# User logout
@router.post("/logout", summary="User Logout")
async def logout():
    return {"message": "Logout successful"}


# Get user profile
@router.get("/me", summary="Get User Profile", response_model=UserProfile)
async def profile():
    """
    Retrieves the profile of the authenticated user.
    """
    pass


# Save edited user profile
@router.post("/save/me", summary="Save edited User Profile")
async def save_profile(data: UserProfile):
    """
    Updates the user profile with new data.
    """
    pass


# Get all notifications
@router.get("/notifications", summary="Get All Notifications", response_model=list[Notification])
async def notifications():
    """
    Retrieves a list of all notifications.
    """
    pass


# Search notifications
@router.get("/notifications/search", summary="Search Notifications", response_model=list[Notification])
async def search_notifications(query: str):
    """
    Searches notifications based on a query string.
    """
    pass


# Get settings
@router.get("/configuration", summary="Get Settings", response_model=Settings)
async def settings():
    """
    Retrieves all current application settings.
    """
    pass


# Save Edited settings
@router.post("/save/configuration", summary="Save Edited Settings")
async def save_settings(data: Settings):
    """
    Updates the application settings.
    """
    pass
