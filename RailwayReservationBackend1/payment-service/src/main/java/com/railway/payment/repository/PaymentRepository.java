package com.railway.payment.repository;

import com.railway.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * ============================================================
 * PAYMENT REPOSITORY INTERFACE
 * ============================================================
 * Provides CRUD operations and database queries for the "payments" table.
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Find payment by unique Transaction ID
    Optional<Payment> findByTransactionId(String transactionId);

    // Find payment by PNR Number
    Optional<Payment> findByPnrNumber(String pnrNumber);

    // Find all payments by User ID
    List<Payment> findByUserId(Long userId);

    // Find all payments by User Email
    List<Payment> findByUserEmail(String userEmail);
}
