# Hướng dẫn thiết lập và chạy ứng dụng

## Backend (Flask API)

1. Đảm bảo đã cài đặt Python 3.7+ và pip

2. Di chuyển vào thư mục backend:
```
cd backend/pet_api
```

3. Cài đặt các dependencies:
```
pip install -r requirements.txt
```

4. Khởi động server:
```
python app.py
```

Server sẽ chạy tại địa chỉ: http://localhost:5000

## Frontend (React)

1. Đảm bảo đã cài đặt Node.js 14+ và npm

2. Di chuyển vào thư mục frontend:
```
cd frontend/web
```

3. Cài đặt các dependencies:
```
npm install
```

4. Khởi động ứng dụng React:
```
npm start
```

Ứng dụng sẽ chạy tại địa chỉ: http://localhost:3000

## Xử lý lỗi CORS

Nếu vẫn gặp lỗi CORS sau khi thực hiện các bước trên:

1. Đảm bảo backend đang chạy trước khi khởi động frontend
2. Kiểm tra xem cổng 5000 có đang được sử dụng bởi ứng dụng khác không
3. Nếu vấn đề vẫn tồn tại, bạn có thể dùng extension CORS Unblock trên Chrome hoặc Firefox để tạm thời giải quyết vấn đề
4. Hoặc sử dụng proxy như đã cấu hình trong package.json 

## Khởi động lại sau khi cập nhật

Nếu bạn đã cập nhật code và vẫn gặp vấn đề:

1. Dừng cả backend và frontend (Ctrl+C trong terminal)
2. Xóa cache của trình duyệt:
   - Chrome: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
   - Edge: Ctrl+Shift+Delete
3. Khởi động lại backend:
```
cd backend/pet_api
python app.py
```
4. Khởi động lại frontend trong một terminal khác:
```
cd frontend/web
npm start
```
5. Mở trình duyệt ở cửa sổ Incognito/Private mới để tránh cache 