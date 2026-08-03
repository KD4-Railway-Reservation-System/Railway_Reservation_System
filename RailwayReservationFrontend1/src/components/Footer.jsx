import React from "react";
import { Train, ShieldCheck, PhoneCall, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-blue-200/80 bg-white/90 backdrop-blur-md text-slate-700 py-10 mt-16 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <Train className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-slate-900">RailReserve Express</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Next-generation microservices-powered Indian Railway reservation platform for seamless nationwide travel booking.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a href="/trains" className="hover:text-blue-600 transition-colors text-slate-600">
                  Search Trains
                </a>
              </li>
              <li>
                <a href="/pnr-status" className="hover:text-blue-600 transition-colors text-slate-600">
                  PNR Status Inquiry
                </a>
              </li>
              <li>
                <a href="/my-bookings" className="hover:text-blue-600 transition-colors text-slate-600">
                  My Bookings
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              System Microservices
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>API Gateway & Security</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Eureka Discovery Server</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Train, Booking & Payment Services</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Customer Support
            </h4>
            <p className="text-xs text-slate-600 mb-1 flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
              <span>24/7 Helpline Desk</span>
            </p>
            <p className="text-base font-black text-blue-700">
              1800-RAIL-RESERVE
            </p>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>support@railreserve.com</span>
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} RailReserve Express Portal. Indian Railways Reservation System.</p>
          <div className="flex items-center space-x-4 mt-3 md:mt-0 font-medium">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span className="flex items-center space-x-1 text-emerald-600 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>256-Bit SSL Encrypted</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
