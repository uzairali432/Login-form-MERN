# 🔐 Login / Signup Form with JWT Authentication & MongoDB

A full-stack authentication system with JWT authorization, MongoDB database, and role-based access control (user/admin), built using React, Express, MongoDB, and Joi validation.

---

## 🚀 Features

- User registration (Signup) with validation  
- User login with JWT token generation  
- JWT-based authentication & authorization  
- Role-based access control (User / Admin)  
- Protected routes & API endpoints  
- MongoDB database integration  
- Password hashing with bcrypt  
- Client-side & server-side validation using Joi  
- Clean and responsive UI  

---

## 🛠 Tech Stack

Frontend:
- React 19
- Vite
- Context API

Backend:
- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Joi
- CORS

---

## 📦 Setup Instructions

1) Install Dependencies  
Run the following command in the project root:

    npm install

2) Environment Variables  
Create a `.env` file in the root directory and add:

    PORT=3001
    JWT_SECRET=your-super-secret-jwt-key
    MONGODB_URI=mongodb://127.0.0.1:27017/jwt_auth_db

3) Run the Application  

Backend server:

    npm run server

Frontend server:

    npm run dev

Frontend URL: http://localhost:5173  
Backend API URL: http://localhost:3001  

---

## 🔗 API Endpoints

Authentication:

POST /api/auth/signup  
Request body example:
- name: John Doe
- email: john@example.com
- password: 123456
- role: user (optional, default is user)

POST /api/auth/login  
Request body example:
- email: john@example.com
- password: 123456

Protected Routes (JWT Required):

- GET /api/protected/profile → User & Admin
- GET /api/protected/dashboard → User & Admin
- GET /api/protected/admin → Admin only

---

## 🧠 Authentication Flow

1. User signs up and password is hashed before saving to MongoDB  
2. User logs in and receives a JWT token  
3. Token is stored on frontend using Context API  
4. Protected routes verify JWT using middleware  
5. Role-based middleware restricts admin-only routes  

---

## ✅ Validation Rules (Joi)

Signup:
- Name: Required, 2–50 characters  
- Email: Required, valid email  
- Password: Required, minimum 6 characters  
- Role: Optional (user or admin)

Login:
- Email: Required  
- Password: Required  

---

## 📁 Project Structure

server/
- index.js (Express server entry)
- config/db.js (MongoDB connection)
- models/User.js (User schema)
- routes/auth.js (Auth routes)
- routes/protected.js (Protected routes)
- middleware/auth.js (JWT & role middleware)
- validators/auth.js (Joi schemas)
- controllers/authController.js (Auth logic)

src/
- components/LoginForm.jsx
- components/SignupForm.jsx
- components/Dashboard.jsx
- components/AuthForm.css
- components/Dashboard.css
- context/AuthContext.jsx
- services/api.js
- App.jsx
- main.jsx

Other files:
- .env
- package.json
- README.md

---

## 🔐 Security Notes

- Passwords are hashed using bcryptjs  
- JWT tokens expire after 24 hours  
- MongoDB is used for persistent storage  
- Admin routes are protected via role-based authorization  
- CORS enabled for development  

---

## 🌍 Production Checklist

- Use MongoDB Atlas  
- Store secrets securely  
- Enable HTTPS  
- Configure CORS properly  
- Add rate limiting  
- Improve error handling and logging  

---

## 🧑‍💻 Author

Uzair Ali  
MERN Stack Developer
