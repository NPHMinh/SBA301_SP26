# Library Management System - Spring Boot with MongoDB

## Giới thiệu
Ứng dụng web quản lý thư viện trường Đại học, cho phép quản lý Sinh viên (Student) và Sách (Book) với quy tắc nghiệp vụ: Một sinh viên có thể mượn nhiều cuốn sách.

## Công nghệ sử dụng

### Backend
- **Framework**: Spring Boot 4.0.3
- **Database**: MongoDB (NoSQL)
- **Data Management**: Spring Data MongoDB
- **Build Tool**: Maven
- **Java Version**: 21

### Frontend
- **Template Engine**: Thymeleaf
- **CSS**: Inline CSS (responsive design)

## Kiến trúc hệ thống

Dự án được xây dựng theo **3-Layer Architecture** kết hợp với **Repository Pattern**:

### 1. Model Layer (POJO)
- `Student.java` - Entity cho sinh viên
- `Book.java` - Entity cho sách

### 2. Repository Layer
- `IStudentRepository.java` - Interface kết nối CSDL cho Student
- `IBookRepository.java` - Interface kết nối CSDL cho Book

### 3. Service Layer
- `IStudentService.java` & `StudentService.java` - Logic nghiệp vụ cho Student
- `IBookService.java` & `BookService.java` - Logic nghiệp vụ cho Book

### 4. Controller Layer
- `LoginController.java` - Xử lý đăng nhập và phiên làm việc
- `HomeController.java` - Trang chủ và thống kê
- `StudentController.java` - CRUD operations cho Student
- `BookController.java` - CRUD operations cho Book

## Cơ sở dữ liệu

### Database: LibraryDB

#### Collection: STUDENTS
- `id` (String) - MongoDB ObjectId, tự động sinh
- `firstName` (String) - Tên sinh viên
- `lastName` (String) - Họ sinh viên
- `marks` (Double) - Điểm số
- `borrowedBooks` (List<Book>) - Danh sách sách đã mượn (DBRef)

#### Collection: BOOKS
- `id` (String) - MongoDB ObjectId, tự động sinh
- `title` (String) - Tiêu đề sách
- `author` (String) - Tác giả
- `isbn` (String) - Mã số tiêu chuẩn quốc tế

## Cài đặt và Chạy ứng dụng

### Bước 1: Cài đặt MongoDB
1. Tải và cài đặt MongoDB từ: https://www.mongodb.com/try/download/community
2. Khởi động MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # hoặc chạy mongod.exe
   mongod --dbpath "C:\data\db"
   ```

### Bước 2: Cấu hình Database
MongoDB sẽ tự động tạo database `LibraryDB` khi ứng dụng chạy lần đầu.

Cấu hình trong `application.properties`:
```properties
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017
spring.data.mongodb.database=LibraryDB
```

### Bước 3: Build và Run ứng dụng

#### Sử dụng Maven:
```bash
# Build project
mvnw clean install

# Run application
mvnw spring-boot:run
```

#### Sử dụng IDE (IntelliJ/Eclipse):
1. Import project as Maven project
2. Run `Lab8SpringBoostWithMongoDemoApplication.java`

### Bước 4: Truy cập ứng dụng
Mở trình duyệt và truy cập: http://localhost:8080

## Thông tin đăng nhập

**Username**: `admin`  
**Password**: `admin123`

## Chức năng chính

### 1. Authentication (Xác thực)
- ✅ Trang đăng nhập với session management
- ✅ Kiểm tra phiên làm việc trước khi truy cập các chức năng
- ✅ Đăng xuất

### 2. Student Management (Quản lý Sinh viên)
- ✅ **Create** - Thêm sinh viên mới
- ✅ **Read** - Xem danh sách và chi tiết sinh viên
- ✅ **Update** - Chỉnh sửa thông tin sinh viên
- ✅ **Delete** - Xóa sinh viên

### 3. Book Management (Quản lý Sách)
- ✅ **Create** - Thêm sách mới
- ✅ **Read** - Xem danh sách và chi tiết sách
- ✅ **Update** - Chỉnh sửa thông tin sách
- ✅ **Delete** - Xóa sách

### 4. Dashboard
- Thống kê tổng số sinh viên
- Thống kê tổng số sách
- Menu điều hướng nhanh

## Cấu trúc thư mục

```
src/
├── main/
│   ├── java/sum25/de180174/lab8springboostwithmongodemo/
│   │   ├── controller/
│   │   │   ├── BookController.java
│   │   │   ├── HomeController.java
│   │   │   ├── LoginController.java
│   │   │   └── StudentController.java
│   │   ├── model/
│   │   │   ├── Book.java
│   │   │   └── Student.java
│   │   ├── repository/
│   │   │   ├── IBookRepository.java
│   │   │   └── IStudentRepository.java
│   │   ├── service/
│   │   │   ├── BookService.java
│   │   │   ├── IBookService.java
│   │   │   ├── IStudentService.java
│   │   │   └── StudentService.java
│   │   └── Lab8SpringBoostWithMongoDemoApplication.java
│   └── resources/
│       ├── templates/
│       │   ├── books/
│       │   │   ├── form.html
│       │   │   ├── list.html
│       │   │   └── view.html
│       │   ├── students/
│       │   │   ├── form.html
│       │   │   ├── list.html
│       │   │   └── view.html
│       │   ├── home.html
│       │   └── login.html
│       └── application.properties
└── test/
    └── java/sum25/de180174/lab8springboostwithmongodemo/
        └── Lab8SpringBoostWithMongoDemoApplicationTests.java
```

## API Endpoints

### Authentication
- `GET /` - Redirect to login
- `GET /login` - Login page
- `POST /login` - Process login
- `GET /logout` - Logout

### Home
- `GET /home` - Dashboard (requires authentication)

### Students
- `GET /students` - List all students
- `GET /students/new` - New student form
- `POST /students` - Create student
- `GET /students/view/{id}` - View student details
- `GET /students/edit/{id}` - Edit student form
- `POST /students/update/{id}` - Update student
- `GET /students/delete/{id}` - Delete student

### Books
- `GET /books` - List all books
- `GET /books/new` - New book form
- `POST /books` - Create book
- `GET /books/view/{id}` - View book details
- `GET /books/edit/{id}` - Edit book form
- `POST /books/update/{id}` - Update book
- `GET /books/delete/{id}` - Delete book

## Ghi chú

### Session Management
- Session được tạo khi đăng nhập thành công
- Tất cả các trang yêu cầu session hợp lệ
- Session bị hủy khi đăng xuất

### MongoDB Auto-increment ID
MongoDB sử dụng ObjectId (String) thay vì auto-increment integer. Điều này phù hợp hơn với NoSQL và phân tán.

### Relationship
Sử dụng `@DBRef` để tạo mối quan hệ giữa Student và Book (one-to-many).

## Troubleshooting

### Lỗi kết nối MongoDB
```
Error: MongoSocketException: Exception opening socket
```
**Giải pháp**: Đảm bảo MongoDB service đang chạy trên localhost:27017

### Port 8080 already in use
```
Error: Web server failed to start. Port 8080 was already in use.
```
**Giải pháp**: Thay đổi port trong `application.properties`:
```properties
server.port=8081
```

### Thymeleaf template not found
```
Error: Error resolving template
```
**Giải pháp**: Đảm bảo các file HTML nằm trong thư mục `src/main/resources/templates/`

## Tác giả
- Sinh viên: DE180174
- Học kỳ: Summer 2025
- Môn học: SBA301 - Lab 8

## License
Educational purpose only - University Project
