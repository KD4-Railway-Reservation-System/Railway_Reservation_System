package com.railway.notification.repository;

import com.railway.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * ============================================================
 * NOTIFICATION REPOSITORY INTERFACE
 * ============================================================
 * Beginner Notes:
 * Extending JpaRepository automatically gives us CRUD methods (save, findById, findAll, deleteById)
 * without writing any SQL queries manually!
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    /**
     * Find all notifications sent to a specific user, sorted newest first
     */
    List<Notification> findByUserIdOrderBySentAtDesc(Long userId);

    /**
     * Find all notifications sent to a recipient email or phone number
     */
    List<Notification> findByRecipientOrderBySentAtDesc(String recipient);
}
