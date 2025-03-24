import sys 
from pathlib import Path

sys.path.append(str(Path(__file__).parent))

from fastapi import APIRouter
from schemas.schema import ModelResponse, ModelRequest
from models.generator import Generator

router = APIRouter()
generator = Generator()

@router.post("/generate")
async def generate(ModelRequest: ModelRequest):
    
    try:
        response = await generator.chat(**ModelRequest.model_dump())
        return ModelResponse(**response)
    except Exception as e:
        return {"error": str(e)}