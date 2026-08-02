package com.railway.notification.dto;

import com.railway.notification.entity.Notification;
import com.railway.notification.entity.Notification.NotificationStatus;
import com.railway.notification.entity.Notification.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * ============================================================
 * NOTIFICATION RESPONSE DTO
 * ============================================================
 * Clean data structure sent back to API clients.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {

    private Long id;
    private Long userId;
    private String recipient;
    private NotificationType type;
    private String subject;
    private String message;
    private NotificationStatus status;
    private LocalDateTime sentAt;
    private boolean isRead;

    /**
     * Helper factory method to map JPA Entity -> Response DTO
     */
    public static NotificationResponse fromEntity(Notification entity) {
        return NotificationResponse.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .recipient(entity.getRecipient())
                .type(entity.getType())
                .subject(entity.getSubject())
                .message(entity.getMessage())
                .status(entity.getStatus())
                .sentAt(entity.getSentAt())
                .isRead(entity.isRead())
                .build();
    }
}
