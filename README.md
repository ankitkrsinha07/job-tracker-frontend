# 💼 Job Application Tracker

A full-stack job application tracking system built with React, TypeScript, Node.js, PostgreSQL, and Prisma. Track every job application from initial apply to final offer.

## 🔗 Live Demo

**Frontend:** https://job-tracker-frontend-rose-seven.vercel.app

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL (hosted on Supabase)
- Prisma 7 ORM
- JWT Authentication
- bcryptjs (password hashing)
- express-validator (input validation)
- CORS

### Frontend
- React 18 + TypeScript
- Vite
- React Router v6
- React Query v5 (TanStack Query)
- React Hook Form
- Axios with interceptors
- Tailwind CSS
- Context API

## ✨ Features

- User registration and login with JWT authentication
- Password hashing with bcrypt (10 salt rounds)
- Protected routes on both frontend and backend
- Add job applications with:
  - Company name and role
  - Status tracking (Applied, Interview, Rejected, Offer)
  - Date applied
  - Expected salary
  - Job posting URL
  - Notes
- Dashboard with clickable stats cards per status
- Search applications by company or role
- Filter applications by status
- Edit existing applications with pre-filled form
- Delete applications with confirmation
- Profile page with application statistics
- Auto UI updates with React Query cache invalidation
- Persistent login with localStorage
- Global 401 handling via Axios interceptor

## 📁 Project Structure

```
job-tracker/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── middleware/
│   │   │   ├── protect.ts
│   │   │   └── validate.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   └── applicationRoutes.ts
│   │   ├── validators/
│   │   │   ├── authValidator.ts
│   │   │   └── applicationValidator.ts
│   │   ├── db.ts
│   │   └── server.ts
│   ├── tsconfig.json
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── hooks/
    │   └── pages/
    └── package.json
```

## 🚀 How to Run Locally

### Prerequisites
- Node.js v18+
- PostgreSQL installed and running

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` in backend folder:

```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/job_tracker
JWT_SECRET=yourjwtsecretkey
PORT=3001
```

Run database migration:

```bash
npx prisma migrate dev --name init
```

Start backend:

```bash
npm run dev
```

Backend runs on: `http://localhost:3001`

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` in frontend folder:

```
VITE_API_URL=http://localhost:3001
```

Start frontend:

```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /auth/register | Register new user | No |
| POST | /auth/login | Login and get token | No |
| GET | /auth/profile | Get logged in user | Yes |

### Applications
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /applications | Get all user applications | Yes |
| POST | /applications | Add new application | Yes |
| PUT | /applications/:id | Update application | Yes |
| DELETE | /applications/:id | Delete application | Yes |
| GET | /applications/stats | Get stats by status | Yes |
| GET | /applications/:id | Get single application | Yes |

## 🗄️ Database Schema

```prisma
model User {
  id           Int              @id @default(autoincrement())
  name         String
  email        String           @unique
  password     String
  createdAt    DateTime         @default(now())
  applications JobApplication[]
}

model JobApplication {
  id          Int      @id @default(autoincrement())
  company     String
  role        String
  status      Status   @default(applied)
  appliedDate DateTime @default(now())
  notes       String?
  jobUrl      String?
  salary      String?
  userId      Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Status {
  applied
  interview
  rejected
  offer
}
```

## 📸 Screenshots

![Dashboard](image.png)

## 👤 Author

Ankit — Full Stack Developer
GitHub: https://github.com/ankitkrsinha07
Live Project: https://job-tracker-frontend-rose-seven.vercel.app
