# File: app/services/inpainting_service.py
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

        detections = result.get("detections", [])
        if not detections:
            logger.warning("⚠️ No detections found!")
            return None, result.get("labeled_image")

        # Create mask at original resolution
        mask = np.zeros((image.height, image.width), dtype=np.uint8)
        for det in detections:
            x1, y1, x2, y2 = [int(coord) for coord in det["bbox"]]
            mask[y1:y2, x1:x2] = 255

        logger.info(f"✅ Mask created with {len(detections)} detections")
        return mask, result.get("labeled_image")

    except Exception as e:
        logger.error(f"❌ Error in detect_regions: {str(e)}")
        return None, None


def apply_inpainting(image: Image, mask: np.array, target_size=(512, 512)):
    """Use IOPaint for inpainting detected regions. Returns inpainted PIL image at target_size."""
    try:
        if mask is None:
            raise ValueError("Mask is None, cannot proceed with inpainting.")

        logger.info("🎨 Applying inpainting...")
        # Convert PIL to OpenCV BGR
        image_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

        # Resize image and mask to model input size
        resized_image = cv2.resize(image_cv, target_size)
        resized_mask  = cv2.resize(mask, target_size, interpolation=cv2.INTER_NEAREST)

        # Save temp files
        cv2.imwrite("temp_image.jpg", resized_image)
        cv2.imwrite("temp_mask.png", resized_mask)
        os.makedirs("temp_output", exist_ok=True)

        # Run IOPaint
        subprocess.run([
            "iopaint", "run",
            "--model=lama",
            "--device=cpu",
            "--image=temp_image.jpg",
            "--mask=temp_mask.png",
            "--output=temp_output"
        ], check=True)

        out_path = os.path.join("temp_output", "temp_image.png")
        if not os.path.exists(out_path):
            raise FileNotFoundError("Inpainted image was not generated.")

        # Load back as PIL
        inpainted = Image.open(out_path).convert("RGB")
        logger.info("✅ Inpainting successful!")
        return inpainted

    except Exception as e:
        logger.error(f"❌ Error in apply_inpainting: {str(e)}")
        return None


def process_inpainting(image: Image, model_type: str):
    """Detect acne/puffy eyes, inpaint, and return both labeled and cleaned images at original resolution."""
    try:
        logger.info(f"Mode Type: {model_type}")
        # keep original size
        orig_w, orig_h = image.size

        # detect regions & get labeled overlay (orig size)
        mask, labeled_b64 = detect_regions(image.copy(), model_type)
        if mask is None:
            return {"labeled_image": labeled_b64, "inpainted_image": None}

        # apply inpainting at resized resolution
        inpainted_resized = apply_inpainting(image, mask)
        if inpainted_resized is None:
            raise RuntimeError("Inpainting failed, no cleaned image generated.")

        # scale back to original resolution
        inpainted_original = inpainted_resized.resize((orig_w, orig_h), Image.LANCZOS)

        # encode cleaned image to base64
        buf = io.BytesIO()
        inpainted_original.save(buf, format="JPEG")
        clean_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")

        return {"labeled_image": labeled_b64, "inpainted_image": clean_b64}

    except Exception as e:
        logger.error(f"❌ Error in process_inpainting: {str(e)}")
        return {"error": str(e)}
