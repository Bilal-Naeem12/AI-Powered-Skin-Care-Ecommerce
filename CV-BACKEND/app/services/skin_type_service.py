import io, base64
from PIL import Image, ImageDraw
import torch
from transformers import ViTImageProcessor, ViTForImageClassification
from transformers.models.vit.modeling_vit import ViTSelfAttention

# ——— Setup device ———
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ——— Load processor & model architecture ———
processor = ViTImageProcessor.from_pretrained("google/vit-base-patch16-224-in21k")
model = ViTForImageClassification.from_pretrained(
    "google/vit-base-patch16-224-in21k",
    num_labels=3,
    id2label={0: "Oily", 1: "Dry", 2: "Normal"},
    label2id={"Oily": 0, "Dry": 1, "Normal": 2},
)

# ——— Load your fine-tuned weights (full model folder) ———
model_path = "app/models/skin_types_image_detection_model.pt"
# If you saved with torch.save(model), load directly:
model = torch.load(model_path, map_location=device)
# If you saved state_dict only, instead do:
# state_dict = torch.load(model_path, map_location=device)
# model.load_state_dict(state_dict)

model.to(device).eval()

# ——— Patch ViTSelfAttention to add dropout if missing ———
for module in model.modules():
    if isinstance(module, ViTSelfAttention) and not hasattr(module, "dropout"):
        prob = getattr(module, "attention_probs_dropout_prob", 0.0)
        module.dropout = torch.nn.Dropout(prob)


def predict_skin_type(image: Image.Image):
    """
    Classify input PIL image into skin type (Oily/Dry/Normal).
    Returns dict with label, score, all_scores, and base64-annotated image.
    """
    # preprocess
    inputs = processor(images=image, return_tensors="pt")
    pixel_values = inputs["pixel_values"].to(device)

    # inference
    with torch.no_grad():
        outputs = model(pixel_values=pixel_values)
        logits = outputs.logits
        probs = torch.softmax(logits, dim=1).cpu().tolist()[0]
        idx = int(torch.argmax(logits, dim=1))
        label = model.config.id2label[idx]
        score = round(probs[idx], 2)
        all_scores = {model.config.id2label[i]: round(probs[i], 2) for i in range(len(probs))}

    # annotate
    draw = ImageDraw.Draw(image)
    draw.text((10, 10), f"{label} ({score})", fill="red")

    # encode to base64
    buf = io.BytesIO()
    image.save(buf, format="JPEG")
    img_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")

    return {"label": label, "score": score, "all_scores": all_scores, "labeled_image": img_b64}
