import os
from dotenv import load_dotenv

load_dotenv()

MODEL_CONFIDENCE_THRESHOLD = float(os.getenv("MODEL_CONFIDENCE", 0.5))
