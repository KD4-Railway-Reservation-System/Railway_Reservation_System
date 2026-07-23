import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Train, ArrowLeftRight, Zap, Shield, Award, ArrowRight, UserCheck } from 'lucide-react';
import { trainApi } from '../api/apiService';

export default function HomePage() {
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [sourceId, setSourceId] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [journeyDate, setJourneyDate] = useState(new Date().toISOString().split('T')[0]);
  const [seatClass, setSeatClass] = useState('ALL');
  const [quota, setQuota] = useState('GENERAL');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const res = await trainApi.getAllStations();
      const stList = res.data || [];
      setStations(stList);
      
      // Default: Source = NDLS (ID 1), Destination = MMCT (ID 2)
      if (stList.length >= 2) {
        const defaultSource = stList.find(s => s.stationCode === 'NDLS') || stList[0];
        const defaultDest = stList.find(s => s.stationCode === 'MMCT') || stList[1];
        setSourceId(String(defaultSource.id || defaultSource.stationId));
        setDestinationId(String(defaultDest.id || defaultDest.stationId));
      }
    } catch (e) {
      console.error('Failed to load stations', e);
    }
  };

  const handleSwapStations = () => {
    setErrorMsg('');
    const temp = sourceId;
    setSourceId(destinationId);
    setDestinationId(temp);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (sourceId === destinationId) {
      setErrorMsg('Source and Destination stations cannot be the same. Please choose different stations.');
      return;
    }

    navigate(`/trains?source=${sourceId}&destination=${destinationId}&date=${journeyDate}&class=${seatClass}&quota=${quota}`);
  };

  const setDateShortcut = (daysToAdd) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    setJourneyDate(d.toISOString().split('T')[0]);
  };

  const handleQuickRoute = (srcCode, destCode) => {
    const src = stations.find(s => s.stationCode === srcCode);
    const dest = stations.find(s => s.stationCode === destCode);
    if (src && dest) {
      setSourceId(String(src.id || src.stationId));
      setDestinationId(String(dest.id || dest.stationId));
      setErrorMsg('');
    }
  };

  return (
    <div className="space-y-16 pb-12">
      
      {/* HERO SECTION */}
      <div className="relative min-h-[520px] rounded-3xl overflow-hidden glass-panel border border-slate-700/50 flex items-center justify-center p-6 md:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/90 via-slate-900/80 to-purple-950/90 z-0" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 w-full max-w-4xl space-y-8">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Train className="w-3.5 h-3.5" />
              <span>Official Indian Railways Express Network</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              BOOK TRAIN TICKETS <span className="text-gradient">INSTANTLY</span>
            </h1>
            <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto font-light">
              Check live seat availability, PNR status, route timetables, and zero-fee instant booking across India.
            </p>
          </div>

          {/* IRCTC TRAIN SEARCH WIDGET */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-700/80 shadow-2xl space-y-4 backdrop-blur-xl bg-slate-900/80">
            
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSearch} className="space-y-4">
              
              {/* FROM & TO STATION PICKERS WITH SWAP BUTTON */}
              <div className="grid grid-cols-1 md:grid-cols-9 gap-3 items-center">
                
                {/* SOURCE STATION */}
                <div className="md:col-span-4 space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    From Station *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3.5" />
                    <select
                      value={sourceId}
                      onChange={(e) => {
                        setSourceId(e.target.value);
                        setErrorMsg('');
                      }}
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 font-medium"
                    >
                      {stations.map((s) => (
                        <option key={s.id || s.stationId} value={s.id || s.stationId}>
                          {s.city} ({s.stationCode}) - {s.stationName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* SWAP BUTTON */}
                <div className="md:col-span-1 flex justify-center pt-5">
                  <button
                    type="button"
                    onClick={handleSwapStations}
                    title="Swap From & To Stations"
                    className="p-3 rounded-full bg-slate-800 hover:bg-indigo-600 border border-slate-700 text-slate-300 hover:text-white transition-all transform hover:scale-110 shadow-md"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                </div>

                {/* DESTINATION STATION */}
                <div className="md:col-span-4 space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    To Station *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5" />
                    <select
                      value={destinationId}
                      onChange={(e) => {
                        setDestinationId(e.target.value);
                        setErrorMsg('');
                      }}
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-purple-500 font-medium"
                    >
                      {stations.map((s) => (
                        <option key={s.id || s.stationId} value={s.id || s.stationId}>
                          {s.city} ({s.stationCode}) - {s.stationName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>

              {/* DATE, CLASS & QUOTA SELECTORS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                
                {/* JOURNEY DATE */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Journey Date *
                    </label>
                    <div className="flex space-x-1">
                      <button
                        type="button"
                        onClick={() => setDateShortcut(0)}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-indigo-400 hover:bg-slate-700 font-semibold"
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        onClick={() => setDateShortcut(1)}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-indigo-400 hover:bg-slate-700 font-semibold"
                      >
                        Tom
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                    <input
                      type="date"
                      value={journeyDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setJourneyDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 font-medium"
                    />
                  </div>
                </div>

                {/* SEAT CLASS */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Class
                  </label>
                  <select
                    value={seatClass}
                    onChange={(e) => setSeatClass(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="ALL">All Classes</option>
                    <option value="1A">AC First Class (1A)</option>
                    <option value="2A">AC 2 Tier (2A)</option>
                    <option value="3A">AC 3 Tier (3A)</option>
                    <option value="SL">Sleeper (SL)</option>
                  </select>
                </div>

                {/* QUOTA */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Quota
                  </label>
                  <select
                    value={quota}
                    onChange={(e) => setQuota(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="GENERAL">General</option>
                    <option value="TATKAL">Tatkal</option>
                    <option value="LADIES">Ladies</option>
                    <option value="SENIOR">Senior Citizen</option>
                  </select>
                </div>

              </div>

              {/* POPULAR ROUTE CHIPS */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-slate-400 font-medium">Popular Routes:</span>
                <button
                  type="button"
                  onClick={() => handleQuickRoute('NDLS', 'MMCT')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition-colors"
                >
                  Delhi ➔ Mumbai
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickRoute('NDLS', 'HWH')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition-colors"
                >
                  Delhi ➔ Kolkata
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickRoute('NDLS', 'MAS')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition-colors"
                >
                  Delhi ➔ Chennai
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickRoute('SBC', 'MAS')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition-colors"
                >
                  Bengaluru ➔ Chennai
                </button>
              </div>

              {/* SEARCH SUBMIT BUTTON */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl font-black text-white text-base bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2 tracking-wide uppercase"
              >
                <Search className="w-5 h-5" />
                <span>Search Express Trains</span>
              </button>

            </form>
          </div>

        </div>
      </div>

      {/* FEATURE HIGHLIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3 hover:border-indigo-500/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Instant Confirmation</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Real-time seat allocation with instant 10-digit PNR generation and payment settlement.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3 hover:border-indigo-500/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Zero Gateway Charges</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Seamless payment processing with UPI, Credit Cards, NetBanking, and instant refund processing.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3 hover:border-indigo-500/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">IRCTC Microservices Architecture</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Powered by Spring Cloud Gateway, Eureka Service Discovery, Resilience4j Circuit Breakers, and MySQL.
          </p>
        </div>
      </div>

    </div>
  );
}
