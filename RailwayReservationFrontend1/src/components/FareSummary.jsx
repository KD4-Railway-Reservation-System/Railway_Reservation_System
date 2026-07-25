import React from "react";

export default function FareSummary({ train, seatClass, calculateFare }) {
  return (
    <div className="bg-slate-900 text-white p-5 rounded-lg border border-slate-700 space-y-4 h-fit">
      <h4 className="font-bold border-b border-slate-700 pb-2 text-sm">
        Fare Details
      </h4>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between text-slate-400">
          <span>Base Ticket Fare</span>
          <span className="text-white">₹{train?.fare || 750}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Selected Class</span>
          <span className="text-indigo-400 font-semibold">{seatClass}</span>
        </div>
        <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold">
          <span>Total Fare</span>
          <span className="text-indigo-400 text-lg">₹{calculateFare()}</span>
        </div>
      </div>
    </div>
  );
}
