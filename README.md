🔐 Login / Signup Form with JWT Authentication & MongoDB

A full-stack authentication system with JWT authorization, MongoDB database, and role-based access control (user/admin), built using React, Express, MongoDB, and Joi validation.

🚀 Features

✅ User registration (Signup) with validation

✅ User login with JWT token generation

✅ JWT-based authentication & authorization

✅ Role-based access control (User / Admin)

✅ Protected routes & API endpoints

✅ MongoDB database integration (persistent storage)

✅ Password hashing with bcrypt

✅ Client-side & server-side validation using Joi

✅ Clean, professional, responsive UI

🛠 Tech Stack
Frontend

React 19

Vite

Context API (Authentication state)

Fetch API

Backend

Node.js

Express.js

MongoDB + Mongoose

JSON Web Tokens (JWT)

bcryptjs (password hashing)

Joi (request validation)

CORS

📦 Setup Instructions
1️⃣ Install Dependencies
npm install

2️⃣ Environment Variables

Create a .env file in the root directory:

PORT=3001
JWT_SECRET=your-super-secret-jwt-key
MONGODB_URI=mongodb://127.0.0.1:27017/jwt_auth_db


⚠️ Important:

Use a strong JWT_SECRET in production

Replace MongoDB URI when deploying (MongoDB Atlas recommended)

3️⃣ Run the Application

You must run both frontend and backend:

🖥 Terminal 1 — Backend Server
npm run server

🌐 Terminal 2 — Frontend (Vite)
npm run dev


📍 Frontend: http://localhost:5173
📍 Backend API: http://localhost:3001

🔗 API Endpoints
🔑 Authentication
POST /api/auth/signup

Register a new user

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "role": "user"
}


Role is optional (defaults to user)

POST /api/auth/login

Login user & receive JWT

{
  "email": "john@example.com",
  "password": "123456"
}

🔒 Protected Routes (JWT Required)
Method	Endpoint	Access
GET	/api/protected/profile	User & Admin
GET	/api/protected/dashboard	User & Admin
GET	/api/protected/admin	Admin only
🧠 Authentication Flow

User signs up → password is hashed & saved in MongoDB

User logs in → JWT token is generated

Token is stored on frontend (Context API)

Protected routes verify JWT via middleware

Role-based middleware restricts admin access

✅ Validation Rules (Joi)
Signup Validation

Name: Required, 2–50 characters

Email: Required, valid email

Password: Required, minimum 6 characters

Role: Optional (user or admin)

Login Validation

Email: Required, valid email

Password: Required

📁 Project Structure
├── server/
│   ├── index.js               # Express server entry
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   └── User.js            # Mongoose user schema
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   └── protected.js       # Protected routes
│   ├── middleware/
│   │   └── auth.js            # JWT & role middleware
│   ├── validators/
│   │   └── auth.js            # Joi schemas
│   └── controllers/
│       └── authController.js  # Auth logic
│
├── src/
│   ├── components/
│   │   ├── LoginForm.jsx
│   │   ├── SignupForm.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AuthForm.css
│   │   └── Dashboard.css
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── package.json
└── README.md

🔐 Security Notes

Passwords are hashed using bcryptjs

JWT tokens expire after 24 hours

MongoDB stores users securely using Mongoose schemas

Admin routes are protected via role middleware

CORS enabled for development

Environment variables used for secrets

🌍 Production Deployment Checklist

Before deploying:

✅ Use MongoDB Atlas

✅ Set a strong JWT_SECRET

✅ Enable HTTPS

✅ Configure CORS for your domain

✅ Add rate limiting

✅ Add logging & error handling

✅ Store JWT securely (HttpOnly cookies recommended)

📌 Future Improvements

Refresh tokens

Email verification

Password reset

OAuth (Google / GitHub)

Admin user management panel

🧑‍💻 Author

Uzair Ali
Frontend / MERN Stack Developer
