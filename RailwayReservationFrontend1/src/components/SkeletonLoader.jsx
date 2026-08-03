import React from "react";

/**
 * Shimmering Skeleton Loader for Train Cards
 */
export function TrainCardSkeleton() {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 animate-pulse shadow-lg">
      <div className="flex justify-between items-center pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800"></div>
          <div className="space-y-2">
            <div className="w-44 h-4 bg-slate-800 rounded"></div>
            <div className="w-20 h-3 bg-slate-800/60 rounded"></div>
          </div>
        </div>
        <div className="w-28 h-6 bg-slate-800/70 rounded-full"></div>
      </div>

      <div className="grid grid-cols-3 items-center py-4 text-center">
        <div className="space-y-2">
          <div className="w-12 h-3 bg-slate-800 rounded mx-auto sm:mx-0"></div>
          <div className="w-24 h-5 bg-slate-800 rounded mx-auto sm:mx-0"></div>
          <div className="w-16 h-3 bg-slate-800/60 rounded mx-auto sm:mx-0"></div>
        </div>
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-16 h-3 bg-slate-800 rounded"></div>
          <div className="w-28 h-1 bg-slate-800 rounded-full"></div>
          <div className="w-12 h-2 bg-slate-800/60 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="w-12 h-3 bg-slate-800 rounded mx-auto sm:ml-auto"></div>
          <div className="w-24 h-5 bg-slate-800 rounded mx-auto sm:ml-auto"></div>
          <div className="w-16 h-3 bg-slate-800/60 rounded mx-auto sm:ml-auto"></div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
        <div className="flex space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-12 h-6 bg-slate-800 rounded"></div>
          ))}
        </div>
        <div className="w-24 h-9 bg-indigo-900/50 rounded-lg"></div>
      </div>
    </div>
  );
}

/**
 * Shimmering Skeleton Loader for Ticket Cards on My Bookings page
 */
export function TicketSkeleton() {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4 animate-pulse shadow-lg">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div className="space-y-1">
          <div className="w-16 h-3 bg-slate-800 rounded"></div>
          <div className="w-32 h-5 bg-slate-800 rounded"></div>
        </div>
        <div className="w-20 h-6 bg-slate-800 rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="w-28 h-4 bg-slate-800 rounded"></div>
          <div className="w-20 h-3 bg-slate-800/60 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="w-32 h-4 bg-slate-800 rounded"></div>
          <div className="w-24 h-3 bg-slate-800/60 rounded"></div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
        <div className="w-20 h-4 bg-slate-800 rounded"></div>
        <div className="w-24 h-8 bg-slate-800 rounded"></div>
      </div>
    </div>
  );
}

/**
 * Full Page Loading Spinner with Pulsing Logo
 */
export function PageSpinner({ message = "Loading live data..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] py-12 space-y-4 text-center">
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
        <div className="absolute w-8 h-8 rounded-full bg-indigo-600/30 flex items-center justify-center text-indigo-400 font-bold text-xs animate-pulse">
          🚆
        </div>
      </div>
      <p className="text-sm font-medium text-slate-300 animate-pulse">{message}</p>
    </div>
  );
}
