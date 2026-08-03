import React from "react";
import StatusBadge from "./StatusBadge";
import { downloadTicketPdf } from "../utils/pdfGenerator";

export default function PnrResultCard({
  booking,
  payment,
  cancelling,
  handleCancelTicket,
}) {
  const pnr = booking?.pnrNumber || booking?.pnr || "PNR12345678";
  const fare = booking?.totalFare || booking?.fare || 650;
  const status = booking?.status || "CONFIRMED";
  const isCancelled = status === "CANCELLED";

  return (
    <div className="bg-slate-900 text-white p-6 rounded-lg border border-slate-800 space-y-5 shadow-xl">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-medium">
            Ticket PNR Number
          </span>
          <span className="text-xl font-bold font-mono text-indigo-400">
            {pnr}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <StatusBadge status={status} />
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
          <span className="text-slate-400 block">Train</span>
          <span className="font-semibold text-white">
            {booking.trainName || `Train #${booking.trainNumber || booking.trainId}`}
          </span>
          <span className="text-slate-400 block">
            {booking.sourceStation || "Origin"} ➔ {booking.destinationStation || "Destination"}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block">Class & Seat</span>
          <span className="font-semibold text-indigo-300">
            {booking.travelClass || booking.seatClass}
          </span>
          <span className="text-slate-400 block">
            Seat #{booking.seatNumber || "B1-12"}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block">Total Fare</span>
          <span className="font-bold text-green-400 text-sm">
            ₹{fare}
          </span>
          <span className="text-slate-400 block">{booking.travelDate || booking.journeyDate}</span>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-4 flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => downloadTicketPdf(booking, payment)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded text-xs font-semibold flex items-center gap-1 transition shadow"
          >
            📥 Download PDF
          </button>
          <button
            onClick={() => window.print()}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded text-xs font-semibold"
          >
            🖨️ Print Ticket
          </button>
        </div>

        {!isCancelled && (
          <button
            onClick={handleCancelTicket}
            disabled={cancelling}
            className="bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-500/40 px-4 py-2 rounded text-xs font-semibold transition"
          >
            {cancelling ? "Cancelling..." : "Cancel & Request Refund"}
          </button>
        )}
      </div>
    </div>
  );
}
