from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from PIL import Image
import io

from app.services.skin_analysis_service import skin_analysis

router = APIRouter()

@router.post("/predict")
async def analyze_skin(file: UploadFile = File(...)):
    image = Image.open(io.BytesIO(await file.read())).convert("RGB")
    result = skin_analysis(image)
    return JSONResponse(content=result)
