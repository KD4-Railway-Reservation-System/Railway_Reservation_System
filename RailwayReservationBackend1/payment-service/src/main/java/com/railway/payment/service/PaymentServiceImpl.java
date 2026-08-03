package com.railway.payment.service;

import com.railway.payment.dto.PaymentRequest;
import com.railway.payment.entity.Payment;
import com.railway.payment.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

/**
 * ============================================================
 * PAYMENT SERVICE IMPLEMENTATION
 * ============================================================
 * Implements transaction processing, payment status tracking,
 * unique transaction ID generation, and refund operations.
 */
@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final Random random = new Random();

    @Autowired
    public PaymentServiceImpl(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    public Payment processPayment(PaymentRequest request) {
        String transactionId = (request.getTransactionId() != null && !request.getTransactionId().isBlank())
                ? request.getTransactionId()
                : generateUniqueTransactionId();

        Payment payment = Payment.builder()
                .transactionId(transactionId)
                .bookingId(request.getBookingId())
                .pnrNumber(request.getPnrNumber())
                .userId(request.getUserId())
                .userEmail(request.getUserEmail())
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod().toUpperCase())
                .paymentStatus("SUCCESS")
                .gatewayResponse("Payment processed successfully via " + request.getPaymentMethod().toUpperCase())
                .paymentTime(LocalDateTime.now())
                .build();

        return paymentRepository.save(payment);
    }

    @Override
    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    @Override
    public Optional<Payment> getPaymentByTransactionId(String transactionId) {
        return paymentRepository.findByTransactionId(transactionId);
    }

    @Override
    public Optional<Payment> getPaymentByPnr(String pnrNumber) {
        return paymentRepository.findByPnrNumber(pnrNumber);
    }

    @Override
    public List<Payment> getPaymentsByUserId(Long userId) {
        return paymentRepository.findByUserId(userId);
    }

    @Override
    public List<Payment> getPaymentsByUserEmail(String userEmail) {
        return paymentRepository.findByUserEmail(userEmail);
    }

    @Override
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @Override
    public Optional<Payment> processRefund(String pnrNumber) {
        Optional<Payment> optionalPayment = paymentRepository.findByPnrNumber(pnrNumber);
        if (optionalPayment.isPresent()) {
            Payment payment = optionalPayment.get();
            payment.setPaymentStatus("REFUNDED");
            payment.setGatewayResponse("Refund of ₹" + payment.getAmount() + " processed back to original " + payment.getPaymentMethod() + " account.");
            return Optional.of(paymentRepository.save(payment));
        }
        return Optional.empty();
    }

    /**
     * Helper Method: Generates a unique 10-character Transaction ID (e.g. "TXN98472019")
     */
    private String generateUniqueTransactionId() {
        String txn;
        do {
            long number = 10000000L + random.nextInt(90000000);
            txn = "TXN" + number;
        } while (paymentRepository.findByTransactionId(txn).isPresent());
        return txn;
    }
}
