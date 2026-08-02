package com.railway.train;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * ============================================================
 * TRAIN SERVICE - MAIN APPLICATION CLASS
 * ============================================================
 * Entry point for the Train Search & Schedule Microservice.
 * Starts Spring Boot on port 8082 and registers with Eureka.
 */
@SpringBootApplication
@EnableDiscoveryClient
public class TrainServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(TrainServiceApplication.class, args);
        System.out.println("====================================================");
        System.out.println("🚆 Train Search Microservice is running on port: 8082");
        System.out.println("====================================================");
    }
}
