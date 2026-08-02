package com.railway.booking.repository;

import com.railway.booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * ============================================================
 * BOOKING REPOSITORY INTERFACE
 * ============================================================
 * Provides CRUD operations and database queries for the "bookings" table.
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find booking by PNR Number
    Optional<Booking> findByPnrNumber(String pnrNumber);

    // Find all bookings for a specific user by User ID
    List<Booking> findByUserId(Long userId);

    // Find all bookings for a specific user by User Email
    List<Booking> findByUserEmail(String userEmail);
}
