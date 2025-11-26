# training/train_all.py
from training import train_category, train_regression


def main():
    print("=== Train category (classification) ===")
    train_category.main()

    print("\n=== Train urgency & importance (regression) ===")
    train_regression.main()


if __name__ == "__main__":
    main()
