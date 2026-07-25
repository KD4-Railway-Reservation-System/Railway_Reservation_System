import React, { useState } from "react";
import { bookingApi, paymentApi, notificationApi } from "../api/apiService";
import PnrResultCard from "../components/PnrResultCard";

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

    try {
      const res = await bookingApi.getAllBookings();
      const match = (res.data || []).find(
        (b) => b.pnr.trim() === pnrQuery.trim(),
      );

      if (!match) {
        setError(`No active ticket found for PNR: ${pnrQuery}`);
      } else {
        setBooking(match);
        try {
          const payRes = await paymentApi.getPaymentByPnr(match.pnr);
          setPayment(payRes.data);
        } catch (payErr) {
          console.log("Payment record lookup error", payErr);
        }
      }
    } catch (err) {
      setError("Failed to fetch PNR status.");
    }
    setLoading(false);
  }

  async function handleCancelTicket() {
    if (!booking || !window.confirm(`Cancel PNR ${booking.pnr}?`)) return;

    setCancelling(true);
    setError(null);

    try {
      const res = await bookingApi.cancelBooking(booking.bookingId);
      setBooking(res.data);

      try {
        const payRes = await paymentApi.processRefund(booking.pnr);
        setPayment(payRes.data);
      } catch (e) {
        console.log("Refund process error", e);
      }

      try {
        await notificationApi.sendCancellationNotice({
          recipientEmail: "passenger@railway.com",
          subject: `Ticket Cancelled - PNR: ${booking.pnr}`,
          message: `Your booking (PNR: ${booking.pnr}) has been cancelled.`,
          pnr: booking.pnr,
        });
      } catch (e) {
        console.log("Notification error", e);
      }

      setSuccessMsg("Ticket cancelled successfully! Refund processed.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel ticket.");
    }
    setCancelling(false);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-slate-900 border border-slate-700 text-white p-6 rounded-lg text-center space-y-4 shadow">
        <h2 className="text-xl font-bold">Check PNR Status</h2>
        <p className="text-xs text-slate-400">
          Enter your 10-digit Passenger Name Record (PNR) number
        </p>

        <form
          onSubmit={handleSearchPNR}
          className="flex gap-2 max-w-md mx-auto"
        >
          <input
            type="text"
            required
            maxLength={10}
            value={pnrQuery}
            onChange={(e) => setPnrQuery(e.target.value.toUpperCase())}
            placeholder="e.g. PNR1234567"
            className="flex-1 bg-slate-800 border border-slate-600 rounded p-2 text-sm text-center font-mono uppercase text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 font-bold px-4 py-2 rounded text-white text-xs"
          >
            {loading ? "Searching..." : "Check PNR"}
          </button>
        </form>
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
