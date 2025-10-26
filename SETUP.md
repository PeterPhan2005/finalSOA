# E-Commerce Application

## Setup Instructions

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd sb-ecom
   ```

2. **Create `.env` file** (copy from `.env.example`)
   ```bash
   cp .env.example .env
   ```

3. **Configure your `.env` file**
   - Update database credentials
   - Add your VNPay credentials (TMN Code and Hash Secret)
   - Set your JWT secret key

4. **Install dependencies and run**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

5. **Access API Documentation**
   - Swagger UI: `http://localhost:8080/swagger-ui.html`
   - OpenAPI JSON: `http://localhost:8080/api-docs`
   - OpenAPI YAML: `http://localhost:8080/api-docs.yaml`

### Frontend Setup

1. **Navigate to frontend folder**
   ```bash
   cd ecom-frontend
   ```

2. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

3. **Configure your `.env` file**
   - Set `VITE_BACK_END_URL` to your backend URL

4. **Install dependencies and run**
   ```bash
   npm install
   npm run dev
   ```

## Environment Variables

### Backend (.env)
- `DB_URL`: PostgreSQL database URL
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: Secret key for JWT token generation
- `VNPAY_TMN_CODE`: VNPay terminal code
- `VNPAY_HASH_SECRET`: VNPay hash secret key
- `FRONTEND_URL`: Frontend application URL

### Frontend (.env)
- `VITE_BACK_END_URL`: Backend API URL

## Important Notes

⚠️ **NEVER commit `.env` files to GitHub!**

✅ **Always use `.env.example` as a template for others**

## API Documentation

### Swagger UI (Interactive)
Access at: `http://localhost:8080/swagger-ui.html`

Features:
- Interactive API testing
- Try out endpoints directly from browser
- View request/response schemas
- JWT authentication support (click "Authorize" button)

### OpenAPI Specification
- JSON format: `http://localhost:8080/api-docs`
- YAML format: `http://localhost:8080/api-docs.yaml`

### How to use Swagger UI:
1. Start the backend server
2. Navigate to `http://localhost:8080/swagger-ui.html`
3. To test protected endpoints:
   - First login via POST `/api/auth/signin`
   - Copy the JWT token from response
   - Click "Authorize" button (top right)
   - Enter: `Bearer <your-token>`
   - Click "Authorize" then "Close"
   - Now you can test protected endpoints
