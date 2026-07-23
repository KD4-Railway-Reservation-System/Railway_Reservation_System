import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Train, User, Calendar, ShieldCheck, ArrowRight, Loader2, CreditCard } from 'lucide-react';
import { trainApi, bookingApi } from '../api/apiService';
import { useAuth } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';

export default function BookingPage() {
  const { trainId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [passengerName, setPassengerName] = useState(user?.fullName || '');
  const [passengerAge, setPassengerAge] = useState(25);
  const [passengerGender, setPassengerGender] = useState('MALE');
  const [seatClass, setSeatClass] = useState('3AC');
  const [journeyDate, setJourneyDate] = useState(new Date().toISOString().split('T')[0]);

  // Created Booking for Payment Modal
  const [createdBooking, setCreatedBooking] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/book/' + trainId);
      return;
    }
    fetchTrainDetails();
  }, [trainId, isAuthenticated]);

  const fetchTrainDetails = async () => {
    try {
      const res = await trainApi.getTrainById(trainId);
      setTrain(res.data);
    } catch (err) {
      setError('Failed to load train details. Please check train ID.');
    } finally {
      setLoading(false);
    }
  };

  const calculateFare = () => {
    const baseFare = train?.fare || 750;
    switch (seatClass) {
      case '1AC': return Math.round(baseFare * 2.5);
      case '2AC': return Math.round(baseFare * 1.8);
      case '3AC': return Math.round(baseFare * 1.3);
      default: return Math.round(baseFare); // SL
    }
  };

  const handleBookTicket = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const fare = calculateFare();
      const bookingData = {
        trainId: Number(trainId),
        sourceStationId: train?.sourceStationId || 1,
        destinationStationId: train?.destinationStationId || 2,
        passengerName,
        passengerAge: Number(passengerAge),
        passengerGender,
        seatClass,
        journeyDate,
        fare,
      };

      const userId = user?.userId || 1;
      const res = await bookingApi.bookTicket(userId, bookingData);
      setCreatedBooking(res.data);
    } catch (err) {
      console.error('Booking error', err);
      setError(err.response?.data?.message || 'Booking creation failed. Please verify inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-sm font-medium">Loading train reservation details...</p>
      </div>
    );
  }

  if (error && !train) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="glass-card p-8 rounded-2xl text-center border border-rose-500/20 text-rose-400 space-y-3">
          <p>{error}</p>
          <button onClick={() => navigate('/trains')} className="px-4 py-2 rounded-xl bg-slate-800 text-white text-sm">
            Back to Trains
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
          <Train className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{train?.trainName}</h2>
          <p className="text-xs text-slate-400">
            Train #{train?.trainNumber} | Route: <span className="text-indigo-400 font-semibold">{train?.source || 'Origin'} ➔ {train?.destination || 'Destination'}</span>
          </p>
        </div>
      </div>

      {/* Main Booking Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Form (2 cols) */}
        <div className="md:col-span-2 glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
            <User className="w-5 h-5 text-indigo-400" />
            <span>Passenger Reservation Details</span>
          </h3>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleBookTicket} className="space-y-4">
            
            {/* Passenger Name */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Full Passenger Name *
              </label>
              <input
                type="text"
                required
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Age & Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Age *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="110"
                  value={passengerAge}
                  onChange={(e) => setPassengerAge(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Gender *
                </label>
                <select
                  value={passengerGender}
                  onChange={(e) => setPassengerGender(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            {/* Seat Class Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Travel Seat Class *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['SL', '3AC', '2AC', '1AC'].map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setSeatClass(cls)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      seatClass === cls
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>

            {/* Journey Date */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Journey Date *
              </label>
              <input
                type="date"
                required
                value={journeyDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setJourneyDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2 mt-6"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Reserving Ticket...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Proceed to Payment Checkout (₹{calculateFare()})</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* Right Fare Summary Card */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6 h-fit">
          <h4 className="text-base font-bold text-white border-b border-slate-800 pb-3">Fare Breakdown</h4>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Base Ticket Fare</span>
              <span className="text-white font-medium">₹{train?.fare || 750}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Class Multiplier ({seatClass})</span>
              <span className="text-indigo-400 font-medium">
                {seatClass === '1AC' ? '2.5x' : seatClass === '2AC' ? '1.8x' : seatClass === '3AC' ? '1.3x' : '1.0x'}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Reservation Charge</span>
              <span className="text-emerald-400 font-medium">INCLUDED</span>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
              <span className="font-bold text-white text-base">Total Payable</span>
              <span className="text-2xl font-black text-indigo-400">₹{calculateFare()}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 leading-relaxed">
            ✨ Guaranteed seat allocation with instant PNR generation upon payment completion.
          </div>
        </div>

      </div>

      {/* Payment Checkout Modal */}
      {createdBooking && (
        <PaymentModal
          booking={createdBooking}
          onClose={() => {
            setCreatedBooking(null);
            navigate('/my-bookings');
          }}
          onSuccess={() => {
            navigate('/my-bookings');
          }}
        />
      )}

    </div>
  );
}
