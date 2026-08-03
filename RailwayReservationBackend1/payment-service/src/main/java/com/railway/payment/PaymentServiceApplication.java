package com.railway.payment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * ============================================================
 * PAYMENT SERVICE - MAIN APPLICATION CLASS
 * ============================================================
 * Entry point for the Railway Payment Microservice.
 * Starts Spring Boot on port 8085 and registers with Eureka.
 */
@SpringBootApplication
@EnableDiscoveryClient
public class PaymentServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PaymentServiceApplication.class, args);
        System.out.println("====================================================");
        System.out.println("💳 Payment Processing Microservice is running on port: 8085");
        System.out.println("====================================================");
    }
}
