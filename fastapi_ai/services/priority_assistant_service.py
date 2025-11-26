# services/assistant_priority_service.py
from datetime import datetime
from services.nlp_assistant_service import analyze_assistant_text


# =============================
# URGENCY BASED ON DEADLINE
# =============================
def compute_urgency_from_deadline(deadline):
    """Tính độ khẩn cấp theo thời gian còn lại."""
    if not deadline:
        return 0.2

    now = datetime.now()
    diff_hours = (deadline - now).total_seconds() / 3600

    if diff_hours <= 0:
        return 1.0
    if diff_hours <= 2:
        return 1.0
    if diff_hours <= 6:
        return 0.8
    if diff_hours <= 24:
        return 0.6
    if diff_hours <= 72:
        return 0.4
    return 0.2


# =============================
# PRIORITY SCORE
# =============================
def compute_priority_score(urgency, importance):
    if urgency is None or importance is None:
        return 0.0
    return round(urgency * 0.6 + importance * 0.4, 3)


# =============================
# MAIN: ASSISTANT PRIORITY
# =============================
def analyze_assistant_priority(input_text: str):
    """
    Chạy NLP Assistant full pipeline:
    1) tách title
    2) dùng ML dự đoán category, importance, duration
    3) parse deadline
    4) tính urgency
    5) tính priorityScore
    """
    nlp = analyze_assistant_text(input_text)

    title = nlp["title"]
    description = nlp["description"]
    category = nlp["categoryName"]
    importance = nlp["importance"]
    duration = nlp["durationMinutes"]
    deadline = nlp["parsedDeadline"]

    # Tính urgency từ deadline
    urgency = compute_urgency_from_deadline(deadline)

    # Tính priorityScore theo pipeline 1
    priority_score = compute_priority_score(urgency, importance)

    # =============================
    # KẾT QUẢ ĐẦY ĐỦ GỬI VỀ CHO CHATBOT
    # =============================
    return {
        "title": title,
        "description": description,
        "categoryName": category,
        "importance": importance,
        "durationMinutes": duration,
        "parsedDeadline": deadline,
        "urgency": urgency,
        "priorityScore": priority_score
    }
