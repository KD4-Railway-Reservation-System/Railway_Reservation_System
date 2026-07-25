import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { trainApi } from "../api/apiService";
import TrainSearchForm from "../components/TrainSearchForm";

export default function HomePage() {
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [sourceId, setSourceId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [journeyDate, setJourneyDate] = useState("");
  const [seatClass, setSeatClass] = useState("ALL");
  const [quota, setQuota] = useState("GENERAL");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function getStations() {
      try {
        const res = await trainApi.getAllStations();
        const list = res.data || [];
        setStations(list);

        if (list.length >= 2) {
          const defaultSource =
            list.find((s) => s.stationCode === "NDLS") || list[0];
          const defaultDest =
            list.find((s) => s.stationCode === "MMCT") || list[1];
          setSourceId(String(defaultSource.id || defaultSource.stationId));
          setDestinationId(String(defaultDest.id || defaultDest.stationId));
        }
      } catch (err) {
        console.log("Error loading stations", err);
      }
    }
    getStations();
  }, []);

  function handleSwap() {
    setErrorMsg("");
    const temp = sourceId;
    setSourceId(destinationId);
    setDestinationId(temp);
  }

  function handleSearch(e) {
    e.preventDefault();
    setErrorMsg("");

    if (sourceId === destinationId) {
      setErrorMsg("Source and Destination stations cannot be the same.");
      return;
    }

    navigate(
      `/trains?source=${sourceId}&destination=${destinationId}&date=${journeyDate}&class=${seatClass}&quota=${quota}`,
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-slate-800 text-white rounded-lg p-6 text-center space-y-3 shadow">
        <h1 className="text-3xl font-bold">Book Train Tickets Online</h1>
        <p className="text-sm text-slate-300">
          Indian Railways Express train search and seat booking portal
        </p>
      </div>

      <TrainSearchForm
        stations={stations}
        sourceId={sourceId}
        setSourceId={setSourceId}
        destinationId={destinationId}
        setDestinationId={setDestinationId}
        journeyDate={journeyDate}
        setJourneyDate={setJourneyDate}
        seatClass={seatClass}
        setSeatClass={setSeatClass}
        quota={quota}
        setQuota={setQuota}
        errorMsg={errorMsg}
        handleSwap={handleSwap}
        handleSearch={handleSearch}
      />
    </div>
  );
}
