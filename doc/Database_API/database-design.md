
# DATABASE DESIGN
## Dự án: Website kinh doanh mã nguồn

### 1. Mục đích
Tài liệu mô tả thiết kế cơ sở dữ liệu cho website kinh doanh mã nguồn.
Cơ sở dữ liệu lưu trữ thông tin người dùng, sản phẩm mã nguồn, đơn hàng,
đánh giá và lịch sử tải xuống.

### 2. Phạm vi
Các chức năng dữ liệu dự kiến:
- Quản lý tài khoản người dùng.
- Quản lý sản phẩm mã nguồn.
- Quản lý đơn hàng và chi tiết đơn hàng.
- Quản lý đánh giá sản phẩm.
- Quản lý lịch sử tải xuống mã nguồn.

### 3. Danh sách bảng dữ liệu dự kiến

| STT | Tên bảng | Mục đích |
|---|---|---|
| 1 | users | Lưu thông tin người dùng và quyền hạn |
| 2 | products | Lưu thông tin sản phẩm mã nguồn |
| 3 | orders | Lưu thông tin đơn hàng |
| 4 | order_items | Lưu chi tiết sản phẩm trong đơn hàng |
| 5 | reviews | Lưu đánh giá sản phẩm |
| 6 | downloads_log | Lưu lịch sử tải xuống |

### 4. Quan hệ dữ liệu dự kiến
- Một người dùng có thể tạo nhiều đơn hàng.
- Một đơn hàng có thể chứa nhiều sản phẩm.
- Một sản phẩm có thể xuất hiện trong nhiều đơn hàng.
- Một người dùng có thể đánh giá nhiều sản phẩm.
- Một sản phẩm có thể nhận nhiều đánh giá.
- Một người dùng có thể có nhiều lượt tải xuống.

### 5. Nguyên tắc thiết kế
- Mỗi bảng có khóa chính (Primary Key).
- Các bảng liên quan sử dụng khóa ngoại (Foreign Key).
- Phân quyền người dùng bằng trường role.
- Quản lý trạng thái đơn hàng.
- Đường dẫn file mã nguồn cần được bảo vệ, không công khai trực tiếp.

### 6. Các nội dung cần thống nhất với nhóm
- Hệ quản trị cơ sở dữ liệu sử dụng.
- Các trường dữ liệu cụ thể của từng bảng.
- Quy tắc phân quyền người dùng.
- Trạng thái đơn hàng và thanh toán.
- Cách lưu trữ và bảo vệ file mã nguồn.

**Lưu ý:** Đây là bản thiết kế đề xuất ban đầu, cần thống nhất với nhóm trước khi triển khai chính thức.

### 7. Định hướng phân quyền người dùng

Hệ thống đề xuất cho phép một tài khoản vừa thực hiện
chức năng mua mã nguồn vừa thực hiện chức năng bán mã nguồn.

Các quyền dự kiến:
- Buyer: xem, mua, thanh toán và tải mã nguồn.
- Seller: đăng bán và quản lý sản phẩm mã nguồn.
- Admin: quản lý người dùng, kiểm duyệt sản phẩm và quản trị hệ thống.

Phương án phân quyền chi tiết cần được thống nhất với nhóm.

### 8. Các giả định nghiệp vụ cần xác nhận

1. Một tài khoản có thể vừa mua vừa bán mã nguồn.
2. Sản phẩm cần được kiểm duyệt trước khi công khai.
3. Người mua chỉ được tải mã nguồn sau khi thanh toán thành công.
4. Mỗi người dùng chỉ được đánh giá một lần cho mỗi sản phẩm.
5. Mỗi sản phẩm mã nguồn được mua với số lượng mặc định là 1.
6. File mã nguồn được lưu trữ riêng tư và không truy cập công khai.

### 9. Nội dung cần thống nhất với nhóm

- Cơ chế phân quyền Buyer, Seller và Admin.
- Quy trình đăng bán và kiểm duyệt sản phẩm.
- Phương thức thanh toán.
- Quy tắc cấp quyền tải mã nguồn.
- Hệ quản trị cơ sở dữ liệu sử dụng.

### 10. Bảng dữ liệu mở rộng đề xuất

| STT | Tên bảng | Mục đích |
|---|---|---|
| 7 | payments | Lưu thông tin giao dịch thanh toán |

Bảng payments dự kiến lưu:
- Mã giao dịch.
- Mã đơn hàng liên quan.
- Phương thức thanh toán.
- Số tiền thanh toán.
- Trạng thái giao dịch.
- Thời gian thanh toán.
- Mã giao dịch từ cổng thanh toán (nếu có).

### 11. Quan hệ dữ liệu bổ sung

- Một người bán có thể đăng nhiều sản phẩm.
- Một đơn hàng có thể có nhiều chi tiết đơn hàng.
- Một đơn hàng có thể có một hoặc nhiều giao dịch thanh toán.
- Mỗi giao dịch thanh toán thuộc về một đơn hàng.

### 12. Định hướng phân quyền

Hệ thống đề xuất cho phép một tài khoản vừa mua vừa bán mã nguồn.

Các quyền Buyer, Seller và Admin được quản lý linh hoạt.
Cấu trúc phân quyền chính thức sẽ được thống nhất với nhóm
trước khi triển khai.

### 13. Lưu ý về thiết kế

Bảng payments là đề xuất mở rộng, chưa được xác nhận chính thức.
Việc bổ sung bảng cần căn cứ vào phương thức thanh toán và
tài liệu API mà nhóm sử dụng.

## 14. Chi tiết cấu trúc các bảng dữ liệu

### 14.1. Bảng users – Quản lý người dùng

**Mục đích:**

Lưu trữ thông tin tài khoản của người dùng trong hệ thống,
bao gồm người mua, người bán và quản trị viên.

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Mã người dùng |
| full_name | VARCHAR(100) | NOT NULL | Họ và tên |
| email | VARCHAR(150) | UNIQUE, NOT NULL | Email đăng nhập |
| password | VARCHAR(255) | NOT NULL | Mật khẩu đã được mã hóa |
| role | VARCHAR(20) | NOT NULL | Vai trò tài khoản |
| created_at | TIMESTAMP | - | Thời gian tạo tài khoản |
| updated_at | TIMESTAMP | - | Thời gian cập nhật gần nhất |

**Quy tắc nghiệp vụ:**
- Mỗi người dùng có một mã định danh duy nhất.
- Email không được trùng lặp.
- Mật khẩu phải được lưu dưới dạng hash.
- Vai trò dự kiến gồm Buyer, Seller và Admin.
- Người dùng có thể đăng sản phẩm nếu được cấp quyền Seller.

**Lưu ý:** Cơ chế một tài khoản có thể vừa mua vừa bán
cần được thống nhất với nhóm trước khi chốt trường role.

### 14.2. Bảng products – Quản lý sản phẩm mã nguồn

**Mục đích:**

Lưu trữ thông tin các sản phẩm mã nguồn được người bán đăng lên
website để giới thiệu và kinh doanh.

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Mã sản phẩm |
| seller_id | INT | FK, NOT NULL | Mã người bán |
| name | VARCHAR(200) | NOT NULL | Tên sản phẩm |
| description | TEXT | - | Mô tả sản phẩm |
| price | DECIMAL(12,2) | NOT NULL | Giá bán sản phẩm |
| file_path | VARCHAR(500) | NOT NULL | Đường dẫn lưu file mã nguồn |
| status | VARCHAR(20) | NOT NULL | Trạng thái sản phẩm |
| created_at | TIMESTAMP | - | Thời gian đăng sản phẩm |
| updated_at | TIMESTAMP | - | Thời gian cập nhật sản phẩm |

**Khóa và quan hệ:**
- Khóa chính (PK): id.
- Khóa ngoại (FK): seller_id tham chiếu đến users.id.
- Một người bán có thể đăng nhiều sản phẩm.
- Mỗi sản phẩm thuộc về một người bán.

**Quy tắc nghiệp vụ:**
- Sản phẩm phải có người bán hợp lệ.
- Giá bán không được nhỏ hơn 0.
- Sản phẩm cần được kiểm duyệt trước khi công khai.
- File mã nguồn phải được lưu trữ riêng tư.
- Người mua chỉ được tải file khi đáp ứng điều kiện thanh toán.

**Các trạng thái dự kiến:**
- pending: Chờ kiểm duyệt.
- approved: Đã được duyệt.
- rejected: Bị từ chối.
- hidden: Đã ẩn khỏi danh sách công khai.

**Lưu ý:** Quy trình kiểm duyệt và trạng thái sản phẩm
cần được thống nhất với nhóm.

### 14.3. Bảng orders – Quản lý đơn hàng

**Mục đích:**

Lưu trữ thông tin các đơn hàng do người mua tạo ra khi thực hiện giao dịch mua sản phẩm mã nguồn trên website.

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Mã đơn hàng |
| buyer_id | INT | FK, NOT NULL | Mã người mua |
| total_amount | DECIMAL(12,2) | NOT NULL | Tổng giá trị đơn hàng |
| status | VARCHAR(20) | NOT NULL | Trạng thái đơn hàng |
| payment_status | VARCHAR(20) | NOT NULL | Trạng thái thanh toán |
| payment_method | VARCHAR(50) | - | Phương thức thanh toán |
| paid_at | TIMESTAMP | - | Thời gian thanh toán thành công |
| created_at | TIMESTAMP | - | Thời gian tạo đơn hàng |

**Khóa và quan hệ:**
- Khóa chính (PK): id.
- Khóa ngoại (FK): buyer_id tham chiếu đến users.id.
- Một người mua có thể tạo nhiều đơn hàng.
- Mỗi đơn hàng thuộc về một người mua.
- Một đơn hàng có thể chứa nhiều sản phẩm thông qua bảng order_items.

**Quy tắc nghiệp vụ:**
- Mỗi đơn hàng phải thuộc về một người mua hợp lệ.
- Tổng giá trị đơn hàng không được nhỏ hơn 0.
- Đơn hàng cần có thông tin sản phẩm tương ứng trong bảng order_items.
- Người mua chỉ được tải sản phẩm khi đáp ứng điều kiện thanh toán.
- Thời gian paid_at chỉ được ghi nhận khi thanh toán thành công.

**Các trạng thái đơn hàng dự kiến:**
- pending: Đơn hàng đang chờ xử lý.
- paid: Đơn hàng đã thanh toán.
- cancelled: Đơn hàng đã bị hủy.
- refunded: Đơn hàng đã được hoàn tiền.

**Các trạng thái thanh toán dự kiến:**
- unpaid: Chưa thanh toán.
- paid: Thanh toán thành công.
- failed: Thanh toán thất bại.
- refunded: Đã hoàn tiền.

**Lưu ý:** status thể hiện trạng thái xử lý của đơn hàng, còn payment_status thể hiện kết quả thanh toán. Hai trường này có mục đích khác nhau và không nên gộp thành một trường. Các trạng thái cần được nhóm thống nhất trước khi triển khai.

---

### 14.4. Bảng order_items – Chi tiết sản phẩm trong đơn hàng

**Mục đích:**

Lưu trữ danh sách các sản phẩm mã nguồn thuộc từng đơn hàng, bao gồm tên sản phẩm, giá bán và số lượng tại thời điểm mua.

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Mã chi tiết đơn hàng |
| order_id | INT | FK, NOT NULL | Mã đơn hàng |
| product_id | INT | FK, NOT NULL | Mã sản phẩm |
| product_name | VARCHAR(200) | NOT NULL | Tên sản phẩm tại thời điểm mua |
| unit_price | DECIMAL(12,2) | NOT NULL | Đơn giá tại thời điểm mua |
| quantity | INT | NOT NULL, DEFAULT 1 | Số lượng sản phẩm |

**Khóa và quan hệ:**
- Khóa chính (PK): id.
- Khóa ngoại (FK): order_id tham chiếu đến orders.id.
- Khóa ngoại (FK): product_id tham chiếu đến products.id.
- Một đơn hàng có thể có nhiều dòng chi tiết đơn hàng.
- Một sản phẩm có thể xuất hiện trong nhiều đơn hàng.

**Quy tắc nghiệp vụ:**
- Mỗi chi tiết đơn hàng phải thuộc về một đơn hàng hợp lệ.
- Sản phẩm được thêm vào đơn hàng phải tồn tại trong hệ thống.
- Số lượng sản phẩm phải lớn hơn 0.
- Đơn giá không được nhỏ hơn 0.
- product_name và unit_price được lưu lại để giữ thông tin sản phẩm tại thời điểm mua, tránh thay đổi dữ liệu lịch sử khi người bán cập nhật tên hoặc giá sản phẩm.

**Lưu ý:** Đối với website kinh doanh mã nguồn, quantity dự kiến mặc định là 1 vì sản phẩm thường được mua theo từng sản phẩm. Quy tắc này cần được nhóm thống nhất.

---

### 14.5. Bảng reviews – Quản lý đánh giá sản phẩm

**Mục đích:**

Lưu trữ các đánh giá và nhận xét của người mua đối với sản phẩm mã nguồn trên website.

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Mã đánh giá |
| user_id | INT | FK, NOT NULL | Mã người đánh giá |
| product_id | INT | FK, NOT NULL | Mã sản phẩm được đánh giá |
| rating | INT | NOT NULL | Điểm đánh giá từ 1 đến 5 |
| comment | TEXT | - | Nội dung nhận xét |
| created_at | TIMESTAMP | - | Thời gian tạo đánh giá |

**Khóa và quan hệ:**
- Khóa chính (PK): id.
- Khóa ngoại (FK): user_id tham chiếu đến users.id.
- Khóa ngoại (FK): product_id tham chiếu đến products.id.
- Một người dùng có thể đánh giá nhiều sản phẩm.
- Một sản phẩm có thể nhận được nhiều đánh giá từ những người dùng khác nhau.
- Mỗi người dùng chỉ được đánh giá một lần đối với một sản phẩm theo thiết kế hiện tại.

**Quy tắc nghiệp vụ:**
- Người đánh giá phải là người dùng hợp lệ.
- Sản phẩm được đánh giá phải tồn tại.
- Điểm đánh giá chỉ được nằm trong khoảng từ 1 đến 5.
- Nội dung nhận xét có thể để trống.
- Một người dùng không được tạo nhiều đánh giá cho cùng một sản phẩm.
- Đề xuất chỉ cho phép người đã mua sản phẩm và thanh toán thành công được đánh giá sản phẩm.

**Ràng buộc dữ liệu:**

Tạo ràng buộc UNIQUE trên cặp trường (user_id, product_id) để đảm bảo một người dùng chỉ có một đánh giá cho một sản phẩm.

**Lưu ý:** Điều kiện bắt buộc đã mua sản phẩm trước khi đánh giá là quy tắc nghiệp vụ cần được kiểm tra ở phía API. Nhóm cần thống nhất trước khi triển khai.

---

### 14.6. Bảng downloads_log – Lịch sử tải sản phẩm

**Mục đích:**

Ghi nhận lịch sử người dùng tải các sản phẩm mã nguồn đã mua trên website. Bảng này hỗ trợ quản lý lượt tải và kiểm tra lịch sử sử dụng sản phẩm.

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Mã lịch sử tải |
| user_id | INT | FK, NOT NULL | Mã người tải |
| product_id | INT | FK, NOT NULL | Mã sản phẩm được tải |
| order_item_id | INT | FK | Mã chi tiết đơn hàng liên quan |
| downloaded_at | TIMESTAMP | - | Thời gian tải sản phẩm |

**Khóa và quan hệ:**
- Khóa chính (PK): id.
- Khóa ngoại (FK): user_id tham chiếu đến users.id.
- Khóa ngoại (FK): product_id tham chiếu đến products.id.
- Khóa ngoại (FK): order_item_id tham chiếu đến order_items.id.
- Một người dùng có thể có nhiều lượt tải.
- Một sản phẩm có thể được tải nhiều lần bởi những người dùng khác nhau.
- Một chi tiết đơn hàng có thể liên quan đến nhiều lượt tải.

**Quy tắc nghiệp vụ:**
- Người tải phải là người dùng hợp lệ.
- Sản phẩm được tải phải tồn tại trong hệ thống.
- Chỉ cho phép tải khi người dùng đáp ứng điều kiện thanh toán theo quy định của website.
- Mỗi lượt tải cần ghi nhận thời gian tải cụ thể.
- order_item_id được sử dụng để liên kết lượt tải với sản phẩm trong đơn hàng tương ứng.

**Lưu ý về bảo mật:**
- Không lưu đường dẫn tải công khai nếu file mã nguồn cần được bảo vệ.
- API tải file cần kiểm tra quyền sở hữu đơn hàng và trạng thái thanh toán trước khi cấp quyền tải.
- Đường dẫn file thực tế được quản lý thông qua file_path trong bảng products.
- Việc giới hạn số lượt tải hoặc thời hạn tải cần được nhóm thống nhất.

---

## 15. Tổng kết thiết kế cơ sở dữ liệu

Cơ sở dữ liệu đề xuất hiện tại gồm 6 bảng chính:

| STT | Tên bảng | Chức năng |
|---|---|---|
| 1 | users | Quản lý người dùng |
| 2 | products | Quản lý sản phẩm mã nguồn |
| 3 | orders | Quản lý đơn hàng |
| 4 | order_items | Quản lý chi tiết sản phẩm trong đơn hàng |
| 5 | reviews | Quản lý đánh giá sản phẩm |
| 6 | downloads_log | Quản lý lịch sử tải sản phẩm |

**Các quan hệ chính:**
- users – products: Một người bán có thể đăng nhiều sản phẩm.
- users – orders: Một người mua có thể tạo nhiều đơn hàng.
- orders – order_items: Một đơn hàng có thể chứa nhiều sản phẩm.
- products – order_items: Một sản phẩm có thể xuất hiện trong nhiều đơn hàng.
- users – reviews: Một người dùng có thể tạo nhiều đánh giá.
- products – reviews: Một sản phẩm có thể có nhiều đánh giá.
- users – downloads_log: Một người dùng có thể có nhiều lượt tải.
- products – downloads_log: Một sản phẩm có thể có nhiều lượt tải.
- order_items – downloads_log: Một chi tiết đơn hàng có thể liên quan đến nhiều lượt tải.

## 16. Những nội dung cần thống nhất với nhóm

Các nội dung dưới đây là đề xuất thiết kế ban đầu, chưa phải quyết định triển khai cuối cùng:

1. Một tài khoản có được phép vừa mua vừa bán sản phẩm hay không?
2. Người bán có cần được quản trị viên phê duyệt trước khi đăng sản phẩm không?
3. Người mua có bắt buộc thanh toán thành công mới được tải mã nguồn không?
4. Người mua có được đánh giá sản phẩm sau khi mua hay không?
5. Một sản phẩm có được tải nhiều lần sau khi mua không?
6. Có cần giới hạn số lượt tải hoặc thời hạn tải sản phẩm không?
7. Hệ thống thanh toán có cần xây dựng bảng payments riêng hay sử dụng API thanh toán do nhóm cung cấp?
8. Nhóm sẽ sử dụng hệ quản trị cơ sở dữ liệu nào?
9. API và cấu trúc dữ liệu có được cung cấp bởi giảng viên hay nhóm tự thiết kế?

**Kết luận:**

Thiết kế cơ sở dữ liệu trên là phương án đề xuất ban đầu nhằm mô tả cấu trúc dữ liệu, khóa chính, khóa ngoại và các quy tắc nghiệp vụ cơ bản cho website kinh doanh mã nguồn. Cấu trúc cuối cùng cần được các thành viên trong nhóm thống nhất trước khi triển khai lập trình và tích hợp API.
