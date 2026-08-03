/**
 * ============================================================
 * BEGINNER-FRIENDLY EXPRESS.JS API GATEWAY
 * ============================================================
 * 
 * WHAT IS AN API GATEWAY?
 * An API Gateway is a single front door (entry point) for all client requests.
 * Instead of frontend apps calling backend services directly (like auth on port 8081, 
 * trains on port 8082), they call the API Gateway on port 8080.
 * 
 * The API Gateway:
 * 1. Logs every incoming request.
 * 2. Checks JWT tokens for security on protected routes.
 * 3. Forwards (proxies) requests to the correct backend microservice.
 * ============================================================
 */

// Step 1: Import required Node packages
require('dotenv').config(); // Reads environment variables from .env file
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Step 2: Create the Express application and set the port
const app = express();
const PORT = process.env.PORT || 8080;

// Read JWT secret key from .env (matches the Java auth-service secret key)
const JWT_SECRET = process.env.JWT_SECRET || '404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970';
const JWT_ENCODING = process.env.JWT_SECRET_ENCODING || 'base64';

// Define backend microservice target URLs
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || 'http://localhost:8081';
const TRAIN_SERVICE = process.env.TRAIN_SERVICE_URL || 'http://localhost:8082';
const BOOKING_SERVICE = process.env.BOOKING_SERVICE_URL || 'http://localhost:8083';
const USER_SERVICE = process.env.USER_SERVICE_URL || 'http://localhost:8084';
const PAYMENT_SERVICE = process.env.PAYMENT_SERVICE_URL || 'http://localhost:8085';
const NOTIFICATION_SERVICE = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:8086';

// ============================================================
// STEP 3: MIDDLEWARE FUNCTIONS
// ============================================================

// Enable CORS so web browsers and frontend applications can call this gateway
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Handle OPTIONS preflight requests immediately to prevent CORS blockage
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(204);
});

/**
 * Middleware 1: Simple Request Logger
 * Prints every incoming HTTP method and requested URL in the terminal console.
 */
app.use((req, res, next) => {
  console.log(`[LOG] ${new Date().toLocaleTimeString()} -> ${req.method} ${req.originalUrl}`);
  next(); // Pass request to the next step
});

/**
 * Middleware 2: JWT Authentication Token Verifier
 * Checks if the request contains a valid Bearer JWT token before allowing access to private routes.
 */
function verifyJwtToken(req, res, next) {
  // Allow OPTIONS preflight requests to pass through without token verification
  if (req.method === 'OPTIONS') {
    return next();
  }

  // Read "Authorization" header sent by client (e.g., "Bearer eyJhbGci...")
  const authHeader = req.headers['authorization'];

  // Check if header is missing or doesn't start with "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied: Missing or invalid Authorization header. Token format must be "Bearer <token>".'
    });
  }

  // Extract the token part after "Bearer "
  const token = authHeader.split(' ')[1];

  try {
    // Decode key if base64 encoded (matching Java auth-service JJWT decoding)
    const secretKey = JWT_ENCODING === 'base64' 
      ? Buffer.from(JWT_SECRET, 'base64') 
      : JWT_SECRET;

    // Verify token signature and expiration
    const decodedUser = jwt.verify(token, secretKey);

    // Attach decoded user object to request
    req.user = decodedUser;

    // Forward user identity downstream to microservices via custom headers
    if (decodedUser.id) req.headers['x-user-id'] = String(decodedUser.id);
    if (decodedUser.sub) req.headers['x-user-email'] = String(decodedUser.sub);
    if (decodedUser.role) req.headers['x-user-role'] = String(decodedUser.role);

    // Token is valid -> continue to proxy the request
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or Expired JWT Token. Please log in again.'
    });
  }
}

// ============================================================
// STEP 4: HEALTH CHECK ENDPOINT
// ============================================================
/**
 * Simple GET endpoint to verify that the Gateway server is running.
 * Test URL: http://localhost:8080/health
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    message: 'API Gateway is up and running!',
    timestamp: new Date().toISOString(),
    services: {
      authService: AUTH_SERVICE,
      trainService: TRAIN_SERVICE,
      bookingService: BOOKING_SERVICE,
      userService: USER_SERVICE,
      paymentService: PAYMENT_SERVICE,
      notificationService: NOTIFICATION_SERVICE
    }
  });
});

// ============================================================
// STEP 5: PROXY ROUTES (Forwarding Requests to Microservices)
// ============================================================

/**
 * Route 1: Auth Service (PUBLIC - No Token Required)
 * Client URL:  http://localhost:8080/api/auth/login or /register
 * Target URL:  http://localhost:8081/api/auth/*
 */
app.use(createProxyMiddleware({
  target: AUTH_SERVICE,
  changeOrigin: true,
  pathFilter: '/api/auth',
  onError: (err, req, res) => {
    res.status(502).json({
      success: false,
      message: 'Auth Service (Port 8081) is currently unreachable. Make sure auth-service is running.'
    });
  }
}));

/**
 * Route 2: Train Service (PUBLIC - Train Search & Timings)
 * Client URL:  http://localhost:8080/api/trains/*
 * Target URL:  http://localhost:8082/api/trains/*
 */
app.use(createProxyMiddleware({
  target: TRAIN_SERVICE,
  changeOrigin: true,
  pathFilter: '/api/trains',
  onError: (err, req, res) => {
    res.status(502).json({
      success: false,
      message: 'Train Service (Port 8082) is currently unreachable.'
    });
  }
}));

/**
 * Route 3: Booking Service (PROTECTED - Token Required)
 * Client URL:  http://localhost:8080/api/bookings/*
 * Target URL:  http://localhost:8083/api/bookings/*
 */
app.use('/api/bookings', verifyJwtToken);
app.use(createProxyMiddleware({
  target: BOOKING_SERVICE,
  changeOrigin: true,
  pathFilter: '/api/bookings',
  onError: (err, req, res) => {
    res.status(502).json({
      success: false,
      message: 'Booking Service (Port 8083) is currently unreachable.'
    });
  }
}));

/**
 * Route 4: User Service (PROTECTED - Token Required)
 * Client URL:  http://localhost:8080/api/users/*
 * Target URL:  http://localhost:8084/api/users/*
 */
app.use('/api/users', verifyJwtToken);
app.use(createProxyMiddleware({
  target: USER_SERVICE,
  changeOrigin: true,
  pathFilter: '/api/users',
  onError: (err, req, res) => {
    res.status(502).json({
      success: false,
      message: 'User Service (Port 8084) is currently unreachable.'
    });
  }
}));

/**
 * Route 5: Payment Service (PROTECTED - Token Required)
 * Client URL:  http://localhost:8080/api/payments/*
 * Target URL:  http://localhost:8085/api/payments/*
 */
app.use('/api/payments', verifyJwtToken);
app.use(createProxyMiddleware({
  target: PAYMENT_SERVICE,
  changeOrigin: true,
  pathFilter: '/api/payments',
  onError: (err, req, res) => {
    res.status(502).json({
      success: false,
      message: 'Payment Service (Port 8085) is currently unreachable.'
    });
  }
}));

/**
 * Route 6: Notification Service (Token Optional for GET testing)
 * Client URL:  http://localhost:8080/api/notifications/*
 * Target URL:  http://localhost:8086/api/notifications/*
 */
app.use('/api/notifications', (req, res, next) => {
  if (req.method === 'GET') {
    return next();
  }
  return verifyJwtToken(req, res, next);
});
app.use(createProxyMiddleware({
  target: NOTIFICATION_SERVICE,
  changeOrigin: true,
  pathFilter: '/api/notifications',
  onError: (err, req, res) => {
    res.status(502).json({
      success: false,
      message: 'Notification Service (Port 8086) is currently unreachable.'
    });
  }
}));

// ============================================================
// STEP 6: 404 CATCH-ALL ROUTE (For unmapped URLs)
// ============================================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route '${req.originalUrl}' does not exist on this API Gateway.`
  });
});

// ============================================================
// STEP 7: START THE SERVER
// ============================================================
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 API Gateway running on: http://localhost:${PORT}`);
  console.log(`📡 Health Check URL:      http://localhost:${PORT}/health`);
  console.log(`====================================================`);
});
