@echo off
title Railway Reservation System - Launch All Backend Microservices
cls

echo ============================================================
echo 🚀 STARTING RAILWAY RESERVATION BACKEND MICROSERVICES
echo ============================================================
echo.

:: 0. Install/Verify API Gateway Dependencies
echo [0/7] Installing / Verifying API Gateway Node dependencies...
cd api-gateway
call npm install
cd ..
echo.

:: 1. Start Eureka Server first so other services can register
echo [1/7] Starting Eureka Discovery Server (Port 8761)...
start "1. Eureka Discovery Server (Port 8761)" cmd /k "cd eureka-server && mvnw.cmd spring-boot:run"

echo Waiting 12 seconds for Eureka Server to initialize...
timeout /t 12 /nobreak > nul

:: 2. Start Auth Service
echo [2/7] Starting Auth Service (Port 8081)...
start "2. Auth Service (Port 8081)" cmd /k "cd auth-service && mvnw.cmd spring-boot:run"

:: 3. Start Train Service
echo [3/7] Starting Train Search Service (Port 8082)...
start "3. Train Search Service (Port 8082)" cmd /k "cd train-service && mvnw.cmd spring-boot:run"

:: 4. Start Booking Service
echo [4/7] Starting Ticket Booking Service (Port 8083)...
start "4. Ticket Booking Service (Port 8083)" cmd /k "cd booking-service && mvnw.cmd spring-boot:run"

:: 5. Start Payment Service
echo [5/7] Starting Payment Processing Service (Port 8085)...
start "5. Payment Processing Service (Port 8085)" cmd /k "cd payment-service && mvnw.cmd spring-boot:run"

:: 6. Start Notification Service
echo [6/7] Starting Notification Service (Port 8086)...
start "6. Notification Service (Port 8086)" cmd /k "cd notification-service && mvnw.cmd spring-boot:run"

echo Waiting 10 seconds for Backend Microservices to start...
timeout /t 10 /nobreak > nul

:: 7. Start API Gateway
echo [7/7] Starting API Gateway (Port 8080)...
start "7. API Gateway (Port 8080)" cmd /k "cd api-gateway && npm start"

echo.
echo ============================================================
echo SUCCESS: ALL BACKEND SERVICES LAUNCHED IN SEPARATE WINDOWS!
echo.
echo 🌐 API Gateway:          http://localhost:8080
echo 🩺 Gateway Health Check: http://localhost:8080/health
echo 🔍 Eureka Dashboard:     http://localhost:8761
echo.
echo 📚 SWAGGER UI DOCUMENTATION LINKS:
echo 🔐 Auth Service Swagger:         http://localhost:8081/swagger-ui.html
echo 🚆 Train Service Swagger:        http://localhost:8082/swagger-ui.html
echo 🎫 Booking Service Swagger:      http://localhost:8083/swagger-ui.html
echo 💳 Payment Service Swagger:      http://localhost:8085/swagger-ui.html
echo 🔔 Notification Service Swagger: http://localhost:8086/swagger-ui.html
echo ============================================================
echo.
pause
