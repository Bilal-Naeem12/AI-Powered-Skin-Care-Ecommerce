import cv2
import numpy as np
import os
import io
import subprocess
import base64
from PIL import Image
from app.services.acne_service import predict_acne
from app.services.puffy_eyes_service import predict_puffy_eyes

# Confidence threshold
CONFIDENCE_THRESHOLD = 0.5

def detect_regions(image: Image, model_type: str):
    """Use existing acne or puffy eyes service to detect regions and generate a mask."""
    detections = []
    
    if model_type == "acne":
        detections = predict_acne(image)
    elif model_type == "puffy_eyes":
        detections = predict_puffy_eyes(image)
    else:
        raise ValueError(f"Invalid model type '{model_type}'. Choose 'acne' or 'puffy_eyes'.")

    # Create a mask for detected regions
    mask = np.zeros((image.height, image.width), dtype=np.uint8)

    for det in detections:
        x1, y1, x2, y2 = [int(coord) for coord in det["bbox"]]
        mask[y1:y2, x1:x2] = 255  # Mark detected regions

    return mask

def apply_inpainting(image: Image, mask: np.array):
    """Use IOPaint for inpainting the detected regions."""
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
        "--model=GFPGAN",  # Use IOPaint GFPGAN model
        "--device=cpu",  # Change to 'cuda' for GPU
        "--image=" + resized_image_path,
        "--mask=" + mask_path,
        "--output=" + output_dir
    ])

    # Load inpainted image
    inpainted_image_path = os.path.join(output_dir, "resized_image.png")  # Assuming this is the output file
    inpainted_image = Image.open(inpainted_image_path)

    return inpainted_image

def process_inpainting(image: Image, model_type: str):
    """Detect acne/puffy eyes and remove using inpainting."""
    mask = detect_regions(image, model_type)
    clean_image = apply_inpainting(image, mask)

    # Convert to base64 to send over API
    buffered = io.BytesIO()
    clean_image.save(buffered, format="JPEG")
    encoded_image = base64.b64encode(buffered.getvalue()).decode("utf-8")

    return encoded_image
