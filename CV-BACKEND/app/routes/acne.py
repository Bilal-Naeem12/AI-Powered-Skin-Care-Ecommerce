from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from PIL import Image
import io
from app.services.acne_service import predict_acne

router = APIRouter()

@router.post("/predict/acne/")
async def detect_acne(file: UploadFile = File(...)):
    image = Image.open(io.BytesIO(await file.read()))
    detections = predict_acne(image)
    return JSONResponse(content={"detections": detections})
