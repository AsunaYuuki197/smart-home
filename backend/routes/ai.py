import sys 
from pathlib import Path

sys.path.append(str(Path(__file__).parent))

from fastapi import APIRouter
from schemas.schema import ModelResponse
from config.ai_cfg import LLMConfig
from models.generator import Generator

router = APIRouter()
generator = Generator()

@router.post("/generate")
async def generate(msg: str):
    response = await generator.generate(msg)

    return ModelResponse(**response)