import React from "react";
import { useNavigate } from "react-router-dom";
import { Train, Clock, ArrowRight, Check, AlertCircle } from "lucide-react";

export default function TrainCard({ train, stations }) {
  const navigate = useNavigate();

  const getSourceStationDisplay = () => {
    if (train.source && train.sourceCode) {
      return `${train.source} (${train.sourceCode})`;
    }
    if (train.source) return train.source;
    const st = stations.find(
      (s) => String(s.id || s.stationId) === String(train.sourceStationId),
    );
    return st
      ? `${st.stationName} (${st.stationCode})`
      : `Station #${train.sourceStationId}`;
  };

  const getDestStationDisplay = () => {
    if (train.destination && train.destinationCode) {
      return `${train.destination} (${train.destinationCode})`;
    }
    if (train.destination) return train.destination;
    const st = stations.find(
      (s) => String(s.id || s.stationId) === String(train.destinationStationId),
    );
    return st
      ? `${st.stationName} (${st.stationCode})`
      : `Station #${train.destinationStationId}`;
  };

  const isAvailable = (train.availableSeats ?? train.totalSeats ?? 100) > 0;
  const availCount =
    train.availableSeats ?? Math.floor((train.totalSeats || 300) * 0.85);

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden group border border-slate-800">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
            <Train className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
              {train.trainName}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              #{train.trainNumber}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isAvailable ? (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
              <Check className="w-3.5 h-3.5" />
              <span>{availCount} Seats Available</span>
            </span>
          ) : (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Sold Out</span>
            </span>
          )}
        </div>
      </div>

      {/* Schedule / Timings */}
      <div className="grid grid-cols-3 items-center py-6 my-2 text-center sm:text-left">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            From
          </p>
          <p className="text-base font-bold text-white mt-1">
            {getSourceStationDisplay()}
          </p>
          <p className="text-xs font-semibold text-indigo-400 flex items-center mt-1 sm:justify-start justify-center">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {train.departureTime || "06:00 AM"}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <span className="text-xs text-slate-500 font-medium mb-1">
            Superfast Express
          </span>
          <div className="w-full max-w-[120px] flex items-center justify-center space-x-2 text-slate-600">
            <div className="h-[2px] flex-1 bg-slate-800"></div>
            <ArrowRight className="w-4 h-4 text-indigo-500" />
            <div className="h-[2px] flex-1 bg-slate-800"></div>
          </div>
        </div>

        <div className="text-center sm:text-right">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            To
          </p>
          <p className="text-base font-bold text-white mt-1">
            {getDestStationDisplay()}
          </p>
          <p className="text-xs font-semibold text-indigo-400 flex items-center mt-1 sm:justify-end justify-center">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {train.arrivalTime || "02:30 PM"}
          </p>
        </div>
      </div>

      {/* Classes & Fare Footer */}
      <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          {["SL", "3AC", "2AC", "1AC"].map((cls) => (
            <span
              key={cls}
              className="text-xs font-medium px-2.5 py-1 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60"
            >
              {cls}
            </span>
          ))}
        </div>

        <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
          <div>
            <span className="text-xs text-slate-400 block">Starting Fare</span>
            <span className="text-xl font-bold text-white">
              ₹{train.fare || 1450}
            </span>
          </div>

          <button
            onClick={() => navigate(`/book/${train.id}`)}
            disabled={!isAvailable}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg ${
              isAvailable
                ? "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-indigo-500/25 hover:scale-105 active:scale-95"
                : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
            }`}
          >
            Book Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
