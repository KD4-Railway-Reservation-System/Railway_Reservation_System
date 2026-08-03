import axiosClient from "./axiosClient";

/**
 * Default station list fallback for Indian Railways
 */
const DEFAULT_STATIONS = [
  { id: 1, stationId: 1, stationCode: "NDLS", stationName: "New Delhi", city: "New Delhi" },
  { id: 2, stationId: 2, stationCode: "MMCT", stationName: "Mumbai Central", city: "Mumbai" },
  { id: 3, stationId: 3, stationCode: "BPL",  stationName: "Bhopal Junction", city: "Bhopal" },
  { id: 4, stationId: 4, stationCode: "BSB",  stationName: "Varanasi Junction", city: "Varanasi" },
  { id: 5, stationId: 5, stationCode: "SDAH", stationName: "Kolkata Sealdah", city: "Kolkata" },
  { id: 6, stationId: 6, stationCode: "SBC",  stationName: "Bengaluru City", city: "Bengaluru" },
  { id: 7, stationId: 7, stationCode: "MAS",  stationName: "Chennai Central", city: "Chennai" },
  { id: 8, stationId: 8, stationCode: "ASR",  stationName: "Amritsar Junction", city: "Amritsar" },
  { id: 9, stationId: 9, stationCode: "ADI",  stationName: "Ahmedabad Junction", city: "Ahmedabad" },
  { id: 10, stationId: 10, stationCode: "JP", stationName: "Jaipur Junction", city: "Jaipur" },
  { id: 11, stationId: 11, stationCode: "LKO", stationName: "Lucknow Charbagh", city: "Lucknow" },
  { id: 12, stationId: 12, stationCode: "SC", stationName: "Hyderabad Secunderabad", city: "Hyderabad" },
  { id: 13, stationId: 13, stationCode: "PUNE", stationName: "Pune Junction", city: "Pune" },
  { id: 14, stationId: 14, stationCode: "HWH", stationName: "Howrah Junction", city: "Kolkata" },
  { id: 15, stationId: 15, stationCode: "PNBE", stationName: "Patna Junction", city: "Patna" }
];

// 1. Authentication APIs (Auth Service - Port 8081)
export const authApi = {
  login: (credentials) => axiosClient.post("/api/auth/login", credentials),
  register: (userData) => axiosClient.post("/api/auth/register", userData),
  createAdmin: (adminData) => axiosClient.post("/api/auth/create-admin", adminData),
};

// 2. Train & Station APIs (Train Service - Port 8082)
export const trainApi = {
  getAllTrains: () => axiosClient.get("/api/trains"),
  getTrainById: (id) => axiosClient.get(`/api/trains/${id}`),
  getTrainByNumber: (trainNumber) => axiosClient.get(`/api/trains/number/${trainNumber}`),
  searchTrains: (source, destination) => {
    let url = "/api/trains/search";
    const params = [];
    if (source) params.push(`source=${encodeURIComponent(source)}`);
    if (destination) params.push(`destination=${encodeURIComponent(destination)}`);
    if (params.length > 0) url += "?" + params.join("&");
    return axiosClient.get(url);
  },
  getAllStations: async () => {
    try {
      const res = await axiosClient.get("/api/trains/stations");
      return res;
    } catch (err) {
      return { data: DEFAULT_STATIONS };
    }
  },
  addTrain: (trainData) => axiosClient.post("/api/trains", trainData),
  updateTrain: (id, trainData) => axiosClient.put(`/api/trains/${id}`, trainData),
  deleteTrain: (id) => axiosClient.delete(`/api/trains/${id}`),
};

// 3. Ticket Booking APIs (Booking Service - Port 8083)
export const bookingApi = {
  createBooking: (bookingData) => axiosClient.post("/api/bookings", bookingData),
  getBookingById: (id) => axiosClient.get(`/api/bookings/${id}`),
  getBookingByPnr: (pnrNumber) => axiosClient.get(`/api/bookings/pnr/${pnrNumber}`),
  getMyBookings: () => axiosClient.get("/api/bookings/my-bookings"),
  getBookingsByUserId: (userId) => axiosClient.get(`/api/bookings/user/${userId}`),
  cancelBooking: (pnrNumber) => axiosClient.put(`/api/bookings/cancel/${pnrNumber}`),
  getAllBookings: () => axiosClient.get("/api/bookings"),
};

// 4. Payment Processing APIs (Payment Service - Port 8085)
export const paymentApi = {
  processPayment: (paymentData) => axiosClient.post("/api/payments/process", paymentData),
  getPaymentByPnr: (pnrNumber) => axiosClient.get(`/api/payments/pnr/${pnrNumber}`),
  getMyPayments: () => axiosClient.get("/api/payments/my-payments"),
  processRefund: (pnrNumber) => axiosClient.post(`/api/payments/refund/${pnrNumber}`),
  getAllPayments: () => axiosClient.get("/api/payments"),
};

// 5. Notification & Alert APIs (Notification Service - Port 8086)
export const notificationApi = {
  sendNotification: (notificationData) => axiosClient.post("/api/notifications/send", notificationData),
  getUserNotifications: (userId) => axiosClient.get(`/api/notifications/user/${userId}`),
  markAsRead: (notificationId) => axiosClient.put(`/api/notifications/${notificationId}/read`),
  getAllNotifications: () => axiosClient.get("/api/notifications"),
};
