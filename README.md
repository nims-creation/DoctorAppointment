# 🩺 Prescripto — Doctor Appointment System

A **production-ready**, full-stack healthcare platform built with the **MERN stack** that enables patients to find doctors, book appointments, make payments, chat in real-time, and receive digital prescriptions — all from one place.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)

---

## 🌐 Live Demo

| App | URL |
|-----|-----|
| 🏠 **Patient Portal** | [doctorappointment-frontend-ten.vercel.app](https://doctorappointment-frontend-ten.vercel.app) |
| 🔧 **Admin Panel** | [doctorappointment-admin-sigma.vercel.app](https://doctorappointment-admin-sigma.vercel.app) |
| ⚙️ **Backend API** | [doctorappointment-backend-84ws.onrender.com](https://doctorappointment-backend-84ws.onrender.com) |

> **Note:** Backend is hosted on Render free tier — first request may take ~30 seconds due to cold start.

---

## ✨ Key Features

### 🔐 Role-Based Authentication (JWT)
| Role | Capabilities |
|---|---|
| **Patient** | Register, login, book appointments, pay online, chat with doctor, download prescriptions, rate & review doctors |
| **Doctor** | Login, manage appointments, write prescriptions, chat with patients, update profile & availability |
| **Admin** | Login, add/manage doctors, view all appointments, analytics dashboard |

### 💡 Production-Grade Features

| Feature | Technology | Description |
|---|---|---|
| 🏥 Appointment Booking | MongoDB + Express | Slot-based booking with conflict detection |
| 💳 Stripe Payments | Stripe | Secure online payments with checkout & verification |
| 💬 Real-Time Chat | Socket.io | Live doctor-patient messaging with persistent history |
| 📋 Digital Prescriptions | PDFKit | Doctors write Rx → Patients download as PDF |
| ⭐ Review & Rating | MongoDB + Zod | Validated reviews with average rating calculation |
| 📄 Server-Side Pagination | MongoDB Skip/Limit | Optimized data loading with speciality filtering |
| 🛡️ Security Hardening | Helmet + Rate Limit | XSS protection, CSRF, NoSQL injection prevention |
| 📧 Email Notifications | Nodemailer + Gmail SMTP | Transactional emails for bookings |
| ☁️ Image Uploads | Cloudinary + Multer | Profile pictures & doctor images |
| 📊 Analytics Dashboard | Aggregation | Earnings, patient count, appointment stats |

---

## 🏗️ Architecture

```
prescripto/
├── backend/                    # Node.js + Express API Server
│   ├── config/                 # MongoDB & Cloudinary configuration
│   ├── controllers/            # Business logic (user, doctor, admin)
│   ├── middleware/              # Auth guards, validation, error handling
│   │   ├── authUser.js         # JWT auth for patients
│   │   ├── authDoctor.js       # JWT auth for doctors
│   │   ├── authAdmin.js        # JWT auth for admins
│   │   ├── errorHandler.js     # Global error handler
│   │   └── validateRequest.js  # Zod validation middleware
│   ├── models/                 # Mongoose schemas
│   │   ├── userModel.js        # Patient schema
│   │   ├── doctorModel.js      # Doctor schema (with reviews[])
│   │   ├── appointmentModel.js # Appointment schema (with prescription)
│   │   └── messageModel.js     # Chat message schema
│   ├── routes/                 # API route definitions
│   ├── utils/                  # Helpers (sendEmail)
│   ├── validations/            # Zod schemas
│   └── server.js               # Entry point (Express + Socket.io)
│
├── frontend/                   # React.js Patient Portal
│   └── src/
│       ├── pages/              # Home, Doctors, MyAppointments, etc.
│       ├── components/         # Navbar, Footer, TopDoctors, etc.
│       └── context/            # AppContext (global state)
│
├── admin/                      # React.js Admin + Doctor Panel
│   └── src/
│       ├── pages/              # Dashboard, DoctorAppointments, etc.
│       └── context/            # AdminContext, DoctorContext
│
├── API_DOCUMENTATION.md        # Complete API reference (32 endpoints)
└── README.md                   # This file
```

---

## 🚀 Deployment

The project is deployed across three services:

```
┌─────────────────────────────────────────────────────────┐
│                      ARCHITECTURE                        │
│                                                          │
│   Vercel                         Render.com              │
│  ┌──────────────┐              ┌──────────────────┐     │
│  │   Frontend    │──── API ───▶│   Backend API     │     │
│  │  (React/Vite) │             │  (Node + Express  │     │
│  └──────────────┘              │   + Socket.io)    │     │
│  ┌──────────────┐              └────────┬─────────┘     │
│  │  Admin Panel  │──── API ───▶         │               │
│  │  (React/Vite) │                      │               │
│  └──────────────┘              ┌────────▼─────────┐     │
│                                │  MongoDB Atlas    │     │
│                                │  Cloudinary       │     │
│                                │  Stripe           │     │
│                                │  Gmail SMTP       │     │
│                                └──────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

---

## 💻 Local Development

### Prerequisites

- **Node.js** v18+ 
- **MongoDB Atlas** account (or local MongoDB)
- **Cloudinary** account (for image uploads)
- **Stripe** account (for payments)

### 1. Clone the Repository

```bash
git clone https://github.com/nims-creation/DoctorAppointment.git
cd DoctorAppointment
```

### 2. Setup Environment Variables

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and fill in your credentials. See [`.env.example`](backend/.env.example) for all required variables.

Required variables:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT token signing |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |
| `CLOUDINARY_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_SECRET_KEY` | Cloudinary API secret |
| `STRIPE_SECRET_KEY` | Stripe secret key (test or live) |
| `CURRENCY` | Payment currency (e.g., `INR`) |
| `EMAIL_HOST` | SMTP host (e.g., `smtp.gmail.com`) |
| `EMAIL_PORT` | SMTP port (e.g., `587`) |
| `EMAIL_USER` | SMTP email address |
| `EMAIL_PASS` | SMTP app password |

For the frontend and admin panels, create `.env` files with:

```bash
# frontend/.env
VITE_BACKEND_URL=http://localhost:4000

# admin/.env
VITE_BACKEND_URL=http://localhost:4000
```

### 3. Install Dependencies

```bash
# Backend
cd backend && npm install

# Frontend (Patient Portal)
cd ../frontend && npm install

# Admin Panel (Doctor + Admin)
cd ../admin && npm install
```

### 4. Run the Application

Open **3 terminals** and run:

```bash
# Terminal 1 — Backend (Port 4000)
cd backend && npm start

# Terminal 2 — Frontend (Port 5173)
cd frontend && npm run dev

# Terminal 3 — Admin Panel (Port 5174)
cd admin && npm run dev
```

---

## 📋 API Documentation

Full API documentation with **32 endpoints**, WebSocket events, data models, and security details is available in:

👉 [**API_DOCUMENTATION.md**](API_DOCUMENTATION.md)

### Quick Overview

| Module | Endpoints | Auth |
|---|---|---|
| **User** | 12 endpoints | JWT (token) |
| **Doctor** | 11 endpoints | JWT (dtoken) |
| **Admin** | 7 endpoints | JWT (atoken) |
| **WebSocket** | 3 events | Room-based |

---

## 🛡️ Security

| Measure | Implementation |
|---|---|
| **Helmet.js** | Sets secure HTTP headers (XSS, CSP, HSTS) |
| **Rate Limiting** | 100 requests per 15 minutes per IP |
| **Mongo Sanitize** | Prevents NoSQL injection attacks |
| **Zod Validation** | Input validation on registration, login, reviews, profile updates |
| **JWT Auth** | Stateless authentication with role-based middleware |
| **Bcrypt** | Password hashing with salt rounds |
| **CORS** | Restricted to production frontend & admin domains |
| **Morgan** | HTTP request logging for monitoring |

---

## 🧰 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js, React Router, Axios, Socket.io-client, Tailwind CSS |
| **Backend** | Node.js, Express.js, Socket.io, PDFKit |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Auth** | JWT, Bcrypt |
| **Payments** | Stripe SDK |
| **Validation** | Zod |
| **Security** | Helmet, express-rate-limit, express-mongo-sanitize |
| **File Storage** | Cloudinary, Multer |
| **Email** | Nodemailer, Gmail SMTP |
| **Hosting** | Vercel (Frontend/Admin), Render.com (Backend) |
| **Dev Tools** | Morgan, dotenv, nodemon |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Nims Creation**  
GitHub: [@nims-creation](https://github.com/nims-creation)

---

<p align="center">
  Made with ❤️ using the MERN Stack
</p>
