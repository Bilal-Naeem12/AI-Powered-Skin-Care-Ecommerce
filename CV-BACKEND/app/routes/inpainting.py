from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from PIL import Image
import io
from app.services.inpainting_service import process_inpainting

router = APIRouter()

@router.post("/inpaint/")
async def remove_skin_issues(file: UploadFile = File(...), model_type: str = "acne"):
    """API endpoint to detect and remove acne or puffy eyes using inpainting."""
    try:
        if model_type not in ["acne", "puffy_eyes"]:
            return JSONResponse(content={"error": "Invalid model type. Choose 'acne' or 'puffy_eyes'."}, status_code=400)

        image = Image.open(io.BytesIO(await file.read()))
        cleaned_image_base64 = process_inpainting(image, model_type)

        return JSONResponse(content={"cleaned_image": cleaned_image_base64})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
