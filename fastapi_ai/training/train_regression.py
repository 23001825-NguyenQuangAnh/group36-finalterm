# training/train_regression.py

import pandas as pd
from scipy.sparse import hstack
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

# ⭐ thêm import vẽ biểu đồ
import matplotlib.pyplot as plt

from training.preprocessing import build_text
from training.utils import get_data_path, load_model, save_model


def train_regressor(X, y):
    """
    Train một mô hình RandomForestRegressor chung cho các nhãn regression.
    - Mô hình này được dùng cho 3 tác vụ:
        + dự đoán urgency
        + dự đoán importance
        + dự đoán durationMinutes
    """
    model = RandomForestRegressor(
        n_estimators=200,
        max_depth=16,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X, y)
    return model


def evaluate_and_plot(name, model, X, y_true):
    """⭐ In thông số + vẽ 1 biểu đồ trực quan"""
    y_pred = model.predict(X)

    mse = mean_squared_error(y_true, y_pred)
    rmse = mse ** 0.5
    mae = mean_absolute_error(y_true, y_pred)
    r2 = r2_score(y_true, y_pred)

    print(f"\n===== 📊 Evaluation: {name} =====")
    print(f"MSE   : {mse:.4f}")
    print(f"RMSE  : {rmse:.4f}")
    print(f"MAE   : {mae:.4f}")
    print(f"R²    : {r2:.4f}")

    # ⭐ Scatter Plot
    plt.figure(figsize=(5, 5))
    plt.scatter(y_true, y_pred, alpha=0.5)
    plt.plot([y_true.min(), y_true.max()], [y_true.min(), y_true.max()], "r--")
    plt.xlabel("Actual")
    plt.ylabel("Predicted")
    plt.title(f"{name} – Actual vs Predicted")
    plt.tight_layout()
    plt.show()


def main():
    # 1. Load dataset
    df = pd.read_excel(get_data_path("testdata.xlsx"))

    df = df.dropna(
        subset=["title", "description", "urgency", "importance", "durationMinutes"]
    )

    # 2. Build text
    df["text"] = df.apply(
        lambda row: build_text(row["title"], row["description"]),
        axis=1,
    )
    X_text = df["text"].tolist()

    # 3. Load TF-IDF
    vectorizer = load_model("tfidf_vectorizer.pkl")
    X_tfidf = vectorizer.transform(X_text)

    # 4. Numeric features
    numeric = df[["urgency", "importance"]].astype(float).values

    # 5. Merge features
    X = hstack([X_tfidf, numeric])

    # 6. Train urgency
    y_urg = df["urgency"].astype(float)
    urgency_model = train_regressor(X, y_urg)
    save_model(urgency_model, "urgency_model.pkl")
    evaluate_and_plot("Urgency", urgency_model, X, y_urg)

    # 7. Train importance
    y_imp = df["importance"].astype(float)
    importance_model = train_regressor(X, y_imp)
    save_model(importance_model, "importance_model.pkl")
    evaluate_and_plot("Importance", importance_model, X, y_imp)

    # 8. Train duration
    y_dur = df["durationMinutes"].astype(float)
    duration_model = train_regressor(X, y_dur)
    save_model(duration_model, "duration_model.pkl")
    evaluate_and_plot("Duration", duration_model, X, y_dur)

    print("\n✅ Done training & evaluating all regression models!")


if __name__ == "__main__":
    main()
