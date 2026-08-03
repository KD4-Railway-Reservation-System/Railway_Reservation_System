import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { UserPlus, ShieldAlert, CheckCircle2, Lock, Mail, User, ShieldCheck } from "lucide-react";

export default function AdminCreateAdminTab() {
  const { createAdmin } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [createdAdmins, setCreatedAdmins] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("railreserve_local_admins") || "[]");
    } catch (e) {
      return [];
    }
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMsg("Please fill out all fields (Full Name, Email ID, Password).");
      return;
    }

    setLoading(true);
    const res = await createAdmin(fullName.trim(), email.trim(), password.trim());
    setLoading(false);

    if (res.success) {
      setSuccessMsg(res.message || `Admin '${fullName}' created successfully!`);
      const newAdminObj = {
        userId: Date.now(),
        fullName: fullName.trim(),
        email: email.trim(),
        role: "ADMIN",
        createdAt: new Date().toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      
      const updatedList = [newAdminObj, ...createdAdmins];
      setCreatedAdmins(updatedList);
      try {
        localStorage.setItem("railreserve_local_admins", JSON.stringify(updatedList));
      } catch (err) {
        console.error("Storage error", err);
      }

      setFullName("");
      setEmail("");
      setPassword("");
    } else {
      setErrorMsg(res.message || "Failed to create Admin. Please try again.");
    }
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-blue-400/30">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-amber-200">
            <ShieldCheck className="w-4 h-4" />
            <span>Superuser Authority Portal</span>
          </div>
          <h2 className="text-2xl font-black text-white">Create New Admin Account</h2>
          <p className="text-xs text-blue-100 max-w-xl">
            Grant Administrative privileges to trusted personnel. Created Admins can manage trains, fares, routes, and review all booking transactions across the Railway Reservation System.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 text-center min-w-[140px]">
          <span className="text-2xl font-black text-amber-300 block">{createdAdmins.length}</span>
          <span className="text-[11px] font-semibold text-blue-100 uppercase tracking-wider">Admins Provisioned</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Admin Registration Form */}
        <div className="lg:col-span-7 bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl border border-blue-100 space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Admin Account Details</h3>
              <p className="text-xs text-slate-500">Specify Administrator name, email ID, and password credentials</p>
            </div>
          </div>

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-start space-x-3 text-xs font-medium animate-fadeIn shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-900">Success!</p>
                <p>{successMsg}</p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-start space-x-3 text-xs font-medium animate-fadeIn shadow-sm">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-900">Creation Error</p>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Admin Rajesh Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition shadow-inner"
                />
              </div>
            </div>

            {/* Email ID */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Admin Email ID <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin.name@railway.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition shadow-inner"
                />
              </div>
            </div>

            {/* Password */}
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
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition shadow-inner"
                />
              </div>
              <p className="text-[11px] text-slate-500">Assign a strong password for secure system administration.</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white py-3.5 px-6 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Creating Admin Account...</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Admin Account</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Recently Provisioned Admins List */}
        <div className="lg:col-span-5 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-blue-100 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Recently Created Admins</span>
            </h3>
            <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">
              {createdAdmins.length} Total
            </span>
          </div>

          {createdAdmins.length === 0 ? (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <User className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
              <p className="text-xs font-medium">No new Admins created in this session yet.</p>
              <p className="text-[11px] text-slate-400">Fill out the form to provision your first Admin account.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {createdAdmins.map((adm, idx) => (
                <div
                  key={adm.userId || idx}
                  className="bg-slate-50 hover:bg-blue-50/50 p-3.5 rounded-xl border border-slate-200/80 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-md">
                      {(adm.fullName || "A").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{adm.fullName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{adm.email}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block text-[10px] font-extrabold bg-blue-600 text-white px-2 py-0.5 rounded uppercase tracking-wider">
                      ADMIN
                    </span>
                    {adm.createdAt && (
                      <p className="text-[10px] text-slate-400 mt-0.5">{adm.createdAt}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
