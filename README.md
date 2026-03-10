# 🚀 Advanced Node.js Backend Starter

A **production-ready backend boilerplate** built with **Node.js, Express, MongoDB, and Redis** using a scalable **Service–DAL (Data Access Layer) architecture**.

Designed for **clean code, security, and maintainability**, following **OOP and layered architecture principles**.

---

## ✨ Features

- 🔐 **JWT Authentication with Rotation**
- 🛡 **Refresh Token Reuse Detection**
- 👥 **Concurrent Session Limit (Max 3 Sessions)**
- 🍪 **Secure HTTP-Only Cookies**
- ⚡ **Redis for OTP & Temporary Data**
- 🚦 **API Rate Limiting**
- ✅ **Zod Request Validation**
- 📧 **Email Integration (Nodemailer)**
- 📊 **Request Logging (Morgan)**

---

## 🏗 Architecture

The project follows a **layered architecture** to separate responsibilities.

```
Controller → Service → DAL → Database
```

**Controllers**
- Handle HTTP requests and responses

**Services**
- Business logic and orchestration

**DAL (Data Access Layer)**
- Database and Redis operations

---

## 📂 Project Structure

```
src
├── controllers
├── services
├── DAL
├── models
├── validators
├── middlewares
├── utils
└── server.js
```

---

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **Redis**
- **Zod**
- **Morgan**
- **Nodemailer**

---

## ⚙️ Setup

### Install dependencies

```bash
npm install
```

### Create `.env`

```
PORT=5000

MONGO_URI=your_mongodb_uri
REDIS_URL=your_redis_url

ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
```

### Run server

```bash
npm run start
```

---

## 🔒 Security Highlights

- JWT Rotation Strategy  
- Refresh Token Reuse Detection  
- Session Limiting  
- HTTP-Only Cookies  
- API Rate Limiting  

---

## 👨‍💻 Author

**Muhammad Mukhtar Shaikh**  
Backend Developer (Node.js / MERN)

---

## 📄 License

MIT License