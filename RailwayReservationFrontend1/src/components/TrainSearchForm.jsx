import React from "react";

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
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 space-y-6 text-white">
      {errorMsg && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded text-sm text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSearch} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          <div className="md:col-span-2 space-y-1">
            <label className="block text-xs font-semibold text-slate-400">
              From Station *
            </label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white"
            >
              {stations.map((s) => (
                <option key={s.id} value={s.id || s.stationId}>
                  {s.city} ({s.stationCode}) - {s.stationName}
                </option>
              ))}
            </select>
          </div>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={handleSwap}
              className="bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded text-xs text-white"
            >
              ⇄ Swap
            </button>
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="block text-xs font-semibold text-slate-400">
              To Station *
            </label>
            <select
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white"
            >
              {stations.map((s) => (
                <option key={s.id} value={s.id || s.stationId}>
                  {s.city} ({s.stationCode}) - {s.stationName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-400">
              Journey Date
            </label>
            <input
              type="date"
              value={journeyDate}
              // min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setJourneyDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-400">
              Class
            </label>
            <select
              value={seatClass}
              onChange={(e) => setSeatClass(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white"
            >
              <option value="ALL">All Classes</option>
              <option value="1A">AC First Class (1A)</option>
              <option value="2A">AC 2 Tier (2A)</option>
              <option value="3A">AC 3 Tier (3A)</option>
              <option value="SL">Sleeper (SL)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-400">
              Quota
            </label>
            <select
              value={quota}
              onChange={(e) => setQuota(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white"
            >
              <option value="GENERAL">General</option>
              <option value="TATKAL">Tatkal</option>
              <option value="LADIES">Ladies</option>
              <option value="SENIOR">Senior Citizen</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded font-bold text-white text-base shadow"
        >
          🔍 Search Trains
        </button>
      </form>
    </div>
  );
}
