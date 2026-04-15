# User Management System (UMS)

A full-stack MERN web application for managing user accounts with role-based access control (RBAC).

---

## Live Demo

| | URL |
|---|---|
| **Frontend** | `https://user-management-system-alpha-two.vercel.app/login` |
| **Backend API** | `https://user-management-system-alpha-two.vercel.app/` |

> **Demo credentials** (after seeding):
> | Role | Email | Password |
> |---|---|---|
> | Admin | admin@ums.com | Admin@123 |
> | Manager | manager@ums.com | Manager@123 |
> | User | user@ums.com | User@1234 |

---

## Features

- **JWT authentication** with access + refresh token rotation
- **Role-based access control** — Admin, Manager, User
- **User lifecycle management** — create, view, update, deactivate, delete
- **Paginated & searchable user list** with role/status filters
- **Audit trail** — `createdAt`, `updatedAt`, `createdBy`, `updatedBy` on every record
- **Soft delete** — deactivate users without destroying records
- **Auto-generated passwords** — admin can create users without manually setting a password
- **Role-based UI** — nav items and actions conditionally shown by role

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios, React Hot Toast |
| Backend | Node.js, Express 4 |
| Database | MongoDB (Mongoose 8) |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Deployment | Render (backend) + Vercel (frontend) |

---

## Project Structure

```
user-management-system/
├── backend/
│   ├── config/         # DB connection, constants, seed script
│   ├── controllers/    # HTTP handlers (thin layer)
│   ├── middleware/     # auth, RBAC, validation, error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   ├── services/       # Business logic
│   ├── utils/          # JWT helpers, response helpers, password utils
│   ├── validators/     # express-validator chains
│   └── server.js
└── frontend/
    └── src/
        ├── api/        # Axios instance + per-resource API functions
        ├── components/ # layout/, ui/, guards/
        ├── context/    # AuthContext
        ├── hooks/      # (extensible)
        ├── pages/      # One file per screen
        └── utils/      # Role helpers, formatters
```

---

## Local Setup

### Prerequisites

- Node.js >= 18
- A MongoDB URI (MongoDB Atlas free tier works)

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/user-management-system.git
cd user-management-system
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in MONGO_URI and JWT secrets in .env
npm run dev          # starts on http://localhost:5000
```

### 3. Seed the database

```bash
npm run seed
# Creates admin, manager, and user accounts
```

### 4. Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev          # starts on http://localhost:5173
```

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/ums
JWT_ACCESS_SECRET=your_access_secret_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## API Reference

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login, returns tokens |
| POST | `/api/auth/refresh` | Public | Refresh access token |
| POST | `/api/auth/logout` | Auth | Invalidate refresh token |
| GET | `/api/auth/me` | Auth | Get current user |

### Users

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/users` | Admin, Manager | List users (paginated, filterable) |
| POST | `/api/users` | Admin | Create a new user |
| GET | `/api/users/:id` | Admin, Manager, Owner | Get user by ID |
| PATCH | `/api/users/:id` | Admin, Manager | Update user |
| PATCH | `/api/users/me` | Any | Update own profile |
| PATCH | `/api/users/:id/deactivate` | Admin | Deactivate user |
| DELETE | `/api/users/:id` | Admin | Delete user permanently |

---

## Deployment

### Backend → Render

1. Push to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set root directory to `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables from `backend/.env`

### Frontend → Vercel

1. Create a new project on [vercel.com](https://vercel.com)
2. Set root directory to `frontend`
3. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`

---

## RBAC Summary

| Action | Admin | Manager | User |
|---|---|---|---|
| View all users | ✅ | ✅ | ✗ |
| View single user | ✅ | ✅ | Own only |
| Create user | ✅ | ✗ | ✗ |
| Update any user | ✅ | Non-admins only | ✗ |
| Update own profile | ✅ | ✅ | ✅ |
| Change role | ✅ | ✗ | ✗ |
| Deactivate user | ✅ | ✗ | ✗ |
| Delete user | ✅ | ✗ | ✗ |

---

## License

MIT
