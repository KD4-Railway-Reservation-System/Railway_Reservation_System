import axiosClient from "./axiosClient";

// Auth APIs
export const authApi = {
  login: (data) => axiosClient.post("/api/auth/login", data),
  register: (data) => axiosClient.post("/api/auth/register", data),
};

// Train & Station APIs
export const trainApi = {
  getAllTrains: () => axiosClient.get("/api/trains"),
  getTrainById: (id) => axiosClient.get(`/api/trains/${id}`),
  searchTrains: (sourceId, destId) =>
    axiosClient.get(
      `/api/trains/search?sourceStationId=${sourceId}&destinationStationId=${destId}`,
    ),
  createTrain: (data) => axiosClient.post("/api/trains", data),
  updateTrain: (id, data) => axiosClient.put(`/api/trains/${id}`, data),
  deleteTrain: (id) => axiosClient.delete(`/api/trains/${id}`),

  getAllStations: () => axiosClient.get("/api/stations"),
  createStation: (data) => axiosClient.post("/api/stations", data),
  deleteStation: (id) => axiosClient.delete(`/api/stations/${id}`),
};

// Booking APIs
export const bookingApi = {
  bookTicket: (userId, data) =>
    axiosClient.post(`/api/bookings?userId=${userId}`, data),
  getBooking: (id) => axiosClient.get(`/api/bookings/${id}`),
  getUserBookings: (userId) => axiosClient.get(`/api/bookings/user/${userId}`),
  getAllBookings: () => axiosClient.get("/api/bookings"),
  cancelBooking: (id) => axiosClient.post(`/api/bookings/cancel/${id}`),
};

// Payment APIs
export const paymentApi = {
  processPayment: (data) => axiosClient.post("/api/payments/process", data),
  getPaymentByPnr: (pnr) => axiosClient.get(`/api/payments/pnr/${pnr}`),
  getUserPayments: (userId) => axiosClient.get(`/api/payments/user/${userId}`),
  processRefund: (pnr) => axiosClient.post(`/api/payments/refund/${pnr}`),
};

// Notification APIs
export const notificationApi = {
  sendBookingConfirmation: (data) =>
    axiosClient.post("/api/notifications/booking-confirmation", data),
  sendCancellationNotice: (data) =>
    axiosClient.post("/api/notifications/cancellation", data),
};
