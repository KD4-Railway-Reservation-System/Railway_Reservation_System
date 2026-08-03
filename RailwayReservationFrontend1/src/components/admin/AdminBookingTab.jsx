import React from "react";
import StatusBadge from "../StatusBadge";

export default function AdminBookingTab({ bookings }) {
  return (
    <div className="bg-slate-900 border border-slate-700 text-white p-5 rounded-lg space-y-4 shadow">
      <h3 className="font-bold border-b border-slate-700 pb-2 text-sm text-indigo-400">
        All Ticket Bookings Across Microservices ({bookings.length})
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left text-slate-300">
          <thead className="bg-slate-800 text-slate-400 border-b border-slate-700">
            <tr>
              <th className="p-2.5">PNR Number</th>
              <th className="p-2.5">Passenger</th>
              <th className="p-2.5">Train Details</th>
              <th className="p-2.5">Route</th>
              <th className="p-2.5">Class & Seat</th>
              <th className="p-2.5">Total Fare</th>
              <th className="p-2.5">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => {
              const pnr = b.pnrNumber || b.pnr || "PNR12345678";
              const fare = b.totalFare || b.fare || 650;
              const status = b.status || "CONFIRMED";
              return (
                <tr
                  key={b.id || pnr}
                  className="border-b border-slate-800 hover:bg-slate-800/50"
                >
                  <td className="p-2.5 font-mono text-indigo-400 font-bold">{pnr}</td>
                  <td className="p-2.5 font-semibold text-white">
                    {b.passengerName} ({b.passengerAge} yrs)
                  </td>
                  <td className="p-2.5">
                    {b.trainName || `Train #${b.trainNumber || b.trainId}`}
                  </td>
                  <td className="p-2.5 text-slate-300">
                    {b.sourceStation || "Origin"} ➔ {b.destinationStation || "Destination"}
                  </td>
                  <td className="p-2.5 text-indigo-300 font-semibold">
                    {b.travelClass || b.seatClass} (#{b.seatNumber || "B1-12"})
                  </td>
                  <td className="p-2.5 text-green-400 font-bold">₹{fare}</td>
                  <td className="p-2.5">
                    <StatusBadge status={status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
