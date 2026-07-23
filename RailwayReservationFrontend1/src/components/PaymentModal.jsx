import React, { useState } from 'react';
import { CreditCard, Smartphone, Building2, ShieldCheck, CheckCircle2, Loader2, X } from 'lucide-react';
import { paymentApi, notificationApi } from '../api/apiService';
import { useAuth } from '../context/AuthContext';

export default function PaymentModal({ booking, onClose, onSuccess }) {
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Process payment via payment-service
      const paymentData = {
        pnr: booking.pnr,
        userId: booking.userId || user?.userId || 1,
        amount: booking.fare || 750,
        paymentMethod: paymentMethod,
      };

      const res = await paymentApi.processPayment(paymentData);
      setPaymentResult(res.data);

      // 2. Trigger notification confirmation via notification-service
      try {
        await notificationApi.sendBookingConfirmation({
          recipientEmail: user?.email || 'passenger@railway.com',
          subject: `Ticket Confirmed - PNR: ${booking.pnr}`,
          message: `Dear ${booking.passengerName}, your ticket (PNR: ${booking.pnr}) has been successfully confirmed. Fare: ₹${booking.fare}.`,
          pnr: booking.pnr,
          passengerName: booking.passengerName,
        });
      } catch (notifErr) {
        console.warn('Notification service call failed silently', notifErr);
      }

      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6 relative border border-slate-700/60 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {!paymentResult ? (
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Payment Checkout</h3>
                <p className="text-xs text-slate-400">PNR: <span className="text-indigo-400 font-semibold">{booking.pnr}</span></p>
              </div>
            </div>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                {error}
              </div>
            )}

            {/* Summary */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 mb-6 space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Passenger</span>
                <span className="text-white font-medium">{booking.passengerName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Class / Seat</span>
                <span className="text-white font-medium">{booking.seatClass} (Seat #{booking.seatNumber})</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
                <span className="font-semibold text-white">Total Amount</span>
                <span className="text-lg font-bold text-indigo-400">₹{booking.fare}</span>
              </div>
            </div>

            {/* Select Method */}
            <form onSubmit={handlePayment} className="space-y-4">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Select Payment Option
              </label>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                    paymentMethod === 'UPI'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  <span className="text-xs font-medium">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                    paymentMethod === 'CARD'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs font-medium">Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('NET_BANKING')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                    paymentMethod === 'NET_BANKING'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span className="text-xs font-medium">Banking</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <span>Pay ₹{booking.fare} Now</span>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Payment Success State */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-bold text-white">Payment Successful!</h3>
            <p className="text-sm text-slate-300">
              Transaction ID: <span className="font-mono text-indigo-400">{paymentResult.transactionId}</span>
            </p>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between"><span className="text-slate-400">PNR:</span><span className="text-white font-mono">{booking.pnr}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Payment Method:</span><span className="text-white">{paymentResult.paymentMethod}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Status:</span><span className="text-emerald-400 font-bold">{paymentResult.status}</span></div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
            >
              Done & View Ticket
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
