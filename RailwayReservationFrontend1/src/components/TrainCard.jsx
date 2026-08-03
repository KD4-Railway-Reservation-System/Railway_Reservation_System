import React from "react";
import { useNavigate } from "react-router-dom";
import { Train, Clock, ArrowRight, Check, AlertCircle } from "lucide-react";

export default function TrainCard({ train }) {
  const navigate = useNavigate();

  const sourceDisplay = train.sourceStation || train.source || "Source Station";
  const destDisplay = train.destinationStation || train.destination || "Destination Station";
  
  const isAvailable = (train.availableSeats ?? 100) > 0;
  const availCount = train.availableSeats ?? 120;
  const startingFare = train.fareSleeper && train.fareSleeper > 0 
    ? train.fareSleeper 
    : (train.fareAC3 || train.fare || 650);

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden group border border-blue-100 text-slate-900 mb-4 shadow-xl hover:shadow-2xl hover:border-blue-300 transition-all">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
            <Train className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors">
              {train.trainName}
            </h3>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-mono">
              Train #{train.trainNumber}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isAvailable ? (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
              <Check className="w-3.5 h-3.5" />
              <span>{availCount} Seats Available</span>
            </span>
          ) : (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Sold Out</span>
            </span>
          )}
        </div>
      </div>

      {/* Schedule / Timings */}
      <div className="grid grid-cols-3 items-center py-5 my-1 text-center sm:text-left">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            From
          </p>
          <p className="text-base font-black text-slate-900 mt-1">
            {sourceDisplay}
          </p>
          <p className="text-xs font-bold text-blue-700 flex items-center mt-1 sm:justify-start justify-center">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {train.departureTime || "06:00"}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <span className="text-xs text-slate-500 font-bold mb-1">
            {train.travelDuration || "Express"}
          </span>
          <div className="w-full max-w-[120px] flex items-center justify-center space-x-2 text-slate-400">
            <div className="h-[2px] flex-1 bg-slate-200"></div>
            <ArrowRight className="w-4 h-4 text-blue-600" />
            <div className="h-[2px] flex-1 bg-slate-200"></div>
          </div>
          <span className="text-[10px] text-slate-500 font-semibold mt-1">
            {train.runningDays || "Daily"}
          </span>
        </div>

        <div className="text-center sm:text-right">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            To
          </p>
          <p className="text-base font-black text-slate-900 mt-1">
            {destDisplay}
          </p>
          <p className="text-xs font-bold text-blue-700 flex items-center mt-1 sm:justify-end justify-center">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {train.arrivalTime || "14:00"}
          </p>
        </div>
      </div>

      {/* Classes & Fare Footer */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          {["SLEEPER", "3AC", "2AC", "1AC"].map((cls) => (
            <span
              key={cls}
              className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200"
            >
              {cls}
            </span>
          ))}
        </div>

        <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Starting Fare</span>
            <span className="text-xl font-black text-blue-700">
              ₹{startingFare}
            </span>
          </div>

          <button
            onClick={() => navigate(`/book/${train.id}`)}
            disabled={!isAvailable}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md ${
              isAvailable
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white cursor-pointer shadow-blue-500/20 transform hover:-translate-y-0.5"
                : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
            }`}
          >
            Book Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
