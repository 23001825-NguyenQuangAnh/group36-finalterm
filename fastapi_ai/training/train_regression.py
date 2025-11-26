# training/train_regression.py

import pandas as pd
from scipy.sparse import hstack
from sklearn.ensemble import RandomForestRegressor

from training.preprocessing import build_text
from training.utils import get_data_path, load_model, save_model


def train_regressor(X, y):
    """
    Train một mô hình RandomForestRegressor chung cho các nhãn regression.
    """
    model = RandomForestRegressor(
        n_estimators=200,
        max_depth=16,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X, y)
    return model


def main():
    # 1. Load dataset
    df = pd.read_excel(get_data_path("dataset.xlsx"))

    # Bỏ các dòng thiếu giá trị quan trọng
    df = df.dropna(
        subset=[
            "title",
            "description",
            "urgency",
            "importance",
            "durationMinutes",  # thêm dòng này để đảm bảo có dữ liệu duration
        ]
    )

    # 2. Build text (title + description → text)
    df["text"] = df.apply(
        lambda row: build_text(row["title"], row["description"]),
        axis=1,
    )
    X_text = df["text"].tolist()

    # 3. Load TF-IDF vectorizer (đã train ở bước train_category / train_all)
    vectorizer = load_model("tfidf_vectorizer.pkl")
    X_tfidf = vectorizer.transform(X_text)

    # 4. Numeric features (tạm: urgency + importance)
    numeric = df[["urgency", "importance"]].astype(float).values

    # 5. Merge TF-IDF + numeric
    X = hstack([X_tfidf, numeric])

    # 6. Train urgency
    y_urg = df["urgency"].astype(float)
    urgency_model = train_regressor(X, y_urg)
    save_model(urgency_model, "urgency_model.pkl")

    # 7. Train importance
    y_imp = df["importance"].astype(float)
    importance_model = train_regressor(X, y_imp)
    save_model(importance_model, "importance_model.pkl")

    # 8. Train durationMinutes
    y_dur = df["durationMinutes"].astype(float)
    duration_model = train_regressor(X, y_dur)
    save_model(duration_model, "duration_model.pkl")

    print("✅ Done training: urgency, importance, duration models!")


if __name__ == "__main__":
    main()
