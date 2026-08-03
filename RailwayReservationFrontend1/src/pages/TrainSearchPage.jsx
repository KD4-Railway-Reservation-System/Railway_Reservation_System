import React, { useState, useEffect } from "react";
import { trainApi } from "../api/apiService";
import TrainCard from "../components/TrainCard";
import { TrainCardSkeleton } from "../components/SkeletonLoader";

const DEMO_TRAINS = [
  { id: 1, trainNumber: "12951", trainName: "Mumbai Rajdhani Express", sourceStation: "New Delhi", destinationStation: "Mumbai Central", departureTime: "16:55", arrivalTime: "08:35", travelDuration: "15h 40m", runningDays: "Daily", availableSeats: 120, fareSleeper: 1, fareAC3: 2, fareAC2: 3, fareAC1: 4 },
  { id: 2, trainNumber: "12954", trainName: "August Kranti Rajdhani", sourceStation: "Mumbai Central", destinationStation: "New Delhi", departureTime: "17:10", arrivalTime: "09:45", travelDuration: "16h 35m", runningDays: "Daily", availableSeats: 110, fareSleeper: 1, fareAC3: 2, fareAC2: 3, fareAC1: 4 },
  { id: 3, trainNumber: "12002", trainName: "Bhopal Shatabdi Express", sourceStation: "New Delhi", destinationStation: "Bhopal Junction", departureTime: "06:00", arrivalTime: "14:40", travelDuration: "08h 40m", runningDays: "Daily", availableSeats: 95, fareSleeper: 1, fareAC3: 2, fareAC2: 3, fareAC1: 4 },
  { id: 4, trainNumber: "20172", trainName: "Rani Kamlapati Vande Bharat", sourceStation: "Bhopal Junction", destinationStation: "New Delhi", departureTime: "15:05", arrivalTime: "22:45", travelDuration: "07h 40m", runningDays: "Daily", availableSeats: 160, fareSleeper: 1, fareAC3: 2, fareAC2: 3, fareAC1: 4 },
  { id: 5, trainNumber: "22436", trainName: "Vande Bharat Express", sourceStation: "New Delhi", destinationStation: "Varanasi Junction", departureTime: "06:00", arrivalTime: "14:00", travelDuration: "08h 00m", runningDays: "Tue, Wed, Fri, Sat, Sun", availableSeats: 180, fareSleeper: 1, fareAC3: 2, fareAC2: 3, fareAC1: 4 },
  { id: 6, trainNumber: "15128", trainName: "Kashi Vishwanath Express", sourceStation: "Varanasi Junction", destinationStation: "New Delhi", departureTime: "13:30", arrivalTime: "06:00", travelDuration: "16h 30m", runningDays: "Daily", availableSeats: 140, fareSleeper: 1, fareAC3: 2, fareAC2: 3, fareAC1: 4 },
  { id: 7, trainNumber: "12260", trainName: "Sealdah Duronto Express", sourceStation: "New Delhi", destinationStation: "Kolkata Sealdah", departureTime: "19:45", arrivalTime: "12:30", travelDuration: "16h 45m", runningDays: "Mon, Wed, Thu, Sun", availableSeats: 110, fareSleeper: 1, fareAC3: 2, fareAC2: 3, fareAC1: 4 },
  { id: 8, trainNumber: "12314", trainName: "Sealdah Rajdhani Express", sourceStation: "Kolkata Sealdah", destinationStation: "New Delhi", departureTime: "16:50", arrivalTime: "10:25", travelDuration: "17h 35m", runningDays: "Daily", availableSeats: 130, fareSleeper: 1, fareAC3: 2, fareAC2: 3, fareAC1: 4 },
  { id: 9, trainNumber: "12626", trainName: "Kerala Express", sourceStation: "New Delhi", destinationStation: "Bengaluru City", departureTime: "20:10", arrivalTime: "13:50", travelDuration: "41h 40m", runningDays: "Daily", availableSeats: 210, fareSleeper: 1, fareAC3: 2, fareAC2: 3, fareAC1: 4 },
  { id: 10, trainNumber: "12628", trainName: "Karnataka Express", sourceStation: "Bengaluru City", destinationStation: "New Delhi", departureTime: "19:20", arrivalTime: "12:00", travelDuration: "40h 40m", runningDays: "Daily", availableSeats: 190, fareSleeper: 1, fareAC3: 2, fareAC2: 3, fareAC1: 4 },
  { id: 11, trainNumber: "12008", trainName: "Mysore Shatabdi Express", sourceStation: "Chennai Central", destinationStation: "Bengaluru City", departureTime: "06:00", arrivalTime: "10:45", travelDuration: "04h 45m", runningDays: "Mon, Wed, Thu, Fri, Sat, Sun", availableSeats: 140, fareSleeper: 1, fareAC3: 2, fareAC2: 3, fareAC1: 4 },
  { id: 12, trainNumber: "12639", trainName: "Brindavan Express", sourceStation: "Bengaluru City", destinationStation: "Chennai Central", departureTime: "15:00", arrivalTime: "21:05", travelDuration: "06h 05m", runningDays: "Daily", availableSeats: 175, fareSleeper: 1, fareAC3: 2, fareAC2: 3, fareAC1: 4 },
  { id: 13, trainNumber: "12925", trainName: "Paschim Express", sourceStation: "Mumbai Central", destinationStation: "Amritsar Junction", departureTime: "11:25", arrivalTime: "20:20", travelDuration: "32h 55m", runningDays: "Daily", availableSeats: 165, fareSleeper: 1, fareAC3: 2, fareAC2: 3, fareAC1: 4 },
  { id: 14, trainNumber: "12903", trainName: "Golden Temple Mail", sourceStation: "Amritsar Junction", destinationStation: "Mumbai Central", departureTime: "21:25", arrivalTime: "05:20", travelDuration: "31h 55m", runningDays: "Daily", availableSeats: 150, fareSleeper: 1, fareAC3: 2, fareAC2: 3, fareAC1: 4 },
  { id: 15, trainNumber: "82902", trainName: "Tejas Express", sourceStation: "Ahmedabad Junction", destinationStation: "Mumbai Central", departureTime: "06:40", arrivalTime: "13:05", travelDuration: "06h 25m", runningDays: "Mon, Tue, Wed, Fri, Sat, Sun", availableSeats: 130, fareSleeper: 1, fareAC3: 2, fareAC2: 3, fareAC1: 4 },
  { id: 16, trainNumber: "12932", trainName: "Double Decker Express", sourceStation: "Mumbai Central", destinationStation: "Ahmedabad Junction", departureTime: "14:30", arrivalTime: "21:25", travelDuration: "06h 55m", runningDays: "Mon, Tue, Wed, Thu, Fri, Sat", availableSeats: 220, fareSleeper: 1, fareAC3: 2, fareAC2: 3, fareAC1: 4 },
  { id: 17, trainNumber: "12015", trainName: "Ajmer Shatabdi Express", sourceStation: "New Delhi", destinationStation: "Jaipur Junction", departureTime: "06:10", arrivalTime: "10:40", travelDuration: "04h 30m", runningDays: "Daily", availableSeats: 145, fareSleeper: 1, fareAC3: 2, fareAC2: 3, fareAC1: 4 },
  { id: 18, trainNumber: "12916", trainName: "Ashram Express", sourceStation: "Jaipur Junction", destinationStation: "New Delhi", departureTime: "20:25", arrivalTime: "01:30", travelDuration: "05h 05m", runningDays: "Daily", availableSeats: 170, fareSleeper: 1, fareAC3: 2, fareAC2: 3, fareAC1: 4 },
  { id: 19, trainNumber: "12004", trainName: "Lucknow Swarna Shatabdi", sourceStation: "New Delhi", destinationStation: "Lucknow Charbagh", departureTime: "06:10", arrivalTime: "12:40", travelDuration: "06h 30m", runningDays: "Daily", availableSeats: 160, fareSleeper: 1, fareAC3: 2, fareAC2: 3, fareAC1: 4 },
  { id: 20, trainNumber: "12583", trainName: "Lucknow Double Decker", sourceStation: "Lucknow Charbagh", destinationStation: "New Delhi", departureTime: "15:30", arrivalTime: "22:15", travelDuration: "06h 45m", runningDays: "Mon, Tue, Thu, Fri, Sat", availableSeats: 185, fareSleeper: 1, fareAC3: 2, fareAC2: 3, fareAC1: 4 },
  { id: 21, trainNumber: "12724", trainName: "Telangana Express", sourceStation: "New Delhi", destinationStation: "Hyderabad Secunderabad", departureTime: "16:00", arrivalTime: "17:15", travelDuration: "25h 15m", runningDays: "Daily", availableSeats: 155, fareSleeper: 1, fareAC3: 2, fareAC2: 3, fareAC1: 4 },
  { id: 22, trainNumber: "12124", trainName: "Deccan Queen Express", sourceStation: "Pune Junction", destinationStation: "Mumbai Central", departureTime: "07:15", arrivalTime: "10:25", travelDuration: "03h 10m", runningDays: "Daily", availableSeats: 195, fareSleeper: 1, fareAC3: 2, fareAC2: 3, fareAC1: 4 },
  { id: 23, trainNumber: "12394", trainName: "Sampoorna Kranti Express", sourceStation: "New Delhi", destinationStation: "Patna Junction", departureTime: "17:30", arrivalTime: "06:50", travelDuration: "13h 20m", runningDays: "Daily", availableSeats: 200, fareSleeper: 1, fareAC3: 2, fareAC2: 3, fareAC1: 4 },
  { id: 24, trainNumber: "12759", trainName: "Charminar Express", sourceStation: "Hyderabad Secunderabad", destinationStation: "Chennai Central", departureTime: "18:00", arrivalTime: "08:00", travelDuration: "14h 00m", runningDays: "Daily", availableSeats: 165, fareSleeper: 1, fareAC3: 2, fareAC2: 3, fareAC1: 4 }
];

export default function TrainSearchPage() {
  const queryParams = new URLSearchParams(window.location.search);
  const initialSource = queryParams.get("source") || "";
  const initialDest = queryParams.get("destination") || "";

  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);
  const [source, setSource] = useState(initialSource);
  const [destination, setDestination] = useState(initialDest);
  const [loading, setLoading] = useState(true);

  // Load available stations and trains
  useEffect(() => {
    async function loadStations() {
      try {
        const res = await trainApi.getAllStations();
        setStations(res.data || []);
      } catch (err) {
        console.log("Error fetching station dropdown list", err);
      }
    }
    loadStations();

    if (initialSource || initialDest) {
      performSearch(initialSource, initialDest);
    } else {
      fetchTrainData();
    }
  }, []);

  async function fetchTrainData() {
    setLoading(true);
    try {
      const res = await trainApi.getAllTrains();
      const trainList = Array.isArray(res.data) ? res.data : (res.data?.trains || []);
      if (trainList.length > 0) {
        setTrains(trainList);
      } else {
        setTrains(DEMO_TRAINS);
      }
    } catch (err) {
      console.log("Notice: Using fallback train schedules", err);
      setTrains(DEMO_TRAINS);
    }
    setLoading(false);
  }

  async function performSearch(srcQuery, destQuery) {
    setLoading(true);
    const src = (srcQuery !== undefined ? srcQuery : source).trim();
    const dest = (destQuery !== undefined ? destQuery : destination).trim();

    try {
      const res = await trainApi.searchTrains(src, dest);
      const trainList = Array.isArray(res.data) 
        ? res.data 
        : (res.data?.trains || []);
      
      // Also apply client-side filter if needed
      const filtered = trainList.filter(t => 
        (!src || t.sourceStation.toLowerCase().includes(src.toLowerCase()) || src.toLowerCase().includes(t.sourceStation.toLowerCase())) &&
        (!dest || t.destinationStation.toLowerCase().includes(dest.toLowerCase()) || dest.toLowerCase().includes(t.destinationStation.toLowerCase()))
      );

      if (filtered.length > 0) {
        setTrains(filtered);
      } else {
        const demoFiltered = DEMO_TRAINS.filter(t => 
          (!src || t.sourceStation.toLowerCase().includes(src.toLowerCase()) || src.toLowerCase().includes(t.sourceStation.toLowerCase())) &&
          (!dest || t.destinationStation.toLowerCase().includes(dest.toLowerCase()) || dest.toLowerCase().includes(t.destinationStation.toLowerCase()))
        );
        setTrains(demoFiltered);
      }
    } catch (err) {
      console.log("Notice: Filtering demo trains locally", err);
      const demoFiltered = DEMO_TRAINS.filter(t => 
        (!src || t.sourceStation.toLowerCase().includes(src.toLowerCase()) || src.toLowerCase().includes(t.sourceStation.toLowerCase())) &&
        (!dest || t.destinationStation.toLowerCase().includes(dest.toLowerCase()) || dest.toLowerCase().includes(t.destinationStation.toLowerCase()))
      );
      setTrains(demoFiltered);
    }
    setLoading(false);
  }

  function handleSearch(e) {
    if (e) e.preventDefault();
    performSearch(source, destination);
  }

  function handleSwap() {
    const temp = source;
    setSource(destination);
    setDestination(temp);
    performSearch(destination, source);
  }

  function handleReset() {
    setSource("");
    setDestination("");
    fetchTrainData();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Search Header Banner */}
      <div className="station-banner-bg border border-slate-700/80 text-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl glow-indigo">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Search & Book Express Trains</h2>
          <p className="text-xs text-slate-300">
            Available matching train routes: <span className="text-indigo-400 font-bold text-sm ml-1">{trains.length}</span>
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3 text-sm w-full md:w-auto">
          <div className="flex flex-col flex-1 md:flex-initial">
            <label className="text-[10px] text-slate-400 font-semibold mb-0.5">From Station</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="bg-slate-900/90 border border-slate-600 rounded-lg p-2 text-white text-xs min-w-[170px] backdrop-blur-md"
            >
              <option value="">All Source Stations</option>
              {stations.map((s) => (
                <option key={s.id || s.stationCode} value={s.stationName || s.city}>
                  {s.city} ({s.stationCode}) - {s.stationName}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleSwap}
            title="Swap Stations"
            className="self-end mb-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 px-2.5 py-2 rounded-lg text-xs transition"
          >
            ⇄
          </button>

          <div className="flex flex-col flex-1 md:flex-initial">
            <label className="text-[10px] text-slate-400 font-semibold mb-0.5">To Station</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-slate-900/90 border border-slate-600 rounded-lg p-2 text-white text-xs min-w-[170px] backdrop-blur-md"
            >
              <option value="">All Destination Stations</option>
              {stations.map((s) => (
                <option key={s.id || s.stationCode} value={s.stationName || s.city}>
                  {s.city} ({s.stationCode}) - {s.stationName}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="self-end mb-0.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition shadow-lg"
          >
            🔍 Search
          </button>

          {(source || destination) && (
            <button
              type="button"
              onClick={handleReset}
              className="self-end mb-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 px-3 py-2 rounded-lg text-xs transition"
            >
              Reset
            </button>
          )}
        </form>
      </div>

      {/* Train Cards List or Skeleton Loaders */}
      {loading ? (
        <div className="space-y-4">
          <TrainCardSkeleton />
          <TrainCardSkeleton />
          <TrainCardSkeleton />
        </div>
      ) : trains.length > 0 ? (
        <div className="space-y-4">
          {trains.map((train) => (
            <TrainCard key={train.id || train.trainNumber} train={train} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 p-10 text-center rounded-lg text-white space-y-2">
          <h3 className="text-lg font-bold text-slate-300">No Trains Found</h3>
          <p className="text-xs text-slate-400">Try adjusting your source or destination dropdown selections.</p>
          <button
            onClick={handleReset}
            className="mt-3 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-xs font-semibold"
          >
            View All Available Trains
          </button>
        </div>
      )}
    </div>
  );
}

