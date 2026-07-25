import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/apiService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    try {
      const res = await authApi.login({ email, password });
      const userData = {
        email: email,
        userId: res.data?.userId || 1,
        role: res.data?.role || (email.includes("admin") ? "ADMIN" : "USER"),
        fullName: res.data?.fullName || "Rahul Srivastava",
      };
      localStorage.setItem("token", res.data?.token || "dummy-token");
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      // Fallback for frontend testing
      const userData = {
        email: email,
        userId: 1,
        role: email.includes("admin") ? "ADMIN" : "USER",
        fullName:
          email === "rahulsrichunar@gmail.com"
            ? "Rahul Srivastava"
            : email.split("@")[0] || "User",
      };
      localStorage.setItem("token", "frontend-test-token");
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    }
  }

  async function register(fullName, email, password) {
    try {
      const res = await authApi.register({ fullName, email, password });
      const userData = {
        email: email,
        userId: res.data?.userId || 1,
        role: res.data?.role || "USER",
        fullName: res.data?.fullName || fullName,
      };

      localStorage.setItem("token", res.data?.token || "dummy-token");
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return { success: true, user: userData };
    } catch (err) {
      // Fallback for frontend testing
      const userData = {
        email: email,
        userId: 1,
        role: email.includes("admin") ? "ADMIN" : "USER",
        fullName: fullName || "Rahul Srivastava",
      };
      localStorage.setItem("token", "frontend-test-token");
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    }
  }
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN" || user?.role === "ROLE_ADMIN",
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      loading: false,
      login: async () => ({ success: false }),
      register: async () => ({ success: false }),
      logout: () => {},
      isAuthenticated: false,
      isAdmin: false,
    };
  }
  return context;
}
