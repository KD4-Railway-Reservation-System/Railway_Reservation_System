import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { bookingApi } from "../api/apiService";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";

export default function MyBookingsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/my-bookings");
      return;
    }

    async function fetchBookings() {
      try {
        const res = await bookingApi.getUserBookings(user.userId || 1);
        setBookings(res.data || []);
      } catch (err) {
        setError("Failed to fetch booking history.");
      }
      setLoading(false);
    }
    fetchBookings();
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-700 text-white p-5 rounded-lg flex items-center justify-between shadow">
        <div>
          <h2 className="text-xl font-bold">My Booked Tickets</h2>
          <p className="text-xs text-slate-400">
            Total Bookings: {bookings.length}
          </p>
        </div>

        <button
          onClick={() => navigate("/trains")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-xs font-semibold"
        >
          Book New Ticket
        </button>
      </div>

      {/* Bookings Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          Loading your tickets...
        </div>
      ) : error ? (
        <div className="p-4 bg-red-900/50 border border-red-500 text-red-200 text-sm rounded text-center">
          {error}
        </div>
      ) : bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.map((b) => (
            <div
              key={b.bookingId || b.id}
              className="bg-slate-800 text-white p-5 rounded-lg border border-slate-700 space-y-3 shadow"
            >
              <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">
                    PNR
                  </span>
                  <span className="text-base font-bold font-mono text-indigo-300">
                    {b.pnr}
                  </span>
                </div>
                <StatusBadge status={b.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block">Passenger</span>
                  <span className="font-semibold text-white">
                    {b.passengerName}
                  </span>
                  <span className="text-slate-400 block">
                    {b.passengerAge} yrs | {b.passengerGender}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block">Train</span>
                  <span className="font-semibold text-white">
                    Train #{b.trainId}
                  </span>
                  <span className="text-slate-400 block">
                    Date: {b.journeyDate}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-2 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-400">Class & Seat: </span>
                  <span className="text-indigo-300 font-semibold">
                    {b.seatClass} (Seat #{b.seatNumber})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Fare: </span>
                  <span className="text-green-400 font-bold">₹{b.fare}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 p-10 text-center rounded-lg text-white space-y-3">
          <h3 className="text-base font-bold">No Bookings Found</h3>
          <p className="text-xs text-slate-400">
            You haven't booked any train tickets yet.
          </p>
          <button
            onClick={() => navigate("/trains")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-xs font-semibold"
          >
            Search & Book Now
          </button>
        </div>
      )}
    </div>
  );
}
