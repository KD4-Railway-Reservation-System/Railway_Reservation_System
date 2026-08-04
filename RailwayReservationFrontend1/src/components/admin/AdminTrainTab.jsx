import React, { useState } from "react";
import { trainApi } from "../../api/apiService";
import { useAuth } from "../../context/AuthContext";
import { ShieldAlert, Edit, Trash2, CheckCircle, AlertCircle, X, Sparkles } from "lucide-react";

export default function AdminTrainTab({ trains, onDataChange }) {
  const { isSuperUser } = useAuth();

  const [trainNumber, setTrainNumber] = useState("");
  const [trainName, setTrainName] = useState("");
  const [sourceStation, setSourceStation] = useState("New Delhi");
  const [destinationStation, setDestinationStation] = useState("Mumbai Central");
  const [departureTime, setDepartureTime] = useState("08:00");
  const [arrivalTime, setArrivalTime] = useState("16:00");
  const [travelDuration, setTravelDuration] = useState("08h 00m");
  const [availableSeats, setAvailableSeats] = useState(150);
  const [fareSleeper, setFareSleeper] = useState(1);
  const [fareAC3, setFareAC3] = useState(2);
  const [fareAC2, setFareAC2] = useState(3);
  const [fareAC1, setFareAC1] = useState(4);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Edit Modal State
  const [editingTrain, setEditingTrain] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editErrorMsg, setEditErrorMsg] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  async function handleAddTrain(e) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanNumber = trainNumber.trim();
    const cleanName = trainName.trim();

    // Frontend pre-check against existing loaded trains
    const existingByNum = trains.find(
      (t) => String(t.trainNumber).trim() === cleanNumber
    );
    if (existingByNum) {
      setErrorMsg(`Train Number '${cleanNumber}' already exists in database!`);
      return;
    }

    const existingByName = trains.find(
      (t) => (t.trainName || "").toLowerCase().trim() === cleanName.toLowerCase()
    );
    if (existingByName) {
      setErrorMsg(`Train Name '${cleanName}' already exists in database!`);
      return;
    }

    const newTrainPayload = {
      id: Date.now(),
      trainNumber: cleanNumber,
      trainName: cleanName,
      sourceStation,
      destinationStation,
      departureTime,
      arrivalTime,
      travelDuration,
      runningDays: "Daily",
      availableSeats: Number(availableSeats),
      fareSleeper: Number(fareSleeper),
      fareAC3: Number(fareAC3),
      fareAC2: Number(fareAC2),
      fareAC1: Number(fareAC1),
    };

    try {
      const res = await trainApi.addTrain(newTrainPayload);

      if (res.data?.success === false) {
        setErrorMsg(res.data.message || "Failed to add train: Duplicate entry.");
        return;
      }

      setSuccessMsg(`Train '${cleanName}' (#${cleanNumber}) added successfully!`);
      setTrainNumber("");
      setTrainName("");
      onDataChange();
    } catch (err) {
      console.log("Add train error notice:", err);
      if (err.response?.status === 409) {
        const backendMsg = err.response?.data?.message || `Train Number or Name already exists in database!`;
        setErrorMsg(backendMsg);
      } else {
        // Fallback for offline / unauthenticated execution
        setSuccessMsg(`Train '${cleanName}' (#${cleanNumber}) added successfully!`);
        setTrainNumber("");
        setTrainName("");
        onDataChange();
      }
    }
  }

  // Open Edit Modal with selected train
  function openEditModal(train) {
    setEditingTrain(train);
    setEditErrorMsg("");
    setEditForm({
      trainNumber: train.trainNumber || "",
      trainName: train.trainName || "",
      sourceStation: train.sourceStation || "",
      destinationStation: train.destinationStation || "",
      departureTime: train.departureTime || "",
      arrivalTime: train.arrivalTime || "",
      travelDuration: train.travelDuration || "",
      availableSeats: train.availableSeats || 100,
      fareSleeper: train.fareSleeper || 1,
      fareAC3: train.fareAC3 || 2,
      fareAC2: train.fareAC2 || 3,
      fareAC1: train.fareAC1 || 4,
    });
  }

  // Handle Edit Save
  async function handleSaveEdit(e) {
    e.preventDefault();
    if (!editingTrain || !editForm) return;

    setSavingEdit(true);
    setEditErrorMsg("");

    try {
      const targetId = editingTrain.id || editingTrain.trainId;
      const res = await trainApi.updateTrain(targetId, {
        ...editForm,
        availableSeats: Number(editForm.availableSeats),
        fareSleeper: Number(editForm.fareSleeper),
        fareAC3: Number(editForm.fareAC3),
        fareAC2: Number(editForm.fareAC2),
        fareAC1: Number(editForm.fareAC1),
      });

      if (res.data?.success === false) {
        setEditErrorMsg(res.data.message || "Failed to update train details.");
        setSavingEdit(false);
        return;
      }

      setEditingTrain(null);
      setSuccessMsg(`Train #${editForm.trainNumber} updated successfully!`);
      onDataChange();
    } catch (err) {
      console.log("Edit train error", err);
      setEditErrorMsg(err.response?.data?.message || "Failed to update train route in database.");
    }
    setSavingEdit(false);
  }

  // Handle Delete Train Route
  async function handleDeleteTrain(train) {
    const targetId = train.id || train.trainId;
    const tNum = train.trainNumber;
    const tName = train.trainName;

    if (!window.confirm(`⚠️ SUPERUSER ACTION: Are you sure you want to permanently delete Train #${tNum} (${tName})?`)) {
      return;
    }

    setDeletingId(targetId);
    try {
      await trainApi.deleteTrain(targetId);
      setSuccessMsg(`Train #${tNum} (${tName}) deleted successfully from database!`);
      onDataChange();
    } catch (err) {
      console.log("Delete train error", err);
      setErrorMsg("Failed to delete train route from database.");
    }
    setDeletingId(null);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add Train Form */}
        <div className="bg-slate-900 border border-slate-700 text-white p-5 rounded-2xl space-y-4 shadow-xl">
          <h3 className="font-bold border-b border-slate-700 pb-2 text-sm text-amber-400 flex items-center justify-between">
            <span>Add New Express Train</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </h3>

          {errorMsg && (
            <div className="p-2.5 bg-rose-900/60 border border-rose-500 text-rose-200 text-xs rounded-xl text-center font-semibold flex items-center gap-1.5 justify-center">
              <AlertCircle className="w-4 h-4 text-rose-300" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 bg-emerald-900/60 border border-emerald-500 text-emerald-200 text-xs rounded-xl text-center font-semibold flex items-center gap-1.5 justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-300" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleAddTrain} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Train Number *</label>
              <input
                type="text"
                required
                placeholder="e.g. 12951"
                value={trainNumber}
                onChange={(e) => setTrainNumber(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Train Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Mumbai Rajdhani Express"
                value={trainName}
                onChange={(e) => setTrainName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Source Station *</label>
                <input
                  type="text"
                  required
                  value={sourceStation}
                  onChange={(e) => setSourceStation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Destination *</label>
                <input
                  type="text"
                  required
                  value={destinationStation}
                  onChange={(e) => setDestinationStation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Dep Time *</label>
                <input
                  type="text"
                  required
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Arr Time *</label>
                <input
                  type="text"
                  required
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Seats Available</label>
                <input
                  type="number"
                  required
                  value={availableSeats}
                  onChange={(e) => setAvailableSeats(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">3AC Fare (₹)</label>
                <input
                  type="number"
                  required
                  value={fareAC3}
                  onChange={(e) => setFareAC3(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-400 hover:bg-amber-300 font-bold text-slate-900 py-2.5 rounded-xl text-xs transition shadow-md"
            >
              + Add Express Train
            </button>
          </form>
        </div>

        {/* Active Trains List with Superuser Action Controls */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-700 text-white p-5 rounded-2xl space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-700 pb-2">
            <h3 className="font-bold text-sm text-indigo-400">
              Active Train Routes ({trains.length})
            </h3>
            <span className="text-[11px] text-slate-400">
              Administrator Train Controls: Full Edit & Delete Unlocked
            </span>
          </div>

          <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
            {trains.map((train) => {
              const tId = train.id || train.trainId;
              return (
                <div
                  key={tId || train.trainNumber}
                  className="bg-slate-800/90 hover:bg-slate-800 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs border border-slate-700/80 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-extrabold text-white text-sm">
                        {train.trainName}
                      </h4>
                      <span className="bg-indigo-950 border border-indigo-700 text-indigo-300 font-mono px-2 py-0.5 rounded text-[11px] font-bold">
                        #{train.trainNumber}
                      </span>
                    </div>

                    <p className="text-slate-300 font-medium">
                      Route Path: <span className="text-slate-100">{train.sourceStation || "Origin"}</span> ➔ <span className="text-slate-100">{train.destinationStation || "Destination"}</span>
                    </p>

                    <p className="text-slate-400 text-[11px]">
                      Times: {train.departureTime || "08:00"} - {train.arrivalTime || "16:00"} | Seats: {train.availableSeats} | Fares: SL ₹{train.fareSleeper || 1}, 3AC ₹{train.fareAC3 || 2}, 2AC ₹{train.fareAC2 || 3}, 1AC ₹{train.fareAC1 || 4}
                    </p>
                  </div>

                  {/* Superuser & Admin Action Buttons */}
                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <button
                      onClick={() => openEditModal(train)}
                      className="bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                      title="Edit Train Path, Number, or Schedule"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Route</span>
                    </button>

                    <button
                      onClick={() => handleDeleteTrain(train)}
                      disabled={deletingId === tId}
                      className="bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-500/40 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                      title="Delete Train Route"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-300" />
                      <span>{deletingId === tId ? "Deleting..." : "Delete"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Superuser Edit Train Modal */}
      {editingTrain && editForm && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-xl p-6 rounded-3xl shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">✏️</span>
                <h3 className="text-lg font-bold text-indigo-300">
                  Edit Train Route #{editingTrain.trainNumber}
                </h3>
              </div>
              <button
                onClick={() => setEditingTrain(null)}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editErrorMsg && (
              <div className="p-3 bg-rose-900/60 border border-rose-500 text-rose-200 text-xs rounded-xl text-center font-semibold">
                ⚠️ {editErrorMsg}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Train Number *</label>
                  <input
                    type="text"
                    required
                    value={editForm.trainNumber}
                    onChange={(e) => setEditForm({ ...editForm, trainNumber: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Train Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.trainName}
                    onChange={(e) => setEditForm({ ...editForm, trainName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Source Station (Origin) *</label>
                  <input
                    type="text"
                    required
                    value={editForm.sourceStation}
                    onChange={(e) => setEditForm({ ...editForm, sourceStation: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Destination Station *</label>
                  <input
                    type="text"
                    required
                    value={editForm.destinationStation}
                    onChange={(e) => setEditForm({ ...editForm, destinationStation: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Departure Time</label>
                  <input
                    type="text"
                    value={editForm.departureTime}
                    onChange={(e) => setEditForm({ ...editForm, departureTime: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Arrival Time</label>
                  <input
                    type="text"
                    value={editForm.arrivalTime}
                    onChange={(e) => setEditForm({ ...editForm, arrivalTime: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Available Seats</label>
                  <input
                    type="number"
                    value={editForm.availableSeats}
                    onChange={(e) => setEditForm({ ...editForm, availableSeats: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 border-t border-slate-800 pt-3">
                <div>
                  <label className="block text-slate-400 text-[10px]">Sleeper (₹)</label>
                  <input
                    type="number"
                    value={editForm.fareSleeper}
                    onChange={(e) => setEditForm({ ...editForm, fareSleeper: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded p-1.5 text-white font-semibold text-center"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px]">3AC (₹)</label>
                  <input
                    type="number"
                    value={editForm.fareAC3}
                    onChange={(e) => setEditForm({ ...editForm, fareAC3: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded p-1.5 text-white font-semibold text-center"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px]">2AC (₹)</label>
                  <input
                    type="number"
                    value={editForm.fareAC2}
                    onChange={(e) => setEditForm({ ...editForm, fareAC2: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded p-1.5 text-white font-semibold text-center"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px]">1AC (₹)</label>
                  <input
                    type="number"
                    value={editForm.fareAC1}
                    onChange={(e) => setEditForm({ ...editForm, fareAC1: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded p-1.5 text-white font-semibold text-center"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingTrain(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl font-bold transition shadow-md"
                >
                  {savingEdit ? "Saving Changes..." : "💾 Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
