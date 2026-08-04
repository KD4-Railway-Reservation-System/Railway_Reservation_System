import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import { Train, User, LogOut, Shield, ShieldCheck, UserPlus, Ticket, Bell } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, isSuperUser, isOnlyAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  // Determine active path helper
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 border-b border-blue-600/40 text-white px-6 py-3 flex flex-wrap items-center justify-between shadow-xl backdrop-blur-md">
      {/* Brand Logo */}
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

      {/* Dynamic Role-Based Navbar Features */}
      <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
        {/* Universal Link */}
        <Link
          to="/"
          className={`transition-colors ${isActive("/") ? "text-amber-300 font-bold" : "text-slate-100 hover:text-amber-300"}`}
        >
          Home
        </Link>

        {/* 1. GUEST FEATURES (Not logged in) */}
        {!isAuthenticated && (
          <>
            <Link
              to="/trains"
              className={`transition-colors ${isActive("/trains") ? "text-amber-300 font-bold" : "text-slate-100 hover:text-amber-300"}`}
            >
              Search Trains
            </Link>
            <Link
              to="/pnr-status"
              className={`transition-colors ${isActive("/pnr-status") ? "text-amber-300 font-bold" : "text-slate-100 hover:text-amber-300"}`}
            >
              PNR Status
            </Link>
          </>
        )}

        {/* 2. STANDARD USER FEATURES */}
        {isAuthenticated && !isOnlyAdmin && !isSuperUser && (
          <>
            <Link
              to="/trains"
              className={`transition-colors ${isActive("/trains") ? "text-amber-300 font-bold" : "text-slate-100 hover:text-amber-300"}`}
            >
              Search Trains
            </Link>
            <Link
              to="/pnr-status"
              className={`transition-colors ${isActive("/pnr-status") ? "text-amber-300 font-bold" : "text-slate-100 hover:text-amber-300"}`}
            >
              PNR Status
            </Link>
            <Link
              to="/my-bookings"
              className={`transition-colors ${isActive("/my-bookings") ? "text-amber-300 font-bold" : "text-slate-100 hover:text-amber-300"}`}
            >
              My Bookings
            </Link>
            <Link
              to="/notifications"
              className={`flex items-center gap-1 transition-colors ${isActive("/notifications") ? "text-amber-300 font-bold" : "text-slate-100 hover:text-amber-300"}`}
            >
              <Bell className="w-3.5 h-3.5 text-amber-300" />
              <span>Notifications</span>
            </Link>
          </>
        )}

        {/* 3. ADMIN FEATURES (Logged in as ADMIN) */}
        {isOnlyAdmin && (
          <>
            <Link
              to="/trains"
              className={`transition-colors ${isActive("/trains") ? "text-amber-300 font-bold" : "text-slate-100 hover:text-amber-300"}`}
            >
              Search Trains
            </Link>
            <Link
              to="/admin?tab=TRAINS"
              className="bg-indigo-600/60 hover:bg-indigo-500 border border-indigo-400/40 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
            >
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>Admin Panel</span>
            </Link>
            <Link
              to="/admin?tab=TRAINS"
              className="hover:text-amber-300 transition-colors text-slate-100 text-xs font-medium"
            >
              Train Management
            </Link>
            <Link
              to="/admin?tab=BOOKINGS"
              className="hover:text-amber-300 transition-colors text-slate-100 text-xs font-medium flex items-center gap-1"
            >
              <Ticket className="w-3.5 h-3.5 text-blue-300" />
              <span>All Bookings</span>
            </Link>
          </>
        )}

        {/* 4. SUPERUSER FEATURES (Logged in as SUPERUSER) */}
        {isSuperUser && (
          <>
            <Link
              to="/admin?tab=CREATE_ADMIN"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-3.5 py-1.5 rounded-lg font-black transition-all shadow-md flex items-center gap-1.5 text-xs"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>Superuser Console</span>
            </Link>
            <Link
              to="/admin?tab=CREATE_ADMIN"
              className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-300" />
              <span>Create Admin</span>
            </Link>
          </>
        )}

        {/* Theme Switcher */}
        <ThemeToggle />

        {/* User Status / Account Controls */}
        {isAuthenticated ? (
          <div className="flex items-center space-x-3 ml-2">
            <span className="text-xs bg-white/15 border border-white/20 px-3.5 py-1.5 rounded-full text-white font-bold flex items-center gap-1.5 shadow-inner">
              {isSuperUser ? (
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              ) : isOnlyAdmin ? (
                <Shield className="w-3.5 h-3.5 text-blue-300" />
              ) : (
                <User className="w-3.5 h-3.5 text-emerald-300" />
              )}
              <span>{user?.fullName || user?.email || "User"}</span>

              {/* Dynamic Badge */}
              {isSuperUser && (
                <span className="bg-amber-400 text-slate-950 text-[9px] px-1.5 py-0.5 rounded font-black uppercase ml-1 shadow">
                  SUPERUSER
                </span>
              )}
              {isOnlyAdmin && (
                <span className="bg-indigo-400 text-slate-950 text-[9px] px-1.5 py-0.5 rounded font-black uppercase ml-1 shadow">
                  ADMIN
                </span>
              )}
              {!isSuperUser && !isOnlyAdmin && (
                <span className="bg-emerald-400/30 text-emerald-200 border border-emerald-400/40 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ml-1">
                  PASSENGER
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
