import os
import gdown
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

MODEL_DIR = "app/models"
os.makedirs(MODEL_DIR, exist_ok=True)

models = {
    "skin_types_image_detection_model.pt": os.getenv("SKIN_MODEL_ID"),
    "acne_model.pt": os.getenv("ACNE_MODEL_ID"),
    "puffy_eyes_model.pt": os.getenv("PUFFY_EYES_MODEL_ID")
}

for filename, file_id in models.items():
    if file_id is None:
        print(f"Missing file ID for {filename}. Skipping.")
        continue

    output_path = os.path.join(MODEL_DIR, filename)
    if os.path.exists(output_path):
        print(f"{filename} already exists. Skipping download.")
        continue

    url = f"https://drive.google.com/uc?id={file_id}"
    print(f"Downloading {filename} from {url}...")
    gdown.download(url, output_path, quiet=False)
