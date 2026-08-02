package com.railway.booking.service;

import com.railway.booking.dto.BookingRequest;
import com.railway.booking.entity.Booking;

import java.util.List;
import java.util.Optional;

/**
 * ============================================================
 * BOOKING SERVICE INTERFACE
 * ============================================================
 * Defines business logic contract for ticket booking operations.
 */
public interface BookingService {

    Booking createBooking(BookingRequest bookingRequest);

    Optional<Booking> getBookingById(Long id);

    Optional<Booking> getBookingByPnr(String pnrNumber);

    List<Booking> getBookingsByUserId(Long userId);

    List<Booking> getBookingsByUserEmail(String userEmail);

    List<Booking> getAllBookings();

    Optional<Booking> cancelBooking(String pnrNumber);
}
