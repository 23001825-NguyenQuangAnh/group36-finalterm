# training_assistant/utils_assistant.py
from pathlib import Path
import joblib
from typing import Any

# PROJECT_ROOT = thư mục gốc của module training_assistant
# (thư mục cha chứa các thư mục: data/, models_assistant/, ...)
PROJECT_ROOT = Path(__file__).resolve().parents[1]


def get_data_path(filename: str) -> Path:
    """
    Trả về đường dẫn tới file dữ liệu nằm trong thư mục /data của Assistant.
    Dùng để load các file: testdata.xlsx, dataset dành cho Assistant NLP.
    """
    return PROJECT_ROOT / "data" / filename


def get_models_path(filename: str) -> Path:
    """
    Trả về đường dẫn đầy đủ tới file mô hình nằm trong thư mục /models_assistant.
    Nếu thư mục chưa tồn tại ⇒ tự động tạo.
    """
    models_dir = PROJECT_ROOT / "models_assistant"
    models_dir.mkdir(parents=True, exist_ok=True)  # đảm bảo thư mục tồn tại
    return models_dir / filename


def save_model(obj: Any, filename: str):
    """
    Lưu mô hình ML thành file .pkl.
    Dùng trong quá trình training:
    - assistant_vectorizer.pkl
    - assistant_category_model.pkl
    - assistant_importance_model.pkl
    - assistant_duration_model.pkl
    """
    path = get_models_path(filename)
    joblib.dump(obj, path)
    print(f"✔ Saved {filename} → {path}")  # log vị trí file lưu


def load_model(filename: str) -> Any:
    """
    Load mô hình ML từ file .pkl.
    Nếu file không tồn tại → báo lỗi ngay để tránh pipeline chạy sai mô hình.
    """
    path = get_models_path(filename)
    if not path.exists():
        raise FileNotFoundError(f"❌ Model not found: {path}")
    return joblib.load(path)
