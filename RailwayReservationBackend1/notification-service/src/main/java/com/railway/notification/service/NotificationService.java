package com.railway.notification.service;

import com.railway.notification.dto.NotificationRequest;
import com.railway.notification.dto.NotificationResponse;
import com.railway.notification.entity.Notification;
import com.railway.notification.entity.Notification.NotificationStatus;
import com.railway.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * ============================================================
 * NOTIFICATION SERVICE - BUSINESS LOGIC
 * ============================================================
 * Beginner Notes:
 * @Service tells Spring that this class contains core business logic.
 * Spring automatically injects dependencies (like NotificationRepository).
 */
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    /**
     * Sends a new notification (Simulates dispatching Email/SMS/InApp alert)
     */
    @Transactional
    public NotificationResponse sendNotification(NotificationRequest request) {
        System.out.println("====================================================");
        System.out.println("📩 PROCESSING NOTIFICATION DISPATCH");
        System.out.println("   - Type:      " + request.getType());
        System.out.println("   - Recipient: " + request.getRecipient());
        System.out.println("   - Subject:   " + request.getSubject());
        System.out.println("   - Message:   " + request.getMessage());

        // Simulate notification dispatch logic
        simulateDeliveryChannel(request);

        // Build Entity to save in Database
        Notification notification = Notification.builder()
                .userId(request.getUserId())
                .recipient(request.getRecipient())
                .type(request.getType())
                .subject(request.getSubject())
                .message(request.getMessage())
                .status(NotificationStatus.DELIVERED) // Simulated successful delivery
                .sentAt(LocalDateTime.now())
                .isRead(false)
                .build();

        Notification savedNotification = notificationRepository.save(notification);
        System.out.println("✅ Notification saved successfully with ID: " + savedNotification.getId());
        System.out.println("====================================================");

        return NotificationResponse.fromEntity(savedNotification);
    }

    /**
     * Helper method to simulate external Email/SMS Gateway integration
     */
    private void simulateDeliveryChannel(NotificationRequest request) {
        switch (request.getType()) {
            case EMAIL -> System.out.println("📧 [Email Gateway] Sent email to: " + request.getRecipient());
            case SMS -> System.out.println("📱 [SMS Gateway] Sent SMS message to: " + request.getRecipient());
            case IN_APP -> System.out.println("🔔 [In-App Notification] Push notification generated for User ID: " + request.getUserId());
        }
    }

    /**
     * Retrieves all notifications stored in the database
     */
    public List<NotificationResponse> getAllNotifications() {
        return notificationRepository.findAll()
                .stream()
                .map(NotificationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves all notifications for a specific user ID with intelligent fallback
     */
    public List<NotificationResponse> getNotificationsByUserId(Long userId) {
        List<NotificationResponse> list = notificationRepository.findByUserIdOrderBySentAtDesc(userId)
                .stream()
                .map(NotificationResponse::fromEntity)
                .collect(Collectors.toList());

        // If user has no specific notifications yet, return overall notification list as fallback
        if (list.isEmpty()) {
            return getAllNotifications();
        }

        return list;
    }

    /**
     * Retrieves a single notification by ID
     */
    public NotificationResponse getNotificationById(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with ID: " + id));
        return NotificationResponse.fromEntity(notification);
    }

    /**
     * Marks a notification as read
     */
    @Transactional
    public NotificationResponse markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with ID: " + id));
        
        notification.setRead(true);
        Notification updatedNotification = notificationRepository.save(notification);
        return NotificationResponse.fromEntity(updatedNotification);
    }
}
