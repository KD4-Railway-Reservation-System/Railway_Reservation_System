package com.railway.payment.controller;

import com.railway.payment.dto.PaymentRequest;
import com.railway.payment.entity.Payment;
import com.railway.payment.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * ============================================================
 * PAYMENT REST CONTROLLER
 * ============================================================
 * Exposes REST API endpoints for payment processing and refund tracking.
 * Base URL Path: /api/payments
 */
@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * 1. Process a Payment for a Booking
     * URL: POST http://localhost:8085/api/payments/process
     */
    @PostMapping("/process")
    public ResponseEntity<Map<String, Object>> processPayment(
            @Valid @RequestBody PaymentRequest request,
            @RequestHeader(value = "x-user-id", required = false) String userIdHeader,
            @RequestHeader(value = "x-user-email", required = false) String userEmailHeader) {

        // Auto-fill user identity from API Gateway headers if missing in request body
        if (request.getUserId() == null && userIdHeader != null) {
            try {
                request.setUserId(Long.parseLong(userIdHeader));
            } catch (NumberFormatException ignored) {}
        }
        if (request.getUserEmail() == null && userEmailHeader != null) {
            request.setUserEmail(userEmailHeader);
        }

        Payment payment = paymentService.processPayment(request);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Payment processed successfully!");
        response.put("transactionId", payment.getTransactionId());
        response.put("payment", payment);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 2. Get Payment Details by Transaction ID
     * Example URL: GET http://localhost:8085/api/payments/transaction/TXN98472019
     */
    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<?> getPaymentByTransactionId(@PathVariable String transactionId) {
        Optional<Payment> payment = paymentService.getPaymentByTransactionId(transactionId);
        if (payment.isPresent()) {
            return ResponseEntity.ok(payment.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("success", false, "message", "Payment transaction not found: " + transactionId));
    }

    /**
     * 3. Get Payment Details by PNR Number
     * Example URL: GET http://localhost:8085/api/payments/pnr/PNR84739210
     */
    @GetMapping("/pnr/{pnrNumber}")
    public ResponseEntity<?> getPaymentByPnr(@PathVariable String pnrNumber) {
        Optional<Payment> payment = paymentService.getPaymentByPnr(pnrNumber);
        if (payment.isPresent()) {
            return ResponseEntity.ok(payment.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("success", false, "message", "No payment found for PNR: " + pnrNumber));
    }

    /**
     * 4. Get Payment History for Logged-In User
     * URL: GET http://localhost:8085/api/payments/my-payments
     */
    @GetMapping("/my-payments")
    public ResponseEntity<?> getMyPayments(
            @RequestHeader(value = "x-user-id", required = false) String userIdHeader,
            @RequestHeader(value = "x-user-email", required = false) String userEmailHeader) {

        List<Payment> payments;
        if (userIdHeader != null) {
            try {
                Long userId = Long.parseLong(userIdHeader);
                payments = paymentService.getPaymentsByUserId(userId);
            } catch (NumberFormatException e) {
                payments = paymentService.getPaymentsByUserEmail(userEmailHeader);
            }
        } else if (userEmailHeader != null) {
            payments = paymentService.getPaymentsByUserEmail(userEmailHeader);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "User identity header missing."));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", payments.size());
        response.put("payments", payments);

        return ResponseEntity.ok(response);
    }

    /**
     * 5. Process Refund for a Cancelled Booking
     * Example URL: POST http://localhost:8085/api/payments/refund/PNR84739210
     */
    @PostMapping("/refund/{pnrNumber}")
    public ResponseEntity<?> processRefund(@PathVariable String pnrNumber) {
        Optional<Payment> refundedPayment = paymentService.processRefund(pnrNumber);
        if (refundedPayment.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Refund issued successfully for PNR: " + pnrNumber);
            response.put("payment", refundedPayment.get());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("success", false, "message", "No payment record found to refund for PNR: " + pnrNumber));
    }

    /**
     * 6. Get All Payment Transactions (Admin View)
     * URL: GET http://localhost:8085/api/payments
     */
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        List<Payment> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }
}
