from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
from PIL import Image
import io
from app.services.inpainting_service import process_inpainting
from app.services.acne_severity_service import predict_acne_severity
router = APIRouter()

@router.post("/inpaint/")
async def remove_skin_issues(file: UploadFile = File(...), model_type: str = Form("acne")):
    """API endpoint to detect and remove acne or puffy eyes using inpainting."""
    try:
        
        if model_type not in ["acne", "puffy_eyes"]:
            raise HTTPException(status_code=400, detail="Invalid model type. Choose 'acne' or 'puffy_eyes'.")

        # Load image
        image = Image.open(io.BytesIO(await file.read()))
 # Check severity if acne
        if model_type == "acne":
            severity_result = predict_acne_severity(image.copy())["severity"]
            severity_level = int(severity_result["label"].split()[-1])  # e.g., "level 4" → 4

            if severity_level >= 3:
                raise HTTPException(
                    status_code=400,
                    detail="Acne severity too high for inpainting"
                )
        # Process inpainting
        result = process_inpainting(image, model_type)

        # Return both labeled image & inpainted image
        return JSONResponse(content={
            "labeled_image": result["labeled_image"],  # Image with bounding boxes
            "inpainted_image": result["inpainted_image"]  # Image after inpainting
        })
    except HTTPException as http_err:
     raise http_err  # ✅ Let FastAPI handle this as-is

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
