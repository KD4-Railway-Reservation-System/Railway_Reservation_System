import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Train, Calendar, User, CreditCard, Loader2, ArrowRight } from 'lucide-react';
import { bookingApi } from '../api/apiService';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import PaymentModal from '../components/PaymentModal';

export default function MyBookingsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBookingForPay, setSelectedBookingForPay] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/my-bookings');
      return;
    }
    fetchMyBookings();
  }, [isAuthenticated]);

  const fetchMyBookings = async () => {
    try {
      const res = await bookingApi.getUserBookings(user.userId || 1);
      setBookings(res.data || []);
    } catch (err) {
      setError('Failed to fetch your booking history.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">My Railway Tickets</h2>
            <p className="text-xs text-slate-400">Total Booked: <span className="text-indigo-400 font-semibold">{bookings.length}</span> tickets</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/trains')}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center space-x-1.5"
        >
          <span>Book New Ticket</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Booking List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-sm font-medium">Loading your reservation history...</p>
        </div>
      ) : error ? (
        <div className="glass-card p-6 rounded-xl border border-rose-500/20 text-rose-400 text-center text-sm">
          {error}
        </div>
      ) : bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((b) => (
            <div key={b.bookingId || b.id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 relative">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div>
                  <span className="text-xs text-slate-500 block uppercase">PNR Number</span>
                  <span className="text-lg font-bold font-mono text-indigo-400 tracking-wider">{b.pnr}</span>
                </div>
                <StatusBadge status={b.status} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-slate-500 block uppercase">Passenger</span>
                  <span className="font-semibold text-white">{b.passengerName}</span>
                  <span className="text-xs text-slate-400 block">{b.passengerAge} yrs | {b.passengerGender}</span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 block uppercase">Train ID</span>
                  <span className="font-semibold text-white">Train #{b.trainId}</span>
                  <span className="text-xs text-slate-400 block">Date: {b.journeyDate}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Class & Seat: </span>
                  <span className="text-indigo-300 font-semibold">{b.seatClass} (Seat #{b.seatNumber})</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400">Fare: </span>
                  <span className="text-emerald-400 font-bold text-sm">₹{b.fare}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 space-y-4">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Tickets Booked Yet</h3>
          <p className="text-sm text-slate-400">You haven't reserved any train tickets yet.</p>
          <button
            onClick={() => navigate('/trains')}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            Explore Trains & Book
          </button>
        </div>
      )}

      {selectedBookingForPay && (
        <PaymentModal
          booking={selectedBookingForPay}
          onClose={() => {
            setSelectedBookingForPay(null);
            fetchMyBookings();
          }}
          onSuccess={() => {
            fetchMyBookings();
          }}
        />
      )}

    </div>
  );
}
