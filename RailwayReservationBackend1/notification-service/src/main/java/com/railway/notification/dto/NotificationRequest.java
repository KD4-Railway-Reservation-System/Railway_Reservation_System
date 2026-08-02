package com.railway.notification.dto;

import com.railway.notification.entity.Notification.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ============================================================
 * NOTIFICATION REQUEST DTO (Data Transfer Object)
 * ============================================================
 * Defines the incoming data required to send a new notification.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationRequest {

    /**
     * ID of the target user receiving the notification
     */
    @NotNull(message = "User ID is required")
    private Long userId;

    /**
     * Target email address or phone number
     */
    @NotBlank(message = "Recipient contact detail (email or phone) is required")
    private String recipient;

    /**
     * Type of notification: EMAIL, SMS, or IN_APP
     */
    @NotNull(message = "Notification type (EMAIL, SMS, IN_APP) is required")
    private NotificationType type;

    /**
     * Notification title or email subject
     */
    @NotBlank(message = "Subject is required")
    private String subject;

    /**
     * Notification body text
     */
    @NotBlank(message = "Message text is required")
    private String message;
}
