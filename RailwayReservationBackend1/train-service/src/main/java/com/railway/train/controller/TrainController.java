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
     * 3. Get Train by Database ID
     * Example URL: GET http://localhost:8082/api/trains/1
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getTrainById(@PathVariable Long id) {
        Optional<Train> train = trainService.getTrainById(id);
        if (train.isPresent()) {
            return ResponseEntity.ok(train.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("success", false, "message", "Train not found with ID: " + id));
    }

    /**
     * 4. Get Train by Train Number
     * Example URL: GET http://localhost:8082/api/trains/number/12951
     */
    @GetMapping("/number/{trainNumber}")
    public ResponseEntity<?> getTrainByNumber(@PathVariable String trainNumber) {
        Optional<Train> train = trainService.getTrainByNumber(trainNumber);
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
    public ResponseEntity<Map<String, Object>> addTrain(@RequestBody Train train) {
        Train savedTrain = trainService.addTrain(train);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Train successfully added!");
        response.put("train", savedTrain);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
