# app/services/skin_analysis_service.py
"""
High-level service that runs both acne- and puffy-eyes detection, draws colour-
coded boxes on a single copy of the image, and returns a unified result.
"""
import base64
import io
import logging
from typing import Dict, Any

from PIL import Image, ImageDraw

from app.services.acne_service import predict_acne
from app.services.puffy_eyes_service import predict_puffy_eyes


def skin_analysis(image: Image.Image) -> Dict[str, Any]:
    """
    Args
    ----
    image : PIL.Image
        Raw image uploaded by the client.

    Returns
    -------
    Dict
        {
          "acne": <output-of-predict_acne>,
          "puffy_eyes": <output-of-predict_puffy_eyes>,
          "scanned_image": "<base64-jpeg>"
        }
    """

    try:
        # --- run models on copies so they don’t interfere ----------------
        acne_result = predict_acne(image.copy())
        puffy_result = predict_puffy_eyes(image.copy())

        # --- prepare combined image --------------------------------------
        combined = image.copy().convert("RGB")
        draw = ImageDraw.Draw(combined)

        # acne boxes → RED
        for det in acne_result["detections"]:
            x1, y1, x2, y2 = det["bbox"]
            draw.rectangle([x1, y1, x2, y2], outline="red", width=3)

        # puffy-eyes boxes → GREEN
        for det in puffy_result["detections"]:
            x1, y1, x2, y2 = det["bbox"]
            draw.rectangle([x1, y1, x2, y2], outline="green", width=3)

        # encode combined image
        buf = io.BytesIO()
        combined.save(buf, format="JPEG")
        combined_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")

        return {
            "acne": acne_result,
            "puffy_eyes": puffy_result,
            "scanned_image": combined_b64,
        }

    except Exception as exc:
        logging.exception("Skin analysis failed")
        # Let the router or higher-level handler turn this into an HTTP error
        raise RuntimeError(f"Skin analysis failed: {exc}") from exc
