from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from PIL import Image
import io
from app.services.puffy_eyes_service import predict_puffy_eyes

router = APIRouter()

@router.post("/predict/")
async def detect_puffy_eyes(file: UploadFile = File(...)):
    """API endpoint to detect Puffy Eyes in an uploaded image."""
    try:
        image = Image.open(io.BytesIO(await file.read()))
        detections = predict_puffy_eyes(image)
        return JSONResponse(content={"result": detections})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
