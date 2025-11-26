# training/train_category.py
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

from training.preprocessing import build_text
from training.utils import get_data_path, save_model


def main():
    # 1. Đọc dữ liệu
    df = pd.read_excel(get_data_path("dataset.xlsx"))
    # đảm bảo có đủ 3 cột chính
    df = df.dropna(subset=["title", "description", "categoryName"])

    # 2. Tạo text input
    df["text"] = df.apply(
        lambda row: build_text(row["title"], row["description"]),
        axis=1,
    )

    X_text = df["text"].tolist()
    y = df["categoryName"].astype(str)

    # 3. TF-IDF
    vectorizer = TfidfVectorizer(
        max_features=3000,
        ngram_range=(1, 2)
    )
    X = vectorizer.fit_transform(X_text)

    # 4. Chia train/test để xem performance
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    # 5. Train Logistic Regression
    clf = LogisticRegression(max_iter=2000)
    clf.fit(X_train, y_train)

    # 6. Đánh giá nhanh
    y_pred = clf.predict(X_test)
    print("🔎 Category accuracy:", accuracy_score(y_test, y_pred))
    print(classification_report(y_test, y_pred))

    # 7. Lưu vectorizer + model
    save_model(vectorizer, "tfidf_vectorizer.pkl")
    save_model(clf, "category_model.pkl")


if __name__ == "__main__":
    main()
