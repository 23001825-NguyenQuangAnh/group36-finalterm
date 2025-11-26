import re

# ========================================
#       TỪ KHÓA CHỈ THỜI GIAN (MATCH TRỌN TỪ)
# ========================================
TIME_WORDS = [
    r"\bsáng\b", r"\btrưa\b", r"\bchiều\b", r"\btối\b", r"\bđêm\b",
    r"\bhôm nay\b", r"\bngày mai\b", r"\bmai\b", r"\bngày kia\b",
    r"\bcuối tuần\b", r"\bđầu tuần\b", r"\bhôm qua\b", r"\bngày mốt\b",
    r"\btối mai\b", r"\bchiều mai\b", r"\bsáng mai\b"
]

DAY_WORDS = [
    r"\bthứ ?\d\b", r"\bthứ hai\b", r"\bthứ ba\b",
    r"\bthứ tư\b", r"\bthứ bốn\b", r"\bthứ năm\b",
    r"\bthứ sáu\b", r"\bthứ bảy\b", r"\bchủ nhật\b", r"\bcn\b"
]

# ========================================
#     PATTERN NGÀY & GIỜ — LUÔN AN TOÀN
# ========================================
TIME_PATTERNS = [
    r"\b\d{1,2}h\d{1,2}\b",        # 7h30
    r"\b\d{1,2}h\b",              # 7h
    r"\b\d{1,2}:\d{2}\b",         # 07:30
    r"\b\d{1,2}\/\d{1,2}(\/\d{2,4})?\b",   # 25/11/2024
    r"\b\d{1,2}-\d{1,2}(-\d{2,4})?\b",     # 25-11
]

# ========================================
#        CỤM MỞ ĐẦU — MATCH TRỌN CỤM
# ========================================
LEADING_PHRASES = [
    r"\btạo\b", r"\btạo ra\b", r"\btạo task\b",
    r"\btạo cho tôi\b", r"\btạo cho tôi một task\b",
    r"\btạo một task\b", r"\bthêm task\b", r"\bthêm việc\b",
    r"\btạo việc\b", r"\bhãy tạo\b", r"\bhãy thêm\b", r"\bhãy\b",
    r"\bnhắc tôi\b", r"\bhãy nhắc tôi\b", r"\bgiúp tôi\b",
    r"\bhãy giúp tôi\b", r"\blàm ơn\b", r"\bvui lòng\b",
    r"\bxin vui lòng\b", r"\bnhờ bạn\b", r"\bnhờ bạn giúp\b",
    r"\bcho tôi\b"
]

# ========================================
#       TỪ NỐI (KHÔNG XÓA BÊN TRONG TỪ)
# ========================================
CONNECT_WORDS = [
    r"\blúc\b", r"\bvào lúc\b", r"\bvào\b", r"\btrước\b",
    r"\bsau\b", r"\bkhi\b", r"\bđến\b", r"\bkhoảng\b",
    r"\btừ\b", r"\btrước khi\b", r"\bsau khi\b", r"\bđể\b"
]

# ========================================
#        TỪ RÁC AN TOÀN
# ========================================
REMOVE_WORDS = [
    r"\bmột\b",
    r"\btask\b",
    r"\bcái\b",
    r"\bnữa\b"
]

# ========================================
#        CLEANER CORE
# ========================================
def clean_text(t: str) -> str:
    t = re.sub(r"\s+", " ", t)
    return t.strip()

def remove_patterns(text: str, patterns):
    for p in patterns:
        text = re.sub(p, " ", text, flags=re.IGNORECASE)
    return clean_text(text)

# ========================================
#        MAIN TITLE EXTRACTOR
# ========================================
def extract_title(input_text: str) -> str:
    text = " " + input_text.lower().strip() + " "

    # 1. XÓA CỤM MỞ ĐẦU
    for p in LEADING_PHRASES:
        text = re.sub(p, " ", text, flags=re.IGNORECASE)

    # 2. XÓA TỪ NỐI
    text = remove_patterns(text, CONNECT_WORDS)

    # 3. XÓA PATTERN THỜI GIAN
    text = remove_patterns(text, TIME_PATTERNS)

    # 4. XÓA TỪ CHỈ THỜI ĐIỂM (MAI, TỐI, SÁNG… — KHÔNG XÓA "email")
    text = remove_patterns(text, TIME_WORDS + DAY_WORDS)

    # 5. XÓA TỪ RÁC
    text = remove_patterns(text, REMOVE_WORDS)

    # 6. XÓA DẤU CÂU
    text = re.sub(r"[.,!?;:]", " ", text)

    # 7. DỌN CHUỖI
    text = clean_text(text)

    # 8. FALLBACK
    if len(text) < 2:
        return input_text.strip()

    return text
