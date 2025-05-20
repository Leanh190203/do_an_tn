# Phát triển Backend

## 1. Giới thiệu

Backend của ứng dụng được phát triển bằng Python sử dụng Flask Framework, cùng với SQLAlchemy làm ORM (Object-Relational Mapping) để tương tác với cơ sở dữ liệu MySQL. Hệ thống được thiết kế theo mô hình REST API với các endpoint được tổ chức theo chức năng.

## 2. Cấu trúc Backend

```
backend/
│
├── pet_api/
│   ├── app.py                 # Entry point của ứng dụng
│   ├── config.py             # Cấu hình ứng dụng
│   ├── auth.py              # Xử lý authentication
│   ├── requirements.txt     # Các dependency
│   │
│   ├── models/             # Định nghĩa các model
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── customer.py
│   │   ├── pet.py
│   │   └── appointment.py
│   │
│   └── routes/             # Các route xử lý API
│       ├── user.py
│       ├── customer.py
│       ├── pets.py
│       ├── appointments.py
│       └── dashboard.py
```

## 3. Công nghệ sử dụng

- **Framework**: Flask 2.3.3
- **Database**: MySQL với SQLAlchemy 2.0.21
- **Authentication**: JWT (PyJWT 2.8.0)
- **Password Hashing**: Flask-Bcrypt 1.0.1
- **CORS**: Flask-CORS 4.0.0
- **Database Migration**: Custom migration scripts

## 4. Models

### 4.1. User Model
```python
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(50))
    address = db.Column(db.String(200))
    role = db.Column(db.String(20), default='user')
```

### 4.2. Customer Model
```python
class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120))
    address = db.Column(db.String(200))
    pets = db.relationship('Pet', backref='owner')
```

### 4.3. Pet Model
```python
class Pet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    species = db.Column(db.String(50), nullable=False)
    age = db.Column(db.Integer)
    weight = db.Column(db.Float)
    medical_description = db.Column(db.Text)
    symptoms = db.Column(db.Text)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'))
```

### 4.4. Appointment Model
```python
class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'))
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'))
    appointment_date = db.Column(db.DateTime, nullable=False)
    service = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), default='pending')
    diagnosis = db.Column(db.Text)
    clinic = db.Column(db.String(100))
```

## 5. API Endpoints

### 5.1. Authentication
- POST `/api/user/register` - Đăng ký tài khoản mới
- POST `/api/user/login` - Đăng nhập
- GET `/api/user/me` - Lấy thông tin người dùng hiện tại

### 5.2. Customer Management
- GET `/api/customers` - Lấy danh sách khách hàng
- GET `/api/customers/<id>` - Lấy thông tin một khách hàng
- POST `/api/customers` - Tạo khách hàng mới
- PUT `/api/customers/<id>` - Cập nhật thông tin khách hàng
- DELETE `/api/customers/<id>` - Xóa khách hàng

### 5.3. Pet Management
- GET `/api/pets` - Lấy danh sách thú cưng
- GET `/api/pets/<id>` - Lấy thông tin một thú cưng
- POST `/api/pets` - Tạo thú cưng mới
- PUT `/api/pets/<id>` - Cập nhật thông tin thú cưng
- DELETE `/api/pets/<id>` - Xóa thú cưng

### 5.4. Appointment Management
- GET `/api/appointments` - Lấy danh sách lịch hẹn
- GET `/api/appointments/upcoming` - Lấy danh sách lịch hẹn sắp tới
- GET `/api/appointments/completed` - Lấy danh sách lịch hẹn đã hoàn thành
- POST `/api/appointments` - Tạo lịch hẹn mới
- PUT `/api/appointments/<id>` - Cập nhật lịch hẹn
- PATCH `/api/appointments/status/<id>` - Cập nhật trạng thái lịch hẹn

### 5.5. Dashboard
- GET `/api/dashboard/stats` - Lấy thống kê tổng quan
- GET `/api/dashboard/reports` - Lấy báo cáo chi tiết

## 6. Authentication & Authorization

- Sử dụng JWT (JSON Web Tokens) cho xác thực
- Token được tạo khi đăng nhập và có thời hạn 99 giờ
- Middleware `token_required` để bảo vệ các route cần xác thực
- Middleware `admin_required` cho các route chỉ dành cho admin

## 7. Bảo mật

- Mật khẩu được mã hóa bằng Bcrypt trước khi lưu vào database
- CORS được cấu hình để cho phép truy cập từ frontend
- Validation dữ liệu đầu vào cho tất cả các request
- Error handling cho tất cả các trường hợp lỗi có thể xảy ra

## 8. Database

- Sử dụng MySQL làm database chính
- SQLAlchemy làm ORM để tương tác với database
- Các quan hệ được định nghĩa rõ ràng giữa các bảng
- Cascade delete được cấu hình cho các quan hệ phù hợp

## 9. Logging

- Sử dụng Python logging module
- Log được cấu hình ở mức DEBUG cho development
- Ghi log cho tất cả các hoạt động quan trọng
- Error logging chi tiết để dễ dàng debug

## 10. Khởi tạo và Migration

- Script `init_db.py` để khởi tạo database
- Tạo sẵn tài khoản admin và dữ liệu mẫu
- Hỗ trợ migration để cập nhật schema
- Backup dữ liệu tự động trước khi migration
