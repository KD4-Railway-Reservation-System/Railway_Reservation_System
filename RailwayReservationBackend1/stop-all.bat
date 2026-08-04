@echo off
title Railway Reservation System - Stop All Microservices
cls


echo  STOPPING ALL RUNNING RAILWAY RESERVATION SERVICES
echo.

echo Stopping Node.js processes (API Gateway)...
taskkill /F /IM node.exe 2>nul

echo Stopping Java processes (Eureka Server, Auth Service, Train Service, Booking Service, Payment Service, Notification Service)...
taskkill /F /IM java.exe 2>nul

echo.
echo ✅ ALL SERVICES STOPPED SUCCESSFULLY!
echo.
pause
