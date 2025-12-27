# services/assistant_nlp_service.py
from pathlib import Path
from typing import Any, Dict
import joblib
from scipy.sparse import hstack

from training_assistant.assistant_title_extractor import extract_title
from training_assistant.deadline_parser import parse_deadline
from training_assistant.preprocessing_assistant import clean_text

# ===============================
# MODEL PATH
# → Trỏ tới thư mục chứa các mô hình dành riêng cho Chat Assistant
# ===============================
PROJECT_ROOT = Path(__file__).resolve().parents[1]
MODELS_DIR = PROJECT_ROOT / "models_assistant"

# Các biến lưu mô hình đã load (lazy load)
_vectorizer = None
_category_model = None
_importance_model = None
_duration_model = None


# ===============================
# LOAD MODEL
# → Hàm dùng để load file model .pkl, kiểm tra file tồn tại trước khi load
# ===============================
def _load_model(filename: str) -> Any:
    path = MODELS_DIR / filename
    if not path.exists():  # Báo lỗi nếu thiếu mô hình
        raise RuntimeError(f"❌ Assistant model missing: {path}")
    return joblib.load(path)


def load_assistant_models() -> None:
    """
    Load mô hình Assistant NLP vào RAM một lần duy nhất.
    Tránh load lại nhiều lần gây chậm API.
    """
    global _vectorizer, _category_model, _importance_model, _duration_model

    if _vectorizer is None:
        _vectorizer = _load_model("assistant_vectorizer.pkl")

    if _category_model is None:
        _category_model = _load_model("assistant_category_model.pkl")

    if _importance_model is None:
        _importance_model = _load_model("assistant_importance_model.pkl")

    if _duration_model is None:
        _duration_model = _load_model("assistant_duration_model.pkl")


# ===============================
# MAIN ASSISTANT NLP
# → Pipeline chính xử lý câu chat tự nhiên
# ===============================
def analyze_assistant_text(raw_text: str) -> Dict[str, Any]:
    """
    Input: câu chat của người dùng (ngôn ngữ tự nhiên)
    Output bao gồm:
    - title: tiêu đề được AI trích xuất từ câu chat
    - description: nguyên văn câu chat để lưu DB
    - categoryName: mô hình phân loại
    - importance: ML dự đoán độ quan trọng
    - durationMinutes: ML dự đoán thời gian thực hiện
    - parsedDeadline: deadline AI trích xuất từ câu nói
    """
    load_assistant_models()  # Đảm bảo mô hình đã được load

    # 1) Clean raw text
    # Làm sạch câu chat (lowercase, bỏ ký tự thừa...) để mô hình dễ xử lý
    cleaned = clean_text(raw_text)

    # 2) Extract TITLE
    # Mô hình tùy chỉnh để trích xuất tiêu đề từ câu chat
    predicted_title = extract_title(cleaned)

    # 3) Description = nguyên câu người dùng nói
    # Lưu vào DB để giữ toàn bộ thông tin gốc
    predicted_description = raw_text

    # 4) TF-IDF
    # Vector hóa câu chat đã làm sạch
    X_text = _vectorizer.transform([cleaned])

    # 5) Predict classification + regression
    # Dự đoán loại task
    category = _category_model.predict(X_text)[0]

    # Dự đoán importance và duration (regression)
    importance = float(_importance_model.predict(X_text)[0])
    duration = float(_duration_model.predict(X_text)[0])

    # 6) Parse deadline từ câu chat
    # Dùng NLP rule-based để trích xuất thời gian từ câu nói
    parsed_deadline = parse_deadline(raw_text)

    # 7) Return kết quả tổng hợp
    return {
        "title": predicted_title,
        "description": predicted_description,
        "categoryName": str(category),
        "importance": round(importance, 2),
        "durationMinutes": max(1, round(duration)),   # Không cho thấp hơn 1 phút
        "parsedDeadline": parsed_deadline,
    }
