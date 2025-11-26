import re

def clean_text(text: str) -> str:
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r"\s+", " ", text)
    text = re.sub(
        r"[^0-9a-zA-Záàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩị"
        r"óòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ ]",
        " ",
        text,
    )
    return re.sub(r"\s+", " ", text).strip()

def build_input(text_input: str) -> str:
    return clean_text(text_input)
