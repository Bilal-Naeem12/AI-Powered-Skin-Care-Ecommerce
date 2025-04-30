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
MAX_SHOW = 2  # only show up to 2 detections

def predict_puffy_eyes(image: Image):
    """Run YOLO model on the input image, draw up to MAX_SHOW highest-confidence boxes,
       and return detections + processed image plus max_confidence if >2 initial boxes."""
    
    # Run YOLO detection
    results = model(image, conf=CONFIDENCE_THRESHOLD)
    all_dets = []
    
    for result in results:
        for box in result.boxes:
            conf = float(box.conf)
            if conf >= CONFIDENCE_THRESHOLD:
                x1, y1, x2, y2 = [float(c) for c in box.xyxy[0]]
                all_dets.append({"confidence": conf, "bbox": [x1, y1, x2, y2]})

    # Sort by confidence descending
    all_dets.sort(key=lambda d: d["confidence"], reverse=True)

    # Keep only top MAX_SHOW
    keep = all_dets[:MAX_SHOW]
    extra = all_dets[MAX_SHOW:]
    if extra:
        max_conf = extra[0]["confidence"]
    else:
        max_conf = None

    # Draw only kept boxes
    draw = ImageDraw.Draw(image)
    for det in keep:
        x1, y1, x2, y2 = det["bbox"]
        draw.rectangle([x1, y1, x2, y2], outline="red", width=3)

    
    # Encode annotated image
    buf = io.BytesIO()
    image.save(buf, format="JPEG")
    encoded_image = base64.b64encode(buf.getvalue()).decode("utf-8")

    out = {"detections": keep, "labeled_image": encoded_image}
    if max_conf is not None:
        out["max_confidence"] = max_conf
    return out
