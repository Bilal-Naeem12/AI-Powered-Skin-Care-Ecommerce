import cv2
import numpy as np
import os
import io
import subprocess
import base64
import logging
from PIL import Image
from app.services.acne_service import predict_acne
from app.services.puffy_eyes_service import predict_puffy_eyes

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)



def detect_regions(image: Image, model_type: str):
    """Use acne or puffy eyes service to detect regions and generate a mask."""
    try:
        logger.info(f"🔍 Running detection for {model_type} model")

        if model_type == "acne":
            result = predict_acne(image)
        elif model_type == "puffy_eyes":
            result = predict_puffy_eyes(image)
        else:
            raise ValueError(f"Invalid model type '{model_type}'. Choose 'acne' or 'puffy_eyes'.")

        detections = result.get("detections", [])  # Extract detections
        if not detections:
            logger.warning("⚠️ No detections found!")
            return None, result["labeled_image"]

        # Create a mask
        mask = np.zeros((image.height, image.width), dtype=np.uint8)
        for det in detections:
            x1, y1, x2, y2 = [int(coord) for coord in det["bbox"]]
            mask[y1:y2, x1:x2] = 255  # Mark detected regions

        logger.info(f"✅ Mask created with {len(detections)} detections")
        return mask, result["labeled_image"]

    except Exception as e:
        logger.error(f"❌ Error in detect_regions: {str(e)}")
        return None, None

def apply_inpainting(image: Image, mask: np.array):
    """Use IOPaint for inpainting detected regions."""
    try:
        if mask is None:
            raise ValueError("Mask is None, cannot proceed with inpainting.")

        logger.info("🎨 Applying inpainting...")
        image_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)  # Convert PIL image to OpenCV

        # Save temporary files
        mask_path = "temp_mask.png"
        image_path = "temp_image.jpg"
        resized_image_path = "temp_resized_image.jpg"
        output_dir = "temp_output"

        cv2.imwrite(mask_path, mask)
        cv2.imwrite(image_path, image_cv)

        # Resize image for inpainting
        resized_image = cv2.resize(image_cv, (512, 512))
        cv2.imwrite(resized_image_path, resized_image)

        # Run IOPaint inpainting
        os.makedirs(output_dir, exist_ok=True)
        subprocess.run([
            "iopaint", "run",
            "--model=lama",  # ✅ Change model if needed
            "--device=cpu",  # Change to 'cuda' for GPU
            "--image=" + resized_image_path,
            "--mask=" + mask_path,
            "--output=" + output_dir
        ], check=True)

        # Validate inpainted image exists
        inpainted_image_path = os.path.join(output_dir, "temp_resized_image.png")
        if not os.path.exists(inpainted_image_path):
            raise FileNotFoundError("Inpainted image was not generated.")

        # Load inpainted image
        inpainted_image = Image.open(inpainted_image_path)
        logger.info("✅ Inpainting successful!")

        return inpainted_image

    except Exception as e:
        logger.error(f"❌ Error in apply_inpainting: {str(e)}")
        return None

def process_inpainting(image: Image, model_type: str):
    """Detect acne/puffy eyes and remove using inpainting."""
    try:
        logger.info(f"Mode Type: {str(model_type)}")
        image_copy = image.copy()
        mask, labeled_image = detect_regions(image_copy, model_type)

        if mask is None:
            logger.warning("⚠️ No regions detected, skipping inpainting.")
            return {"labeled_image": labeled_image, "inpainted_image": None}

        clean_image = apply_inpainting(image, mask)

        if clean_image is None:
            raise ValueError("Inpainting failed, no cleaned image generated.")

        # Convert cleaned image to base64
        buffered = io.BytesIO()
        clean_image.save(buffered, format="JPEG")
        encoded_clean_image = base64.b64encode(buffered.getvalue()).decode("utf-8")

        return {
            "labeled_image": labeled_image,
            "inpainted_image": encoded_clean_image
        }

    except Exception as e:
        logger.error(f"❌ Error in process_inpainting: {str(e)}")
        return {"error": str(e)}
