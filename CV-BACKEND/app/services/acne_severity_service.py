import io, base64, logging
from PIL import Image, ImageDraw
import torch
from transformers import AutoFeatureExtractor, AutoModelForImageClassification

# Load HF classification model for acne severity
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MODEL_NAME = "imfarzanansari/skintelligent-acne"
extractor = AutoFeatureExtractor.from_pretrained(MODEL_NAME)
cls_model = AutoModelForImageClassification.from_pretrained(MODEL_NAME).to(device)
cls_model.eval()


def predict_acne_severity(image: Image.Image) -> dict:
    """
    Run Hugging‑Face image classification on the input PIL image
    to produce an acne severity label and confidence scores.

    Returns:
      {
        "severity": { "label": str, "score": float, "all_scores": {label: score, ...} }
      }
    """
    # preprocess
    inputs = extractor(images=image, return_tensors="pt")
    pixel_values = inputs["pixel_values"].to(device)

    # inference
    with torch.no_grad():
        outputs = cls_model(pixel_values)
        logits = outputs.logits
        probs = torch.softmax(logits, dim=1).cpu().tolist()[0]
        pred_idx = int(torch.argmax(logits, dim=1))

    # build result
    severity_label = cls_model.config.id2label[pred_idx]
    severity_score = round(probs[pred_idx], 2)
    all_scores = {cls_model.config.id2label[i]: round(probs[i], 2)
                  for i in range(len(probs))}

    logging.info(f"[Severity] label={severity_label}, score={severity_score}")
    return {"severity": {"label": severity_label, "score": severity_score, "all_scores": all_scores}}