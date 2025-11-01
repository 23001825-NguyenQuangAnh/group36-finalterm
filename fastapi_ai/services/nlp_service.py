# Phân tích ngôn ngữ tự nhiên (Natural Language Processing) để hiểu mô tả công việc:

# Nhiệm vụ:

# Trích xuất deadline: Nhận biết từ khóa thời gian (“mai”, “thứ 6”, “ngày 10/11”)
# Xác định mức độ khẩn cấp (urgency) : Dựa trên từ khóa (“gấp”, “ngay”, “càng sớm càng tốt”)
# Đánh giá độ quan trọng (importance): Dựa theo ngữ cảnh (“cho sếp”, “báo cáo”, “khách hàng”)
# Phân loại category: Dựa vào từ khóa (“học”, “sức khỏe”, “gia đình”, …)
# Trả về dữ liệu đã chuẩn hóa: urgency, importance, deadline_hours, category

# (cái bên dưới là t test thử thôi)

import re

def extract_features_from_text(text: str):
    """
    Trích xuất thông tin NLP cơ bản từ mô tả task.
    Trả về các đặc trưng như có chứa từ 'khẩn', 'quan trọng', 'học', 'gia đình'...
    """

    text = text.lower()

    # Xác định loại task
    if any(word in text for word in ["báo cáo", "họp", "dự án", "deadline"]):
        category = "Công việc"
    elif any(word in text for word in ["tập thể dục", "ăn uống", "ngủ nghỉ"]):
        category = "Sức khỏe"
    elif any(word in text for word in ["học", "ôn tập", "bài kiểm tra"]):
        category = "Học tập"
    elif any(word in text for word in ["gia đình", "nấu ăn", "mua sắm"]):
        category = "Gia đình"
    else:
        category = "Khác"

    # Kiểm tra mức độ khẩn
    urgency = 0.9 if "khẩn" in text or "ngay" in text else 0.6

    # Kiểm tra tầm quan trọng
    importance = 0.8 if "báo cáo" in text or "deadline" in text else 0.5

    # Phát hiện thời gian (dùng regex)
    time_phrases = re.findall(r"(sáng|chiều|tối|ngày mai|thứ [2-7])", text)
    has_time = len(time_phrases) > 0

    return {
        "urgency": urgency,
        "importance": importance,
        "category": category,
        "has_time": has_time
    }
