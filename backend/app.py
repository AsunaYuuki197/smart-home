import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent))


from fastapi import FastAPI
from middleware import LogMiddleware, setup_cors
from contextlib import asynccontextmanager
from routes.base import router 
from agent.agent import start_agent, shutdown_agent


@asynccontextmanager
async def lifespan(app: FastAPI):
    start_agent()
    yield
    shutdown_agent()

app = FastAPI(lifespan=lifespan)

app.add_middleware(LogMiddleware)
setup_cors(app)
app.include_router(router)