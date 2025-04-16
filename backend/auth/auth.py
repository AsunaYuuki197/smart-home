from datetime import datetime,timezone
from uuid import uuid4
from jose import jwt, JWTError
from fastapi import HTTPException, status, Depends, APIRouter
from fastapi.routing import APIRoute
from fastapi.security import OAuth2PasswordBearer
from schemas.schema import *


SECRET_KEY = "u9rP$1z@X!7bL4mCq8#VsD^Ft3GwZhJp"
ALGORITHM = "HS256"

token_blacklist = set()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

EXCLUDE_PATHS = ["/login", "/signup", "/env-info"]

def create_access_token(data: dict):
    to_encode = data.copy()
    now = datetime.now(timezone.utc)

    to_encode.update({
        "iat": now.timestamp(),      
        "jti": str(uuid4())          
    })

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def verify_token(token: str = Depends(oauth2_scheme)):
    if token in token_blacklist:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been revoked",
        )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id_ctx.set(int(payload["sub"]))
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
    
def secure_router(router: APIRouter, exclude_paths: list[str] = EXCLUDE_PATHS, dependency = verify_token):
    for route in router.routes:
        if isinstance(route, APIRoute) and route.path not in exclude_paths:
            route.dependencies.append(Depends(dependency))
    return router
