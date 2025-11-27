# training_assistant/train_assistant_regression.py
import pandas as pd
from scipy.sparse import hstack
from sklearn.ensemble import RandomForestRegressor

from training_assistant.preprocessing_assistant import clean_text
from training_assistant.utils_assistant import (
    get_data_path, load_model, save_model
)


def train_rf(X, y):
    """
    Hàm train một mô hình RandomForestRegressor.
    - Dùng để train:
        + importance (mức độ quan trọng)
        + durationMinutes (thời gian thực hiện)
    - Dùng RandomForest để mô hình hóa được quan hệ phi tuyến tốt hơn.
    """
    model = RandomForestRegressor(
        n_estimators=200,   # số cây trong rừng
        max_depth=18,       # giới hạn độ sâu, tránh overfitting
        random_state=42,    # cố định seed để kết quả ổn định
        n_jobs=-1           # tận dụng toàn bộ CPU cores
    )
    model.fit(X, y)
    return model


def main():
    print("=== Train REGRESSION ===")

    # Load dataset Assistant
    df = pd.read_excel(get_data_path("testdata.xlsx"))

    # Loại bỏ các dòng thiếu dữ liệu cần thiết
    df = df.dropna(subset=["input_text", "importance", "durationMinutes"])

    # Làm sạch văn bản đầu vào để vectorizer hoạt động hiệu quả
    df["text"] = df["input_text"].apply(clean_text)
    X_text = df["text"].tolist()

    # Load TF-IDF vectorizer đã train từ bước train_category
    vectorizer = load_model("assistant_vectorizer.pkl")
    X_tfidf = vectorizer.transform(X_text)

    # ============================
    # Train mô hình dự đoán importance
    # ============================
    y_imp = df["importance"].astype(float)
    imp_model = train_rf(X_tfidf, y_imp)
    save_model(imp_model, "assistant_importance_model.pkl")

    # ============================
    # Train mô hình dự đoán durationMinutes
    # ============================
    y_dur = df["durationMinutes"].astype(float)
    dur_model = train_rf(X_tfidf, y_dur)
    save_model(dur_model, "assistant_duration_model.pkl")

    print("✔ Done training regression models!")
