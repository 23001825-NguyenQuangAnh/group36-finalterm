Để chạy thành công bài tập lớn này phải chạy cùng lúc 3 project: spring boot, FastApi, và frontend

Yêu cầu môi trường
-	Java JDK 17 or 21 (khuyến nghị, phù hợp với Spring Boot 3.x)
-	Maven 3.8+ (có thể dùng Maven tích hợp trong IntelliJ hoặc cài riêng)
-	Docker Desktop (để chạy MySQL container)
-	IntelliJ IDEA (Ultimate/Community đều được)
  
	Chạy project spring boot

-	Clone project về máy: clone thư mục AI_Task ở nhánh taskai-springboot về máy
-	Sau đó mở project bằng IntelliJ IDEA : mở thư mục chứa file src
-	Cấu hình Spring Boot kết nối vào MySQL: mở file application.yml sửa lại đúng port MySQL bạn đang chạy jdbc:mysql://127.0.0.1:3310/task_ai
-	Cài dependencies Maven: Mở terminal ngay trong thư mục project chạy lệnh 
mvn clean install
-	Đợi Maven load toàn bộ thư viện.
-	Chạy Spring Boot: Nhấn Run ▶
 (Trước khi run phải cài đặt Docker và chạy đã để springboot kết nối với database
Sau khi chạy thành công springboot các bảng sẽ tự động được tạo ở database)

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
