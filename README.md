# group36-finalterm
Báo cáo cuối kì môn Nhập Môn Trí Tuệ Nhân Tạo mã MAT1206E

📌 TaskAI – Main Branch

Nhánh main chứa toàn bộ tài liệu và mã nguồn của dự án, bao gồm:

📄 Báo cáo cuối kỳ (Report)

📊 Slide thuyết trình

💻 Source code của dự án

Dự án TaskAI được triển khai dưới dạng 3 project độc lập, tương ứng với 3 source code riêng biệt.
Để hệ thống hoạt động đầy đủ, cần chạy đồng thời cả 3 project:
- Backend Spring Boot

- AI Service FastAPI

- Frontend React (Vite)

  
🚀 Chạy project Spring Boot (Backend)

Yêu cầu môi trường
-	Java JDK 17 or 21 (khuyến nghị, phù hợp với Spring Boot 3.x)
-	Maven 3.8+ (có thể dùng Maven tích hợp trong IntelliJ hoặc cài riêng)
-	Docker Desktop (để chạy MySQL container)
-	IntelliJ IDEA (Ultimate/Community đều được)

▶️ Các bước chạy Spring Boot:

1. Clone project về máy: clone thư mục AI_Task 
2. Sau đó mở project bằng IntelliJ IDEA : mở thư mục chứa file src
3. Cấu hình Spring Boot kết nối vào MySQL: mở file application.yml sửa lại đúng port MySQL bạn đang chạy jdbc:mysql://127.0.0.1:3310/task_ai
4. Cài dependencies Maven: Mở terminal ngay trong thư mục project chạy lệnh 
mvn clean install
-	Đợi Maven load toàn bộ thư viện.
5. Chạy Spring Boot: Nhấn Run ▶
 (Trước khi run phải cài đặt Docker và chạy đã để springboot kết nối với database
Sau khi chạy thành công springboot các bảng sẽ tự động được tạo ở database)

🐳 Cài đặt và chạy MySQL bằng Docker
-	Cài đặt Docker Desktop
-	Tạo container MySQL bằng Docker: chạy lệnh 
docker run --name taskai_mysql -e MYSQL_ROOT_PASSWORD=root -e M	YSQL_DATABASE=task_ai -p 3310:3306 -d mysql:8.0
-	Kiểm tra container MySQL có chạy không : docker ps

<img width="602" height="35" alt="image" src="https://github.com/user-attachments/assets/aad8c370-3e20-4b16-884b-d884ad626c0e" />

-	Cài đặt MySQL Workbench để xem database
-	Sau khi cài đặt xong: mở MySQL Workbench → MySQL Connections → New Connection
-	Điền thông tin: password: root

<img width="602" height="207" alt="image" src="https://github.com/user-attachments/assets/c1dcb52d-0a09-450a-a5d1-1615a5c6dec9" />

-	Điền xong ấn Test Connection → OK. 
-	Kiểm tra database trong Workbench – sẽ thấy database tên task_ai đã được tạo


🤖 Chạy project FastAPI (AI Service)

Yêu cầu môi trường FastAPI:

  - Python 3.10+ (khuyến nghị Python 3.11 để tốc độ tốt hơn)
  - FastAPI + Uvicorn (server ASGI để chạy ứng dụng)
  - pip / virtualenv (tạo môi trường ảo và quản lý thư viện)
  - Các thư viện ML & NLP:
    scikit-learn, pandas, scipy, joblib, regex / underthesea (tùy chọn)
  - Visual Studio Code (IDE khuyến nghị để phát triển Python)

▶️ Các bước chạy FastAPI

1. Clone project từ GitHub: clone thư mục fastapi_ai 
2. Mở thư mục đó lên ở Visual Studio Code :mở terminal cd vào thư mục fastapi_ai (nếu đang ở đấy rồi thì thôi)
3. Cài Python: FastAPI yêu cầu: Python 3.10+ 
4. Kiểm tra version:  python –version
5. Cài pip (nếu cần): ở terminal python -m ensurepip –upgrade
6. Nâng cấp pip: ở terminal pip install --upgrade pip
7. Sau đó cài môi trường ảo: ở terminal dán: python -m venv venv 
8. Sau đó activate bằng lệnh: source venv/Scripts/activate để activate môi trường
- Sau khi active, terminal sẽ có dạng như ảnh dưới đây:
  
<img width="602" height="60" alt="image" src="https://github.com/user-attachments/assets/f4f6f649-2b4e-4b53-aecd-65622ecd357b" />

9. Cài dependencies từ requirements.txt: Chạy lệnh
pip install -r requirements.txt
-	FastAPI sẽ được cài cùng các thư viện
-	Kiểm tra thư mục models: FastAPI sử dụng mô hình ML đã train, đảm bảo rằng trong thư mục dự án có các file .pkl như ảnh:

  <img width="299" height="253" alt="image" src="https://github.com/user-attachments/assets/2a48bf6f-0822-49ff-a731-a8037356fa75" />

-	Nếu backend Spring Boot gọi AI mà file thiếu → sẽ lỗi.
10. Chạy FastAPI server: uvicorn main:app --reload --port 8000
-	Hoặc : uvicorn main:app –reload
-	Kiểm tra FastAPI hoạt động như ảnh dưới đây là oke
  
<img width="601" height="146" alt="image" src="https://github.com/user-attachments/assets/123d769d-af15-43f0-9d5c-19dcec04e83a" />


🎨 Chạy project Frontend (React)

Yêu cầu môi trường FrontEnd:
  - Node.js 18+
  - npm 9+ / yarn / pnpm
  - Vite 4+
  - VS Code (Khuyến nghị)
  - Các Extention trong VS Code cần thiết

▶️ Các bước chạy Frontend

1. Clone project từ GitHub: clone thư mục group36-finalterm-refactor-folder
2. Cài Node.js : Project React Vite yêu cầu: Node.js 18+ , npm
3. Mở thư mục vừa clone trong Visual Studio Code: cd đến thư mục vite-project(thư mục chứa src)
4. Sau đó chạy lệnh : npm install (lệnh này sẽ tải về các thư viện React, tải Vite, tải Tailwind, Axios, React Router, v.v.
5. Sau đó chạy frontend: npm run dev

<img width="559" height="152" alt="image" src="https://github.com/user-attachments/assets/12739342-8714-4247-bea7-060746b0ce96" />

-	Chạy xong nó sẽ hiện lên như này và mở đường dẫn local lên để kiểm tra nếu khi mở lên có thể nó sẽ báo lỗi bị thiếu 1 số thư viện react, … thì xem xem nó hiện thiếu thư viện nào thì tải về bằng cách dán câu lện tải thư viện đấy vào terminal thư mục đang làm việc trên visual
-	Sau khi cài đầy đủ các thư viện cần thiết giao diện trang web sẽ hiện ra







  

