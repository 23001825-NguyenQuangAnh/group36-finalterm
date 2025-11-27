# training/utils.py
from pathlib import Path
from typing import Any
import joblib

# thư mục gốc project = thư mục chứa main.py
# Dùng để xác định đường dẫn tuyệt đối trong toàn project
PROJECT_ROOT = Path(__file__).resolve().parents[1]


def get_data_path(filename: str) -> Path:
    """
    Trả về đường dẫn tới file dữ liệu trong thư mục /data.
    Dùng khi load dataset để train mô hình.
    """
    return PROJECT_ROOT / "data" / filename


def get_models_path(filename: str) -> Path:
    """
    Tạo đường dẫn đầy đủ tới file mô hình nằm trong thư mục /models.
    Nếu thư mục models chưa tồn tại → tự động tạo.
    """
    models_dir = PROJECT_ROOT / "models"
    models_dir.mkdir(parents=True, exist_ok=True)  # đảm bảo thư mục tồn tại
    return models_dir / filename


def save_model(obj: Any, filename: str) -> None:
    """
    Lưu mô hình ML dưới dạng file .pkl bằng joblib.dump.
    Dùng cho các mô hình: urgency, importance, duration, category, vectorizer...
    """
    path = get_models_path(filename)
    joblib.dump(obj, path)
    print(f"✅ Saved {filename} -> {path}")  # log vị trí file được lưu


def load_model(filename: str) -> Any:
    """
    Load một mô hình ML từ file .pkl.
    Nếu file không tồn tại → báo lỗi để tránh dùng mô hình trống.
    """
    path = get_models_path(filename)
    if not path.exists():
        raise FileNotFoundError(f"❌ Model file not found: {path}")
    return joblib.load(path)
