import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { trainApi, bookingApi } from "../api/apiService";
import { useAuth } from "../context/AuthContext";
import PaymentModal from "../components/PaymentModal";

import FareSummary from "../components/FareSummary";
import PassengerForm from "../components/PassengerForm";

export default function BookingPage() {
  const { trainId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [passengerName, setPassengerName] = useState(user?.fullName || "");
  const [passengerAge, setPassengerAge] = useState(25);
  const [passengerGender, setPassengerGender] = useState("MALE");
  const [seatClass, setSeatClass] = useState("3AC");
  const [journeyDate, setJourneyDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [createdBooking, setCreatedBooking] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/book/" + trainId);
      return;
    }

    async function getTrain() {
      try {
        const res = await trainApi.getTrainById(trainId);
        setTrain(res.data);
      } catch (err) {
        setError("Failed to load train details.");
      }
      setLoading(false);
    }
    getTrain();
  }, [trainId, isAuthenticated, navigate]);

  function calculateFare() {
    const base = train?.fare || 750;
    if (seatClass === "1AC") return Math.round(base * 2.5);
    if (seatClass === "2AC") return Math.round(base * 1.8);
    if (seatClass === "3AC") return Math.round(base * 1.3);
    return Math.round(base);
  }

  async function handleBookTicket(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const fare = calculateFare();
      const bookingData = {
        trainId: Number(trainId),
        sourceStationId: train?.sourceStationId || 1,
        destinationStationId: train?.destinationStationId || 2,
        passengerName,
        passengerAge: Number(passengerAge),
        passengerGender,
        seatClass,
        journeyDate,
        fare,
      };

      const userId = user?.userId || 1;
      const res = await bookingApi.bookTicket(userId, bookingData);
      setCreatedBooking(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Check details.");
    }
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-slate-400">
        Loading reservation form...
      </div>
    );
  }

  if (error && !train) {
    return (
      <div className="max-w-md mx-auto py-10 text-center text-red-400 bg-slate-900 p-6 rounded border border-slate-700">
        <p>{error}</p>
        <button
          onClick={() => navigate("/trains")}
          className="mt-4 px-4 py-2 bg-slate-800 text-white rounded text-xs"
        >
          Back to Trains
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-slate-800 text-white p-5 rounded-lg border border-slate-700 shadow">
        <h2 className="text-xl font-bold text-indigo-300">
          {train?.trainName}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Train #{train?.trainNumber} | Route: {train?.source || "Origin"} ➔{" "}
          {train?.destination || "Destination"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PassengerForm
          passengerName={passengerName}
          setPassengerName={setPassengerName}
          passengerAge={passengerAge}
          setPassengerAge={setPassengerAge}
          passengerGender={passengerGender}
          setPassengerGender={setPassengerGender}
          seatClass={seatClass}
          setSeatClass={setSeatClass}
          journeyDate={journeyDate}
          setJourneyDate={setJourneyDate}
          submitting={submitting}
          calculateFare={calculateFare}
          handleBookTicket={handleBookTicket}
          error={error}
        />

        <FareSummary
          train={train}
          seatClass={seatClass}
          calculateFare={calculateFare}
        />
      </div>

      {createdBooking && (
        <PaymentModal
          booking={createdBooking}
          onClose={() => {
            setCreatedBooking(null);
            navigate("/my-bookings");
          }}
          onSuccess={() => {
            navigate("/my-bookings");
          }}
        />
      )}
    </div>
  );
}
