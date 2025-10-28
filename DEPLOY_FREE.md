# 🚀 Deploy Miễn Phí Lên Internet

## Giải pháp: Backend + Frontend riêng biệt

### ✅ Backend (Spring Boot) → Railway
- ✅ **MIỄN PHÍ** $5 credit/tháng
- ✅ **DOMAIN CỐ ĐỊNH**: `your-app.up.railway.app`
- ✅ Hỗ trợ Docker, PostgreSQL
- ✅ Auto deploy từ GitHub

### ✅ Frontend (React) → Vercel
- ✅ **MIỄN PHÍ** 100%
- ✅ **DOMAIN CỐ ĐỊNH**: `your-app.vercel.app`
- ✅ Auto deploy từ GitHub
- ✅ HTTPS tự động

---

## 📦 BƯỚC 1: Deploy Backend lên Railway

### 1.1. Tạo tài khoản
- Vào: https://railway.app
- Đăng nhập bằng GitHub

### 1.2. Tạo Dockerfile cho Backend

**File: `sb-ecom/Dockerfile`** (tạo file mới)

```dockerfile
# Build stage
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Create images directory
RUN mkdir -p /app/images

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 1.3. Deploy trên Railway

1. **New Project** → **Deploy from GitHub repo**
2. Chọn repository `finalSOA`
3. Chọn folder `sb-ecom`
4. Railway sẽ tự detect Dockerfile

### 1.4. Add PostgreSQL Database

1. Trong project → **New** → **Database** → **PostgreSQL**
2. Railway tự động tạo database
3. Lấy connection string từ Variables tab

### 1.5. Configure Environment Variables

Vào **Variables** tab, thêm:

```env
DB_URL=${{PGHOST}}:${{PGPORT}}/${{PGDATABASE}}
DB_USERNAME=${{PGUSER}}
DB_PASSWORD=${{PGPASSWORD}}
JWT_SECRET=your_secret_key_here
JWT_EXPIRATION=300000000
JWT_COOKIE_NAME=springBootEcom
VNPAY_TMN_CODE=TSPYPMGW
VNPAY_HASH_SECRET=9RNCXLEJ6D5GQFPY7AAPXNDBY8RHPL4U
VNPAY_RETURN_URL=https://your-backend.up.railway.app/api/payment/vnpay/callback
FRONTEND_URL=https://your-frontend.vercel.app
IMAGE_BASE_URL=https://your-backend.up.railway.app/images
```

### 1.6. Get Backend URL

Sau khi deploy xong:
- Vào **Settings** → **Networking** → **Public Networking**
- Copy domain: `https://your-app-abc123.up.railway.app`

---

## 🎨 BƯỚC 2: Deploy Frontend lên Vercel

### 2.1. Tạo tài khoản
- Vào: https://vercel.com
- Đăng nhập bằng GitHub

### 2.2. Update Backend URL

**File: `ecom-frontend/.env`**

```env
VITE_BACK_END_URL=https://your-backend.up.railway.app
```

**Commit changes:**
```bash
git add ecom-frontend/.env
git commit -m "Update backend URL for production"
git push
```

### 2.3. Deploy trên Vercel

1. **Add New Project**
2. Import `finalSOA` repository
3. **Root Directory**: chọn `ecom-frontend`
4. **Framework Preset**: Vite
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`
7. Click **Deploy**

### 2.4. Configure Environment Variables

Trong Vercel project settings:
- Vào **Settings** → **Environment Variables**
- Add:
  ```
  VITE_BACK_END_URL = https://your-backend.up.railway.app
  ```

### 2.5. Get Frontend URL

Sau khi deploy xong:
- Copy domain: `https://your-app.vercel.app`
- Hoặc config custom domain (miễn phí)

---

## 🔄 BƯỚC 3: Update Backend CORS

Về máy local, update CORS để backend accept requests từ Vercel:

**File: `sb-ecom/src/main/java/com/ecommerce/project/config/CorsConfig.java`**

```java
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:5173",
    "https://your-app.vercel.app"  // Thêm domain Vercel
));
```

**Commit và push:**
```bash
git add .
git commit -m "Update CORS for production domain"
git push
```

Railway sẽ tự động deploy lại!

---

## 🎉 KẾT QUẢ

### URLs của bạn:
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-app.up.railway.app`
- **Swagger**: `https://your-app.up.railway.app/swagger-ui.html`

### ✅ Hoàn toàn miễn phí
### ✅ Domain cố định
### ✅ HTTPS tự động
### ✅ Auto deploy từ GitHub

---

## 📱 Truy cập từ mọi nơi

- **Điện thoại** (4G/5G/WiFi): ✅
- **Máy tính bất kỳ**: ✅
- **Chia sẻ cho bạn bè**: ✅
- **Demo cho khách hàng**: ✅

Chỉ cần mở: `https://your-app.vercel.app`

---

## 🔧 Alternative: Render.com (Nếu không muốn dùng Railway)

### Backend → Render
- Free tier: 750 hours/month
- Domain: `your-app.onrender.com`
- PostgreSQL free (90 days)

### Hướng dẫn: https://render.com/docs

---

## 💰 Chi phí

| Service | Backend | Frontend | Database | Tổng |
|---------|---------|----------|----------|------|
| Railway + Vercel | $5 credit (free) | $0 | Included | **$0/tháng** |
| Render + Vercel | $0 (750h) | $0 | $0 (90 days) | **$0/tháng** |

**Lưu ý:** Railway $5 credit đủ cho 1 app nhỏ chạy cả tháng.

---

## 🚀 Quick Commands

```bash
# 1. Clone & setup
git clone https://github.com/PeterPhan2005/finalSOA.git
cd finalSOA

# 2. Deploy backend
# → Vào Railway dashboard → New Project → Deploy from GitHub

# 3. Deploy frontend
# → Vào Vercel dashboard → Add New → Import from GitHub

# 4. Done! Access your app:
# https://your-app.vercel.app
```

---

## ❓ FAQ

**Q: Có giới hạn gì không?**
- Railway: $5 credit/tháng (đủ cho app vừa)
- Vercel: Unlimited requests cho hobby plan

**Q: Database có mất không?**
- Railway: Persistent, không mất
- Data được lưu trữ trên cloud

**Q: Có thể custom domain không?**
- ✅ Có! Cả Railway và Vercel đều support
- Cần mua domain (~$10/năm từ Namecheap)

**Q: Auto deploy khi push code?**
- ✅ Có! Cả 2 platform đều auto deploy từ GitHub

**Q: HTTPS có sẵn không?**
- ✅ Có! Tự động config SSL certificate

---

## 📝 Checklist Deploy

- [ ] Tạo tài khoản Railway
- [ ] Tạo tài khoản Vercel  
- [ ] Tạo Dockerfile cho backend
- [ ] Push code lên GitHub
- [ ] Deploy backend trên Railway
- [ ] Add PostgreSQL database
- [ ] Configure environment variables
- [ ] Deploy frontend trên Vercel
- [ ] Update CORS config
- [ ] Test app trên production URL
- [ ] Share link với bạn bè! 🎉

---

## 🆘 Support

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- GitHub Issues: https://github.com/PeterPhan2005/finalSOA/issues
