from datetime import datetime, timedelta
import re

# ==============================
# Helper Functions
# ==============================

def next_weekday(start: datetime, weekday: int) -> datetime:
    """Tìm ngày thứ X tiếp theo (0=Monday)."""
    # Tính số ngày cần cộng để tới đúng thứ trong tuần
    days_ahead = weekday - start.weekday()
    if days_ahead <= 0:      # Nếu đã qua thứ đó → nhảy sang tuần sau
        days_ahead += 7
    return start + timedelta(days=days_ahead)


def parse_time(text: str):
    """Trả về (hour, minute) hoặc None.
    Hỗ trợ nhiều định dạng giờ phổ biến trong tiếng Việt."""
    text = text.lower()

    # 1. dạng 7h, 19h, 7h30, 07:15
    m = re.search(r"(\d{1,2})h(\d{1,2})?", text)
    if m:
        h = int(m.group(1))
        mnt = int(m.group(2)) if m.group(2) else 0
        return h, mnt

    m = re.search(r"(\d{1,2}):(\d{1,2})", text)
    if m:
        return int(m.group(1)), int(m.group(2))

    # 2. từ khóa thời gian chung
    if "sáng" in text:
        return 9, 0      # mặc định 9h sáng
    if "trưa" in text:
        return 12, 0
    if "chiều" in text:
        return 15, 0
    if "tối" in text:
        return 19, 0

    return None


# ==============================
# Main Deadline Parser
# ==============================

def parse_deadline(text: str) -> datetime | None:
    """Phân tích thời gian tự nhiên tiếng Việt từ câu chat người dùng."""
    text = text.lower().strip()
    now = datetime.now()

    # Default deadline = hôm nay 17:00 nếu không tìm được gì
    day = now
    hour = 17
    minute = 0

    # =============================
    # 1. Ngày dạng số: 15/12 hoặc 15/12/2025
    # =============================
    m = re.search(r"(\d{1,2})/(\d{1,2})(?:/(\d{2,4}))?", text)
    if m:
        d, mth = int(m.group(1)), int(m.group(2))
        year = int(m.group(3)) if m.group(3) else now.year
        day = datetime(year, mth, d)
    else:
        # =============================
        # 2. Từ khóa ngày tương đối
        # =============================

        if "hôm nay" in text:
            day = now

        elif "ngày mai" in text or "mai" in text:
            day = now + timedelta(days=1)

        elif "ngày kia" in text:
            day = now + timedelta(days=2)

        elif "tuần sau" in text:
            day = now + timedelta(days=7)

        elif "cuối tuần" in text:
            # Chủ nhật tuần này
            day = next_weekday(now, 6)

        elif "đầu tuần" in text:
            # Thứ 2 tuần tới
            day = next_weekday(now, 0)

        # =============================
        # 3. Thứ trong tuần: thứ 2 → chủ nhật
        # =============================
        weekdays = {
            "thứ 2": 0, "thứ hai": 0,
            "thứ 3": 1, "thứ ba": 1,
            "thứ 4": 2, "thứ tư": 2,
            "thứ 5": 3, "thứ năm": 3,
            "thứ 6": 4, "thứ sáu": 4,
            "thứ 7": 5, "thứ bảy": 5,
            "chủ nhật": 6,
        }

        # Nếu có từ khóa thứ trong tuần → lấy ngày gần nhất tiếp theo
        for key, wd in weekdays.items():
            if key in text:
                day = next_weekday(now, wd)
                break

    # =============================
    # 4. Parse time (giờ phút)
    # =============================
    parsed = parse_time(text)
    if parsed:
        hour, minute = parsed

        # Xử lý các từ khóa buổi → chuyển 7h tối thành 19h
        if "tối" in text and hour < 12:
            hour += 12
        if "chiều" in text and hour < 12:
            hour += 12

    # =============================
    # 5. Trường hợp: "trước 7h"
    # =============================
    m = re.search(r"trước (\d{1,2})h", text)
    if m:
        hour = int(m.group(1))
        minute = 0

    # =============================
    # 6. Tạo datetime deadline cuối cùng
    # =============================
    try:
        deadline = day.replace(hour=hour, minute=minute, second=0, microsecond=0)

        # Nếu thời gian đã qua trong ngày hiện tại → đẩy sang ngày hôm sau
        if deadline < now:
            deadline += timedelta(days=1)

        return deadline
    except:
        # Nếu có lỗi định dạng → trả None
        return None
