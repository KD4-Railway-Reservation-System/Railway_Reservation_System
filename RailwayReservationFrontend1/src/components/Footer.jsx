import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 text-slate-400 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-lg font-bold text-white">RailReserve</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Next-generation microservices-powered railway reservation platform
              for seamless nationwide travel booking.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/trains"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Search Trains
                </a>
              </li>
              <li>
                <a
                  href="/pnr-status"
                  className="hover:text-indigo-400 transition-colors"
                >
                  PNR Status Inquiry
                </a>
              </li>
              <li>
                <a
                  href="/my-bookings"
                  className="hover:text-indigo-400 transition-colors"
                >
                  My Bookings
                </a>
              </li>
            </ul>
          </div>

          {/* Microservice Architecture */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              System Services
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>API Gateway & JWT Security</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Eureka Discovery Server</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Train, Booking & Payment Services</span>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Support & Help
            </h4>
            <p className="text-sm text-slate-400 mb-2">
              24/7 Customer Care Desk
            </p>
            <p className="text-lg font-bold text-indigo-400">
              1800-RAIL-RESERVE
            </p>
            <p className="text-xs text-slate-500 mt-2">
              support@railreserve.com
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800/60 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span className="flex items-center space-x-1 text-slate-400">
              <span>256-Bit SSL Encrypted</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
