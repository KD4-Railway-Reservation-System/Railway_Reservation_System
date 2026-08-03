import React from "react";

export default function SearchFilterHeader({
  trainCount,
  selectedSource,
  setSelectedSource,
  selectedDest,
  setSelectedDest,
  stations,
  handleSwap,
  handleReset,
}) {
  return (
    <div className="bg-slate-900 border border-slate-700 text-white p-5 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 shadow">
      <div>
        <h2 className="text-xl font-bold">Available Express Trains</h2>
        <p className="text-xs text-slate-400">
          Found{" "}
          <span className="text-indigo-400 font-semibold">{trainCount}</span>{" "}
          matching routes
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          className="bg-slate-800 border border-slate-600 rounded p-2 text-white text-xs"
        >
          <option value="">All Source Stations</option>
          {stations.map((s) => (
            <option key={s.id || s.stationCode} value={s.stationName || s.city}>
              {s.city} ({s.stationCode}) - {s.stationName}
            </option>
          ))}
        </select>

        <button
          onClick={handleSwap}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-2 rounded text-xs"
        >
          ⇄ Swap
        </button>

        <select
          value={selectedDest}
          onChange={(e) => setSelectedDest(e.target.value)}
          className="bg-slate-800 border border-slate-600 rounded p-2 text-white text-xs"
        >
          <option value="">All Destination Stations</option>
          {stations.map((s) => (
            <option key={s.id || s.stationCode} value={s.stationName || s.city}>
              {s.city} ({s.stationCode}) - {s.stationName}
            </option>
          ))}
        </select>

        {(selectedSource || selectedDest) && (
          <button
            onClick={handleReset}
            className="bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-500/30 px-3 py-2 rounded text-xs"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
