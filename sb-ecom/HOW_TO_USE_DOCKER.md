# Hướng dẫn sử dụng Docker cho Ecommerce App

## 🚀 Lần đầu khởi động

```powershell
cd D:\final_soa\sb-ecom
docker-compose up -d
```

## 🔄 Khi tắt máy và bật lại

### Tùy chọn 1: Docker Desktop TỰ ĐỘNG khởi động lại (Khuyên dùng)

1. Mở **Docker Desktop**
2. Vào **Settings** → **General**
3. Bật ✅ **Start Docker Desktop when you log in**
4. Vào **Settings** → **Resources** → **Advanced**
5. Bật ✅ **Enable containers to start automatically**

→ **Containers sẽ TỰ ĐỘNG chạy lại khi bật máy**, không cần gõ lệnh!

### Tùy chọn 2: Khởi động thủ công

```powershell
# Bước 1: Mở Docker Desktop (bắt buộc)
# Đợi Docker Desktop khởi động xong (icon chuyển màu xanh)

# Bước 2: Khởi động containers
cd D:\final_soa\sb-ecom
docker-compose start
```

**KHÔNG CẦN** gõ lại `docker-compose up -d`!

## 📋 Các lệnh thường dùng

### Kiểm tra trạng thái
```powershell
docker-compose ps          # Xem containers đang chạy
docker ps                  # Xem tất cả containers
docker-compose logs app    # Xem logs của ứng dụng
docker-compose logs -f     # Xem logs real-time
```

### Quản lý containers
```powershell
# Khởi động (nếu đã tạo containers)
docker-compose start

# Dừng (giữ lại dữ liệu)
docker-compose stop

# Khởi động lại
docker-compose restart

# Xóa containers (GIỮ dữ liệu trong volume)
docker-compose down

# Xóa containers + XÓA dữ liệu
docker-compose down -v
```

### Xem dữ liệu
```powershell
# Kết nối vào PostgreSQL container
docker exec -it ecommerce-postgres psql -U postgres -d ecommerce

# Trong psql:
\dt                # Xem danh sách tables
\q                 # Thoát
```

## 🔧 Khi nào cần gõ lại `docker-compose up -d`?

Chỉ khi:
- ❌ Đã chạy `docker-compose down` (xóa containers)
- ❌ Thay đổi file `docker-compose.yml`
- ❌ Cần rebuild image mới

## 💾 Dữ liệu lưu ở đâu?

Dữ liệu PostgreSQL được lưu trong **Docker Volume**: `sb-ecom_postgres-data`

```powershell
# Xem volumes
docker volume ls

# Xem thông tin volume
docker volume inspect sb-ecom_postgres-data
```

→ Dữ liệu **KHÔNG MẤT** khi:
- Tắt máy
- Chạy `docker-compose stop`
- Chạy `docker-compose down`

→ Dữ liệu **CHỈ MẤT** khi:
- Chạy `docker-compose down -v` (xóa volume)
- Xóa volume thủ công: `docker volume rm sb-ecom_postgres-data`

## 🌐 Truy cập ứng dụng

- **API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs**: http://localhost:8080/api-docs
- **PostgreSQL**: localhost:5432 (username: postgres, password: sa123456)

## 🐛 Troubleshooting

### Lỗi: "Cannot connect to Docker daemon"
→ Mở Docker Desktop và đợi khởi động xong

### Lỗi: "port 8080 already in use"
```powershell
# Tìm process đang dùng port 8080
netstat -ano | findstr :8080

# Kill process (thay PID bằng số bạn tìm được)
taskkill /PID <PID> /F

# Hoặc dừng Docker containers
docker-compose down
```

### Lỗi: "Cannot start service postgres"
```powershell
# Xóa containers và volumes, tạo lại
docker-compose down -v
docker-compose up -d
```

## 📌 Lưu ý quan trọng

1. **Docker Desktop PHẢI CHẠY** trước khi dùng bất kỳ lệnh Docker nào
2. Containers có thể **tự động khởi động** nếu cấu hình trong Docker Desktop
3. Dữ liệu được **lưu vĩnh viễn** trong volumes
4. Không cần gõ lại `docker-compose up -d` mỗi lần bật máy
