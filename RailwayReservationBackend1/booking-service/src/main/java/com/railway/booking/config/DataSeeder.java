package com.railway.booking.config;

import com.railway.booking.entity.Booking;
import com.railway.booking.repository.BookingRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * ============================================================
 * DATA SEEDER (DEMO INITIAL DATA)
 * ============================================================
 * Seeds sample booking records into the in-memory H2 database
 * upon application startup for instant testing and demonstration.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final BookingRepository bookingRepository;

    public DataSeeder(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Override
    public void run(String... args) {
        if (bookingRepository.count() == 0) {
            Booking booking1 = Booking.builder()
                    .pnrNumber("PNR10293847")
                    .userId(1L)
                    .userEmail("john@example.com")
                    .trainId(1L)
                    .trainNumber("12951")
                    .trainName("Mumbai Rajdhani Express")
                    .passengerName("John Doe")
                    .passengerAge(28)
                    .passengerGender("MALE")
                    .travelClass("AC3")
                    .travelDate("2026-08-15")
                    .sourceStation("New Delhi")
                    .destinationStation("Mumbai Central")
                    .seatNumber("B3-22")
                    .totalFare(1750.0)
                    .status("CONFIRMED")
                    .bookingTime(LocalDateTime.now().minusDays(2))
                    .build();

            Booking booking2 = Booking.builder()
                    .pnrNumber("PNR98765432")
                    .userId(2L)
                    .userEmail("jane@example.com")
                    .trainId(2L)
                    .trainNumber("12301")
                    .trainName("Howrah Rajdhani Express")
                    .passengerName("Jane Smith")
                    .passengerAge(32)
                    .passengerGender("FEMALE")
                    .travelClass("AC2")
                    .travelDate("2026-08-20")
                    .sourceStation("Howrah Junction")
                    .destinationStation("New Delhi")
                    .seatNumber("A1-14")
                    .totalFare(2850.0)
                    .status("CONFIRMED")
                    .bookingTime(LocalDateTime.now().minusDays(1))
                    .build();

            bookingRepository.saveAll(List.of(booking1, booking2));

            System.out.println("✅ DataSeeder: Pre-seeded 2 sample ticket bookings into H2 Database.");
        }
    }
}
