package com.railway.booking.controller;

import com.railway.booking.dto.BookingRequest;
import com.railway.booking.entity.Booking;
import com.railway.booking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * ============================================================
 * BOOKING REST CONTROLLER
 * ============================================================
 * Exposes REST API endpoints for ticket booking operations.
 * Base URL Path: /api/bookings
 */
@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    /**
     * 1. Create a New Ticket Booking
     * URL: POST http://localhost:8083/api/bookings
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createBooking(
            @Valid @RequestBody BookingRequest request,
            @RequestHeader(value = "x-user-id", required = false) String userIdHeader,
            @RequestHeader(value = "x-user-email", required = false) String userEmailHeader) {

        // Auto-fill user identity from API Gateway headers if missing in request body
        if (request.getUserId() == null && userIdHeader != null) {
            try {
                request.setUserId(Long.parseLong(userIdHeader));
            } catch (NumberFormatException ignored) {}
        }
        if (request.getUserEmail() == null && userEmailHeader != null) {
            request.setUserEmail(userEmailHeader);
        }

        Booking booking = bookingService.createBooking(request);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Ticket successfully booked!");
        response.put("pnrNumber", booking.getPnrNumber());
        response.put("booking", booking);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 2. Get Booking Details by ID
     * Example URL: GET http://localhost:8083/api/bookings/1
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        Optional<Booking> booking = bookingService.getBookingById(id);
        if (booking.isPresent()) {
            return ResponseEntity.ok(booking.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("success", false, "message", "Booking not found with ID: " + id));
    }

    /**
     * 3. Get Booking Details by PNR Number
     * Example URL: GET http://localhost:8083/api/bookings/pnr/PNR84739210
     */
    @GetMapping("/pnr/{pnrNumber}")
    public ResponseEntity<?> getBookingByPnr(@PathVariable String pnrNumber) {
        Optional<Booking> booking = bookingService.getBookingByPnr(pnrNumber);
        if (booking.isPresent()) {
            return ResponseEntity.ok(booking.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("success", false, "message", "Booking not found with PNR: " + pnrNumber));
    }

    /**
     * 4. Get Current Logged-In User's Bookings (via JWT Gateway headers)
     * URL: GET http://localhost:8083/api/bookings/my-bookings
     */
    @GetMapping("/my-bookings")
    public ResponseEntity<?> getMyBookings(
            @RequestHeader(value = "x-user-id", required = false) String userIdHeader,
            @RequestHeader(value = "x-user-email", required = false) String userEmailHeader) {

        List<Booking> bookings;
        if (userIdHeader != null) {
            try {
                Long userId = Long.parseLong(userIdHeader);
                bookings = bookingService.getBookingsByUserId(userId);
            } catch (NumberFormatException e) {
                bookings = bookingService.getBookingsByUserEmail(userEmailHeader);
            }
        } else if (userEmailHeader != null) {
            bookings = bookingService.getBookingsByUserEmail(userEmailHeader);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "User identity header missing."));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", bookings.size());
        response.put("bookings", bookings);

        return ResponseEntity.ok(response);
    }

    /**
     * 5. Get Bookings by User ID
     * Example URL: GET http://localhost:8083/api/bookings/user/1
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUserId(@PathVariable Long userId) {
        List<Booking> bookings = bookingService.getBookingsByUserId(userId);
        return ResponseEntity.ok(bookings);
    }

    /**
     * 6. Cancel Ticket Booking by PNR Number
     * Example URL: PUT http://localhost:8083/api/bookings/cancel/PNR84739210
     */
    @PutMapping("/cancel/{pnrNumber}")
    public ResponseEntity<?> cancelBooking(@PathVariable String pnrNumber) {
        Optional<Booking> cancelledBooking = bookingService.cancelBooking(pnrNumber);
        if (cancelledBooking.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Booking with PNR " + pnrNumber + " has been cancelled.");
            response.put("booking", cancelledBooking.get());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("success", false, "message", "Cannot cancel. PNR not found: " + pnrNumber));
    }

    /**
     * 7. Get All Ticket Bookings (Admin View)
     * URL: GET http://localhost:8083/api/bookings
     */
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }
}
