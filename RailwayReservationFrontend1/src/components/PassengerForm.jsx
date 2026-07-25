import React from "react";

export default function PassengerForm({
  passengerName,
  setPassengerName,
  passengerAge,
  setPassengerAge,
  passengerGender,
  setPassengerGender,
  seatClass,
  setSeatClass,
  journeyDate,
  setJourneyDate,
  submitting,
  calculateFare,
  handleBookTicket,
  error,
}) {
  return (
    <div className="md:col-span-2 bg-slate-900 text-white p-6 rounded-lg border border-slate-700 space-y-4">
      <h3 className="text-base font-bold border-b border-slate-700 pb-2">
        Passenger Information
      </h3>

      {error && (
        <div className="p-3 bg-red-900/50 border border-red-500 text-red-200 text-xs rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleBookTicket} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={passengerName}
            onChange={(e) => setPassengerName(e.target.value)}
            placeholder="e.g. Rahul Sharma"
            className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Age *
            </label>
            <input
              type="number"
              required
              min="1"
              max="110"
              value={passengerAge}
              onChange={(e) => setPassengerAge(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Gender *
            </label>
            <select
              value={passengerGender}
              onChange={(e) => setPassengerGender(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Travel Class *
          </label>
          <div className="grid grid-cols-4 gap-2">
            {["SL", "3AC", "2AC", "1AC"].map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => setSeatClass(cls)}
                className={`py-2 rounded text-xs font-bold border ${
                  seatClass === cls
                    ? "bg-indigo-600 border-indigo-400 text-white"
                    : "bg-slate-800 border-slate-700 text-slate-400"
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Journey Date *
          </label>
          <input
            type="date"
            required
            value={journeyDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setJourneyDate(e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded text-sm transition mt-4"
        >
          {submitting
            ? "Booking Ticket..."
            : `Proceed to Payment (₹${calculateFare()})`}
        </button>
      </form>
    </div>
  );
}
