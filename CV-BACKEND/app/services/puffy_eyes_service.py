from ultralytics import YOLO
import logging
from PIL import Image

# Load Puffy Eyes Detection Model
MODEL_PATH = "app/models/puffy_eyes_model.pt"
model = YOLO(MODEL_PATH)

# Set confidence threshold
CONFIDENCE_THRESHOLD = 0.5

def predict_puffy_eyes(image: Image):
    """Run YOLO model on the input image and return detections with confidence >= 0.5."""
    results = model(image, conf=CONFIDENCE_THRESHOLD)
    detections = []
    
    for result in results:
        for box in result.boxes:
            if float(box.conf) >= CONFIDENCE_THRESHOLD:
                det = {
                    "confidence": float(box.conf),
                    "bbox": [float(coord) for coord in box.xyxy[0]]
                }
                detections.append(det)
    
    logging.info(f"Puffy Eyes Model Predictions: {detections}")
    return detections
