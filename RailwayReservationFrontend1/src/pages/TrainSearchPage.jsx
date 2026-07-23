import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Train, Filter, Loader2, ArrowLeftRight } from 'lucide-react';
import { trainApi } from '../api/apiService';
import TrainCard from '../components/TrainCard';

export default function TrainSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  const initialSource = searchParams.get('source') || '';
  const initialDest = searchParams.get('destination') || '';

  const [selectedSource, setSelectedSource] = useState(initialSource);
  const [selectedDest, setSelectedDest] = useState(initialDest);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setSelectedSource(searchParams.get('source') || '');
    setSelectedDest(searchParams.get('destination') || '');
  }, [searchParams]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [stRes, trRes] = await Promise.all([
        trainApi.getAllStations(),
        trainApi.getAllTrains(),
      ]);

      setStations(stRes.data || []);
      setTrains(trRes.data || []);
    } catch (err) {
      console.error('Error fetching search data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    const tempSrc = selectedSource;
    const tempDest = selectedDest;
    setSelectedSource(tempDest);
    setSelectedDest(tempSrc);
    setSearchParams({ source: tempDest, destination: tempSrc });
  };

  const filteredTrains = trains.filter((t) => {
    let matchSource = true;
    let matchDest = true;

    if (selectedSource) {
      const srcSt = stations.find((s) => String(s.id || s.stationId) === String(selectedSource));
      matchSource =
        String(t.sourceStationId) === String(selectedSource) ||
        (srcSt && t.source && t.source.toLowerCase().includes(srcSt.city.toLowerCase())) ||
        (srcSt && t.sourceCode && t.sourceCode.toUpperCase() === srcSt.stationCode.toUpperCase());
    }

    if (selectedDest) {
      const destSt = stations.find((s) => String(s.id || s.stationId) === String(selectedDest));
      matchDest =
        String(t.destinationStationId) === String(selectedDest) ||
        (destSt && t.destination && t.destination.toLowerCase().includes(destSt.city.toLowerCase())) ||
        (destSt && t.destinationCode && t.destinationCode.toUpperCase() === destSt.stationCode.toUpperCase());
    }

    return matchSource && matchDest;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Filter Controls */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Train className="w-6 h-6 text-indigo-400" />
            <span>Search & Reserve Express Trains</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Showing <span className="text-indigo-400 font-semibold">{filteredTrains.length}</span> active routes
          </p>
        </div>

        {/* Station Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <select
            value={selectedSource}
            onChange={(e) => {
              setSelectedSource(e.target.value);
              setSearchParams({ source: e.target.value, destination: selectedDest });
            }}
            className="w-full sm:w-auto bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 font-medium"
          >
            <option value="">All Source Stations</option>
            {stations.map((s) => (
              <option key={s.id || s.stationId} value={s.id || s.stationId}>
                {s.city} ({s.stationCode})
              </option>
            ))}
          </select>

          <button
            onClick={handleSwap}
            title="Swap From & To"
            className="p-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          <select
            value={selectedDest}
            onChange={(e) => {
              setSelectedDest(e.target.value);
              setSearchParams({ source: selectedSource, destination: e.target.value });
            }}
            className="w-full sm:w-auto bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 font-medium"
          >
            <option value="">All Destination Stations</option>
            {stations.map((s) => (
              <option key={s.id || s.stationId} value={s.id || s.stationId}>
                {s.city} ({s.stationCode})
              </option>
            ))}
          </select>

          {(selectedSource || selectedDest) && (
            <button
              onClick={() => {
                setSelectedSource('');
                setSelectedDest('');
                setSearchParams({});
              }}
              className="px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors border border-rose-500/20"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Train List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-sm font-medium">Fetching real-time train schedules...</p>
        </div>
      ) : filteredTrains.length > 0 ? (
        <div className="space-y-4">
          {filteredTrains.map((train) => (
            <TrainCard key={train.id} train={train} stations={stations} />
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No Trains Found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            We couldn't find any active express trains matching your selected station filters. Try selecting different stations or resetting filters.
          </p>
        </div>
      )}

    </div>
  );
}
