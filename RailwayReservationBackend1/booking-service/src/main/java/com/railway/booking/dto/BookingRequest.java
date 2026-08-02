package com.railway.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * ============================================================
 * BOOKING REQUEST DATA TRANSFER OBJECT (DTO)
 * ============================================================
 * Carries ticket booking creation data sent by the client.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingRequest {

    private Long userId;
    private String userEmail;

    private Long trainId;

    @NotBlank(message = "Train number is required")
    private String trainNumber;

    @NotBlank(message = "Train name is required")
    private String trainName;

    @NotBlank(message = "Passenger name is required")
    private String passengerName;

    @NotNull(message = "Passenger age is required")
    private Integer passengerAge;

    private String passengerGender; // e.g. "MALE", "FEMALE", "OTHER"

    @NotBlank(message = "Travel class is required")
    private String travelClass;     // e.g. "SLEEPER", "AC3", "AC2", "AC1"

    @NotBlank(message = "Travel date is required")
    private String travelDate;      // e.g. "2026-08-15"

    @NotBlank(message = "Source station is required")
    private String sourceStation;

    @NotBlank(message = "Destination station is required")
    private String destinationStation;

    @NotNull(message = "Total fare is required")
    private Double totalFare;
}
