# Full Stack Node.js Project

Dự án Full Stack bao gồm Express.js Backend và React.js Frontend.

## Cấu trúc dự án

```
├── ExpressJS01/          # Backend API Server
│   ├── src/
│   │   ├── controllers/  # Controllers xử lý request
│   │   ├── models/       # Database models
│   │   ├── services/     # Business logic
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Middleware functions
│   │   └── config/       # Cấu hình database, email
│   └── package.json
└── reactjs01/           # Frontend React App
    ├── src/
    │   ├── components/   # React components
    │   ├── pages/        # Page components
    │   ├── styles/       # CSS styles
    │   └── util/         # Utility functions
    └── package.json
```

## Tính năng

### Backend (Express.js)
- ✅ Đăng ký tài khoản
- ✅ Đăng nhập với JWT token
- ✅ Quên mật khẩu (gửi email)
- ✅ Authentication middleware
- ✅ MongoDB integration

### Frontend (React.js)  
- ✅ React Context cho Authentication
- ✅ Axios client cho API calls
- ✅ Responsive UI

## Cài đặt và chạy

### Backend
```bash
cd ExpressJS01
npm install
npm run dev
```

### Frontend
```bash
cd reactjs01
npm install
npm run dev
```

## Environment Variables

Tạo file `.env` trong thư mục `ExpressJS01/`:

```
DB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
PORT=3000
```

## API Endpoints

- `POST /api/register` - Đăng ký tài khoản
- `POST /api/login` - Đăng nhập
- `POST /api/forgot-password` - Quên mật khẩu
- `GET /api/home` - Route được bảo vệ (cần token)

## Công nghệ sử dụng

**Backend:**
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt (Hash password)
- Nodemailer (Send email)

**Frontend:**
- React.js
- Vite
- Axios
- Context API