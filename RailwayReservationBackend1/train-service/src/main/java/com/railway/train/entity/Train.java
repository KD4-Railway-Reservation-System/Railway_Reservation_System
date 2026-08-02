package com.railway.train.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * ============================================================
 * TRAIN ENTITY CLASS
 * ============================================================
 * Represents a Train object stored in the database.
 * Maps directly to the "trains" table.
 */
@Entity
@Table(name = "trains")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Train {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Train Details
    @Column(nullable = false, unique = true)
    private String trainNumber;      // e.g. "12951"

    @Column(nullable = false)
    private String trainName;        // e.g. "Mumbai Rajdhani Express"

    // Route Details
    @Column(nullable = false)
    private String sourceStation;    // e.g. "New Delhi"

    @Column(nullable = false)
    private String destinationStation; // e.g. "Mumbai Central"

    // Timings & Schedule
    private String departureTime;     // e.g. "16:55"
    private String arrivalTime;       // e.g. "08:35"
    private String travelDuration;    // e.g. "15h 40m"
    private String runningDays;       // e.g. "Daily", "Mon, Wed, Fri"

    // Seat Availability & Fares
    private Integer availableSeats;   // e.g. 150
    private Double fareSleeper;       // e.g. 650.0
    private Double fareAC3;           // e.g. 1750.0
    private Double fareAC2;           // e.g. 2450.0
    private Double fareAC1;           // e.g. 4100.0
}
