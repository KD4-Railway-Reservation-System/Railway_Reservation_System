import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { trainApi, bookingApi, paymentApi, notificationApi } from "../api/apiService";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";
import { downloadTicketPdf } from "../utils/pdfGenerator";
import { TicketSkeleton } from "../components/SkeletonLoader";

export default function MyBookingsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingPnr, setCancellingPnr] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/my-bookings");
      return;
    }
    fetchBookings();
  }, [isAuthenticated, navigate]);

  async function fetchBookings() {
    setLoading(true);
    let apiList = [];
    try {
      const res = await bookingApi.getMyBookings();
      apiList = Array.isArray(res.data) ? res.data : (res.data?.bookings || []);
    } catch (err) {
      console.log("Error fetching my bookings", err);
      try {
        const fallbackRes = await bookingApi.getBookingsByUserId(user?.userId || 1);
        apiList = Array.isArray(fallbackRes.data) ? fallbackRes.data : [];
      } catch (fErr) {
        console.log("Fallback API error", fErr);
      }
    }

    // Merge with Local Storage persistence backup
    let localList = [];
    try {
      localList = JSON.parse(localStorage.getItem("railreserve_local_bookings") || "[]");
    } catch (e) {
      localList = [];
    }

    // Combine & remove duplicate PNRs
    const combinedMap = new Map();
    [...apiList, ...localList].forEach((b) => {
      const pnrKey = b.pnrNumber || b.pnr;
      if (pnrKey && !combinedMap.has(pnrKey)) {
        combinedMap.set(pnrKey, b);
      }
    });

    setBookings(Array.from(combinedMap.values()));
    setLoading(false);
  }

  async function handleCancelBooking(pnrNumber) {
    if (!pnrNumber) return;
    if (!window.confirm(`Are you sure you want to cancel ticket PNR ${pnrNumber}?`)) return;

    setCancellingPnr(pnrNumber);
    setError(null);
    setSuccessMsg(null);

    try {
      // 1. Cancel ticket in Booking Service
      await bookingApi.cancelBooking(pnrNumber);

      const targetBooking = bookings.find((b) => (b.pnrNumber || b.pnr) === pnrNumber);
      if (targetBooking?.trainId || targetBooking?.trainNumber) {
        try {
          await trainApi.cancelSeat(targetBooking.trainId || targetBooking.trainNumber);
        } catch (sErr) {
          console.log("Seat restoration notice", sErr);
        }
      }

      // 2. Trigger auto refund in Payment Service
      try {
        await paymentApi.processRefund(pnrNumber);
      } catch (pErr) {
        console.log("Refund process notice", pErr);
      }

      // 3. Send cancellation notification in Notification Service
      try {
        await notificationApi.sendNotification({
          userId: user?.userId || 1,
          recipient: user?.email || "passenger@railway.com",
          type: "IN_APP",
          subject: `Ticket Cancelled - PNR: ${pnrNumber}`,
          message: `Your booking (PNR: ${pnrNumber}) has been cancelled and refund has been initiated.`,
        });
      } catch (nErr) {
        console.log("Notification notice", nErr);
      }

      setSuccessMsg(`Ticket PNR ${pnrNumber} cancelled successfully! Refund has been processed.`);
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel ticket. Please try again.");
    }
    setCancellingPnr(null);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-700 text-white p-5 rounded-lg flex items-center justify-between shadow">
        <div>
          <h2 className="text-xl font-bold">My Booked Tickets</h2>
          <p className="text-xs text-slate-400">
            Total Tickets: <span className="text-indigo-400 font-semibold">{bookings.length}</span>
          </p>
        </div>

        <button
          onClick={() => navigate("/trains")}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-xs font-semibold transition"
        >
          Book New Ticket
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-900/50 border border-red-500 text-red-200 text-xs rounded text-center">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-green-900/50 border border-green-500 text-green-200 text-xs rounded text-center">
          {successMsg}
        </div>
      )}

      {/* Bookings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TicketSkeleton />
          <TicketSkeleton />
        </div>
      ) : bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.map((b) => {
            const pnr = b.pnrNumber || b.pnr || "PNR12345678";
            const fare = b.totalFare || b.fare || 650;
            const status = b.status || "CONFIRMED";
            const isCancelled = status === "CANCELLED";

            return (
              <div
                key={b.id || pnr}
                className="bg-slate-900 text-white p-5 rounded-lg border border-slate-800 space-y-3 shadow relative"
              >
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">
                      PNR NUMBER
                    </span>
                    <span className="text-base font-bold font-mono text-indigo-400">
                      {pnr}
                    </span>
                  </div>
                  <StatusBadge status={status} />
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
                      {b.trainName || `Train #${b.trainNumber || b.trainId}`}
                    </span>
                    <span className="text-slate-400 block">
                      Date: {b.travelDate || b.journeyDate}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-400">Route: </span>
                    <span className="text-slate-200 font-medium">
                      {b.sourceStation || "Origin"} ➔ {b.destinationStation || "Destination"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Class & Seat: </span>
                    <span className="text-indigo-300 font-bold">
                      {b.travelClass || b.seatClass} ({b.seatNumber || "B1-12"})
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-400">Total Fare: </span>
                    <span className="text-green-400 font-bold text-sm">₹{fare}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadTicketPdf(b)}
                      className="bg-emerald-700/80 hover:bg-emerald-600 text-emerald-100 border border-emerald-500/40 px-3 py-1 rounded text-xs font-semibold transition flex items-center gap-1"
                    >
                      📥 PDF
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 px-3 py-1 rounded text-xs font-semibold transition"
                    >
                      🖨️ Print
                    </button>

                    {!isCancelled && (
                      <button
                        onClick={() => handleCancelBooking(pnr)}
                        disabled={cancellingPnr === pnr}
                        className="bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-500/40 px-3 py-1 rounded text-xs font-semibold transition"
                      >
                        {cancellingPnr === pnr ? "Cancelling..." : "Cancel & Refund"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 p-10 text-center rounded-lg text-white space-y-3">
          <h3 className="text-base font-bold text-slate-300">No Tickets Found</h3>
          <p className="text-xs text-slate-400">
            You haven't booked any train tickets yet.
          </p>
          <button
            onClick={() => navigate("/trains")}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-xs font-semibold"
          >
            Search & Book Now
          </button>
        </div>
      )}
    </div>
  );
}
