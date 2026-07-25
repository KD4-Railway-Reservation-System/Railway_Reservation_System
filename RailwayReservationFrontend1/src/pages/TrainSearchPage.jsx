import React, { useState, useEffect } from "react";
import { trainApi } from "../api/apiService";
import TrainCard from "../components/TrainCard";
import SearchFilterHeader from "../components/SearchFilterHeader";

export default function TrainSearchPage() {
  const queryParams = new URLSearchParams(window.location.search);
  const initialSource = queryParams.get("source") || "";
  const initialDest = queryParams.get("destination") || "";

  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedSource, setSelectedSource] = useState(initialSource);
  const [selectedDest, setSelectedDest] = useState(initialDest);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const stRes = await trainApi.getAllStations();
        const trRes = await trainApi.getAllTrains();

        setStations(stRes.data);
        setTrains(trRes.data);
      } catch (err) {
        console.log("Error fetching trains or stations", err);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  function handleSwap() {
    const tempSrc = selectedSource;
    setSelectedSource(selectedDest);
    setSelectedDest(tempSrc);
  }

  function handleReset() {
    setSelectedSource("");
    setSelectedDest("");
  }

  const filteredTrains = trains.filter((train) => {
    return (
      (!selectedSource || train.sourceStationId == selectedSource) &&
      (!selectedDest || train.destinationStationId == selectedDest)
    );
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <SearchFilterHeader
        trainCount={filteredTrains.length}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
        selectedDest={selectedDest}
        setSelectedDest={setSelectedDest}
        stations={stations}
        handleSwap={handleSwap}
        handleReset={handleReset}
      />

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          Loading express train schedules...
        </div>
      ) : filteredTrains.length > 0 ? (
        <div className="space-y-4">
          {filteredTrains.map((train) => (
            <TrainCard key={train.id} train={train} stations={stations} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 p-10 text-center rounded-lg text-white space-y-2">
          <h3 className="text-lg font-bold">No Trains Found</h3>
        </div>
      )}
    </div>
  );
}
