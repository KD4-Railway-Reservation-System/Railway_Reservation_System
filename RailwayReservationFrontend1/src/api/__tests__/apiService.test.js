import { describe, it, expect, vi, beforeEach } from 'vitest';
import axiosClient from '../axiosClient';
import { authApi, trainApi, bookingApi, paymentApi, notificationApi } from '../apiService';

vi.mock('../axiosClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('apiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('authApi', () => {
    it('calls login endpoint with payload', async () => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      axiosClient.post.mockResolvedValueOnce({ data: { token: 'mock-jwt-token' } });

      const response = await authApi.login(credentials);
      expect(axiosClient.post).toHaveBeenCalledWith('/api/auth/login', credentials);
      expect(response.data.token).toBe('mock-jwt-token');
    });

    it('calls register endpoint with payload', async () => {
      const userData = { fullName: 'John Doe', email: 'john@example.com', password: 'secretpassword' };
      axiosClient.post.mockResolvedValueOnce({ data: { userId: 1 } });

      const response = await authApi.register(userData);
      expect(axiosClient.post).toHaveBeenCalledWith('/api/auth/register', userData);
      expect(response.data.userId).toBe(1);
    });
  });

  describe('trainApi', () => {
    it('fetches all trains', async () => {
      axiosClient.get.mockResolvedValueOnce({ data: [{ id: 1, trainName: 'Express' }] });
      const res = await trainApi.getAllTrains();
      expect(axiosClient.get).toHaveBeenCalledWith('/api/trains');
      expect(res.data).toHaveLength(1);
    });

    it('fetches train by ID', async () => {
      axiosClient.get.mockResolvedValueOnce({ data: { id: 101, trainName: 'Rajdhani' } });
      const res = await trainApi.getTrainById(101);
      expect(axiosClient.get).toHaveBeenCalledWith('/api/trains/101');
      expect(res.data.trainName).toBe('Rajdhani');
    });

    it('searches trains with query parameters', async () => {
      axiosClient.get.mockResolvedValueOnce({ data: [] });
      await trainApi.searchTrains(1, 2);
      expect(axiosClient.get).toHaveBeenCalledWith('/api/trains/search?sourceStationId=1&destinationStationId=2');
    });
  });

  describe('bookingApi', () => {
    it('submits ticket booking', async () => {
      const bookingData = { trainId: 1, passengers: [] };
      axiosClient.post.mockResolvedValueOnce({ data: { pnr: 'PNR123456' } });
      const res = await bookingApi.bookTicket(42, bookingData);
      expect(axiosClient.post).toHaveBeenCalledWith('/api/bookings?userId=42', bookingData);
      expect(res.data.pnr).toBe('PNR123456');
    });

    it('fetches user bookings', async () => {
      axiosClient.get.mockResolvedValueOnce({ data: [] });
      await bookingApi.getUserBookings(42);
      expect(axiosClient.get).toHaveBeenCalledWith('/api/bookings/user/42');
    });
  });

  describe('paymentApi', () => {
    it('processes payment', async () => {
      const paymentData = { pnr: 'PNR123', amount: 1500 };
      axiosClient.post.mockResolvedValueOnce({ data: { status: 'SUCCESS' } });
      const res = await paymentApi.processPayment(paymentData);
      expect(axiosClient.post).toHaveBeenCalledWith('/api/payments/process', paymentData);
      expect(res.data.status).toBe('SUCCESS');
    });
  });

  describe('notificationApi', () => {
    it('sends booking confirmation', async () => {
      const payload = { pnr: 'PNR123', email: 'user@example.com' };
      axiosClient.post.mockResolvedValueOnce({ data: { sent: true } });
      await notificationApi.sendBookingConfirmation(payload);
      expect(axiosClient.post).toHaveBeenCalledWith('/api/notifications/booking-confirmation', payload);
    });
  });
});
