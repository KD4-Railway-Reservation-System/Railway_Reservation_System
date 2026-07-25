import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { trainApi, bookingApi } from "../api/apiService";
import { useAuth } from "../context/AuthContext";
import AdminTrainTab from "../components/admin/AdminTrainTab";
import AdminStationTab from "../components/admin/AdminStationTab";
import AdminBookingTab from "../components/admin/AdminBookingTab";

export default function AdminDashboard() {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("TRAINS");
  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/login?redirect=/admin");
      return;
    }
    loadAdminData();
  }, [isAuthenticated, isAdmin, navigate]);

  async function loadAdminData() {
    setLoading(true);
    try {
      const tRes = await trainApi.getAllTrains();
      const sRes = await trainApi.getAllStations();
      const bRes = await bookingApi.getAllBookings();

      setTrains(tRes.data || []);
      setStations(sRes.data || []);
      setBookings(bRes.data || []);
    } catch (err) {
      console.log("Error loading admin data", err);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-slate-400">
        Loading admin panel...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header & Tabs */}
      <div className="bg-slate-900 border border-slate-700 text-white p-5 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 shadow">
        <div>
          <h2 className="text-xl font-bold text-amber-400">
            Admin Control Console
          </h2>
          <p className="text-xs text-slate-400">
            Manage Express Trains, Stations, and Bookings
          </p>
        </div>

        <div className="flex bg-slate-800 p-1 rounded gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("TRAINS")}
            className={`px-3 py-1.5 rounded ${
              activeTab === "TRAINS"
                ? "bg-amber-400 text-slate-900 font-bold"
                : "text-slate-300"
            }`}
          >
            Trains ({trains.length})
          </button>
          <button
            onClick={() => setActiveTab("STATIONS")}
            className={`px-3 py-1.5 rounded ${
              activeTab === "STATIONS"
                ? "bg-amber-400 text-slate-900 font-bold"
                : "text-slate-300"
            }`}
          >
            Stations ({stations.length})
          </button>
          <button
            onClick={() => setActiveTab("BOOKINGS")}
            className={`px-3 py-1.5 rounded ${
              activeTab === "BOOKINGS"
                ? "bg-amber-400 text-slate-900 font-bold"
                : "text-slate-300"
            }`}
          >
            Bookings ({bookings.length})
          </button>
        </div>
      </div>

      {/* Active Tab View */}
      {activeTab === "TRAINS" && (
        <AdminTrainTab
          trains={trains}
          stations={stations}
          onDataChange={loadAdminData}
        />
      )}

      {activeTab === "STATIONS" && (
        <AdminStationTab stations={stations} onDataChange={loadAdminData} />
      )}

      {activeTab === "BOOKINGS" && <AdminBookingTab bookings={bookings} />}
    </div>
  );
}
