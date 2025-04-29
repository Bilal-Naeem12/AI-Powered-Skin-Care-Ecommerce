from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from PIL import Image
import io

from app.services.acne_severity_service import predict_acne_severity

router = APIRouter()

@router.post("/predict")
async def predict_severity(file: UploadFile = File(...)):
    # Read and validate the uploaded image
    try:
        img_bytes = await file.read()
        image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {e}")

    # Get severity prediction
    result = predict_acne_severity(image)
    return JSONResponse(content=result)