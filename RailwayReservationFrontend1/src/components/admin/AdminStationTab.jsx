import React, { useState } from "react";
import { trainApi } from "../../api/apiService";

export default function AdminStationTab({ stations, onDataChange }) {
  const [stationCode, setStationCode] = useState("");
  const [stationName, setStationName] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");

  async function handleAddStation(e) {
    e.preventDefault();
    try {
      await trainApi.createStation({
        stationCode: stationCode.toUpperCase(),
        stationName,
        city,
        state: stateName,
      });
      setStationCode("");
      setStationName("");
      setCity("");
      setStateName("");
      onDataChange();
    } catch (err) {
      alert("Failed to add station");
    }
  }

  async function handleDeleteStation(id) {
    if (!window.confirm("Delete this station?")) return;
    try {
      await trainApi.deleteStation(id);
      onDataChange();
    } catch (err) {
      alert("Failed to delete station");
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-slate-900 border border-slate-700 text-white p-5 rounded-lg space-y-4">
        <h3 className="font-bold border-b border-slate-700 pb-2 text-sm text-amber-300">
          Add New Station
        </h3>
        <form onSubmit={handleAddStation} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Station Code *</label>
            <input
              type="text"
              required
              placeholder="NDLS"
              value={stationCode}
              onChange={(e) => setStationCode(e.target.value.toUpperCase())}
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white uppercase"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Station Name *</label>
            <input
              type="text"
              required
              placeholder="New Delhi"
              value={stationName}
              onChange={(e) => setStationName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">City *</label>
            <input
              type="text"
              required
              placeholder="New Delhi"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">State *</label>
            <input
              type="text"
              required
              placeholder="Delhi"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-400 hover:bg-amber-500 font-bold text-slate-900 py-2 rounded text-xs transition"
          >
            + Add Station
          </button>
        </form>
      </div>

      <div className="md:col-span-2 bg-slate-900 border border-slate-700 text-white p-5 rounded-lg space-y-4">
        <h3 className="font-bold border-b border-slate-700 pb-2 text-sm">
          Registered Stations
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto">
          {stations.map((st) => (
            <div
              key={st.id || st.stationId}
              className="bg-slate-800 p-3 rounded flex justify-between items-center text-xs"
            >
              <div>
                <h4 className="font-bold text-white">
                  {st.stationName}{" "}
                  <span className="text-indigo-400 font-mono">
                    ({st.stationCode})
                  </span>
                </h4>
                <p className="text-slate-400 mt-1">
                  {st.city}, {st.state}
                </p>
              </div>
              <button
                onClick={() => handleDeleteStation(st.id || st.stationId)}
                className="bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-500/30 px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
