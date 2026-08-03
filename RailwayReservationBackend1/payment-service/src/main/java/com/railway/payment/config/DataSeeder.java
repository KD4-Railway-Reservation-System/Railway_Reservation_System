package com.railway.payment.config;

import com.railway.payment.entity.Payment;
import com.railway.payment.repository.PaymentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * ============================================================
 * DATA SEEDER (DEMO PAYMENT TRANSACTIONS)
 * ============================================================
 * Seeds sample payment records into H2 database on startup.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final PaymentRepository paymentRepository;

    public DataSeeder(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    public void run(String... args) {
        if (paymentRepository.count() == 0) {
            Payment p1 = Payment.builder()
                    .transactionId("TXN10293847")
                    .bookingId(1L)
                    .pnrNumber("PNR10293847")
                    .userId(1L)
                    .userEmail("john@example.com")
                    .amount(1750.0)
                    .paymentMethod("UPI")
                    .paymentStatus("SUCCESS")
                    .gatewayResponse("Payment successful via Google Pay UPI")
                    .paymentTime(LocalDateTime.now().minusDays(2))
                    .build();

            Payment p2 = Payment.builder()
                    .transactionId("TXN98765432")
                    .bookingId(2L)
                    .pnrNumber("PNR98765432")
                    .userId(2L)
                    .userEmail("jane@example.com")
                    .amount(2850.0)
                    .paymentMethod("CREDIT_CARD")
                    .paymentStatus("SUCCESS")
                    .gatewayResponse("Payment successful via HDFC Credit Card")
                    .paymentTime(LocalDateTime.now().minusDays(1))
                    .build();

            paymentRepository.saveAll(List.of(p1, p2));

            System.out.println("✅ DataSeeder: Pre-seeded 2 sample payment transactions into H2 Database.");
        }
    }
}
