package com.railway.notification.config;

import com.railway.notification.entity.Notification;
import com.railway.notification.entity.Notification.NotificationStatus;
import com.railway.notification.entity.Notification.NotificationType;
import com.railway.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * ============================================================
 * DATA SEEDER - INITIAL TEST DATA INITIALIZER
 * ============================================================
 * Beginner Notes:
 * CommandLineRunner runs automatically right after the Spring Boot application starts.
 * We use it to populate sample data into the H2 Database for easy testing!
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final NotificationRepository notificationRepository;

    @Override
    public void run(String... args) {
        if (notificationRepository.count() == 0) {
            System.out.println("🌱 Initializing Notification Microservice Data Seeder...");

            List<Notification> sampleNotifications = List.of(
                    Notification.builder()
                            .userId(1L)
                            .recipient("john.doe@example.com")
                            .type(NotificationType.EMAIL)
                            .subject("Welcome to Railway Reservation System!")
                            .message("Hello John! Welcome aboard. Your account has been successfully created.")
                            .status(NotificationStatus.DELIVERED)
                            .sentAt(LocalDateTime.now().minusDays(2))
                            .isRead(true)
                            .build(),

                    Notification.builder()
                            .userId(1L)
                            .recipient("john.doe@example.com")
                            .type(NotificationType.EMAIL)
                            .subject("Booking Confirmation - PNR: 8492019482")
                            .message("Your ticket booking for Rajdhani Express (Train #12951) from NDLS to BCT is CONFIRMED. Seat: B2-45.")
                            .status(NotificationStatus.DELIVERED)
                            .sentAt(LocalDateTime.now().minusHours(5))
                            .isRead(false)
                            .build(),

                    Notification.builder()
                            .userId(1L)
                            .recipient("+919876543210")
                            .type(NotificationType.SMS)
                            .subject("Payment Successful")
                            .message("Payment of Rs. 1450.00 for PNR 8492019482 was successful. Transaction ID: TXN99882211.")
                            .status(NotificationStatus.DELIVERED)
                            .sentAt(LocalDateTime.now().minusHours(5))
                            .isRead(true)
                            .build(),

                    Notification.builder()
                            .userId(2L)
                            .recipient("priya.sharma@example.com")
                            .type(NotificationType.IN_APP)
                            .subject("Train Schedule Update")
                            .message("Train #12002 Shatabdi Express is running on time today.")
                            .status(NotificationStatus.DELIVERED)
                            .sentAt(LocalDateTime.now().minusMinutes(30))
                            .isRead(false)
                            .build()
            );

            notificationRepository.saveAll(sampleNotifications);
            System.out.println("✅ Data Seeder complete! Pre-seeded " + sampleNotifications.size() + " sample notifications.");
        }
    }
}
