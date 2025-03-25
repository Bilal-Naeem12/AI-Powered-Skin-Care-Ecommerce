from ultralytics import YOLO
import logging
from PIL import Image

# Load Acne Detection Model
MODEL_PATH = "app/models/acne_model.pt"
model = YOLO(MODEL_PATH)

def predict_acne(image: Image, conf_threshold=0.5):
    results = model(image, conf=conf_threshold)
    detections = []
    
    for result in results:
        for box in result.boxes:
            det = {
                "confidence": float(box.conf),
                "bbox": [float(coord) for coord in box.xyxy[0]]
            }
            detections.append(det)
    
    logging.info(f"Acne Model Predictions: {detections}")
    return detections
