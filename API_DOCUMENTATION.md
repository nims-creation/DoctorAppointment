# 📋 API Documentation — Doctor Appointment System

> **Base URL:** `http://localhost:4000`  
> **Version:** 1.0.0  
> **Authentication:** JWT Bearer Token (passed via custom headers)

---

## 📑 Table of Contents

- [Authentication](#authentication)
- [User APIs](#-user-apis-apiuser)
- [Doctor APIs](#-doctor-apis-apidoctor)
- [Admin APIs](#-admin-apis-apiadmin)
- [WebSocket Events](#-websocket-events-socketio)
- [Error Handling](#-error-handling)
- [Data Models](#-data-models)

---

## Authentication

The API uses **JWT (JSON Web Tokens)** for authentication. Tokens are returned upon successful login and must be sent with every protected request via custom headers.

| Role    | Header Key | How to Obtain          |
|---------|------------|------------------------|
| User    | `token`    | `POST /api/user/login` |
| Doctor  | `dtoken`   | `POST /api/doctor/login` |
| Admin   | `atoken`   | `POST /api/admin/login` |

**Example Header:**
```
token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 👤 User APIs (`/api/user`)

### 1. Register User
| | |
|---|---|
| **Endpoint** | `POST /api/user/register` |
| **Auth Required** | ❌ No |
| **Validation** | Zod Schema |

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePass123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGci..."
}
```

**Validation Rules:**
- `name` — Required, string, min 2 chars
- `email` — Required, valid email format
- `password` — Required, min 8 chars

---

### 2. Login User
| | |
|---|---|
| **Endpoint** | `POST /api/user/login` |
| **Auth Required** | ❌ No |
| **Validation** | Zod Schema |

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePass123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGci..."
}
```

---

### 3. Get User Profile
| | |
|---|---|
| **Endpoint** | `GET /api/user/get-profile` |
| **Auth Required** | ✅ User Token |

**Success Response (200):**
```json
{
  "success": true,
  "userData": {
    "name": "John Doe",
    "email": "john@example.com",
    "image": "...",
    "phone": "9876543210",
    "address": { "line1": "123 Main St", "line2": "Apt 4" },
    "gender": "Male",
    "dob": "1995-06-15"
  }
}
```

---

### 4. Update User Profile
| | |
|---|---|
| **Endpoint** | `POST /api/user/update-profile` |
| **Auth Required** | ✅ User Token |
| **Content-Type** | `multipart/form-data` |

**Request Body (form-data):**
| Field | Type | Required |
|---|---|---|
| `name` | string | ✅ |
| `phone` | string | ✅ |
| `address` | JSON string | ✅ |
| `gender` | string | ✅ |
| `dob` | string | ✅ |
| `image` | file | ❌ |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile Updated"
}
```

---

### 5. Book Appointment
| | |
|---|---|
| **Endpoint** | `POST /api/user/book-appointment` |
| **Auth Required** | ✅ User Token |

**Request Body:**
```json
{
  "docId": "6650abc...",
  "slotDate": "15_7_2026",
  "slotTime": "10:00 am"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Appointment Booked"
}
```

---

### 6. List User Appointments
| | |
|---|---|
| **Endpoint** | `GET /api/user/appointments` |
| **Auth Required** | ✅ User Token |

**Success Response (200):**
```json
{
  "success": true,
  "appointments": [
    {
      "_id": "...",
      "docId": "...",
      "slotDate": "15_7_2026",
      "slotTime": "10:00 am",
      "docData": { "name": "Dr. Smith", "speciality": "Dermatologist", "..." },
      "amount": 500,
      "cancelled": false,
      "payment": false,
      "isCompleted": false,
      "prescription": ""
    }
  ]
}
```

---

### 7. Cancel Appointment
| | |
|---|---|
| **Endpoint** | `POST /api/user/cancel-appointment` |
| **Auth Required** | ✅ User Token |

**Request Body:**
```json
{
  "appointmentId": "6650def..."
}
```

---

### 8. Payment — Razorpay
| | |
|---|---|
| **Endpoint** | `POST /api/user/payment-razorpay` |
| **Auth Required** | ✅ User Token |

**Request Body:**
```json
{
  "appointmentId": "6650def..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "order": { "id": "order_xxx", "amount": 50000, "currency": "INR" }
}
```

---

### 9. Verify Razorpay Payment
| | |
|---|---|
| **Endpoint** | `POST /api/user/verifyRazorpay` |
| **Auth Required** | ✅ User Token |

**Request Body:**
```json
{
  "razorpay_order_id": "order_xxx"
}
```

---

### 10. Payment — Stripe
| | |
|---|---|
| **Endpoint** | `POST /api/user/payment-stripe` |
| **Auth Required** | ✅ User Token |

**Request Body:**
```json
{
  "appointmentId": "6650def..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "session": { "url": "https://checkout.stripe.com/..." }
}
```

---

### 11. Verify Stripe Payment
| | |
|---|---|
| **Endpoint** | `POST /api/user/verifyStripe` |
| **Auth Required** | ✅ User Token |

**Request Body:**
```json
{
  "appointmentId": "6650def...",
  "success": "true"
}
```

---

### 12. Add Doctor Review ⭐
| | |
|---|---|
| **Endpoint** | `POST /api/user/add-review` |
| **Auth Required** | ✅ User Token |
| **Validation** | Zod Schema |

**Request Body:**
```json
{
  "docId": "6650abc...",
  "rating": 5,
  "comment": "Excellent treatment, very caring doctor!"
}
```

**Validation Rules:**
- `docId` — Required, valid MongoDB ObjectId
- `rating` — Required, number, 1 to 5
- `comment` — Required, string, min 5 chars

**Success Response (200):**
```json
{
  "success": true,
  "message": "Review added successfully"
}
```

---

### 13. Download Prescription 📄
| | |
|---|---|
| **Endpoint** | `POST /api/user/download-prescription/:appointmentId` |
| **Auth Required** | ✅ User Token |
| **Response Type** | `application/pdf` (streamed) |

**Path Params:**
| Param | Description |
|---|---|
| `appointmentId` | The ID of the appointment |

**Success Response:** A binary PDF file is streamed as a download attachment.

**Error Response (500):**
```json
{
  "success": false,
  "message": "No prescription found for this appointment"
}
```

---

### 14. Get Chat History 💬
| | |
|---|---|
| **Endpoint** | `GET /api/user/chat-history/:appointmentId` |
| **Auth Required** | ✅ User Token |

**Path Params:**
| Param | Description |
|---|---|
| `appointmentId` | The ID of the appointment |

**Success Response (200):**
```json
{
  "success": true,
  "messages": [
    {
      "_id": "...",
      "appointmentId": "6650def...",
      "sender": "user",
      "text": "Hello Doctor!",
      "timestamp": 1720100000000
    },
    {
      "sender": "doctor",
      "text": "Hello! How can I help you?",
      "timestamp": 1720100010000
    }
  ]
}
```

---

## 🩺 Doctor APIs (`/api/doctor`)

### 1. Doctor Login
| | |
|---|---|
| **Endpoint** | `POST /api/doctor/login` |
| **Auth Required** | ❌ No |

**Request Body:**
```json
{
  "email": "doctor@example.com",
  "password": "docPass123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "dToken": "eyJhbGci..."
}
```

---

### 2. List All Doctors (Public)
| | |
|---|---|
| **Endpoint** | `GET /api/doctor/list` |
| **Auth Required** | ❌ No |

**Query Parameters (Optional):**
| Param | Type | Description |
|---|---|---|
| `page` | number | Page number (1-indexed) |
| `limit` | number | Results per page |
| `speciality` | string | Filter by speciality (e.g., `Dermatologist`) |

**Example:** `GET /api/doctor/list?page=1&limit=5&speciality=Dermatologist`

**Success Response (Paginated):**
```json
{
  "success": true,
  "doctors": [ { "name": "Dr. Smith", "speciality": "Dermatologist", "..." } ],
  "pagination": {
    "total": 12,
    "page": 1,
    "pages": 3
  }
}
```

**Success Response (Non-Paginated):**
```json
{
  "success": true,
  "doctors": [ "..." ]
}
```

---

### 3. Get Doctor Appointments
| | |
|---|---|
| **Endpoint** | `GET /api/doctor/appointments` |
| **Auth Required** | ✅ Doctor Token |

---

### 4. Complete Appointment
| | |
|---|---|
| **Endpoint** | `POST /api/doctor/complete-appointment` |
| **Auth Required** | ✅ Doctor Token |

**Request Body:**
```json
{
  "appointmentId": "6650def..."
}
```

---

### 5. Cancel Appointment
| | |
|---|---|
| **Endpoint** | `POST /api/doctor/cancel-appointment` |
| **Auth Required** | ✅ Doctor Token |

**Request Body:**
```json
{
  "appointmentId": "6650def..."
}
```

---

### 6. Change Availability
| | |
|---|---|
| **Endpoint** | `POST /api/doctor/change-availability` |
| **Auth Required** | ✅ Doctor Token |

**Request Body:**
```json
{
  "docId": "6650abc..."
}
```

---

### 7. Get Doctor Dashboard
| | |
|---|---|
| **Endpoint** | `GET /api/doctor/dashboard` |
| **Auth Required** | ✅ Doctor Token |

**Success Response (200):**
```json
{
  "success": true,
  "dashData": {
    "earnings": 5000,
    "appointments": 25,
    "patients": 18,
    "latestAppointments": [ "..." ]
  }
}
```

---

### 8. Get Doctor Profile
| | |
|---|---|
| **Endpoint** | `GET /api/doctor/profile` |
| **Auth Required** | ✅ Doctor Token |

---

### 9. Update Doctor Profile
| | |
|---|---|
| **Endpoint** | `POST /api/doctor/update-profile` |
| **Auth Required** | ✅ Doctor Token |

**Request Body:**
```json
{
  "fees": 600,
  "address": { "line1": "456 Clinic Rd", "line2": "Suite 2" },
  "available": true
}
```

---

### 10. Add Prescription 📝
| | |
|---|---|
| **Endpoint** | `POST /api/doctor/add-prescription` |
| **Auth Required** | ✅ Doctor Token |

**Request Body:**
```json
{
  "appointmentId": "6650def...",
  "prescription": "Tab Paracetamol 500mg — 1 tablet, 3 times a day after meals for 5 days.\nSyrup Cough Relief — 10ml, twice daily."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Prescription added successfully"
}
```

---

### 11. Get Chat History (Doctor) 💬
| | |
|---|---|
| **Endpoint** | `GET /api/doctor/chat-history/:appointmentId` |
| **Auth Required** | ✅ Doctor Token |

Same response format as [User Chat History](#14-get-chat-history-).

---

## 🛡️ Admin APIs (`/api/admin`)

### 1. Admin Login
| | |
|---|---|
| **Endpoint** | `POST /api/admin/login` |
| **Auth Required** | ❌ No |

**Request Body:**
```json
{
  "email": "admin@prescripto.com",
  "password": "admin123"
}
```

---

### 2. Add Doctor
| | |
|---|---|
| **Endpoint** | `POST /api/admin/add-doctor` |
| **Auth Required** | ✅ Admin Token |
| **Content-Type** | `multipart/form-data` |

**Request Body (form-data):**
| Field | Type | Required |
|---|---|---|
| `name` | string | ✅ |
| `email` | string | ✅ |
| `password` | string | ✅ |
| `speciality` | string | ✅ |
| `degree` | string | ✅ |
| `experience` | string | ✅ |
| `about` | string | ✅ |
| `fees` | number | ✅ |
| `address` | JSON string | ✅ |
| `image` | file | ✅ |

---

### 3. Get All Doctors
| | |
|---|---|
| **Endpoint** | `GET /api/admin/all-doctors` |
| **Auth Required** | ✅ Admin Token |

---

### 4. Get All Appointments
| | |
|---|---|
| **Endpoint** | `GET /api/admin/appointments` |
| **Auth Required** | ✅ Admin Token |

---

### 5. Cancel Appointment (Admin)
| | |
|---|---|
| **Endpoint** | `POST /api/admin/cancel-appointment` |
| **Auth Required** | ✅ Admin Token |

**Request Body:**
```json
{
  "appointmentId": "6650def..."
}
```

---

### 6. Change Doctor Availability
| | |
|---|---|
| **Endpoint** | `POST /api/admin/change-availability` |
| **Auth Required** | ✅ Admin Token |

**Request Body:**
```json
{
  "docId": "6650abc..."
}
```

---

### 7. Admin Dashboard
| | |
|---|---|
| **Endpoint** | `GET /api/admin/dashboard` |
| **Auth Required** | ✅ Admin Token |

**Success Response (200):**
```json
{
  "success": true,
  "dashData": {
    "doctors": 10,
    "appointments": 50,
    "patients": 30,
    "latestAppointments": [ "..." ]
  }
}
```

---

## 🔌 WebSocket Events (Socket.io)

The server runs a Socket.io instance on the same port as the HTTP server.

**Client Connection:**
```javascript
import { io } from "socket.io-client";
const socket = io("http://localhost:4000");
```

### Events

| Event | Direction | Payload | Description |
|---|---|---|---|
| `join_room` | Client → Server | `appointmentId` (string) | Join a chat room for a specific appointment |
| `send_message` | Client → Server | `{ room, sender, text, timestamp }` | Send a message. `sender` = `"user"` or `"doctor"` |
| `receive_message` | Server → Client | `{ room, sender, text, timestamp }` | Receive a message from the other party |

**Example — Sending a message:**
```javascript
socket.emit("send_message", {
  room: "6650def123abc...",      // appointmentId
  sender: "user",                 // "user" or "doctor"
  text: "Hello Doctor!",
  timestamp: Date.now()
});
```

**Example — Receiving a message:**
```javascript
socket.on("receive_message", (data) => {
  console.log(`${data.sender}: ${data.text}`);
});
```

> **Note:** Messages are automatically persisted to the database when sent via `send_message`.

---

## ❌ Error Handling

All API errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

### HTTP Status Codes

| Code | Description |
|---|---|
| `200` | Success |
| `401` | Unauthorized (invalid/missing token) |
| `429` | Too Many Requests (rate limited) |
| `500` | Internal Server Error |

### Rate Limiting
- **Window:** 15 minutes
- **Max Requests:** 100 per IP per window
- **Response on limit:**
```json
{
  "message": "Too many requests from this IP, please try again after 15 minutes"
}
```

### Security Headers
All responses include security headers via **Helmet.js**.

### Input Sanitization
MongoDB injection attacks are prevented via **express-mongo-sanitize**.

---

## 📦 Data Models

### User
| Field | Type | Default |
|---|---|---|
| `name` | String | Required |
| `email` | String | Required, Unique |
| `password` | String | Required (hashed) |
| `image` | String | Default avatar |
| `phone` | String | `"000000000"` |
| `address` | Object | `{ line1: "", line2: "" }` |
| `gender` | String | `"Not Selected"` |
| `dob` | String | `"Not Selected"` |

### Doctor
| Field | Type | Default |
|---|---|---|
| `name` | String | Required |
| `email` | String | Required, Unique |
| `password` | String | Required (hashed) |
| `image` | String | Required |
| `speciality` | String | Required |
| `degree` | String | Required |
| `experience` | String | Required |
| `about` | String | Required |
| `available` | Boolean | `true` |
| `fees` | Number | Required |
| `slots_booked` | Object | `{}` |
| `address` | Object | Required |
| `reviews` | Array | `[]` |
| `reviews[].userId` | ObjectId | Ref: User |
| `reviews[].rating` | Number | 1–5 |
| `reviews[].comment` | String | Required |

### Appointment
| Field | Type | Default |
|---|---|---|
| `userId` | String | Required |
| `docId` | String | Required |
| `slotDate` | String | Required |
| `slotTime` | String | Required |
| `userData` | Object | Required |
| `docData` | Object | Required |
| `amount` | Number | Required |
| `cancelled` | Boolean | `false` |
| `payment` | Boolean | `false` |
| `isCompleted` | Boolean | `false` |
| `prescription` | String | `""` |

### Message
| Field | Type | Description |
|---|---|---|
| `appointmentId` | ObjectId | Ref: Appointment |
| `sender` | String | `"user"` or `"doctor"` |
| `text` | String | Message content |
| `timestamp` | Number | Unix timestamp (ms) |

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT (jsonwebtoken) |
| **Payments** | Razorpay + Stripe |
| **Real-Time** | Socket.io |
| **PDF Generation** | PDFKit |
| **Validation** | Zod |
| **Security** | Helmet, express-rate-limit, express-mongo-sanitize |
| **File Upload** | Multer + Cloudinary |
| **Logging** | Morgan |

---

*Generated for Doctor Appointment System v1.0.0*
