import React from "react";
import { Search, ArrowRightLeft, Calendar, Layers, ShieldCheck, MapPin } from "lucide-react";

export default function TrainSearchForm({
  stations,
  sourceId,
  setSourceId,
  destinationId,
  setDestinationId,
  journeyDate,
  setJourneyDate,
  seatClass,
  setSeatClass,
  quota,
  setQuota,
  errorMsg,
  handleSwap,
  handleSearch,
}) {
  return (
    <div className="bg-white/95 backdrop-blur-md border border-blue-100 rounded-3xl p-6 sm:p-8 space-y-6 text-slate-900 shadow-2xl">
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs font-bold text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSearch} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* From Station */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>From Station *</span>
            </label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
            >
              <option value="">Select Origin Station</option>
              {stations.map((s) => (
                <option key={s.id || s.stationCode} value={s.stationName || s.city}>
                  {s.city} ({s.stationCode}) - {s.stationName}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="text-center pt-3 md:pt-6">
            <button
              type="button"
              onClick={handleSwap}
              className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center mx-auto shadow-sm"
              title="Swap Origin and Destination"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* To Station */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>To Station *</span>
            </label>
            <select
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
            >
              <option value="">Select Destination Station</option>
              {stations.map((s) => (
                <option key={s.id || s.stationCode} value={s.stationName || s.city}>
                  {s.city} ({s.stationCode}) - {s.stationName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date, Class, Quota */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Journey Date</span>
            </label>
            <input
              type="date"
              value={journeyDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setJourneyDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Travel Class</span>
            </label>
            <select
              value={seatClass}
              onChange={(e) => setSeatClass(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
            >
              <option value="ALL">All Classes</option>
              <option value="1A">AC First Class (1A)</option>
              <option value="2A">AC 2 Tier (2A)</option>
              <option value="3A">AC 3 Tier (3A)</option>
              <option value="SL">Sleeper (SL)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Quota</span>
            </label>
            <select
              value={quota}
              onChange={(e) => setQuota(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
            >
              <option value="GENERAL">General Quota</option>
              <option value="TATKAL">Tatkal Quota</option>
              <option value="LADIES">Ladies Quota</option>
              <option value="SENIOR">Senior Citizen</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black py-4 rounded-xl text-base shadow-xl shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer"
        >
          <Search className="w-5 h-5" />
          <span>Search Available Trains</span>
        </button>
      </form>
    </div>
  );
}
