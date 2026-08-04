import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { trainApi, bookingApi } from "../api/apiService";
import { useAuth } from "../context/AuthContext";
import AdminTrainTab from "../components/admin/AdminTrainTab";
import AdminBookingTab from "../components/admin/AdminBookingTab";
import AdminCreateAdminTab from "../components/admin/AdminCreateAdminTab";
import { ShieldCheck, Train, Ticket, UserPlus } from "lucide-react";

export default function AdminDashboard() {
  const { isAuthenticated, isAdmin, isSuperUser, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const rawTabQuery = searchParams.get("tab")?.toUpperCase();
  const activeTab = isSuperUser
    ? "CREATE_ADMIN"
    : rawTabQuery === "BOOKINGS"
    ? "BOOKINGS"
    : "TRAINS";

  const [trains, setTrains] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/admin");
      return;
    }
    if (!isAdmin && !isSuperUser) {
      navigate("/");
      return;
    }
    loadAdminData();
  }, [isAuthenticated, isAdmin, isSuperUser, navigate]);

  async function loadAdminData() {
    setLoading(true);
    let trainList = [];
    let bookingList = [];

    // Fetch trains
    try {
      const tRes = await trainApi.getAllTrains();
      trainList = Array.isArray(tRes.data) ? tRes.data : (tRes.data?.trains || []);
    } catch (tErr) {
      console.log("Admin Data Notice: Error loading trains", tErr);
    }

    // Fetch bookings
    try {
      const bRes = await bookingApi.getAllBookings();
      bookingList = Array.isArray(bRes.data) ? bRes.data : (bRes.data?.bookings || []);
    } catch (bErr) {
      console.log("Admin Data Notice: Error loading bookings, using backup cache", bErr);
      try {
        bookingList = JSON.parse(localStorage.getItem("railreserve_local_bookings") || "[]");
      } catch (e) {
        bookingList = [];
      }
    }

    setTrains(trainList);
    setBookings(bookingList);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-slate-600 font-semibold flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p>Loading Railway Administration Console...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header & Tabs */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 border border-blue-600/30 text-white p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{isSuperUser ? "Superuser Master Console" : "System Administrator Console"}</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            {isSuperUser ? "Admin Account Provisioning Portal" : "Railway Express & Booking Portal"}
          </h2>
          <p className="text-xs text-blue-100 max-w-xl">
            Logged in as <span className="font-bold text-amber-300">{user?.fullName || user?.email}</span> ({isSuperUser ? "SUPERUSER" : "ADMIN"}).{" "}
            {isSuperUser
              ? "Superuser Role: Create and manage Administrator Email IDs and passwords."
              : "Admin Role: Add express trains, manage routes/fares, and oversee passenger bookings."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-900/60 backdrop-blur-md p-1.5 rounded-xl gap-1.5 text-xs font-bold border border-white/10 w-full md:w-auto overflow-x-auto">
          {isSuperUser ? (
            <div className="px-4 py-2.5 bg-amber-400 text-slate-950 font-black rounded-lg flex items-center space-x-2 shadow-md">
              <UserPlus className="w-4 h-4" />
              <span>Create Admin Only</span>
            </div>
          ) : (
            <>
              <button
                onClick={() => setSearchParams({ tab: "TRAINS" })}
                className={`px-4 py-2.5 rounded-lg transition-all flex items-center space-x-2 shrink-0 ${
                  activeTab === "TRAINS"
                    ? "bg-amber-400 text-slate-950 font-black shadow-md"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Train className="w-4 h-4" />
                <span>Add & Manage Trains ({trains.length})</span>
              </button>

              <button
                onClick={() => setSearchParams({ tab: "BOOKINGS" })}
                className={`px-4 py-2.5 rounded-lg transition-all flex items-center space-x-2 shrink-0 ${
                  activeTab === "BOOKINGS"
                    ? "bg-amber-400 text-slate-950 font-black shadow-md"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Ticket className="w-4 h-4" />
                <span>Bookings Overview ({bookings.length})</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Active Tab View */}
      {isSuperUser && <AdminCreateAdminTab />}

      {!isSuperUser && activeTab === "TRAINS" && (
        <AdminTrainTab
          trains={trains}
          onDataChange={loadAdminData}
        />
      )}

      {!isSuperUser && activeTab === "BOOKINGS" && <AdminBookingTab bookings={bookings} />}
    </div>
  );
}
