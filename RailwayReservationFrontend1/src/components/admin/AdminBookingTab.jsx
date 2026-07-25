import React from "react";
import StatusBadge from "../StatusBadge";

export default function AdminBookingTab({ bookings }) {
  return (
    <div className="bg-slate-900 border border-slate-700 text-white p-5 rounded-lg space-y-4">
      <h3 className="font-bold border-b border-slate-700 pb-2 text-sm">
        All User Bookings
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left text-slate-300">
          <thead className="bg-slate-800 text-slate-400 border-b border-slate-700">
            <tr>
              <th className="p-2.5">PNR</th>
              <th className="p-2.5">Passenger</th>
              <th className="p-2.5">Train ID</th>
              <th className="p-2.5">Seat</th>
              <th className="p-2.5">Fare</th>
              <th className="p-2.5">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr
                key={b.bookingId || b.id}
                className="border-b border-slate-800 hover:bg-slate-800/50"
              >
                <td className="p-2.5 font-mono text-indigo-300">{b.pnr}</td>
                <td className="p-2.5">
                  {b.passengerName} ({b.passengerAge})
                </td>
                <td className="p-2.5">#{b.trainId}</td>
                <td className="p-2.5">
                  {b.seatClass} #{b.seatNumber}
                </td>
                <td className="p-2.5 text-green-400 font-bold">₹{b.fare}</td>
                <td className="p-2.5">
                  <StatusBadge status={b.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
