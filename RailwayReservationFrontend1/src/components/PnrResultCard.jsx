import React from "react";
import StatusBadge from "./StatusBadge";

export default function PnrResultCard({
  booking,
  payment,
  cancelling,
  handleCancelTicket,
}) {
  return (
    <div className="bg-slate-800 text-white p-6 rounded-lg border border-slate-700 space-y-5 shadow">
      <div className="flex justify-between items-center border-b border-slate-700 pb-3">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase">
            Ticket PNR
          </span>
          <span className="text-xl font-bold font-mono text-indigo-300">
            {booking.pnr}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <StatusBadge status={booking.status} />
          {payment && (
            <StatusBadge
              status={payment.status === "REFUNDED" ? "REFUNDED" : "PAID"}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-400 block">Passenger</span>
          <span className="font-semibold text-white">
            {booking.passengerName}
          </span>
          <span className="text-slate-400 block">
            {booking.passengerAge} yrs | {booking.passengerGender}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block">Train ID</span>
          <span className="font-semibold text-white">#{booking.trainId}</span>
        </div>

        <div>
          <span className="text-slate-400 block">Class & Seat</span>
          <span className="font-semibold text-indigo-300">
            {booking.seatClass}
          </span>
          <span className="text-slate-400 block">
            Seat #{booking.seatNumber}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block">Total Fare</span>
          <span className="font-bold text-green-400 text-sm">
            ₹{booking.fare}
          </span>
          <span className="text-slate-400 block">{booking.journeyDate}</span>
        </div>
      </div>

      <div className="border-t border-slate-700 pt-4 flex justify-between items-center">
        <button
          onClick={() => window.print()}
          className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded text-xs"
        >
          🖨️ Print Ticket
        </button>

        {booking.status === "BOOKED" && (
          <button
            onClick={handleCancelTicket}
            disabled={cancelling}
            className="bg-red-700 hover:bg-red-800 text-white px-3 py-1.5 rounded text-xs font-semibold"
          >
            {cancelling ? "Cancelling..." : "Cancel Ticket"}
          </button>
        )}
      </div>
    </div>
  );
}
