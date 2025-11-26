# services/priority_service.py

from services import nlp_service


def compute_priority_score(urgency: float, importance: float) -> float:
    """
    Tính priorityScore dựa trên urgency & importance (0.0 - 1.0).
    urgency quan trọng hơn, nên weight 0.6.
    """
    if urgency is None or importance is None:
        return 0.0

    score = urgency * 0.6 + importance * 0.4
    return round(score, 3)


def analyze_priority(title: str, description: str):
    """
    Gọi NLP để hiểu mô tả, rồi tính priority_score.
    Đây là hàm chính được gọi từ router hoặc từ Spring Boot.
    """

    # 1. Gọi NLP để phân tích
    nlp_result = nlp_service.analyze_task(title, description)

    urgency = nlp_result["urgency"]
    importance = nlp_result["importance"]
    category = nlp_result["categoryName"]
    parsed_deadline = nlp_result["parsedDeadline"]
    duration = nlp_result["durationMinutes"]     # ⬅️ NEW

    # 2. Tính priorityScore
    priority_score = compute_priority_score(urgency, importance)

    # 3. Trả về kết quả cuối cùng
    return {
        "categoryName": category,
        "urgency": urgency,
        "importance": importance,
        "parsedDeadline": parsed_deadline,
        "durationMinutes": duration,             # ⬅️ NEW
        "priorityScore": priority_score
    }
