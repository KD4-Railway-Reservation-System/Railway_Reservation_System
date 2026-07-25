import React, { useState } from "react";
import { paymentApi, notificationApi } from "../api/apiService";
import { useAuth } from "../context/AuthContext";

export default function PaymentModal({ booking, onClose, onSuccess }) {
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);

  async function handlePayment(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const paymentData = {
        pnr: booking.pnr,
        userId: booking.userId || user?.userId || 1,
        amount: booking.fare || 750,
        paymentMethod: paymentMethod,
      };

      const res = await paymentApi.processPayment(paymentData);
      setPaymentResult(res.data);

      try {
        await notificationApi.sendBookingConfirmation({
          recipientEmail: user?.email || "passenger@railway.com",
          subject: `Ticket Confirmed - PNR: ${booking.pnr}`,
          message: `Dear ${booking.passengerName}, your ticket (PNR: ${booking.pnr}) is confirmed. Fare: ₹${booking.fare}.`,
          pnr: booking.pnr,
          passengerName: booking.passengerName,
        });
      } catch (errNotif) {
        console.log("Notification call ignored", errNotif);
      }

      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed. Try again.");
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-lg p-6 max-w-md w-full relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white text-sm"
        >
          ✖
        </button>

        {!paymentResult ? (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Payment Checkout</h3>
            <p className="text-xs text-slate-400">PNR: {booking.pnr}</p>

            {error && (
              <div className="p-2 bg-red-900/50 border border-red-500 text-red-200 text-xs rounded">
                {error}
              </div>
            )}

            <div className="bg-slate-800 p-3 rounded text-xs space-y-1">
              <div className="flex justify-between">
                <span>Passenger:</span>
                <span className="font-semibold">{booking.passengerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Class / Seat:</span>
                <span>
                  {booking.seatClass} (Seat #{booking.seatNumber})
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-700 font-bold text-sm">
                <span>Amount:</span>
                <span className="text-indigo-400">₹{booking.fare}</span>
              </div>
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
              <label className="block text-xs font-semibold text-slate-400">
                Payment Option
              </label>

              <div className="grid grid-cols-3 gap-2 text-xs">
                {["UPI", "CARD", "NET_BANKING"].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`p-2 rounded border ${
                      paymentMethod === method
                        ? "bg-indigo-600 border-indigo-400 text-white font-bold"
                        : "bg-slate-800 border-slate-700 text-slate-400"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold py-2.5 rounded text-white text-sm"
              >
                {loading ? "Processing..." : `Pay ₹${booking.fare} Now`}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center space-y-4 py-2">
            <h3 className="text-xl font-bold text-green-400">
              Payment Successful!
            </h3>
            <p className="text-xs text-slate-300">
              Transaction ID:{" "}
              <span className="font-mono text-indigo-300">
                {paymentResult.transactionId}
              </span>
            </p>

            <div className="bg-slate-800 p-3 rounded text-xs space-y-1 text-left">
              <div className="flex justify-between">
                <span>PNR:</span>
                <span>{booking.pnr}</span>
              </div>
              <div className="flex justify-between">
                <span>Method:</span>
                <span>{paymentResult.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-green-400 font-bold">
                  {paymentResult.status}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded font-bold text-sm"
            >
              Done & View Ticket
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
