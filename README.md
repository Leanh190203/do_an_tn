# Hướng dẫn khắc phục lỗi CORS

## Nguyên nhân lỗi CORS

CORS (Cross-Origin Resource Sharing) là một cơ chế an ninh được trình duyệt áp dụng để ngăn chặn các yêu cầu từ một trang web đến một domain khác khi không có sự cho phép rõ ràng.

Lỗi thường gặp: `Access to XMLHttpRequest at 'http://localhost:5000/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy`

## Giải pháp mới (sau khi cập nhật)

Chúng tôi đã thêm một proxy (http-proxy-middleware) để giải quyết vấn đề CORS. Hãy làm theo các bước sau:

1. Cài đặt các dependencies mới:
```bash
cd frontend/web
npm install
```

2. Khởi động lại server theo thứ tự:
```bash
# Terminal 1 - Backend
cd backend/pet_api
python app.py

# Terminal 2 - Frontend 
cd frontend/web
npm start
```

3. Đảm bảo truy cập ứng dụng qua http://localhost:3000

4. Nếu vẫn gặp lỗi, mở cửa sổ trình duyệt mới ở chế độ ẩn danh/Incognito và thử lại.

## Các cách giải quyết khác

### 1. Cài đặt extension CORS cho trình duyệt

- Chrome: [CORS Unblock](https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino)
- Firefox: [CORS Everywhere](https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/)

### 2. Khởi động lại và xóa cache

1. Dừng cả frontend và backend
2. Xóa cache trình duyệt (Ctrl+Shift+Delete)
3. Khởi động lại backend
4. Khởi động lại frontend
5. Sử dụng cửa sổ Incognito/Private để kiểm tra

### 3. Kiểm tra port 5000

Đảm bảo cổng 5000 không bị chiếm bởi ứng dụng khác:

Windows:
```
netstat -ano | findstr 5000
```

### 4. Kiểm tra URL API trong code frontend

Đảm bảo tất cả các service đều sử dụng instance api từ api.js và không có URL hardcoded nào.

## Hướng dẫn debug CORS

1. Mở Chrome DevTools (F12)
2. Vào tab Network
3. Lọc "XHR" hoặc "Fetch" để xem các API requests
4. Tìm các request bị đánh dấu đỏ
5. Kiểm tra trong tab Headers, Response, Preview để xem lỗi cụ thể

## Liên hệ hỗ trợ

Nếu vẫn gặp vấn đề, vui lòng liên hệ đội hỗ trợ. 