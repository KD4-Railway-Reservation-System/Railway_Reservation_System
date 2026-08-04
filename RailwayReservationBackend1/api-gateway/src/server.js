require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.PORT || 8080;

// JWT Configuration
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970s";
const JWT_ENCODING = process.env.JWT_SECRET_ENCODING || "base64";

// Microservice URLs
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || "http://localhost:8081";
const TRAIN_SERVICE = process.env.TRAIN_SERVICE_URL || "http://localhost:8082";
const BOOKING_SERVICE = process.env.BOOKING_SERVICE_URL || "http://localhost:8083";
const USER_SERVICE = process.env.USER_SERVICE_URL || "http://localhost:8084";
const PAYMENT_SERVICE = process.env.PAYMENT_SERVICE_URL || "http://localhost:8085";
const NOTIFICATION_SERVICE =
  process.env.NOTIFICATION_SERVICE_URL || "http://localhost:8086";

// Enable CORS
app.use(cors());

// Log every request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// JWT Verification
function verifyJwtToken(req, res, next) {
  if (req.method === "OPTIONS") {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "JWT Token Required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secretKey =
      JWT_ENCODING === "base64"
        ? Buffer.from(JWT_SECRET, "base64")
        : JWT_SECRET;

    const user = jwt.verify(token, secretKey);

    req.user = user;

    if (user.id) req.headers["x-user-id"] = String(user.id);
    if (user.sub) req.headers["x-user-email"] = String(user.sub);
    if (user.role) req.headers["x-user-role"] = String(user.role);

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    });
  }
}

// Health Check
app.get("/health", (req, res) => {
  res.json({
    status: "UP",
    message: "API Gateway Running",
  });
});

// -------------------- AUTH SERVICE --------------------
app.use(
  createProxyMiddleware({
    target: AUTH_SERVICE,
    changeOrigin: true,
    pathFilter: "/api/auth",
  })
);

// -------------------- TRAIN SERVICE --------------------
app.use(
  createProxyMiddleware({
    target: TRAIN_SERVICE,
    changeOrigin: true,
    pathFilter: "/api/trains",
  })
);

// -------------------- BOOKING SERVICE --------------------
app.use("/api/bookings", verifyJwtToken);

app.use(
  createProxyMiddleware({
    target: BOOKING_SERVICE,
    changeOrigin: true,
    pathFilter: "/api/bookings",
  })
);

// -------------------- USER SERVICE --------------------
app.use("/api/users", verifyJwtToken);

app.use(
  createProxyMiddleware({
    target: USER_SERVICE,
    changeOrigin: true,
    pathFilter: "/api/users",
  })
);

// -------------------- PAYMENT SERVICE --------------------
app.use("/api/payments", verifyJwtToken);

app.use(
  createProxyMiddleware({
    target: PAYMENT_SERVICE,
    changeOrigin: true,
    pathFilter: "/api/payments",
  })
);

// -------------------- NOTIFICATION SERVICE --------------------
app.use("/api/notifications", (req, res, next) => {
  if (req.method === "GET") {
    return next();
  }

  verifyJwtToken(req, res, next);
});

app.use(
  createProxyMiddleware({
    target: NOTIFICATION_SERVICE,
    changeOrigin: true,
    pathFilter: "/api/notifications",
  })
);

// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`API Gateway Running: http://localhost:${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/health`);
});
