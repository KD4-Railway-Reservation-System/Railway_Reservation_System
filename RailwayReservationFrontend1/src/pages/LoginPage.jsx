import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    console.log(e);
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await login(email, password);
    console.log(res);
    setLoading(false);

    if (res.success) {
      navigate("/");
    } else {
      setError(res.message);
    }
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-8">
      <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-md p-6 rounded-lg shadow-xl space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold">Sign In to RailReserve</h2>
          <p className="text-xs text-slate-400">
            Enter your credentials to manage your bookings
          </p>
        </div>

        {error && (
          <div className="p-2.5 bg-red-900/50 border border-red-500 text-red-200 text-xs rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="e.g. rahulsrichunar@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Password *
            </label>
            <input
              type="password"
              required
              placeholder="Enter password (e.g. 123)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold py-2.5 rounded text-white text-sm transition mt-2"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:underline">
            Register Account
          </Link>
        </div>
      </div>
    </div>
  );
}
