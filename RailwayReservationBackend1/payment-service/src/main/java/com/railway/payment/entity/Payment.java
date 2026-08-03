package com.railway.payment.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * ============================================================
 * PAYMENT ENTITY CLASS
 * ============================================================
 * Represents a Payment transaction record stored in the database.
 * Maps directly to the "payments" table.
 */
@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Unique Transaction Identifier (e.g. "TXN98472019")
    @Column(nullable = false, unique = true)
    private String transactionId;

    // Related Booking & User Info
    private Long bookingId;
    private String pnrNumber;        // e.g. "PNR84739210"
    private Long userId;
    private String userEmail;

    // Financial Details
    @Column(nullable = false)
    private Double amount;           // e.g. 1750.0

    @Column(nullable = false)
    private String paymentMethod;    // "UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING"

    @Column(nullable = false)
    private String paymentStatus;    // "SUCCESS", "FAILED", "REFUNDED"

    private String gatewayResponse;  // e.g. "Payment successful via Google Pay UPI"

    private LocalDateTime paymentTime;

    @PrePersist
    public void onCreate() {
        if (this.paymentTime == null) {
            this.paymentTime = LocalDateTime.now();
        }
    }
}
