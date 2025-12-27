# services/assistant_priority_service.py
from datetime import datetime
from services.nlp_assistant_service import analyze_assistant_text


# =============================
# URGENCY BASED ON DEADLINE
# → Hàm tính mức độ khẩn cấp dựa trên deadline trích xuất từ câu chat
# =============================
def compute_urgency_from_deadline(deadline):
    """Tính độ khẩn cấp theo thời gian còn lại."""
    if not deadline:          # Nếu không có deadline → giả định mức khẩn thấp
        return 0.2

    now = datetime.now()      # Lấy thời điểm hiện tại
    diff_hours = (deadline - now).total_seconds() / 3600   # Chênh lệch thời gian tính theo giờ

    # Các mức đánh giá khẩn cấp theo khoảng thời gian còn lại
    if diff_hours <= 0:       # Deadline đã trôi qua
        return 1.0
    if diff_hours <= 2:       # Deadline trong vòng 2 giờ
        return 1.0
    if diff_hours <= 6:       # Deadline trong 6 giờ
        return 0.8
    if diff_hours <= 24:      # Deadline trong ngày
        return 0.6
    if diff_hours <= 72:      # Deadline trong 3 ngày
        return 0.4
    return 0.2                # Deadline xa → ít khẩn cấp


# =============================
# PRIORITY SCORE
# → Tính toán điểm ưu tiên từ urgency & importance
# =============================
def compute_priority_score(urgency, importance):
    if urgency is None or importance is None:
        return 0.0

    # Công thức: urgency * 0.6 + importance * 0.4 (theo pipeline 1)
    return round(urgency * 0.6 + importance * 0.4, 3)


# =============================
# MAIN: ASSISTANT PRIORITY
# → Pipeline chính xử lý Chat Assistant:
#   1. NLP trích title + info
#   2. ML dự đoán category, importance, duration
#   3. Rule-based trích deadline
#   4. Tính urgency từ deadline
#   5. Tính priorityScore
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
    # Gọi pipeline NLP để phân tích câu chat
    nlp = analyze_assistant_text(input_text)

    # Trích các trường AI phân tích được
    title = nlp["title"]
    description = nlp["description"]
    category = nlp["categoryName"]
    importance = nlp["importance"]
    duration = nlp["durationMinutes"]
    deadline = nlp["parsedDeadline"]

    # Tính urgency dựa trên deadline
    urgency = compute_urgency_from_deadline(deadline)

    # Tính priorityScore theo pipeline 1 (urgency * 0.6 + importance * 0.4)
    priority_score = compute_priority_score(urgency, importance)

    # =============================
    # KẾT QUẢ ĐẦY ĐỦ GỬI VỀ CHO CHATBOT
    # → FE sẽ dựa trên dữ liệu này để hỏi người dùng có muốn tạo task hay không
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
