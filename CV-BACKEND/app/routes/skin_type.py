from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from PIL import Image
import io

from app.services.skin_type_service import predict_skin_type

router = APIRouter()

@router.post("/predict")
async def detect_skin_type(file: UploadFile = File(...)):
    try:
        data = await file.read()
        img = Image.open(io.BytesIO(data)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image: {e}")

    result = predict_skin_type(img)
    return JSONResponse(content=result)
