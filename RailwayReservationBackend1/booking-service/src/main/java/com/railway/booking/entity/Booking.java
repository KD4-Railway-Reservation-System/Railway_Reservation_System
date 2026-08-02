package com.railway.booking.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * ============================================================
 * BOOKING ENTITY CLASS
 * ============================================================
 * Represents a Ticket Booking record stored in the database.
 * Maps directly to the "bookings" table.
 */
@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Unique 10-digit Passenger Name Record (PNR) number, e.g. "PNR84739210"
    @Column(nullable = false, unique = true)
    private String pnrNumber;

    // User Identification
    private Long userId;
    private String userEmail;

    // Train Details
    private Long trainId;
    private String trainNumber;      // e.g. "12951"
    private String trainName;        // e.g. "Mumbai Rajdhani Express"

    // Passenger Details
    @Column(nullable = false)
    private String passengerName;
    private Integer passengerAge;
    private String passengerGender;  // "MALE", "FEMALE", "OTHER"

    // Journey Details
    private String travelClass;      // "SLEEPER", "AC3", "AC2", "AC1"
    private String travelDate;       // e.g. "2026-08-15"
    private String sourceStation;    // e.g. "New Delhi"
    private String destinationStation; // e.g. "Mumbai Central"
    private String seatNumber;       // e.g. "B2-34"

    // Payment & Status
    private Double totalFare;        // e.g. 1750.0
    private String status;           // "CONFIRMED", "CANCELLED", "PENDING"

    private LocalDateTime bookingTime;

    @PrePersist
    public void onCreate() {
        if (this.bookingTime == null) {
            this.bookingTime = LocalDateTime.now();
        }
    }
}
