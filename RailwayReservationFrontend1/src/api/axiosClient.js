import axios from "axios";

/**
 * Beginner-Friendly Axios Client
 * Connects frontend to API Gateway running on http://localhost:8080
 */
const axiosClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach Bearer JWT Token to all outgoing requests if user is logged in
axiosClient.interceptors.request.use(
  (config) => {
    // Do not send Authorization header for auth endpoints
    if (!config.url || !config.url.includes("/api/auth")) {
      const token = localStorage.getItem("token");
      if (token && token.length > 20 && !token.startsWith("mock-")) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 Unauthorized and network errors gracefully
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("401 Unauthorized: Session token expired or invalid. Clearing token for:", error.config?.url);
      localStorage.removeItem("token");
    } else if (!error.response) {
      console.warn("Network/CORS Notice: Backend API Gateway (http://localhost:8080) unreachable or starting up.");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
