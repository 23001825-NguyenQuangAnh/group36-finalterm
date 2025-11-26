# training_assistant/train_assistant_regression.py
import pandas as pd
from scipy.sparse import hstack
from sklearn.ensemble import RandomForestRegressor

from training_assistant.preprocessing_assistant import clean_text
from training_assistant.utils_assistant import (
    get_data_path, load_model, save_model
)


def train_rf(X, y):
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

    df = pd.read_excel(get_data_path("testdata.xlsx"))
    df = df.dropna(subset=["input_text", "importance", "durationMinutes"])

    df["text"] = df["input_text"].apply(clean_text)
    X_text = df["text"].tolist()

    vectorizer = load_model("assistant_vectorizer.pkl")
    X_tfidf = vectorizer.transform(X_text)

    # Train importance
    y_imp = df["importance"].astype(float)
    imp_model = train_rf(X_tfidf, y_imp)
    save_model(imp_model, "assistant_importance_model.pkl")

    # Train duration
    y_dur = df["durationMinutes"].astype(float)
    dur_model = train_rf(X_tfidf, y_dur)
    save_model(dur_model, "assistant_duration_model.pkl")

    print("✔ Done training regression models!")
