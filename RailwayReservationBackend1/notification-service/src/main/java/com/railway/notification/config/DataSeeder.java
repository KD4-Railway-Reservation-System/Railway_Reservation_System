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
 * CommandLineRunner runs automatically right after Spring Boot starts up.
 * Populates realistic demo notifications into the database for immediate testing.
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
                    // 1. Standard User (Rahul Srivastava / userId 1)
                    Notification.builder()
                            .userId(1L)
                            .recipient("rahulsrichunar@gmail.com")
                            .type(NotificationType.EMAIL)
                            .subject("Ticket Booking Confirmed - PNR: PNR84739210")
                            .message("Dear Rahul Srivastava, your ticket booking for Mumbai Rajdhani Express (Train #12951) from New Delhi to Mumbai Central is CONFIRMED. Seat: B1-42. Class: 3AC.")
                            .status(NotificationStatus.DELIVERED)
                            .sentAt(LocalDateTime.now().minusHours(4))
                            .isRead(false)
                            .build(),

                    Notification.builder()
                            .userId(1L)
                            .recipient("rahulsrichunar@gmail.com")
                            .type(NotificationType.SMS)
                            .subject("Payment Successful - TXN99882211")
                            .message("Payment of Rs. 2.00 for PNR PNR84739210 was successful via Razorpay. Transaction ID: TXN99882211.")
                            .status(NotificationStatus.DELIVERED)
                            .sentAt(LocalDateTime.now().minusHours(4))
                            .isRead(true)
                            .build(),

                    Notification.builder()
                            .userId(1L)
                            .recipient("rahulsrichunar@gmail.com")
                            .type(NotificationType.IN_APP)
                            .subject("Platform Update - Train #12002 Bhopal Shatabdi")
                            .message("Bhopal Shatabdi Express is arriving on Platform 3 at New Delhi Railway Station.")
                            .status(NotificationStatus.DELIVERED)
                            .sentAt(LocalDateTime.now().minusHours(1))
                            .isRead(false)
                            .build(),

                    // 2. Superuser (Rahul Superuser / userId 12 & 102)
                    Notification.builder()
                            .userId(12L)
                            .recipient("rahul1234@gmail.com")
                            .type(NotificationType.IN_APP)
                            .subject("Superuser Security Alert")
                            .message("Superuser Master Console session activated. Full administrative privileges granted.")
                            .status(NotificationStatus.DELIVERED)
                            .sentAt(LocalDateTime.now().minusMinutes(45))
                            .isRead(false)
                            .build(),

                    Notification.builder()
                            .userId(102L)
                            .recipient("rahul1234@gmail.com")
                            .type(NotificationType.EMAIL)
                            .subject("New Admin Provisioning Report")
                            .message("Admin account 'Admin Rajesh' was successfully created by Superuser.")
                            .status(NotificationStatus.DELIVERED)
                            .sentAt(LocalDateTime.now().minusMinutes(20))
                            .isRead(false)
                            .build(),

                    // 3. Admin (Admin Rahul / userId 101)
                    Notification.builder()
                            .userId(101L)
                            .recipient("rahul123@gmail.com")
                            .type(NotificationType.IN_APP)
                            .subject("Admin Console Status Update")
                            .message("Welcome Admin Rahul! 24 express train routes are live and operational across the network.")
                            .status(NotificationStatus.DELIVERED)
                            .sentAt(LocalDateTime.now().minusHours(2))
                            .isRead(false)
                            .build(),

                    // 4. Demo fallback user (userId 2)
                    Notification.builder()
                            .userId(2L)
                            .recipient("john.doe@example.com")
                            .type(NotificationType.EMAIL)
                            .subject("Welcome to RailReserve Express!")
                            .message("Welcome aboard! Your Railway Reservation System account is ready for booking tickets.")
                            .status(NotificationStatus.DELIVERED)
                            .sentAt(LocalDateTime.now().minusDays(1))
                            .isRead(true)
                            .build()
            );

            notificationRepository.saveAll(sampleNotifications);
            System.out.println("✅ Data Seeder complete! Pre-seeded " + sampleNotifications.size() + " sample notifications.");
        }
    }
}
