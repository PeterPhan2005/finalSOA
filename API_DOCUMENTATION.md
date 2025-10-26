# API Documentation

## Access Documentation

### Swagger UI (Recommended)
🌐 **URL:** `http://localhost:8080/swagger-ui.html`

Interactive documentation where you can:
- Browse all endpoints
- Try API calls directly from browser
- View request/response examples
- Test with JWT authentication

### OpenAPI Specification

📄 **JSON:** `http://localhost:8080/api-docs`
📄 **YAML:** `http://localhost:8080/api-docs.yaml`

Download these files to:
- Import into Postman
- Generate client SDKs
- Use with other API tools

---

## Quick Start Guide

### 1. Start Backend
```bash
cd sb-ecom
mvn spring-boot:run
```

### 2. Open Swagger UI
Navigate to: `http://localhost:8080/swagger-ui.html`

### 3. Test Public Endpoints (No Auth Required)
- `GET /api/info` - API information
- `GET /api/health` - Health check
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login

### 4. Test Protected Endpoints (Auth Required)

#### Step 1: Login
1. Expand `POST /api/auth/signin`
2. Click "Try it out"
3. Enter credentials:
```json
{
  "username": "your-email@example.com",
  "password": "your-password"
}
```
4. Click "Execute"
5. Copy the JWT token from response

#### Step 2: Authorize
1. Click **"Authorize"** button (🔒 icon, top right)
2. Enter: `Bearer <paste-your-token-here>`
3. Click "Authorize"
4. Click "Close"

#### Step 3: Test Protected Endpoints
Now you can test any protected endpoint!

---

## API Overview

### 🔐 Authentication (`/api/auth`)
- `POST /signup` - Register new user
- `POST /signin` - Login and get JWT token

### 👤 User Management (`/api/user`)
- Get user profile
- Update user info
- Manage addresses

### 📦 Products (`/api/public/products`, `/api/admin/products`)
- Browse products (public)
- Search & filter
- CRUD operations (admin/seller)
- Image upload

### 🏷️ Categories (`/api/public/categories`, `/api/admin/categories`)
- List all categories
- Manage categories (admin)

### 🛒 Cart (`/api/cart`)
- Add to cart
- Update quantities
- Remove items
- View cart

### 📋 Orders (`/api/order`, `/api/admin/orders`)
- Place order
- View order history
- Track order status
- Manage orders (admin/seller)

### 💳 Payment (`/api/payment`)
- VNPay integration
- Payment callback handling

---

## Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Authentication Flow

```
1. Register → POST /api/auth/signup
   ↓
2. Login → POST /api/auth/signin
   ↓
3. Receive JWT token
   ↓
4. Add token to requests:
   Header: Authorization: Bearer <token>
   ↓
5. Access protected endpoints
```

---

## Example Requests

### Register User
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "USER"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john@example.com",
    "password": "password123"
  }'
```

### Get Products (with JWT)
```bash
curl -X GET http://localhost:8080/api/public/products \
  -H "Authorization: Bearer <your-jwt-token>"
```

---

## Tips

💡 **Tip 1:** Use the "Authorize" button in Swagger UI once, then all subsequent requests will include your token automatically

💡 **Tip 2:** Export the OpenAPI spec (`/api-docs`) to import into Postman for testing

💡 **Tip 3:** JWT tokens expire after a configured time. Re-login to get a fresh token

💡 **Tip 4:** Check `/api/info` endpoint for quick API details

---

## Troubleshooting

❌ **401 Unauthorized**
- Check if token is valid
- Ensure token starts with "Bearer "
- Token may have expired - login again

❌ **403 Forbidden**
- Your role doesn't have permission
- USER vs SELLER vs ADMIN roles

❌ **CORS Error**
- Backend must be running on port 8080
- Frontend must be running on configured URL
