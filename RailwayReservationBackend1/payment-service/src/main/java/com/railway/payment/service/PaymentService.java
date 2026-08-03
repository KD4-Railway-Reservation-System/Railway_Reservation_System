package com.railway.payment.service;

import com.railway.payment.dto.PaymentRequest;
import com.railway.payment.entity.Payment;

import java.util.List;
import java.util.Optional;

/**
 * ============================================================
 * PAYMENT SERVICE INTERFACE
 * ============================================================
 * Defines contract for processing payments and managing transactions.
 */
public interface PaymentService {

    Payment processPayment(PaymentRequest request);

    Optional<Payment> getPaymentById(Long id);

    Optional<Payment> getPaymentByTransactionId(String transactionId);

    Optional<Payment> getPaymentByPnr(String pnrNumber);

    List<Payment> getPaymentsByUserId(Long userId);

    List<Payment> getPaymentsByUserEmail(String userEmail);

    List<Payment> getAllPayments();

    Optional<Payment> processRefund(String pnrNumber);
}
