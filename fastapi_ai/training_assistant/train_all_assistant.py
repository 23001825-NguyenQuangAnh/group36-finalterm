# training_assistant/train_all_assistant.py
from training_assistant import (
    train_assistant_category,
    train_assistant_regression,
)


def main():
    print("=== Train CATEGORY ===")
    train_assistant_category.main()

    print("\n=== Train REGRESSION ===")
    train_assistant_regression.main()

    print("\n=== Skip TITLE extraction (Not needed)")
    print("✔ Assistant training completed!")


if __name__ == "__main__":
    main()
