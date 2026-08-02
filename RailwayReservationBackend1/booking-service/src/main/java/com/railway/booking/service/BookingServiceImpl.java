package com.railway.booking.service;

import com.railway.booking.dto.BookingRequest;
import com.railway.booking.entity.Booking;
import com.railway.booking.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

/**
 * ============================================================
 * BOOKING SERVICE IMPLEMENTATION
 * ============================================================
 * Implements ticket booking business logic: PNR generation,
 * seat assignment, status updates, and database persistence.
 */
@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final Random random = new Random();

    @Autowired
    public BookingServiceImpl(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Override
    public Booking createBooking(BookingRequest request) {
        String pnr = generateUniquePnr();
        String seatNumber = generateSeatNumber(request.getTravelClass());

        Booking booking = Booking.builder()
                .pnrNumber(pnr)
                .userId(request.getUserId())
                .userEmail(request.getUserEmail())
                .trainId(request.getTrainId())
                .trainNumber(request.getTrainNumber())
                .trainName(request.getTrainName())
                .passengerName(request.getPassengerName())
                .passengerAge(request.getPassengerAge())
                .passengerGender(request.getPassengerGender() != null ? request.getPassengerGender() : "MALE")
                .travelClass(request.getTravelClass())
                .travelDate(request.getTravelDate())
                .sourceStation(request.getSourceStation())
                .destinationStation(request.getDestinationStation())
                .seatNumber(seatNumber)
                .totalFare(request.getTotalFare())
                .status("CONFIRMED")
                .bookingTime(LocalDateTime.now())
                .build();

        return bookingRepository.save(booking);
    }

    @Override
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    @Override
    public Optional<Booking> getBookingByPnr(String pnrNumber) {
        return bookingRepository.findByPnrNumber(pnrNumber);
    }

    @Override
    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Override
    public List<Booking> getBookingsByUserEmail(String userEmail) {
        return bookingRepository.findByUserEmail(userEmail);
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public Optional<Booking> cancelBooking(String pnrNumber) {
        Optional<Booking> optionalBooking = bookingRepository.findByPnrNumber(pnrNumber);
        if (optionalBooking.isPresent()) {
            Booking booking = optionalBooking.get();
            booking.setStatus("CANCELLED");
            return Optional.of(bookingRepository.save(booking));
        }
        return Optional.empty();
    }

    /**
     * Helper Method: Generates a unique 10-character PNR string (e.g. "PNR84739210")
     */
    private String generateUniquePnr() {
        String pnr;
        do {
            long number = 10000000L + random.nextInt(90000000);
            pnr = "PNR" + number;
        } while (bookingRepository.findByPnrNumber(pnr).isPresent());
        return pnr;
    }

    /**
     * Helper Method: Generates a seat number based on travel class
     */
    private String generateSeatNumber(String travelClass) {
        String coachPrefix = "S1-";
        if (travelClass != null) {
            switch (travelClass.toUpperCase()) {
                case "AC1": coachPrefix = "H1-"; break;
                case "AC2": coachPrefix = "A1-"; break;
                case "AC3": coachPrefix = "B1-"; break;
                case "SLEEPER": coachPrefix = "S1-"; break;
                default: coachPrefix = "D1-"; break;
            }
        }
        int seatNo = 1 + random.nextInt(72);
        return coachPrefix + seatNo;
    }
}
