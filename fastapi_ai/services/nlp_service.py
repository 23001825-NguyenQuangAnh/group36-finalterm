# services/nlp_service.py
from pathlib import Path
from typing import Any, Dict
from datetime import datetime
import joblib
import dateparser
from scipy.sparse import hstack

from training.preprocessing import build_text

# ===============================
# MODEL PATH
# → Xác định đường dẫn tới thư mục chứa file mô hình đã train
# ===============================
PROJECT_ROOT = Path(__file__).resolve().parents[1]
MODELS_DIR = PROJECT_ROOT / "models"

# Các biến global lưu mô hình ML sau khi load lên RAM
_category_model = None
_urgency_model = None
_importance_model = None
_duration_model = None
_vectorizer = None


# ===============================
# LOAD MODEL
# → Hàm tiện ích để load model từ file .pkl
# ===============================
def _load_model(filename: str) -> Any:
    path = MODELS_DIR / filename
    if not path.exists():  # Kiểm tra file có tồn tại không
        raise RuntimeError(f"❌ Model file not found: {path}")
    return joblib.load(path)  # Load mô hình đã train


def load_models() -> None:
    """
    Chỉ load mô hình 1 lần duy nhất (lazy load).
    Dùng biến global để tránh load lại nhiều lần làm chậm API.
    """
    global _category_model, _urgency_model, _importance_model, _duration_model, _vectorizer

    if _vectorizer is None:
        _vectorizer = _load_model("tfidf_vectorizer.pkl")
    if _category_model is None:
        _category_model = _load_model("category_model.pkl")
    if _urgency_model is None:
        _urgency_model = _load_model("urgency_model.pkl")
    if _importance_model is None:
        _importance_model = _load_model("importance_model.pkl")
    if _duration_model is None:
        _duration_model = _load_model("duration_model.pkl")


# ===============================
# ANALYZE TASK (MAIN API)
# → Hàm chính dùng để phân tích title + description
#   và dự đoán category, urgency, importance, duration, deadline.
# ===============================
def analyze_task(title: str, description: str) -> Dict[str, Any]:
    load_models()   # Đảm bảo các mô hình ML đã được load

    # ---- 1) TF-IDF ----
    # Ghép tiêu đề + mô tả thành một chuỗi và vector hóa bằng TF-IDF
    text = build_text(title, description)
    X_cat = _vectorizer.transform([text])        # ⭐ Category chỉ dùng TF-IDF

    # ---- 2) Numeric placeholder ----
    # Các mô hình regression được train với input: [TFIDF + urgency + importance]
    # Nhưng urgency & importance chưa có → dùng placeholder = 0 để giữ đủ chiều
    numeric_placeholder = [[0.0, 0.0]]
    X_reg = hstack([X_cat, numeric_placeholder])  # ⭐ Input tổng hợp cho mô hình regression

    # ---- 3) Predict ----
    # Category: mô hình classification → dùng riêng TF-IDF
    category = _category_model.predict(X_cat)[0]

    # Urgency, importance, duration: mô hình regression → dùng TF-IDF + placeholder
    urgency = float(_urgency_model.predict(X_reg)[0])
    importance = float(_importance_model.predict(X_reg)[0])
    duration = float(_duration_model.predict(X_reg)[0])

    # ---- 4) Parse deadline ----
    # Dùng dateparser để trích xuất thời gian từ mô tả (vi/en)
    parsed_dt = dateparser.parse(description, languages=["vi", "en"])

    # ---- 5) Return ----
    # Trả về kết quả sau khi làm tròn và chuẩn hóa
    return {
        "categoryName": str(category),
        "urgency": round(urgency, 2),
        "importance": round(importance, 2),
        "durationMinutes": max(1, round(duration)),  # Không cho <1 phút
        "parsedDeadline": parsed_dt,
    }
