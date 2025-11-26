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
# ===============================
PROJECT_ROOT = Path(__file__).resolve().parents[1]
MODELS_DIR = PROJECT_ROOT / "models"

_category_model = None
_urgency_model = None
_importance_model = None
_duration_model = None
_vectorizer = None


# ===============================
# LOAD MODEL
# ===============================
def _load_model(filename: str) -> Any:
    path = MODELS_DIR / filename
    if not path.exists():
        raise RuntimeError(f"❌ Model file not found: {path}")
    return joblib.load(path)


def load_models() -> None:
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
# ===============================
def analyze_task(title: str, description: str) -> Dict[str, Any]:
    load_models()

    # ---- 1) TF-IDF ----
    text = build_text(title, description)
    X_cat = _vectorizer.transform([text])        # ⭐ Category chỉ dùng TF-IDF

    # ---- 2) Numeric placeholder ----
    # Regression models được train = [TFIDF + urgency + importance]
    numeric_placeholder = [[0.0, 0.0]]
    X_reg = hstack([X_cat, numeric_placeholder])  # ⭐ regression input

    # ---- 3) Predict ----
    category = _category_model.predict(X_cat)[0]          # ONLY TF-IDF
    urgency = float(_urgency_model.predict(X_reg)[0])     # TF-IDF + numeric
    importance = float(_importance_model.predict(X_reg)[0])
    duration = float(_duration_model.predict(X_reg)[0])

    # ---- 4) Parse deadline ----
    parsed_dt = dateparser.parse(description, languages=["vi", "en"])

    # ---- 5) Return ----
    return {
        "categoryName": str(category),
        "urgency": round(urgency, 2),
        "importance": round(importance, 2),
        "durationMinutes": max(1, round(duration)),
        "parsedDeadline": parsed_dt,
    }
