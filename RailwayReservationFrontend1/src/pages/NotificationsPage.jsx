import React, { useState, useEffect } from "react";
import { notificationApi } from "../api/apiService";
import { useAuth } from "../context/AuthContext";
import { Bell, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export default function NotificationsPage() {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user?.userId) {
      loadUserNotifications();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  async function loadUserNotifications() {
    setLoading(true);
    try {
      const res = await notificationApi.getUserNotifications(user?.userId || 1);
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("Error loading notifications", err);
    }
    setLoading(false);
  }

  async function handleMarkAsRead(id) {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true, isRead: true } : n))
      );
    } catch (err) {
      console.log("Error marking notification read", err);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white/95 backdrop-blur-md border border-blue-100 text-slate-900 p-6 rounded-3xl flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">My Notifications & Alerts</h2>
            <p className="text-xs text-slate-500 font-medium">
              Booking confirmations, cancellation updates, and journey alerts
            </p>
          </div>
        </div>
        <button
          onClick={loadUserNotifications}
          className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500 font-semibold text-sm">
          Loading notifications...
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => {
            const isRead = n.isRead || n.read;
            return (
              <div
                key={n.id}
                className={`p-5 rounded-2xl border transition space-y-2 shadow-md ${
                  isRead
                    ? "bg-white/80 border-slate-200 text-slate-700"
                    : "bg-white border-blue-300 text-slate-900 shadow-blue-500/5 ring-1 ring-blue-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                      {!isRead && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                      <span>{n.subject}</span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 font-medium">{n.message}</p>
                  </div>
                  {!isRead && (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-300 px-3 py-1 rounded-lg text-xs font-bold transition"
                    >
                      Mark as read
                    </button>
                  )}
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-500 border-t border-slate-100 pt-2.5 mt-2">
                  <span>Type: <strong className="text-slate-800">{n.type || "IN_APP"}</strong></span>
                  <span>{n.sentAt ? new Date(n.sentAt).toLocaleString() : "Recently sent"}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white/95 backdrop-blur-md border border-blue-100 p-12 text-center rounded-3xl text-slate-900 space-y-2 shadow-xl">
          <Bell className="w-12 h-12 text-slate-300 mx-auto stroke-1" />
          <h3 className="text-base font-black text-slate-900">No Notifications</h3>
          <p className="text-xs text-slate-500 font-medium">
            You don't have any notification alerts at this time.
          </p>
        </div>
      )}
    </div>
  );
}
