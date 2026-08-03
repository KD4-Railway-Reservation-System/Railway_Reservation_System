@echo off
title Railway Reservation System - Launch Full Stack (Backend + Frontend)
cls

echo ============================================================
echo 🚀 STARTING ENTIRE RAILWAY RESERVATION SYSTEM (FULL STACK)
echo ============================================================
echo.

:: 1. Install & Launch Backend
echo [1/2] Installing Backend dependencies and starting microservices...
cd RailwayReservationBackend1
call npm --prefix api-gateway install
start "Railway Backend Services" cmd /k "call run-all.bat"
cd ..

:: 2. Install & Launch Frontend
echo [2/2] Installing Frontend dependencies and starting Web App...
cd RailwayReservationFrontend1
call npm install
start "Railway Frontend (React/Vite)" cmd /k "npm run dev"
cd ..

echo.
echo ============================================================
echo SUCCESS: BACKEND & FRONTEND LAUNCHERS TRIGGERED!
echo.
echo 🖥️ Frontend Web App:     http://localhost:5173
echo 🌐 API Gateway:          http://localhost:8080
echo 🔍 Eureka Dashboard:     http://localhost:8761
echo ============================================================
echo.
pause
