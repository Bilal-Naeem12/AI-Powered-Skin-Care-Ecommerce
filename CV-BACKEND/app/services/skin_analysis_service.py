"""
Runs detection & classification and returns nested JSON:
{
  detections: { acne: {objects: [...]}, puffy_eyes: {...} },
  classifications: { acne_severity: {...}, skin_type: {...} },
  scanned_image: base64JPEG
}
"""
import base64, io, logging
from typing import Dict, Any
from PIL import Image, ImageDraw

from app.services.acne_service import predict_acne
from app.services.puffy_eyes_service import predict_puffy_eyes
from app.services.acne_severity_service import predict_acne_severity
from app.services.skin_type_service import predict_skin_type

# Define the size to which images will be resized for model input
MODEL_INPUT_SIZE = (512, 512)

def skin_analysis(image: Image.Image) -> Dict[str, Any]:
    try:
        # Store original size for later resizing
        original_size = image.size

        # Resize image for model input optimization
        image_for_model = image.copy().convert("RGB").resize(MODEL_INPUT_SIZE)

        # run individual services on resized image copies
        acne_out     = predict_acne(image_for_model.copy())
        puffy_out    = predict_puffy_eyes(image_for_model.copy())
        severity_out = predict_acne_severity(image_for_model.copy())
        type_out     = predict_skin_type(image_for_model.copy())

        # detections grouping
        detections = {
            "acne":       {"objects": acne_out.get("detections", [])},
            "puffy_eyes": {"objects": puffy_out.get("detections", [])},
        }

        # normalize severity output whether nested or flat
        if "severity" in severity_out and isinstance(severity_out["severity"], dict):
            sev = severity_out["severity"]
        else:
            sev = severity_out

        # normalize skin_type output whether nested or flat
        if "label" not in type_out and "skin_type" in type_out:
            st = type_out["skin_type"]
        else:
            st = type_out

        # classifications grouping
        classifications = {
            "acne_severity": {
                "label":      sev.get("label"),
                "score":      sev.get("score"),
                "all_scores": sev.get("all_scores", {}),
            },
            "skin_type": {
                "label":      st.get("label"),
                "score":      st.get("score"),
                "all_scores": st.get("all_scores", {}),
            },
        }

        # annotate combined image on resized canvas
        combined = image_for_model.copy()
        draw = ImageDraw.Draw(combined)

        # draw acne boxes (red)
        for obj in detections["acne"]["objects"]:
            x1, y1, x2, y2 = obj.get("bbox", [0,0,0,0])
            draw.rectangle([x1, y1, x2, y2], outline="red", width=2)

        # draw puffy-eyes boxes (green)
        for obj in detections["puffy_eyes"]["objects"]:
            x1, y1, x2, y2 = obj.get("bbox", [0,0,0,0])
            draw.rectangle([x1, y1, x2, y2], outline="green", width=2)

        # Resize annotated image back to original dimensions
        combined = combined.resize(original_size)

        # encode to base64
        buf = io.BytesIO()
        combined.save(buf, format="JPEG")
        img_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")

        return {"detections": detections, "classifications": classifications, "scanned_image": img_b64}

    except Exception as e:
        logging.exception("Skin analysis failed")
        raise RuntimeError(f"Skin analysis failed: {e}") from e
