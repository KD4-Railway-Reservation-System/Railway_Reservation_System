# Beginner-Friendly Express.js API Gateway

A simple, easy-to-understand **API Gateway** built with **Node.js** and **Express.js** for the Railway Reservation System Microservices.

---

## 💡 What is an API Gateway?

An **API Gateway** is the single entry point ("front door") for your entire backend application.

Instead of your frontend app (React, Mobile app) remembering separate ports for every service (Auth on `8081`, Trains on `8082`, Bookings on `8083`), the frontend connects to **one API Gateway port (`8080`)**.

```
Client App ---> API Gateway (Port 8080)
                     |
                     +---> Auth Service (Port 8081)    [Public]
                     +---> Train Service (Port 8082)   [Requires JWT]
                     +---> Booking Service (Port 8083) [Requires JWT]
                     +---> User Service (Port 8084)    [Requires JWT]
```

---

## 🌟 Key Features

1. **Request Logger**: Prints every request (`GET /api/trains`) in the terminal.
2. **JWT Security Check**: Automatically verifies JWT Bearer tokens for private endpoints.
3. **Request Proxying**: Automatically forwards requests to backend microservices using `http-proxy-middleware`.
4. **Health Check**: Test URL at `http://localhost:8080/health`.
5. **Simple Single-File Code**: Everything is located in [`src/server.js`](file:///c:/Users/rahul/OneDrive/Desktop/RailwayReservationBackend-antigravity/api-gateway/src/server.js) with easy line-by-line comments.

---

## 📁 Directory Structure

```
api-gateway/
├── .env           # Environment variables (Port, JWT Secret, Microservice URLs)
├── .env.example   # Template environment file
├── package.json   # Project dependencies
├── README.md      # Documentation
└── src/
    └── server.js  # Main Gateway server with beginner-friendly comments
```

---

## 🚀 How to Run

### 1. Install Dependencies
```bash
cd api-gateway
npm install
```

### 2. Start the Gateway Server
```bash
npm start
```
Or for auto-reloading during development:
```bash
npm run dev
```

---

## 🧪 Testing Endpoints

### 1. Health Check
Open your browser or run in terminal:
```bash
curl http://localhost:8080/health
```

### 2. Public Login Endpoint (No Token Needed)
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### 3. Protected Endpoint (Token Required)
Without a token, this returns `401 Unauthorized`:
```bash
curl http://localhost:8080/api/trains
```
With a valid Bearer token:
```bash
curl http://localhost:8080/api/trains \
  -H "Authorization: Bearer <your_jwt_token>"
```
