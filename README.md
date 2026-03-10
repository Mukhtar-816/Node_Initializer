# 🚀 Advanced Node.js Backend Starter
### Service–DAL Architecture (Production Ready)

![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![Express](https://img.shields.io/badge/Express.js-Framework-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![Redis](https://img.shields.io/badge/Redis-Cache-red)
![License](https://img.shields.io/badge/License-MIT-blue)

A **professional backend starter template** built with **Node.js, Express, MongoDB, and Redis** using a scalable **Service–DAL (Data Access Layer) architecture**.

This project follows **clean architecture principles and Object-Oriented Programming (OOP)** to ensure **high maintainability, security, and scalability** for production-ready backend systems.

It is designed to demonstrate **advanced backend engineering practices** including secure authentication, session management, caching strategies, and layered architecture.

---

# ✨ Key Features

## 🔐 Secure Authentication & Session Management

### JWT Rotation Strategy
- Issues a new **access token and refresh token pair** every time a refresh occurs.
- Minimizes the attack window if a token is compromised.

### Refresh Token Reuse Detection
- Detects when a **revoked refresh token** is used again.
- Triggers a security mechanism that can **invalidate all active sessions**.

### Concurrent Session Control
- Maximum **3 active sessions per user**.
- Uses **FIFO strategy** to remove the oldest session when limit is exceeded.

### HTTP-Only Cookie Storage
- Refresh tokens are stored in **secure HTTP-only cookies**.
- Protects against **XSS-based token theft**.

---

# ⚡ Performance Optimizations

### Redis Staging Layer
Redis is used as a **high-speed temporary storage layer** for:

- OTP verification codes
- Temporary user registration staging
- Session caching
- Rate limiting counters

This helps reduce unnecessary writes to the primary database.

### Parallel Processing
Database and cache operations are executed concurrently using:

```js
Promise.all()
```

This significantly reduces request latency.

---

# 🛡 API Rate Limiting

The system includes **rate limiting protection** to prevent:

- Brute force login attempts
- OTP abuse
- API spam
- Denial-of-service attempts

Rate limiting can be configured using **Redis-backed counters** to ensure scalability across multiple instances.

Example protections:

- Login attempts limit
- OTP request limit
- Global API request limit per IP

---

# 📧 Email Communication

The system integrates **Nodemailer** for email services.

Supported features:

- OTP verification emails
- Registration confirmation
- Future support for notifications and alerts

SMTP configuration is handled via environment variables.

---

# 🏗 Architecture Overview

This project follows a **clean multi-layer architecture** to enforce separation of concerns.

```
Client Request
      │
      ▼
Controllers
      │
      ▼
Services (Business Logic)
      │
      ▼
DAL (Data Access Layer)
      │
      ▼
MongoDB / Redis
```

---

# 📂 Project Structure

```
src
│
├── controllers
│   # Handles HTTP requests and responses
│
├── services
│   # Business logic layer
│
├── DAL
│   # Data access layer (MongoDB and Redis queries)
│
├── models
│   # Mongoose schema definitions
│
├── validators
│   # Zod validation schemas
│
├── utils
│   # Helper utilities (JWT, hashing, custom errors)
│
├── middlewares
│   # Global middleware and security guards
│
└── server.js
    # Application entry point
```

---

# 🛠 Tech Stack

| Technology | Purpose |
|-----------|--------|
| Node.js | JavaScript runtime |
| Express.js | Backend framework |
| MongoDB | Primary database |
| Mongoose | MongoDB ODM |
| Redis | Cache & temporary storage |
| Zod | Schema validation |
| Morgan | HTTP request logging |
| Nodemailer | Email services |

---

# ⚙️ Getting Started

## 1️⃣ Install Dependencies

```bash
npm install
```

---

## 2️⃣ Environment Setup

Create a `.env` file in the project root.

```
PORT=5000
NODE_ENV=DEV

# Database
MONGO_URI=your_mongodb_uri
REDIS_URL=your_redis_url

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

---

## 3️⃣ Run the Development Server

Start the server using:

```bash
npm run start
```

If using **nodemon**, the server will automatically reload when files change.

---

# 🔒 Security Highlights

This backend implements several **production-grade security measures**:

- JWT Rotation Strategy
- Refresh Token Reuse Detection
- HTTP-Only Cookie Storage
- Session Limiting
- Zod Input Validation
- Redis OTP Expiration
- API Rate Limiting
- Centralized Error Handling

---

# 📈 Future Improvements

Potential enhancements for the project include:

- Role-Based Access Control (RBAC)
- Advanced Redis Rate Limiting
- Distributed Session Handling
- API Documentation with Swagger
- Docker Support
- CI/CD Pipeline
- Monitoring & Logging with Winston
- Microservice-ready architecture

---

# 👨‍💻 Author

**Muhammad Mukhtar Shaikh**

Backend Developer  
Node.js • MERN Stack • System Architecture

---

# 📜 License

This project is licensed under the **MIT License**.