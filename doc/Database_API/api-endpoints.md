# API ENDPOINTS DESIGN

## 1. Giới thiệu

### 1.1. Mục đích

Tài liệu này mô tả danh sách API endpoints dự kiến cho website kinh doanh mã nguồn.

API được thiết kế nhằm hỗ trợ Frontend giao tiếp với Backend để thực hiện các chức năng như:
- Đăng ký và đăng nhập tài khoản.
- Quản lý thông tin người dùng.
- Hiển thị và quản lý sản phẩm mã nguồn.
- Quản lý đơn hàng.
- Đánh giá sản phẩm.
- Tải sản phẩm đã mua.
- Quản lý lịch sử tải xuống.

### 1.2. Phạm vi

Các API được xây dựng dựa trên 6 bảng dữ liệu chính:
1. users
2. products
3. orders
4. order_items
5. reviews
6. downloads_log

### 1.3. Quy ước API

- Phương thức HTTP được sử dụng: GET, POST, PUT, PATCH, DELETE.
- Dữ liệu trao đổi giữa Frontend và Backend sử dụng định dạng JSON.
- API có thể sử dụng JWT (JSON Web Token) để xác thực người dùng.
- Các API yêu cầu đăng nhập cần gửi access token trong HTTP Header.
- Các API quản lý cần kiểm tra quyền của người dùng trước khi thực hiện.

**Định dạng Header dự kiến:**

`Authorization: Bearer <access_token>`

**Base URL dự kiến:**

`/api/v1`

Lưu ý: Base URL, phương thức xác thực và cấu trúc dữ liệu cần được thống nhất với nhóm hoặc điều chỉnh theo API do giảng viên cung cấp.

---

## 2. Danh sách API Authentication – Xác thực tài khoản

Nhóm API này phục vụ chức năng đăng ký, đăng nhập và quản lý phiên đăng nhập.

| STT | Method | Endpoint | Chức năng | Quyền truy cập |
|---|---|---|---|---|
| 1 | POST | /auth/register | Đăng ký tài khoản | Public |
| 2 | POST | /auth/login | Đăng nhập | Public |
| 3 | GET | /auth/me | Lấy thông tin tài khoản hiện tại | Đã đăng nhập |
| 4 | POST | /auth/logout | Đăng xuất | Đã đăng nhập |

### 2.1. POST /auth/register

**Chức năng:** Tạo tài khoản mới.

Request Body:

`{ "full_name": "Nguyen Van A", "email": "user@example.com", "password": "12345678" }`

Response thành công dự kiến:

`{ "message": "Register successful", "user": { "id": 1, "full_name": "Nguyen Van A", "email": "user@example.com" } }`

Quy tắc:
- Email không được trùng với tài khoản đã tồn tại.
- Mật khẩu phải được mã hóa trước khi lưu vào Database.
- Vai trò tài khoản được xác định theo quy tắc đăng ký của hệ thống.

### 2.2. POST /auth/login

**Chức năng:** Xác thực tài khoản và cấp token đăng nhập.

Request Body:

`{ "email": "user@example.com", "password": "12345678" }`

Response thành công dự kiến:

`{ "message": "Login successful", "access_token": "token_example", "user": { "id": 1, "full_name": "Nguyen Van A", "email": "user@example.com", "role": "buyer" } }`

### 2.3. GET /auth/me

**Chức năng:** Lấy thông tin tài khoản đang đăng nhập.

Yêu cầu:
- Người dùng phải đăng nhập.
- Token phải hợp lệ.

### 2.4. POST /auth/logout

**Chức năng:** Đăng xuất tài khoản.

Yêu cầu:
- Người dùng phải đăng nhập.
- Backend xử lý việc kết thúc hoặc vô hiệu hóa phiên/token theo cơ chế xác thực được lựa chọn.

---

## 3. Danh sách API Users – Quản lý người dùng

Nhóm API này phục vụ việc xem và cập nhật thông tin tài khoản.

| STT | Method | Endpoint | Chức năng | Quyền truy cập |
|---|---|---|---|---|
| 1 | GET | /users/me | Xem thông tin cá nhân | Đã đăng nhập |
| 2 | PUT | /users/me | Cập nhật thông tin cá nhân | Đã đăng nhập |
| 3 | GET | /users | Lấy danh sách người dùng | Admin |

### 3.1. GET /users/me

**Chức năng:** Lấy thông tin người dùng hiện tại.

Response dự kiến:

`{ "id": 1, "full_name": "Nguyen Van A", "email": "user@example.com", "role": "buyer" }`

### 3.2. PUT /users/me

**Chức năng:** Cập nhật thông tin cá nhân.

Request Body:

`{ "full_name": "Nguyen Van B" }`

Quy tắc:
- Người dùng chỉ được cập nhật thông tin tài khoản của chính mình.
- Không cho phép tự ý thay đổi quyền Admin.
- Email phải đảm bảo không trùng với tài khoản khác nếu cho phép cập nhật email.

### 3.3. GET /users

**Chức năng:** Lấy danh sách tài khoản trong hệ thống.

Quyền truy cập: Admin.

---

## 4. Danh sách API Products – Quản lý sản phẩm

Nhóm API này phục vụ việc hiển thị, đăng bán, cập nhật và quản lý sản phẩm mã nguồn.

| STT | Method | Endpoint | Chức năng | Quyền truy cập |
|---|---|---|---|---|
| 1 | GET | /products | Lấy danh sách sản phẩm | Public |
| 2 | GET | /products/{id} | Xem chi tiết sản phẩm | Public |
| 3 | POST | /products | Đăng sản phẩm mới | Seller |
| 4 | PUT | /products/{id} | Cập nhật sản phẩm | Chủ sản phẩm |
| 5 | DELETE | /products/{id} | Xóa sản phẩm | Chủ sản phẩm/Admin |
| 6 | PATCH | /products/{id}/status | Cập nhật trạng thái sản phẩm | Admin |

### 4.1. GET /products

**Chức năng:** Lấy danh sách sản phẩm được phép hiển thị công khai.

Tham số truy vấn dự kiến:
- page: Số trang.
- limit: Số sản phẩm trên mỗi trang.
- keyword: Từ khóa tìm kiếm.

Ví dụ:

`GET /api/v1/products?page=1&limit=10&keyword=website`

### 4.2. GET /products/{id}

**Chức năng:** Xem thông tin chi tiết một sản phẩm.

Response dự kiến:

`{ "id": 1, "seller_id": 2, "name": "Website bán hàng", "description": "Source code website", "price": 500000, "status": "approved" }`

### 4.3. POST /products

**Chức năng:** Người bán đăng sản phẩm mới.

Request Body dự kiến:

`{ "name": "Website bán hàng", "description": "Source code website", "price": 500000, "file_path": "private/products/file.zip" }`

Quy tắc:
- Người đăng phải có quyền Seller.
- Giá bán không được nhỏ hơn 0.
- Backend tự xác định seller_id từ tài khoản đang đăng nhập.
- Sản phẩm mới có thể được đặt trạng thái pending để chờ kiểm duyệt.

### 4.4. PUT /products/{id}

**Chức năng:** Cập nhật thông tin sản phẩm.

Quy tắc:
- Chỉ chủ sở hữu sản phẩm hoặc người có quyền phù hợp mới được cập nhật.
- Không cho phép người bán chỉnh sửa sản phẩm của người khác.

### 4.5. DELETE /products/{id}

**Chức năng:** Xóa sản phẩm.

Quy tắc:
- Kiểm tra quyền sở hữu trước khi xóa.
- Admin có thể thực hiện theo quyền quản trị.
- Cần thống nhất cách xử lý sản phẩm đã phát sinh đơn hàng.

### 4.6. PATCH /products/{id}/status

**Chức năng:** Quản trị viên thay đổi trạng thái sản phẩm.

Request Body:

`{ "status": "approved" }`

Các trạng thái dự kiến:
- pending
- approved
- rejected
- hidden

---

## 5. Danh sách API Orders – Quản lý đơn hàng

Nhóm API này phục vụ việc tạo và theo dõi đơn hàng của người mua.

| STT | Method | Endpoint | Chức năng | Quyền truy cập |
|---|---|---|---|---|
| 1 | POST | /orders | Tạo đơn hàng | Buyer |
| 2 | GET | /orders | Xem danh sách đơn hàng của mình | Đã đăng nhập |
| 3 | GET | /orders/{id} | Xem chi tiết đơn hàng | Chủ đơn hàng/Admin |
| 4 | PATCH | /orders/{id}/cancel | Hủy đơn hàng | Chủ đơn hàng |

### 5.1. POST /orders

**Chức năng:** Tạo đơn hàng mới.

Request Body dự kiến:

`{ "items": [ { "product_id": 1, "quantity": 1 } ] }`

Quy tắc:
- Người mua phải đăng nhập.
- Sản phẩm phải tồn tại và được phép bán.
- Backend tự xác định buyer_id từ tài khoản đăng nhập.
- Backend tự lấy giá sản phẩm từ Database để tính total_amount.
- Không tin tưởng giá tiền do Frontend gửi lên.

### 5.2. GET /orders

**Chức năng:** Lấy danh sách đơn hàng của người dùng hiện tại.

Quy tắc:
- Người dùng chỉ được xem đơn hàng của chính mình.
- Admin có thể được cấp quyền xem danh sách đơn hàng toàn hệ thống.

### 5.3. GET /orders/{id}

**Chức năng:** Xem thông tin chi tiết đơn hàng, bao gồm danh sách sản phẩm trong order_items.

### 5.4. PATCH /orders/{id}/cancel

**Chức năng:** Hủy đơn hàng.

Quy tắc:
- Chỉ chủ đơn hàng hoặc Admin có quyền phù hợp mới được thực hiện.
- Không cho phép hủy đơn đã hoàn tất hoặc đã hoàn tiền nếu quy trình hệ thống không hỗ trợ.
- Quy tắc hủy và hoàn tiền cần được nhóm thống nhất.

---

## 6. Danh sách API Reviews – Đánh giá sản phẩm

Nhóm API này phục vụ việc tạo, xem và quản lý đánh giá sản phẩm.

| STT | Method | Endpoint | Chức năng | Quyền truy cập |
|---|---|---|---|---|
| 1 | GET | /products/{id}/reviews | Xem đánh giá sản phẩm | Public |
| 2 | POST | /products/{id}/reviews | Tạo đánh giá | Buyer |
| 3 | PUT | /reviews/{id} | Cập nhật đánh giá | Chủ đánh giá |
| 4 | DELETE | /reviews/{id} | Xóa đánh giá | Chủ đánh giá/Admin |

### 6.1. GET /products/{id}/reviews

**Chức năng:** Lấy danh sách đánh giá của một sản phẩm.

### 6.2. POST /products/{id}/reviews

**Chức năng:** Người mua tạo đánh giá sản phẩm.

Request Body:

`{ "rating": 5, "comment": "Sản phẩm tốt, dễ sử dụng." }`

Quy tắc:
- rating chỉ được nằm trong khoảng từ 1 đến 5.
- Mỗi người dùng chỉ được đánh giá một lần cho một sản phẩm theo thiết kế hiện tại.
- Đề xuất chỉ cho phép người đã mua sản phẩm và thanh toán thành công được đánh giá.

### 6.3. PUT /reviews/{id}

**Chức năng:** Cập nhật nội dung đánh giá.

Quy tắc:
- Chỉ người tạo đánh giá mới được cập nhật.
- Điểm đánh giá vẫn phải nằm trong khoảng từ 1 đến 5.

### 6.4. DELETE /reviews/{id}

**Chức năng:** Xóa đánh giá.

Quy tắc:
- Người dùng chỉ được xóa đánh giá của chính mình.
- Admin có thể xóa đánh giá vi phạm theo quy định hệ thống.

---

## 7. Danh sách API Downloads – Tải sản phẩm

Nhóm API này phục vụ việc tải sản phẩm mã nguồn đã mua và xem lịch sử tải xuống.

| STT | Method | Endpoint | Chức năng | Quyền truy cập |
|---|---|---|---|---|
| 1 | GET | /products/{id}/download | Tải sản phẩm | Buyer đã đủ điều kiện |
| 2 | GET | /downloads/history | Xem lịch sử tải xuống | Đã đăng nhập |

### 7.1. GET /products/{id}/download

**Chức năng:** Cho phép người mua tải file mã nguồn.

Quy tắc:
- Người dùng phải đăng nhập.
- Phải kiểm tra người dùng có đơn hàng hợp lệ chứa sản phẩm.
- Phải kiểm tra trạng thái thanh toán thành công.
- Không trả về đường dẫn file riêng tư khi chưa xác thực quyền tải.
- Ghi nhận lượt tải vào bảng downloads_log.

### 7.2. GET /downloads/history

**Chức năng:** Lấy lịch sử tải sản phẩm của người dùng hiện tại.

Thông tin dự kiến:
- Tên sản phẩm.
- Mã sản phẩm.
- Thời gian tải.
- Mã chi tiết đơn hàng liên quan.

---

## 8. Quy ước Response và Error Handling

### 8.1. Response thành công

Định dạng dữ liệu dự kiến:

`{ "success": true, "message": "Request successful", "data": {} }`

### 8.2. Response thất bại

Định dạng dữ liệu dự kiến:

`{ "success": false, "message": "An error occurred", "errors": [] }`

### 8.3. Các HTTP Status Code

| Status Code | Ý nghĩa | Trường hợp sử dụng |
|---|---|---|
| 200 | OK | Yêu cầu thành công |
| 201 | Created | Tạo dữ liệu thành công |
| 400 | Bad Request | Dữ liệu gửi lên không hợp lệ |
| 401 | Unauthorized | Chưa đăng nhập hoặc token không hợp lệ |
| 403 | Forbidden | Không có quyền truy cập |
| 404 | Not Found | Không tìm thấy dữ liệu |
| 409 | Conflict | Dữ liệu bị trùng hoặc xung đột |
| 422 | Unprocessable Entity | Dữ liệu không đáp ứng quy tắc nghiệp vụ |
| 500 | Internal Server Error | Lỗi máy chủ |

---

## 9. Quyền truy cập API

| Chức năng | Public | Buyer | Seller | Admin |
|---|---|---|---|---|
| Xem danh sách sản phẩm công khai | Có | Có | Có | Có |
| Xem chi tiết sản phẩm công khai | Có | Có | Có | Có |
| Đăng sản phẩm | Không | Không | Có | Theo quyền quản trị |
| Cập nhật sản phẩm | Không | Không | Sản phẩm của mình | Có |
| Kiểm duyệt sản phẩm | Không | Không | Không | Có |
| Tạo đơn hàng | Không | Có | Theo quyền mua hàng | Theo quyền được cấp |
| Xem đơn hàng | Không | Đơn của mình | Đơn của mình | Có |
| Đánh giá sản phẩm | Không | Theo điều kiện mua hàng | Theo quyền mua hàng | Theo quyền được cấp |
| Tải sản phẩm | Không | Theo điều kiện thanh toán | Theo quyền mua hàng | Theo quyền được cấp |
| Xem lịch sử tải | Không | Của mình | Của mình | Theo quyền quản trị |

Lưu ý: Bảng quyền trên là đề xuất ban đầu. Cần thống nhất với nhóm về việc một tài khoản có thể vừa mua vừa bán hay không.

---

## 10. Các nội dung cần thống nhất với nhóm

1. Backend sử dụng API do giảng viên cung cấp hay nhóm tự xây dựng?
2. Base URL chính thức của hệ thống là gì?
3. Cơ chế xác thực sử dụng JWT hay phương thức khác?
4. Một tài khoản có thể vừa là Buyer vừa là Seller không?
5. Có cần API thanh toán riêng hay sử dụng cổng thanh toán bên ngoài?
6. Có cần bổ sung API tìm kiếm, lọc và phân trang sản phẩm không?
7. Người mua có được tải lại sản phẩm nhiều lần sau khi thanh toán không?
8. Có cần giới hạn số lượt tải hoặc thời hạn tải không?
9. Điều kiện nào cho phép người dùng đánh giá sản phẩm?
10. Quy trình kiểm duyệt sản phẩm của Admin được thực hiện như thế nào?

---

## 11. Kết luận

Tài liệu API Endpoints Design mô tả các API dự kiến phục vụ hoạt động của website kinh doanh mã nguồn.

Danh sách API được xây dựng dựa trên cấu trúc Database gồm 6 bảng chính: users, products, orders, order_items, reviews và downloads_log.

Đây là bản thiết kế ban đầu phục vụ việc trao đổi và thống nhất giữa các thành viên trong nhóm trước khi triển khai. Các endpoint, phương thức xác thực, dữ liệu Request/Response và quyền truy cập cần được điều chỉnh theo yêu cầu thực tế của Backend hoặc API do giảng viên cung cấp.