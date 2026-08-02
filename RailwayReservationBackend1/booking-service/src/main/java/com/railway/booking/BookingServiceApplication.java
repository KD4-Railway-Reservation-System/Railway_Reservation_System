package com.railway.booking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * ============================================================
 * BOOKING SERVICE - MAIN APPLICATION CLASS
 * ============================================================
 * Entry point for the Railway Ticket Booking Microservice.
 * Starts Spring Boot on port 8083 and registers with Eureka.
 */
@SpringBootApplication
@EnableDiscoveryClient
public class BookingServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookingServiceApplication.class, args);
        System.out.println("====================================================");
        System.out.println("🎫 Ticket Booking Microservice is running on port: 8083");
        System.out.println("====================================================");
    }
}
