import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Train, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      const roleUpper = (res.user?.role || "").toUpperCase();
      const cleanEmail = (res.user?.email || "").toLowerCase().trim();

      if (
        roleUpper === "SUPERUSER" ||
        cleanEmail.includes("superuser") ||
        cleanEmail.includes("1234")
      ) {
        navigate("/admin?tab=CREATE_ADMIN");
      } else if (
        roleUpper === "ADMIN" ||
        cleanEmail.includes("123")
      ) {
        navigate("/admin?tab=TRAINS");
      } else {
        navigate("/");
      }
    } else {
      setError(res.message);
    }
  }

  function handleQuickFill(eMail, pWord) {
    setEmail(eMail);
    setPassword(pWord);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="bg-white/95 backdrop-blur-md border border-blue-100 text-slate-900 w-full max-w-md p-8 rounded-3xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white flex items-center justify-center mx-auto font-black shadow-lg shadow-blue-500/25">
            <Train className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to RailReserve</h2>
          <p className="text-xs text-slate-500 font-medium">
            Enter your credentials to access express train reservations & admin tools
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                placeholder="e.g. rahul1234@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 cursor-pointer mt-2"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Login to Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Fill buttons */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Quick Login Presets</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickFill("rahulsrichunar@gmail.com", "123")}
              className="p-2 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 text-emerald-900 rounded-lg font-bold text-center transition truncate"
            >
              Passenger Login
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("rahul123@gmail.com", "rahul123")}
              className="p-2 bg-indigo-100 hover:bg-indigo-200 border border-indigo-300 text-indigo-900 rounded-lg font-bold text-center transition truncate"
            >
              Admin Login
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("rahul1234@gmail.com", "rahul1234")}
              className="p-2 bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 rounded-lg font-bold text-center transition truncate"
            >
              Superuser Login
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-600 font-medium">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-black">
            Register New Account
          </Link>
        </div>
      </div>
    </div>
  );
}
