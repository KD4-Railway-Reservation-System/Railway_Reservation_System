import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Plus, Trash2, Edit, Train, MapPin, Ticket, Loader2 } from 'lucide-react';
import { trainApi, bookingApi } from '../api/apiService';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

export default function AdminDashboard() {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('TRAINS');
  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [newStationName, setNewStationName] = useState('');
  const [newStationCode, setNewStationCode] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');

  const [newTrainNumber, setNewTrainNumber] = useState('');
  const [newTrainName, setNewTrainName] = useState('');
  const [sourceId, setSourceId] = useState('');
  const [destId, setDestId] = useState('');
  const [totalSeats, setTotalSeats] = useState(200);
  const [availableSeats, setAvailableSeats] = useState(200);
  const [fare, setFare] = useState(750);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/login?redirect=/admin');
      return;
    }
    loadAdminData();
  }, [isAuthenticated, isAdmin]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [trRes, stRes, bkRes] = await Promise.all([
        trainApi.getAllTrains(),
        trainApi.getAllStations(),
        bookingApi.getAllBookings(),
      ]);

      setTrains(trRes.data || []);
      setStations(stRes.data || []);
      setBookings(bkRes.data || []);

      if (stRes.data && stRes.data.length >= 2) {
        setSourceId(stRes.data[0].id || stRes.data[0].stationId);
        setDestId(stRes.data[1].id || stRes.data[1].stationId);
      }
    } catch (e) {
      console.error('Failed to load admin panel data', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStation = async (e) => {
    e.preventDefault();
    try {
      await trainApi.createStation({
        stationCode: newStationCode,
        stationName: newStationName,
        city: newCity,
        state: newState,
      });

      setNewStationName('');
      setNewStationCode('');
      setNewCity('');
      setNewState('');

      loadAdminData();
    } catch (err) {
      alert('Failed to add station: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteStation = async (id) => {
    if (!window.confirm('Delete station #' + id + '?')) return;
    try {
      await trainApi.deleteStation(id);
      loadAdminData();
    } catch (e) {
      alert('Failed to delete station');
    }
  };

  const handleAddTrain = async (e) => {
    e.preventDefault();
    try {
      await trainApi.createTrain({
        trainNumber: newTrainNumber,
        trainName: newTrainName,
        sourceStationId: Number(sourceId),
        destinationStationId: Number(destId),
        totalSeats: Number(totalSeats),
        availableSeats: Number(availableSeats),
        fare: Number(fare),
      });

      setNewTrainNumber('');
      setNewTrainName('');

      loadAdminData();
    } catch (err) {
      alert('Failed to add train: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteTrain = async (id) => {
    if (!window.confirm('Delete train #' + id + '?')) return;
    try {
      await trainApi.deleteTrain(id);
      loadAdminData();
    } catch (e) {
      alert('Failed to delete train');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        <p className="text-sm font-medium">Loading Administrator Console...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header */}
      <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">System Administrator Console</h2>
            <p className="text-xs text-slate-400">Manage Express Trains, Railway Stations & View All System Bookings</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('TRAINS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'TRAINS'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Train className="w-4 h-4" />
            <span>Trains ({trains.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('STATIONS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'STATIONS'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Stations ({stations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('BOOKINGS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'BOOKINGS'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>All Bookings ({bookings.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: TRAINS MANAGEMENT */}
      {activeTab === 'TRAINS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Add Train Form */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Plus className="w-5 h-5 text-amber-400" />
              <span>Add Express Train</span>
            </h3>

            <form onSubmit={handleAddTrain} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Train Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 12951"
                  value={newTrainNumber}
                  onChange={(e) => setNewTrainNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Train Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajdhani Express"
                  value={newTrainName}
                  onChange={(e) => setNewTrainName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Source</label>
                  <select
                    value={sourceId}
                    onChange={(e) => setSourceId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-2 py-2 text-xs"
                  >
                    {stations.map((s) => (
                      <option key={s.id || s.stationId} value={s.id || s.stationId}>{s.stationName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Destination</label>
                  <select
                    value={destId}
                    onChange={(e) => setDestId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-2 py-2 text-xs"
                  >
                    {stations.map((s) => (
                      <option key={s.id || s.stationId} value={s.id || s.stationId}>{s.stationName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Available Seats</label>
                  <input
                    type="number"
                    value={availableSeats}
                    onChange={(e) => setAvailableSeats(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Base Fare (₹)</label>
                  <input
                    type="number"
                    value={fare}
                    onChange={(e) => setFare(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors text-sm mt-2"
              >
                Add Train
              </button>
            </form>
          </div>

          {/* Train List (2 cols) */}
          <div className="md:col-span-2 glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Active System Trains</h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {trains.map((t) => (
                <div key={t.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-base">{t.trainName} <span className="text-xs text-amber-400 font-mono">(#{t.trainNumber})</span></h4>
                    <p className="text-xs text-slate-400 mt-1">Available Seats: <span className="text-emerald-400 font-semibold">{t.availableSeats}</span> | Fare: ₹{t.fare}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteTrain(t.id)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: STATIONS MANAGEMENT */}
      {activeTab === 'STATIONS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Add Station Form */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Plus className="w-5 h-5 text-amber-400" />
              <span>Add Railway Station</span>
            </h3>

            <form onSubmit={handleAddStation} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Station Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NDLS"
                  value={newStationCode}
                  onChange={(e) => setNewStationCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm uppercase"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Station Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New Delhi"
                  value={newStationName}
                  onChange={(e) => setNewStationName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="New Delhi"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">State</label>
                  <input
                    type="text"
                    required
                    placeholder="Delhi"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors text-sm mt-2"
              >
                Add Station
              </button>
            </form>
          </div>

          {/* Station List */}
          <div className="md:col-span-2 glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Registered Stations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
              {stations.map((s) => (
                <div key={s.id || s.stationId} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-base">{s.stationName} <span className="text-xs text-indigo-400 font-mono">({s.stationCode})</span></h4>
                    <p className="text-xs text-slate-400 mt-0.5">{s.city}, {s.state}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteStation(s.id || s.stationId)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: SYSTEM BOOKINGS */}
      {activeTab === 'BOOKINGS' && (
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">System-Wide Reservations</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">PNR</th>
                  <th className="py-3 px-4">Passenger</th>
                  <th className="py-3 px-4">Train ID</th>
                  <th className="py-3 px-4">Class & Seat</th>
                  <th className="py-3 px-4">Fare</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {bookings.map((b) => (
                  <tr key={b.bookingId || b.id} className="hover:bg-slate-900/50">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-400">{b.pnr}</td>
                    <td className="py-3 px-4 font-medium text-white">{b.passengerName} ({b.passengerAge})</td>
                    <td className="py-3 px-4">Train #{b.trainId}</td>
                    <td className="py-3 px-4">{b.seatClass} / #{b.seatNumber}</td>
                    <td className="py-3 px-4 font-bold text-emerald-400">₹{b.fare}</td>
                    <td className="py-3 px-4"><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
