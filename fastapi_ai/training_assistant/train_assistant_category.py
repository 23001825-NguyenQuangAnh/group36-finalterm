import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from training_assistant.preprocessing_assistant import build_input
from training_assistant.utils_assistant import get_data_path, save_model

def main():
    df = pd.read_excel(get_data_path("testdata.xlsx"))
    df = df.dropna(subset=["input_text", "categoryName"])

    df["clean"] = df["input_text"].apply(build_input)

    X_text = df["clean"].tolist()
    y = df["categoryName"]

    vectorizer = TfidfVectorizer(max_features=4000, ngram_range=(1, 2))
    X = vectorizer.fit_transform(X_text)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    clf = LogisticRegression(max_iter=2000)
    clf.fit(X_train, y_train)

    preds = clf.predict(X_test)
    print("✔ Category Accuracy:", accuracy_score(y_test, preds))

    save_model(vectorizer, "assistant_vectorizer.pkl")
    save_model(clf, "assistant_category_model.pkl")

if __name__ == "__main__":
    main()
