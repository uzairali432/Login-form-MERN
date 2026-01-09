# Login/Signup Form with JWT Authentication

A full-stack authentication system with JWT authorization and role-based access control (user/admin), built with React, Express, and Joi validation.

## Features

- ✅ User registration (signup) with validation
- ✅ User login with JWT token generation
- ✅ JWT-based authentication
- ✅ Role-based access control (user/admin)
- ✅ Protected routes and API endpoints
- ✅ Client-side and server-side validation using Joi
- ✅ Modern, responsive UI

## Tech Stack

### Frontend
- React 19
- Vite
- Context API for state management

### Backend
- Node.js
- Express.js
- JSON Web Tokens (JWT)
- bcryptjs for password hashing
- Joi for validation
- CORS enabled

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory (optional, defaults are provided):

```env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 3. Run the Application

You need to run both the frontend and backend servers:

**Terminal 1 - Backend Server:**
```bash
npm run server
```

**Terminal 2 - Frontend Development Server:**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the port Vite assigns)
The backend API will be available at `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
  - Body: `{ name, email, password, role? }`
  - Role is optional (defaults to 'user')

- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`

### Protected Routes (Require JWT Token)
- `GET /api/protected/profile` - Get user profile (all authenticated users)
- `GET /api/protected/dashboard` - Access dashboard (user/admin)
- `GET /api/protected/admin` - Admin-only endpoint

## Usage

1. **Sign Up**: Create a new account by providing:
   - Name (2-50 characters)
   - Email (valid email format)
   - Password (minimum 6 characters)
   - Role (user or admin)

2. **Login**: Use your credentials to log in and receive a JWT token

3. **Dashboard**: After login, you'll see:
   - Profile information
   - Dashboard data (accessible to all authenticated users)
   - Admin panel (only visible to admin users)

## Validation Rules

### Signup Validation (Joi)
- Name: Required, 2-50 characters
- Email: Required, valid email format
- Password: Required, minimum 6 characters
- Role: Optional, must be 'user' or 'admin'

### Login Validation (Joi)
- Email: Required, valid email format
- Password: Required

## Project Structure

```
├── server/
│   ├── index.js              # Express server setup
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   └── protected.js      # Protected routes
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── validators/
│   │   └── auth.js           # Joi validation schemas
│   └── data/
│       └── users.js          # User storage (in-memory)
├── src/
│   ├── components/
│   │   ├── LoginForm.jsx     # Login form component
│   │   ├── SignupForm.jsx    # Signup form component
│   │   ├── Dashboard.jsx     # Protected dashboard
│   │   ├── AuthForm.css      # Form styles
│   │   └── Dashboard.css     # Dashboard styles
│   ├── context/
│   │   └── AuthContext.jsx   # Authentication context
│   ├── services/
│   │   └── api.js            # API service functions
│   ├── App.jsx               # Main app component
│   └── main.jsx              # React entry point
└── package.json
```

## Security Notes

- Passwords are hashed using bcryptjs before storage
- JWT tokens expire after 24 hours
- Admin routes are protected with role-based middleware
- CORS is enabled for development (configure for production)
- Change the JWT_SECRET in production

## Development

The frontend uses Vite's proxy configuration to forward `/api` requests to the backend server during development.

## Production Deployment

For production:
1. Set a strong `JWT_SECRET` in environment variables
2. Replace in-memory user storage with a database
3. Configure CORS properly for your domain
4. Use HTTPS
5. Add rate limiting
6. Implement proper error handling and logging
