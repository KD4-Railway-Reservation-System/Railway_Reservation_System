package com.railway.train.controller;

import com.railway.train.entity.Train;
import com.railway.train.service.TrainService;
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
 * TRAIN REST CONTROLLER
 * ============================================================
 * Exposes REST API endpoints for train search and management.
 * Base URL Path: /api/trains
 */
@RestController
@RequestMapping("/api/trains")
@CrossOrigin(origins = "*") // Allows cross-origin requests from frontend apps
public class TrainController {

    private final TrainService trainService;

    @Autowired
    public TrainController(TrainService trainService) {
        this.trainService = trainService;
    }

    /**
     * 1. Search Trains by Source and Destination Stations
     * Example URL: GET http://localhost:8082/api/trains/search?source=New Delhi&destination=Mumbai Central
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchTrains(
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String destination) {

        List<Train> trains = trainService.searchTrains(source, destination);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", trains.size());
        response.put("searchCriteria", Map.of(
            "source", source != null ? source : "ALL",
            "destination", destination != null ? destination : "ALL"
        ));
        response.put("trains", trains);

        return ResponseEntity.ok(response);
    }

    /**
     * 2. Get List of All Trains
     * URL: GET http://localhost:8082/api/trains
     */
    @GetMapping
    public ResponseEntity<List<Train>> getAllTrains() {
        List<Train> trains = trainService.getAllTrains();
        return ResponseEntity.ok(trains);
    }

    /**
     * 2b. Get List of All Stations
     * URL: GET http://localhost:8082/api/trains/stations
     */
    @GetMapping("/stations")
    public ResponseEntity<List<Map<String, Object>>> getAllStations() {
        List<Map<String, Object>> stations = trainService.getAllStations();
        return ResponseEntity.ok(stations);
    }


    /**
     * 3. Get Train by Database ID or Train Number or Index
     * Example URL: GET http://localhost:8082/api/trains/1
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getTrainById(@PathVariable String id) {
        Optional<Train> train = trainService.getTrainByIdOrNumber(id);
        if (train.isPresent()) {
            return ResponseEntity.ok(train.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("success", false, "message", "Train not found with ID or Train Number: " + id));
    }

    /**
     * 3b. Book Seat Endpoint (Decrements availableSeats on train)
     * Example URL: PUT http://localhost:8082/api/trains/1/book-seat?seats=1
     */
    @PutMapping("/{id}/book-seat")
    public ResponseEntity<?> bookSeats(
            @PathVariable String id,
            @RequestParam(defaultValue = "1") int seats) {
        try {
            Train updatedTrain = trainService.bookSeats(id, seats);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", seats + " seat(s) successfully booked!");
            response.put("train", updatedTrain);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * 3c. Cancel Seat Endpoint (Increments availableSeats on train)
     * Example URL: PUT http://localhost:8082/api/trains/1/cancel-seat?seats=1
     */
    @PutMapping("/{id}/cancel-seat")
    public ResponseEntity<?> cancelSeats(
            @PathVariable String id,
            @RequestParam(defaultValue = "1") int seats) {
        try {
            Train updatedTrain = trainService.cancelSeats(id, seats);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", seats + " seat(s) successfully restored!");
            response.put("train", updatedTrain);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * 4. Get Train by Train Number
     * Example URL: GET http://localhost:8082/api/trains/number/12951
     */
    @GetMapping("/number/{trainNumber}")
    public ResponseEntity<?> getTrainByNumber(@PathVariable String trainNumber) {
        Optional<Train> train = trainService.getTrainByIdOrNumber(trainNumber);
        if (train.isPresent()) {
            return ResponseEntity.ok(train.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("success", false, "message", "Train not found with Train Number: " + trainNumber));
    }

    /**
     * 5. Add a New Train (Admin / Creation Endpoint)
     * URL: POST http://localhost:8082/api/trains
     */
    @PostMapping
    public ResponseEntity<?> addTrain(@RequestBody Train train) {
        try {
            Train savedTrain = trainService.addTrain(train);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Train successfully added!");
            response.put("train", savedTrain);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        }
    }

    /**
     * 6. Update Existing Train Route Details (Superuser / Admin Edit Endpoint)
     * URL: PUT http://localhost:8082/api/trains/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTrain(@PathVariable Long id, @RequestBody Train updatedTrain) {
        try {
            Train savedTrain = trainService.updateTrain(id, updatedTrain);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Train details updated successfully!");
            response.put("train", savedTrain);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    /**
     * 7. Delete Train Route (Superuser / Admin Delete Endpoint)
     * URL: DELETE http://localhost:8082/api/trains/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrain(@PathVariable Long id) {
        try {
            trainService.deleteTrain(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Train route deleted successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Failed to delete train route: " + e.getMessage()));
        }
    }
}
