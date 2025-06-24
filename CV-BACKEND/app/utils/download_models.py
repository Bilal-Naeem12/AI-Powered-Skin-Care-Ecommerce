import os
import gdown
from dotenv import load_dotenv

def download_models():
    load_dotenv()
    MODEL_DIR = "app/models"

    # ✅ Skip download if the model folder already exists and has files
    if os.path.isdir(MODEL_DIR) and len(os.listdir(MODEL_DIR)) > 0:
        print(f"✅ Models already downloaded in '{MODEL_DIR}'. Skipping download.")
        return

    os.makedirs(MODEL_DIR, exist_ok=True)

    models = {
        "skin_types_image_detection_model.pt": os.getenv("SKIN_MODEL_ID"),
        "acne_model.pt": os.getenv("ACNE_MODEL_ID"),
        "puffy_eyes_model.pt": os.getenv("PUFFY_EYES_MODEL_ID")
    }

    for filename, file_id in models.items():
        if not file_id:
            print(f"⚠️ Missing file ID for {filename}. Skipping.")
            continue

        output_path = os.path.join(MODEL_DIR, filename)
        if os.path.exists(output_path):
            print(f"✅ {filename} already exists. Skipping.")
            continue

        url = f"https://drive.google.com/uc?id={file_id}"
        print(f"⬇️ Downloading {filename}...")
        gdown.download(url, output_path, quiet=False)

    print("✅ All models downloaded successfully.")
