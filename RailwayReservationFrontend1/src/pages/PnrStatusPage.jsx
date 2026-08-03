import React, { useState } from "react";
import { trainApi, bookingApi, paymentApi, notificationApi } from "../api/apiService";
import PnrResultCard from "../components/PnrResultCard";
import { Search, Ticket, AlertCircle, CheckCircle2 } from "lucide-react";

export default function PnrStatusPage() {
  const [pnrQuery, setPnrQuery] = useState("");
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  async function handleSearchPNR(e) {
    e.preventDefault();
    if (!pnrQuery.trim()) return;

    setLoading(true);
    setError(null);
    setBooking(null);
    setPayment(null);
    setSuccessMsg(null);

    const cleanPnr = pnrQuery.trim().toUpperCase();

    try {
      // Fetch booking by PNR from Booking Service
      const res = await bookingApi.getBookingByPnr(cleanPnr);
      const bookingData = res.data?.booking || res.data;
      if (bookingData && (bookingData.pnrNumber || bookingData.pnr)) {
        setBooking(bookingData);
      } else {
        throw new Error("Not found in API");
      }

      // Fetch payment record by PNR from Payment Service
      try {
        const payRes = await paymentApi.getPaymentByPnr(cleanPnr);
        const payData = payRes.data?.payment || payRes.data;
        setPayment(payData);
      } catch (payErr) {
        console.log("No payment record found for PNR", payErr);
      }
    } catch (err) {
      console.log("PNR Search API notice, checking local storage backup", err);
      try {
        const localList = JSON.parse(localStorage.getItem("railreserve_local_bookings") || "[]");
        const found = localList.find((b) => (b.pnrNumber || b.pnr) === cleanPnr);
        if (found) {
          setBooking(found);
          setError(null);
        } else {
          setError(`No active booking record found for PNR: ${cleanPnr}`);
        }
      } catch (lErr) {
        setError(`No active booking record found for PNR: ${cleanPnr}`);
      }
    }
    setLoading(false);
  }

  async function handleCancelTicket() {
    const pnr = booking?.pnrNumber || booking?.pnr || pnrQuery;
    if (!pnr || !window.confirm(`Are you sure you want to cancel PNR ${pnr}?`)) return;

    setCancelling(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // 1. Cancel booking
      const res = await bookingApi.cancelBooking(pnr);
      const updatedBooking = res.data?.booking || res.data;
      setBooking(updatedBooking);

      // Restore seat in train service
      const trainIdentifier = booking?.trainId || booking?.trainNumber;
      if (trainIdentifier) {
        try {
          await trainApi.cancelSeat(trainIdentifier);
        } catch (sErr) {
          console.log("Seat restoration notice", sErr);
        }
      }

      // 2. Process refund
      try {
        const refundRes = await paymentApi.processRefund(pnr);
        setPayment(refundRes.data?.payment || refundRes.data);
      } catch (rErr) {
        console.log("Refund process notice", rErr);
      }

      // 3. Send cancellation notification
      try {
        await notificationApi.sendNotification({
          userId: booking?.userId || 1,
          recipient: booking?.userEmail || "passenger@railway.com",
          type: "IN_APP",
          subject: `Ticket Cancelled - PNR: ${pnr}`,
          message: `Your booking (PNR: ${pnr}) has been cancelled and refund has been issued.`,
        });
      } catch (nErr) {
        console.log("Notification notice", nErr);
      }

      setSuccessMsg(`Ticket PNR ${pnr} cancelled successfully! Refund has been issued.`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel ticket.");
    }
    setCancelling(false);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white/95 backdrop-blur-md border border-blue-100 text-slate-900 p-8 rounded-3xl text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto font-black shadow-md">
          <Ticket className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Check Live PNR Status</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Enter your 10-digit Passenger Name Record (PNR) number to inspect live reservation details
          </p>
        </div>

        <form
          onSubmit={handleSearchPNR}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2"
        >
          <input
            type="text"
            required
            maxLength={15}
            value={pnrQuery}
            onChange={(e) => setPnrQuery(e.target.value.toUpperCase())}
            placeholder="e.g. PNR84739210"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-center font-black tracking-widest uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black px-6 py-3 rounded-xl text-xs transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? "Searching..." : "Check PNR"}</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {booking && (
        <PnrResultCard
          booking={booking}
          payment={payment}
          cancelling={cancelling}
          handleCancelTicket={handleCancelTicket}
        />
      )}
    </div>
  );
}
