# training_assistant/train_assistant_regression.py
import pandas as pd
from scipy.sparse import hstack
from sklearn.ensemble import RandomForestRegressor

from training_assistant.preprocessing_assistant import clean_text
from training_assistant.utils_assistant import (
    get_data_path, load_model, save_model
)

import matplotlib.pyplot as plt
import seaborn as sns


def train_rf(X, y):
    """
    Hàm train một mô hình RandomForestRegressor.
    - Dùng để train:
        + importance (mức độ quan trọng)
        + durationMinutes (thời gian thực hiện)
    """
    model = RandomForestRegressor(
        n_estimators=200,
        max_depth=18,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X, y)
    return model


def main():
    print("=== Train REGRESSION ===")

    # Load dataset Assistant
    df = pd.read_excel(get_data_path("testdata.xlsx"))

    # Loại bỏ các dòng thiếu dữ liệu cần thiết
    df = df.dropna(subset=["input_text", "importance", "durationMinutes"])

    # Làm sạch văn bản đầu vào
    df["text"] = df["input_text"].apply(clean_text)
    X_text = df["text"].tolist()

    # Load TF-IDF vectorizer
    vectorizer = load_model("assistant_vectorizer.pkl")
    X_tfidf = vectorizer.transform(X_text)

    # ============================
    # ⭐ Train mô hình dự đoán importance
    # ============================
    y_imp = df["importance"].astype(float)
    imp_model = train_rf(X_tfidf, y_imp)
    save_model(imp_model, "assistant_importance_model.pkl")

    # Predict để tạo biểu đồ kết quả
    imp_pred = imp_model.predict(X_tfidf)
    imp_error = y_imp - imp_pred

    # ============================
    # ⭐ Train mô hình dự đoán durationMinutes
    # ============================
    y_dur = df["durationMinutes"].astype(float)
    dur_model = train_rf(X_tfidf, y_dur)
    save_model(dur_model, "assistant_duration_model.pkl")

    dur_pred = dur_model.predict(X_tfidf)
    dur_error = y_dur - dur_pred

    # ============================
    # ⭐ BIỂU ĐỒ KẾT QUẢ SAU TRAIN
    # ============================

    # 1) Error distribution for Importance
    plt.figure(figsize=(7,4))
    sns.histplot(imp_error, bins=30, kde=True)
    plt.title("Error Distribution - Importance")
    plt.xlabel("importance_actual - importance_predicted")
    plt.ylabel("Frequency")
    plt.tight_layout()
    plt.show()

    # 2) Error distribution for Duration
    plt.figure(figsize=(7,4))
    sns.histplot(dur_error, bins=30, kde=True)
    plt.title("Error Distribution - Duration Minutes")
    plt.xlabel("duration_actual - duration_predicted")
    plt.ylabel("Frequency")
    plt.tight_layout()
    plt.show()

    print("\n✔ Done training regression models!")


if __name__ == "__main__":
    main()
