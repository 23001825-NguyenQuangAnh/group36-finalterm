# training_assistant/utils_assistant.py
from pathlib import Path
import joblib
from typing import Any

PROJECT_ROOT = Path(__file__).resolve().parents[1]


def get_data_path(filename: str) -> Path:
    return PROJECT_ROOT / "data" / filename


def get_models_path(filename: str) -> Path:
    models_dir = PROJECT_ROOT / "models_assistant"
    models_dir.mkdir(parents=True, exist_ok=True)
    return models_dir / filename


def save_model(obj: Any, filename: str):
    path = get_models_path(filename)
    joblib.dump(obj, path)
    print(f"✔ Saved {filename} → {path}")


def load_model(filename: str) -> Any:
    path = get_models_path(filename)
    if not path.exists():
        raise FileNotFoundError(f"❌ Model not found: {path}")
    return joblib.load(path)
