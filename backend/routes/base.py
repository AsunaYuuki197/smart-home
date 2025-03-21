from fastapi import APIRouter
# from .ai import router as ai_route
from .control import router as control_route
from .autorule import router as autorule
from schemas.schema import *

router = APIRouter()
# router.include_router(ai_route, prefix="/function_calling")
router.include_router(control_route, prefix="/device")
router.include_router(autorule, prefix="/autorule")

# Home
@router.get("/", summary="Home")
async def home():
    pass

# Environment info
@router.get("/env-info", summary="environment info")
async def environmment_info():
    """
    Get Time + Location + Temp
    """
    pass

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
