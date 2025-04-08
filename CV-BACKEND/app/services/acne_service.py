from PIL import Image
import io
import base64
from sahi import AutoDetectionModel
from sahi.utils.cv import read_image
from sahi.utils.file import download_from_url
from sahi.predict import get_prediction, get_sliced_prediction, predict
import logging
from PIL import Image, ImageDraw

# Load YOLOv8 model using SAHI wrapper
MODEL_PATH = "app/models/acne_model.pt"
model = AutoDetectionModel.from_pretrained(
     model_type='yolov8',
    model_path=MODEL_PATH,
    confidence_threshold=0.3,
    device="cpu"
)

def predict_acne(image: Image.Image):
    """Run SAHI sliced prediction on input image and return results."""
    
    # Run sliced prediction
    result = get_sliced_prediction(
        image,
        detection_model=model,
        slice_height=256,
        slice_width=250,
        overlap_height_ratio=0.0,
        overlap_width_ratio=0.0
    )

    # Draw results on image
    draw = ImageDraw.Draw(image)
    detections = []

    for det in result.object_prediction_list:
        bbox = det.bbox.to_xyxy()
        confidence = det.score.value
        class_name = det.category.name

        draw.rectangle(bbox, outline="blue", width=3)

        detections.append({
            "confidence": round(confidence, 2),
            "bbox": list(map(float, bbox)),
            "class": class_name,
        })

    # Encode labeled image as base64
    buffered = io.BytesIO()
    image.save(buffered, format="JPEG")
    encoded_image = base64.b64encode(buffered.getvalue()).decode("utf-8")

    logging.info(f"[SAHI] Detections: {detections}")

    return {
        "detections": detections,
        "labeled_image": encoded_image
    }
