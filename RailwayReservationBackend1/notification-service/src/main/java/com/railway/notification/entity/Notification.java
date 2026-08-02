package com.railway.notification.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * ============================================================
 * NOTIFICATION ENTITY CLASS
 * ============================================================
 * Represents a Notification record stored in the database.
 * 
 * Beginner Notes:
 * - @Entity tells JPA/Hibernate that this class maps to a database table.
 * - @Table specifies the table name ('notifications').
 * - @Id marks 'id' as the primary key.
 * - @GeneratedValue makes the primary key auto-incrementing.
 */
@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    /**
     * Primary key ID (Auto-generated auto-increment number)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * ID of the User to whom this notification belongs
     */
    @Column(nullable = false)
    private Long userId;

    /**
     * Recipient details (Email address or phone number)
     * Example: "rahul@example.com" or "+919876543210"
     */
    @Column(nullable = false)
    private String recipient;

    /**
     * Type of notification: EMAIL, SMS, or IN_APP
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    /**
     * Subject line of the notification
     * Example: "Ticket Booking Confirmed - PNR 123456"
     */
    @Column(nullable = false)
    private String subject;

    /**
     * Detailed message body content
     */
    @Column(length = 2000, nullable = false)
    private String message;

    /**
     * Delivery status: SENT, DELIVERED, PENDING, or FAILED
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationStatus status;

    /**
     * Date and timestamp when the notification was sent
     */
    private LocalDateTime sentAt;

    /**
     * Flag to check if user has read/opened the notification (true/false)
     */
    private boolean isRead;

    /**
     * Notification Channel Types Enum
     */
    public enum NotificationType {
        EMAIL,
        SMS,
        IN_APP
    }

    /**
     * Delivery Status Enum
     */
    public enum NotificationStatus {
        SENT,
        DELIVERED,
        PENDING,
        FAILED
    }
}
