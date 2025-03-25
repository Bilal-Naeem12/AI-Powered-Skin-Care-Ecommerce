from ultralytics import YOLO
import logging
from PIL import Image, ImageDraw
import io
import base64

# Load Puffy Eyes Detection Model
MODEL_PATH = "app/models/puffy_eyes_model.pt"
model = YOLO(MODEL_PATH)

# Set confidence threshold
CONFIDENCE_THRESHOLD = 0.2

def predict_puffy_eyes(image: Image):
    """Run YOLO model on the input image, draw bounding boxes, and return detections + processed image."""

    # Run YOLO detection
    results = model(image, conf=CONFIDENCE_THRESHOLD)
    detections = []
    draw = ImageDraw.Draw(image)  # Create a drawable image

    for result in results:
        for box in result.boxes:
            if float(box.conf) >= CONFIDENCE_THRESHOLD:
                x1, y1, x2, y2 = [float(coord) for coord in box.xyxy[0]]
                confidence = float(box.conf)

                # Save detection results
                det = {
                    "confidence": confidence,
                    "bbox": [x1, y1, x2, y2]
                }
                detections.append(det)

                # Draw bounding box on image
                draw.rectangle([x1, y1, x2, y2], outline="red", width=3)
            

    logging.info(f"Puffy Eyes Model Predictions: {detections}")

    # Convert the image to a Base64 string
    buffered = io.BytesIO()
    image.save(buffered, format="JPEG")
    encoded_image = base64.b64encode(buffered.getvalue()).decode("utf-8")

    return {"detections": detections, "labeled_image": encoded_image}
