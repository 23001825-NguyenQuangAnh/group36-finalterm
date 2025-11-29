import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix
from training_assistant.preprocessing_assistant import build_input
from training_assistant.utils_assistant import get_data_path, save_model

def main():
    # Load dữ liệu train của Assistant từ file Excel
    df = pd.read_excel(get_data_path("testdata.xlsx"))

    # Loại bỏ các bản ghi thiếu input_text hoặc categoryName (label)
    df = df.dropna(subset=["input_text", "categoryName"])

    # Làm sạch văn bản đầu vào (lowercase, bỏ ký tự thừa…)
    df["clean"] = df["input_text"].apply(build_input)

    # X_text = danh sách câu đã được làm sạch
    X_text = df["clean"].tolist()
    y = df["categoryName"]  # Label cần phân loại

    # Tạo TF-IDF vectorizer (1-gram và 2-gram, giới hạn 4000 đặc trưng)
    vectorizer = TfidfVectorizer(max_features=4000, ngram_range=(1, 2))

    # Biến đổi văn bản → vector TF-IDF
    X = vectorizer.fit_transform(X_text)

    # Chia dữ liệu thành train/test
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Mô hình Logistic Regression để phân loại category
    clf = LogisticRegression(max_iter=2000)  # tăng max_iter để hội tụ tốt hơn
    clf.fit(X_train, y_train)

    # Đánh giá độ chính xác trên tập test
    preds = clf.predict(X_test)
    print("✔ Category Accuracy:", accuracy_score(y_test, preds))

    # ⭐ THÊM CONFUSION MATRIX (không ảnh hưởng pipeline)
    import matplotlib.pyplot as plt
    import seaborn as sns

    cm = confusion_matrix(y_test, preds)
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
                xticklabels=clf.classes_, yticklabels=clf.classes_)
    plt.title("Confusion Matrix - Assistant Category Classification")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.tight_layout()
    plt.show()

    # Lưu TF-IDF vectorizer và mô hình classification
    save_model(vectorizer, "assistant_vectorizer.pkl")
    save_model(clf, "assistant_category_model.pkl")

if __name__ == "__main__":
    main()
