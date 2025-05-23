from fastapi import APIRouter
# from .ai import router as ai_route
from .control import router as control_route
from .general import router as general_route
from .autorule import router as autorule
from auth.auth import secure_router

router = APIRouter()
# router.include_router(ai_route, prefix="/function-calling")
router.include_router(control_route, prefix="/device")
router.include_router(autorule, prefix="/autorule")
router.include_router(general_route)

secure_router(router)