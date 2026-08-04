@echo off
title Railway Reservation System - Launch Full Stack (Backend + Frontend)
cls

echo ============================================================
echo 🚀 STARTING RAILWAY RESERVATION SYSTEM (FULL STACK)
echo ============================================================
echo.

:: 1. Launch Backend Microservices
echo [1/2] Launching Backend Microservices...
cd RailwayReservationBackend1
start "Railway Backend Services" cmd /k "call run-all.bat"
cd ..

:: 2. Launch Frontend Web App
echo [2/2] Starting Frontend Web App...
cd RailwayReservationFrontend1
start "Railway Frontend Web App" cmd /k "npm run dev"
cd ..

echo.
echo ============================================================
echo SUCCESS: BACKEND & FRONTEND LAUNCHERS TRIGGERED!
echo.
echo  Frontend Web App:     http://localhost:5173
echo  API Gateway:          http://localhost:8080
echo  Eureka Dashboard:     http://localhost:8761
echo ============================================================
echo.
pause
