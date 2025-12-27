# training/preprocessing.py
import re
from typing import Optional


def clean_text(text: Optional[str]) -> str:
    """
    Làm sạch text cơ bản: lowercase, bỏ ký tự lạ, gom khoảng trắng.
    """
    if not isinstance(text, str):
        return ""
    text = text.lower()
    # thay \n, \t... bằng space
    text = re.sub(r"\s+", " ", text)
    # giữ lại chữ, số, khoảng trắng, một số dấu tiếng Việt cơ bản
    text = re.sub(
        r"[^0-9a-zA-Záàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩị"
        r"óòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ ]",
        " ",
        text,
    )
    text = re.sub(r"\s+", " ", text).strip()
    return text


def build_text(title: Optional[str], description: Optional[str]) -> str:
    """
    Ghép title + description thành một câu sạch.
    """
    t = clean_text(title)
    d = clean_text(description)
    return (t + " " + d).strip()
