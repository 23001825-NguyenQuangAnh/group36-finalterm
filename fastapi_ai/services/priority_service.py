# services/priority_service.py

from services import nlp_service


def compute_priority_score(urgency: float, importance: float) -> float:
    """
    Tính priorityScore dựa trên urgency & importance (0.0 - 1.0).
    urgency quan trọng hơn, nên weight 0.6.
    """
    if urgency is None or importance is None:
        return 0.0

    # Công thức tính điểm ưu tiên theo pipeline 1:
    #   priorityScore = 0.6 * urgency + 0.4 * importance
    score = urgency * 0.6 + importance * 0.4
    return round(score, 3)


def analyze_priority(title: str, description: str):
    """
    Hàm chính xử lý yêu cầu phân tích priority từ Spring Boot.
    Gồm 3 bước:
    1. Gọi NLP để dự đoán category, urgency, importance, deadline, duration
    2. Tính priorityScore
    3. Trả kết quả về router (và Spring Boot)
    """

    # 1. Gọi NLP để phân tích mô tả task
    # nlp_service.analyze_task sẽ trả về:
    #   - categoryName
    #   - urgency
    #   - importance
    #   - parsedDeadline
    #   - durationMinutes (NEW)
    nlp_result = nlp_service.analyze_task(title, description)

    # Lấy dữ liệu ML dự đoán
    urgency = nlp_result["urgency"]
    importance = nlp_result["importance"]
    category = nlp_result["categoryName"]
    parsed_deadline = nlp_result["parsedDeadline"]
    duration = nlp_result["durationMinutes"]     # ⬅️ NEW: dự đoán thời gian thực hiện

    # 2. Tính priorityScore
    priority_score = compute_priority_score(urgency, importance)

    # 3. Trả về kết quả cuối cùng cho router
    return {
        "categoryName": category,
        "urgency": urgency,
        "importance": importance,
        "parsedDeadline": parsed_deadline,
        "durationMinutes": duration,             # ⬅️ NEW
        "priorityScore": priority_score
    }
