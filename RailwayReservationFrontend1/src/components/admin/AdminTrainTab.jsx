import React, { useState } from "react";
import { trainApi } from "../../api/apiService";

export default function AdminTrainTab({ trains, stations, onDataChange }) {
  const [trainNumber, setTrainNumber] = useState("");
  const [trainName, setTrainName] = useState("");
  const [sourceId, setSourceId] = useState(stations[0]?.id || stations[0]?.stationId || "");
  const [destId, setDestId] = useState(stations[1]?.id || stations[1]?.stationId || "");
  const [availableSeats, setAvailableSeats] = useState(200);
  const [fare, setFare] = useState(750);

  async function handleAddTrain(e) {
    e.preventDefault();
    try {
      await trainApi.createTrain({
        trainNumber,
        trainName,
        sourceId,
        destId,
        availableSeats: Number(availableSeats),
        fare: Number(fare),
      });
      setTrainNumber("");
      setTrainName("");
      onDataChange();
    } catch (err) {
      alert("Failed to add train");
    }
  }

  async function handleDeleteTrain(id) {
    if (!window.confirm("Delete this train?")) return;
    try {
      await trainApi.deleteTrain(id);
      onDataChange();
    } catch (err) {
      alert("Failed to delete train");
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-slate-900 border border-slate-700 text-white p-5 rounded-lg space-y-4">
        <h3 className="font-bold border-b border-slate-700 pb-2 text-sm text-amber-300">
          Add New Train
        </h3>
        <form onSubmit={handleAddTrain} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Train Number *</label>
            <input
              type="text"
              required
              placeholder="12951"
              value={trainNumber}
              onChange={(e) => setTrainNumber(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Train Name *</label>
            <input
              type="text"
              required
              placeholder="Rajdhani Express"
              value={trainName}
              onChange={(e) => setTrainName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Source Station</label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white"
            >
              {stations.map((s) => (
                <option key={s.id || s.stationId} value={s.id || s.stationId}>
                  {s.stationName} ({s.stationCode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Destination Station</label>
            <select
              value={destId}
              onChange={(e) => setDestId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white"
            >
              {stations.map((s) => (
                <option key={s.id || s.stationId} value={s.id || s.stationId}>
                  {s.stationName} ({s.stationCode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Available Seats</label>
            <input
              type="number"
              required
              value={availableSeats}
              onChange={(e) => setAvailableSeats(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Fare (₹)</label>
            <input
              type="number"
              required
              value={fare}
              onChange={(e) => setFare(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-400 hover:bg-amber-500 font-bold text-slate-900 py-2 rounded text-xs transition"
          >
            + Add Train
          </button>
        </form>
      </div>

      <div className="md:col-span-2 bg-slate-900 border border-slate-700 text-white p-5 rounded-lg space-y-4">
        <h3 className="font-bold border-b border-slate-700 pb-2 text-sm">
          Active Trains
        </h3>
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {trains.map((train) => (
            <div
              key={train.id}
              className="bg-slate-800 p-3 rounded flex justify-between items-center text-xs"
            >
              <div>
                <h4 className="font-bold text-white text-sm">
                  {train.trainName}{" "}
                  <span className="text-amber-400 font-mono">
                    #{train.trainNumber}
                  </span>
                </h4>
                <p className="text-slate-400 mt-1">
                  Seats: {train.availableSeats} | Fare: ₹{train.fare}
                </p>
              </div>
              <button
                onClick={() => handleDeleteTrain(train.id)}
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
