package com.railway.notification;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * ============================================================
 * NOTIFICATION SERVICE - MAIN APPLICATION CLASS
 * ============================================================
 * Entry point for the Railway Notification Microservice.
 * Starts Spring Boot on port 8086 and registers with Eureka Server.
 */
@SpringBootApplication
@EnableDiscoveryClient
public class NotificationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(NotificationServiceApplication.class, args);
        System.out.println("====================================================");
        System.out.println("🔔 Notification Microservice is running on port: 8086");
        System.out.println("📄 Swagger Documentation: http://localhost:8086/swagger-ui.html");
        System.out.println("====================================================");
    }
}
