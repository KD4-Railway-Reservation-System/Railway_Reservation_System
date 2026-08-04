import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { trainApi } from "../api/apiService";
import TrainSearchForm from "../components/TrainSearchForm";
import { Train, ShieldCheck, Zap, CreditCard, Sparkles, MapPin } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [sourceId, setSourceId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [journeyDate, setJourneyDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [seatClass, setSeatClass] = useState("ALL");
  const [quota, setQuota] = useState("GENERAL");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

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
          setSourceId(defaultSource.stationName || defaultSource.city || "");
          setDestinationId(defaultDest.stationName || defaultDest.city || "");
        }
      } catch (err) {
        console.log("Error loading stations", err);
      }
      setLoading(false);
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

    const today = new Date().toISOString().substring(0, 10);
    if (journeyDate && journeyDate < today) {
      setErrorMsg("Journey date cannot be in the past. Please select today or a future date.");
      return;
    }

    if (sourceId && destinationId && sourceId === destinationId) {
      setErrorMsg("Source and Destination stations cannot be the same.");
      return;
    }

    navigate(
      `/trains?source=${encodeURIComponent(sourceId)}&destination=${encodeURIComponent(destinationId)}&date=${journeyDate}&class=${seatClass}&quota=${quota}`
    );
  }

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Banner with Generated Background */}
      <div className="relative rounded-3xl overflow-hidden hero-banner-bg border border-blue-600/30 shadow-2xl p-8 sm:p-12 text-center text-white space-y-6">
        <div className="inline-flex items-center space-x-2 bg-white/20 border border-white/30 px-4 py-1.5 rounded-full text-xs font-black text-amber-300 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Next-Gen Indian Railways Reservation Portal</span>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
            Book Train Tickets <span className="text-amber-300">Instantly</span> & <span className="text-cyan-300">Smarter</span>
          </h1>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed font-medium">
            Search live express trains, choose your seats, download instant E-Tickets PDF, and pay securely via Razorpay.
          </p>
        </div>

        {/* Live Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto pt-4 text-left">
          <div className="bg-white/15 backdrop-blur-md p-3.5 rounded-xl flex items-center space-x-3 border border-white/20">
            <div className="w-9 h-9 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black text-white">24+ Routes</p>
              <p className="text-[11px] text-blue-100 font-medium">Express Trains</p>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-md p-3.5 rounded-xl flex items-center space-x-3 border border-white/20">
            <div className="w-9 h-9 rounded-lg bg-emerald-400 text-slate-950 flex items-center justify-center font-black">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black text-white">Instant PDF</p>
              <p className="text-[11px] text-blue-100 font-medium">E-Ticket Download</p>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-md p-3.5 rounded-xl flex items-center space-x-3 border border-white/20">
            <div className="w-9 h-9 rounded-lg bg-cyan-400 text-slate-950 flex items-center justify-center font-black">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black text-white">₹1 Sleeper</p>
              <p className="text-[11px] text-blue-100 font-medium">Razorpay Test Fare</p>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-md p-3.5 rounded-xl flex items-center space-x-3 border border-white/20">
            <div className="w-9 h-9 rounded-lg bg-sky-300 text-slate-950 flex items-center justify-center font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black text-white">100% Safe</p>
              <p className="text-[11px] text-blue-100 font-medium">Secured Payments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Search Form Component */}
      <div className="max-w-4xl mx-auto px-2">
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
          loadingStations={loading}
        />
      </div>

      {/* Features Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-2">
        <div className="bg-white/95 backdrop-blur-md hover:bg-white p-6 rounded-2xl border border-blue-100 shadow-lg transition-all space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
            <Train className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900">24 Live Express Routes</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Covers major Indian Railway corridors including New Delhi, Mumbai Rajdhani, Vande Bharat, Duronto, and Shatabdi.
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-md hover:bg-white p-6 rounded-2xl border border-blue-100 shadow-lg transition-all space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Instant PDF E-Ticket</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Download your official electronic train tickets in PDF format immediately after booking or look up by PNR anytime.
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-md hover:bg-white p-6 rounded-2xl border border-blue-100 shadow-lg transition-all space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Razorpay Test Sandbox</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Test live payment checkouts safely with test mode pricing: ₹1 Sleeper, ₹2 3AC, ₹3 2AC, and ₹4 1AC.
          </p>
        </div>
      </div>
    </div>
  );
}

