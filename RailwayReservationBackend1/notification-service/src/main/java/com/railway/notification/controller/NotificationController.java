package com.railway.notification.controller;

import com.railway.notification.dto.NotificationRequest;
import com.railway.notification.dto.NotificationResponse;
import com.railway.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ============================================================
 * NOTIFICATION REST CONTROLLER
 * ============================================================
 * Beginner Notes:
 * - @RestController exposes HTTP endpoints that return JSON data.
 * - @RequestMapping("/api/notifications") sets base URL for all endpoints in this controller.
 * - @Tag enables clean documentation grouping in Swagger UI.
 */
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notification Controller", description = "APIs for sending & managing Email, SMS, and In-App Notifications")
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * Endpoint 1: Send a Notification
     * HTTP Method: POST
     * URL: http://localhost:8086/api/notifications/send
     */
    @PostMapping("/send")
    @Operation(summary = "Send a Notification", description = "Simulates dispatching Email, SMS, or In-App Notification and saves record in database")
    public ResponseEntity<NotificationResponse> sendNotification(@Valid @RequestBody NotificationRequest request) {
        NotificationResponse response = notificationService.sendNotification(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Endpoint 2: Get All Notifications
     * HTTP Method: GET
     * URL: http://localhost:8086/api/notifications
     */
    @GetMapping
    @Operation(summary = "Get All Notifications", description = "Fetch complete list of all notification logs")
    public ResponseEntity<List<NotificationResponse>> getAllNotifications() {
        List<NotificationResponse> notifications = notificationService.getAllNotifications();
        return ResponseEntity.ok(notifications);
    }

    /**
     * Endpoint 3: Get Notifications for a Specific User
     * HTTP Method: GET
     * URL: http://localhost:8086/api/notifications/user/{userId}
     */
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get User Notifications", description = "Fetch notifications received by a specific User ID (Newest first)")
    public ResponseEntity<List<NotificationResponse>> getNotificationsByUserId(@PathVariable Long userId) {
        List<NotificationResponse> userNotifications = notificationService.getNotificationsByUserId(userId);
        return ResponseEntity.ok(userNotifications);
    }

    /**
     * Endpoint 4: Get Notification Details by ID
     * HTTP Method: GET
     * URL: http://localhost:8086/api/notifications/{id}
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get Notification by ID", description = "Fetch details of a single notification by its ID")
    public ResponseEntity<NotificationResponse> getNotificationById(@PathVariable Long id) {
        NotificationResponse response = notificationService.getNotificationById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint 5: Mark Notification as Read
     * HTTP Method: PUT
     * URL: http://localhost:8086/api/notifications/{id}/read
     */
    @PutMapping("/{id}/read")
    @Operation(summary = "Mark Notification as Read", description = "Updates isRead status to true for a notification")
    public ResponseEntity<NotificationResponse> markAsRead(@PathVariable Long id) {
        NotificationResponse response = notificationService.markAsRead(id);
        return ResponseEntity.ok(response);
    }
}
