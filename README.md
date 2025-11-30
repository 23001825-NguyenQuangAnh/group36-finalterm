Yêu cầu môi trường FastAPI:

  - Python 3.10+ (khuyến nghị Python 3.11 để tốc độ tốt hơn)
  - FastAPI + Uvicorn (server ASGI để chạy ứng dụng)
  - pip / virtualenv (tạo môi trường ảo và quản lý thư viện)
  - Các thư viện ML & NLP:
    scikit-learn, pandas, scipy, joblib, regex / underthesea (tùy chọn)
  - Visual Studio Code (IDE khuyến nghị để phát triển Python)

	Chạy project fastapi
-	Clone project từ GitHub: clone thư mục fastapi_ai ở nhánh taskai-fastapi về máy
-	Mở thư mục đó lên ở Visual Studio Code :mở terminal cd vào thư mục fastapi_ai (nếu đang ở đấy rồi thì thôi)
-	Cài Python: FastAPI yêu cầu: Python 3.10+ 
-	Kiểm tra version:  python –version
-	Cài pip (nếu cần): ở terminal python -m ensurepip –upgrade
-	Nâng cấp pip: ở terminal pip install --upgrade pip
-	Sau đó cài môi trường ảo: ở terminal dán: python -m venv venv 
-	Sau đó activate bằng lệnh: source venv/Scripts/activate để activate môi trường
-	Sau khi active, terminal sẽ có dạng như ảnh dưới đây:
  
<img width="602" height="60" alt="image" src="https://github.com/user-attachments/assets/f4f6f649-2b4e-4b53-aecd-65622ecd357b" />

-	Cài dependencies từ requirements.txt: Chạy lệnh
pip install -r requirements.txt
-	FastAPI sẽ được cài cùng các thư viện
-	Kiểm tra thư mục models: FastAPI sử dụng mô hình ML đã train, đảm bảo rằng trong thư mục dự án có các file .pkl như ảnh:

  <img width="299" height="253" alt="image" src="https://github.com/user-attachments/assets/2a48bf6f-0822-49ff-a731-a8037356fa75" />

-	Nếu backend Spring Boot gọi AI mà file thiếu → sẽ lỗi.
-	Chạy FastAPI server: uvicorn main:app --reload --port 8000
-	Hoặc : uvicorn main:app –reload
-	Kiểm tra FastAPI hoạt động như ảnh dưới đây là oke
  
<img width="601" height="146" alt="image" src="https://github.com/user-attachments/assets/123d769d-af15-43f0-9d5c-19dcec04e83a" />

