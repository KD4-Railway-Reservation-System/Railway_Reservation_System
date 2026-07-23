import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import TrainSearchPage from "../pages/TrainSearchPage";
import BookingPage from "../pages/BookingPage";
import MyBookingsPage from "../pages/MyBookingsPage";
import RegisterPage from "../pages/RegisterPage";
import AdminDashboard from "../pages/AdminDashboard";
import PnrStatusPage from "../pages/PnrStatusPage";
import LoginPage from "../pages/LoginPage";

export default function RouterPath() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/trains" element={<TrainSearchPage />} />
          <Route path="/book/:trainId" element={<BookingPage />} />
          <Route path="/pnr-status" element={<PnrStatusPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}
