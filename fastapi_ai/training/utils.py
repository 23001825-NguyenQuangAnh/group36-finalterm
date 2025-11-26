# training/utils.py
from pathlib import Path
from typing import Any
import joblib

# thư mục gốc project = thư mục chứa main.py
PROJECT_ROOT = Path(__file__).resolve().parents[1]


def get_data_path(filename: str) -> Path:
    return PROJECT_ROOT / "data" / filename


def get_models_path(filename: str) -> Path:
    models_dir = PROJECT_ROOT / "models"
    models_dir.mkdir(parents=True, exist_ok=True)
    return models_dir / filename


def save_model(obj: Any, filename: str) -> None:
    path = get_models_path(filename)
    joblib.dump(obj, path)
    print(f"✅ Saved {filename} -> {path}")


def load_model(filename: str) -> Any:
    path = get_models_path(filename)
    if not path.exists():
        raise FileNotFoundError(f"❌ Model file not found: {path}")
    return joblib.load(path)
