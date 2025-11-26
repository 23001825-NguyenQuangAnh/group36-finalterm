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
# ===============================
PROJECT_ROOT = Path(__file__).resolve().parents[1]
MODELS_DIR = PROJECT_ROOT / "models_assistant"

_vectorizer = None
_category_model = None
_importance_model = None
_duration_model = None


# ===============================
# LOAD MODEL
# ===============================
def _load_model(filename: str) -> Any:
    path = MODELS_DIR / filename
    if not path.exists():
        raise RuntimeError(f"❌ Assistant model missing: {path}")
    return joblib.load(path)


def load_assistant_models() -> None:
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
# ===============================
def analyze_assistant_text(raw_text: str) -> Dict[str, Any]:
    """
    Input: câu chat tự nhiên
    Output:
    - title
    - description
    - categoryName
    - importance
    - durationMinutes
    - parsedDeadline
    """
    load_assistant_models()

    # 1) Clean raw text
    cleaned = clean_text(raw_text)

    # 2) Extract TITLE
    predicted_title = extract_title(cleaned)

    # 3) Description = nguyên câu (dùng để lưu vào DB)
    predicted_description = raw_text

    # 4) TF-IDF
    X_text = _vectorizer.transform([cleaned])

    # 5) Predict classification + regression
    category = _category_model.predict(X_text)[0]

    importance = float(_importance_model.predict(X_text)[0])
    duration = float(_duration_model.predict(X_text)[0])

    # 6) Parse deadline từ câu chat
    parsed_deadline = parse_deadline(raw_text)

    # 7) Return
    return {
        "title": predicted_title,
        "description": predicted_description,
        "categoryName": str(category),
        "importance": round(importance, 2),
        "durationMinutes": max(1, round(duration)),
        "parsedDeadline": parsed_deadline,
    }
