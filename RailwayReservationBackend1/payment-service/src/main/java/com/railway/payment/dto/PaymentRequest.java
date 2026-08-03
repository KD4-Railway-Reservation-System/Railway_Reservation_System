package com.railway.payment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * ============================================================
 * PAYMENT REQUEST DATA TRANSFER OBJECT (DTO)
 * ============================================================
 * Carries payment submission parameters from the client.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentRequest {

    private Long bookingId;

    @NotBlank(message = "PNR number is required")
    private String pnrNumber;

    private Long userId;
    private String userEmail;

    @NotNull(message = "Payment amount is required")
    private Double amount;

    @NotBlank(message = "Payment method is required (UPI, CREDIT_CARD, DEBIT_CARD, NET_BANKING)")
    private String paymentMethod;

    private String transactionId;
}
