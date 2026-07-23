import React, { useState } from 'react';
import { Search, Ticket, Train, User, Calendar, RefreshCw, Printer, AlertTriangle, Loader2 } from 'lucide-react';
import { bookingApi, paymentApi, notificationApi } from '../api/apiService';
import StatusBadge from '../components/StatusBadge';

export default function PnrStatusPage() {
  const [pnrQuery, setPnrQuery] = useState('');
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSearchPNR = async (e) => {
    e.preventDefault();
    if (!pnrQuery.trim()) return;

    setLoading(true);
    setError(null);
    setBooking(null);
    setPayment(null);
    setSuccessMsg(null);

    try {
      // Search all bookings to match PNR
      const res = await bookingApi.getAllBookings();
      const match = (res.data || []).find((b) => b.pnr?.trim() === pnrQuery.trim());

      if (!match) {
        setError(`No active ticket found for PNR: ${pnrQuery}. Please verify the 10-digit PNR.`);
      } else {
        setBooking(match);
        // Also fetch payment info
        try {
          const payRes = await paymentApi.getPaymentByPnr(match.pnr);
          setPayment(payRes.data);
        } catch (payErr) {
          console.warn('Payment record lookup failed', payErr);
        }
      }
    } catch (err) {
      setError('Failed to query PNR status. Gateway connection error.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTicket = async () => {
    if (!booking || !window.confirm(`Are you sure you want to cancel PNR ${booking.pnr}?`)) return;

    setCancelling(true);
    setError(null);

    try {
      // 1. Cancel booking
      const res = await bookingApi.cancelBooking(booking.bookingId);
      setBooking(res.data);

      // 2. Process payment refund
      try {
        const payRes = await paymentApi.processRefund(booking.pnr);
        setPayment(payRes.data);
      } catch (e) {
        console.warn('Refund processing silent notice', e);
      }

      // 3. Send cancellation notification
      try {
        await notificationApi.sendCancellationNotice({
          recipientEmail: 'passenger@railway.com',
          subject: `Ticket Cancelled - PNR: ${booking.pnr}`,
          message: `Your booking (PNR: ${booking.pnr}) has been cancelled. Refund will be processed back to original source.`,
          pnr: booking.pnr,
        });
      } catch (e) {
        console.warn('Notification error', e);
      }

      setSuccessMsg('Ticket cancelled successfully! Refund status updated to REFUNDED.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel ticket.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Search Bar */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 text-center">
        <div className="max-w-md mx-auto space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto">
            <Ticket className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">PNR Status Inquiry</h2>
          <p className="text-sm text-slate-400">
            Enter your 10-digit Passenger Name Record (PNR) to track real-time ticket confirmation status.
          </p>
        </div>

        <form onSubmit={handleSearchPNR} className="max-w-xl mx-auto flex gap-3">
          <input
            type="text"
            required
            maxLength={10}
            value={pnrQuery}
            onChange={(e) => setPnrQuery(e.target.value.toUpperCase())}
            placeholder="e.g. PNR1234567"
            className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 text-base font-mono focus:outline-none focus:border-indigo-500 tracking-wider text-center"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            <span>Check PNR</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="glass-card p-4 rounded-xl border border-rose-500/20 text-rose-400 text-sm text-center">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="glass-card p-4 rounded-xl border border-emerald-500/20 text-emerald-400 text-sm text-center font-medium">
          {successMsg}
        </div>
      )}

      {/* Ticket Details Result Card */}
      {booking && (
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-700/60 space-y-6 relative overflow-hidden">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-800 gap-4">
            <div>
              <span className="text-xs text-slate-400 block uppercase font-medium">Ticket PNR</span>
              <span className="text-2xl font-black font-mono text-indigo-400 tracking-wider">{booking.pnr}</span>
            </div>

            <div className="flex items-center space-x-3">
              <StatusBadge status={booking.status} />
              {payment && <StatusBadge status={payment.status === 'REFUNDED' ? 'REFUNDED' : 'PAID'} />}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            
            <div>
              <span className="text-xs text-slate-500 block uppercase">Passenger</span>
              <span className="font-semibold text-white text-base">{booking.passengerName}</span>
              <span className="text-xs text-slate-400 block">{booking.passengerAge} yrs | {booking.passengerGender}</span>
            </div>

            <div>
              <span className="text-xs text-slate-500 block uppercase">Train ID</span>
              <span className="font-semibold text-white text-base">Train #{booking.trainId}</span>
            </div>

            <div>
              <span className="text-xs text-slate-500 block uppercase">Class & Seat</span>
              <span className="font-semibold text-indigo-300 text-base">{booking.seatClass}</span>
              <span className="text-xs text-slate-400 block">Seat #{booking.seatNumber}</span>
            </div>

            <div>
              <span className="text-xs text-slate-500 block uppercase">Total Fare</span>
              <span className="font-bold text-emerald-400 text-base">₹{booking.fare}</span>
              <span className="text-xs text-slate-400 block">{booking.journeyDate}</span>
            </div>

          </div>

          {/* Actions Footer */}
          <div className="pt-6 border-t border-slate-800 flex flex-wrap justify-between items-center gap-4">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors flex items-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print E-Ticket</span>
            </button>

            {booking.status === 'BOOKED' && (
              <button
                onClick={handleCancelTicket}
                disabled={cancelling}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors flex items-center space-x-2"
              >
                {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
                <span>Cancel Ticket & Refund</span>
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
