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
from app.services.acne_severity_service import predict_acne_severity

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Target size for model inputs
MODEL_INPUT_SIZE = (512, 512)

def _resize_b64_image(b64_str: str, size: tuple) -> str:
    """Decode base64 image, resize, and re-encode to base64."""
    img_data = base64.b64decode(b64_str)
    buf = io.BytesIO(img_data)
    img = Image.open(buf)
    img = img.resize(size, Image.LANCZOS)
    out_buf = io.BytesIO()
    img.save(out_buf, format="JPEG")
    return base64.b64encode(out_buf.getvalue()).decode("utf-8")


def detect_regions(image: Image.Image, model_type: str, target_size=MODEL_INPUT_SIZE):
    """Detect regions on a resized copy, return mask and labeled image at original resolution."""
    try:
        orig_w, orig_h = image.size
        logger.info(f"🔍 Running detection for {model_type} on resized image {target_size}")

        # Resize for detection
        resized_img = image.resize(target_size, Image.LANCZOS)

        # Run detection on resized
        if model_type == "acne":
            result = predict_acne(resized_img)
        elif model_type == "puffy_eyes":
            result = predict_puffy_eyes(resized_img)
        else:
            raise ValueError(f"Invalid model type '{model_type}'. Choose 'acne' or 'puffy_eyes'.")

        detections = result.get("detections", [])
        labeled_b64 = result.get("labeled_image")

        if not detections:
            logger.warning("⚠️ No detections found!")
            # Resize labeled image back if exists
            if labeled_b64:
                labeled_b64 = _resize_b64_image(labeled_b64, (orig_w, orig_h))
            return None, labeled_b64

        # Create mask at resized resolution
        mask_small = np.zeros((target_size[1], target_size[0]), dtype=np.uint8)
        for det in detections:
            x1, y1, x2, y2 = [int(coord) for coord in det["bbox"]]
            mask_small[y1:y2, x1:x2] = 255

        # Scale mask to original resolution
        mask = cv2.resize(mask_small, (orig_w, orig_h), interpolation=cv2.INTER_NEAREST)
        logger.info(f"✅ Mask created with {len(detections)} detections (original size)")

        # Resize labeled image back to original resolution
        if labeled_b64:
            labeled_b64 = _resize_b64_image(labeled_b64, (orig_w, orig_h))

        return mask, labeled_b64

    except Exception as e:
        logger.error(f"❌ Error in detect_regions: {e}")
        return None, None


def apply_inpainting(image: Image.Image, mask: np.ndarray, target_size=MODEL_INPUT_SIZE):
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

        # Run IOPaint CLI
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

        # Load back as PIL image
        inpainted = Image.open(out_path).convert("RGB")
        logger.info("✅ Inpainting successful!")
        return inpainted

    except Exception as e:
        logger.error(f"❌ Error in apply_inpainting: {e}")
        return None


def process_inpainting(image: Image.Image, model_type: str):
    """Detect acne/puffy eyes, inpaint, and return both labeled and cleaned images at original resolution."""
    try:
       

        # Keep original size
        orig_w, orig_h = image.size

        # Detect regions & get labeled overlay at original resolution
        mask, labeled_b64 = detect_regions(image.copy(), model_type)

        if mask is None:
            return {"labeled_image": labeled_b64, "inpainted_image": None}

        # Apply inpainting at model input resolution
        inpainted_resized = apply_inpainting(image, mask)
        if inpainted_resized is None:
            raise RuntimeError("Inpainting failed, no cleaned image generated.")

        # Scale back to original resolution
        inpainted_original = inpainted_resized.resize((orig_w, orig_h), Image.LANCZOS)

        # Encode cleaned image to base64
        buf = io.BytesIO()
        inpainted_original.save(buf, format="JPEG")
        clean_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")

        return {"labeled_image": labeled_b64, "inpainted_image": clean_b64}

    except Exception as e:
        logger.error(f"❌ Error in process_inpainting: {e}")
        return {"error": str(e)}
