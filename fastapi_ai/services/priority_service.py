# nơi tính toán hoặc dự đoán priority_score cho từng task:
# Logic phase: Dùng công thức cố định priority = 0.6*urgency + 0.4*importance
# Huấn luyện mô hình (Linear Regression / XGBoost) dựa trên dữ liệu người dùng để dự đoán priority_score tự động

# (bên dưới là t test thử thôi)

from datetime import datetime, timedelta
from services.nlp_service import extract_features_from_text

def analyze_priority(raw_description: str):
    """
    Gọi NLP để hiểu mô tả, rồi tính priority_score và parsed_deadline.
    """
    features = extract_features_from_text(raw_description)

    urgency = features["urgency"]
    importance = features["importance"]
    category = features["category"]

    # Tính priority_score = trung bình giữa urgency và importance
    priority_score = round((urgency + importance) / 2, 2)

    # Giả lập phân tích deadline: nếu mô tả có chữ 'deadline', cộng thêm 3 ngày
    parsed_deadline = datetime.now() + timedelta(days=3)

    # ✅ Trả về kiểu datetime (không cần isoformat)
    return {
        "parsed_deadline": parsed_deadline,
        "urgency": urgency,
        "importance": importance,
        "priority_score": priority_score,
        "category": category
    }
