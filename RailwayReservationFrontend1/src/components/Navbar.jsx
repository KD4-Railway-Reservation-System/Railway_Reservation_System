import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="bg-slate-800 text-white p-4 flex flex-wrap items-center justify-between shadow-md">
      <div className="flex items-center space-x-2">
        <Link to="/" className="text-xl font-bold text-indigo-400">
          🚆 IRCTC RailReserve
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
        <Link to="/" className="hover:text-indigo-300">
          Home
        </Link>
        <Link to="/trains" className="hover:text-indigo-300">
          Search Trains
        </Link>
        <Link to="/pnr-status" className="hover:text-indigo-300">
          PNR Status
        </Link>
        {isAuthenticated && (
          <Link to="/my-bookings" className="hover:text-indigo-300">
            My Bookings
          </Link>
        )}
        <Link to="/admin" className="hover:text-indigo-300">
          Admin Panel
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center space-x-3 ml-2">
            <span className="text-xs bg-slate-700 px-2 py-1 rounded">
              Hi, {user?.fullName || "User"}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2 ml-2">
            <Link
              to="/login"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-xs"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-xs"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
