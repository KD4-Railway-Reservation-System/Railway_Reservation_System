import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import { Train, User, LogOut, Shield } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, isSuperUser, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 border-b border-blue-600/40 text-white px-6 py-3 flex flex-wrap items-center justify-between shadow-xl backdrop-blur-md">
      <div className="flex items-center space-x-2">
        <Link to="/" className="text-xl font-black tracking-tight flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/30 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform shadow-md">
            <Train className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-white text-lg tracking-wide leading-none">RailReserve</span>
            <span className="text-[10px] text-amber-300 font-bold uppercase tracking-widest mt-0.5">Indian Express</span>
          </div>
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-5 text-sm font-semibold">
        <Link to="/" className="hover:text-amber-300 transition-colors text-slate-100">
          Home
        </Link>
        <Link to="/trains" className="hover:text-amber-300 transition-colors text-slate-100">
          Search Trains
        </Link>
        <Link to="/pnr-status" className="hover:text-amber-300 transition-colors text-slate-100">
          PNR Status
        </Link>
        {isAuthenticated && (
          <>
            <Link to="/my-bookings" className="hover:text-amber-300 transition-colors text-slate-100">
              My Bookings
            </Link>
            <Link to="/notifications" className="hover:text-amber-300 flex items-center gap-1 transition-colors text-slate-100">
              🔔 Notifications
            </Link>
          </>
        )}
        <Link
          to="/admin"
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-1.5 rounded-lg font-black transition-all shadow-md flex items-center gap-1 text-xs"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>{isSuperUser ? "Superuser Console" : "Admin Panel"}</span>
        </Link>

        {/* Theme Switcher */}
        <ThemeToggle />

        {isAuthenticated ? (
          <div className="flex items-center space-x-3 ml-2">
            <span className="text-xs bg-white/15 border border-white/20 px-3.5 py-1.5 rounded-full text-white font-bold flex items-center gap-1.5 shadow-inner">
              <User className="w-3.5 h-3.5 text-amber-300" />
              <span>{user?.fullName || "Passenger"}</span>
              {isSuperUser && (
                <span className="bg-amber-400 text-slate-950 text-[9px] px-1.5 py-0.5 rounded font-black uppercase ml-1">
                  SUPERUSER
                </span>
              )}
            </span>
            <button
              onClick={handleLogout}
              className="bg-rose-600/80 hover:bg-rose-600 text-white border border-rose-400/40 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-md"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2 ml-2">
            <Link
              to="/login"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-1.5 rounded-lg text-xs font-black transition shadow-md"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-white/15 hover:bg-white/25 border border-white/30 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
