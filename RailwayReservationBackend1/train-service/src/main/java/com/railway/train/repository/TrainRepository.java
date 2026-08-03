package com.railway.train.repository;

import com.railway.train.entity.Train;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * ============================================================
 * TRAIN REPOSITORY INTERFACE
 * ============================================================
 * Handles database operations for Trains using Spring Data JPA.
 * Methods are automatically implemented by Spring Data JPA at runtime!
 */
@Repository
public interface TrainRepository extends JpaRepository<Train, Long> {

    /**
     * Search trains matching source and destination stations (case-insensitive substring match).
     */
    List<Train> findBySourceStationContainingIgnoreCaseAndDestinationStationContainingIgnoreCase(String source, String destination);

    /**
     * Search trains matching exact source and destination stations (case-insensitive).
     */
    List<Train> findBySourceStationIgnoreCaseAndDestinationStationIgnoreCase(String source, String destination);

    /**
     * Find train by unique train number (e.g., "12951")
     */
    Optional<Train> findByTrainNumber(String trainNumber);

    /**
     * Search trains originating from a source station keyword
     */
    List<Train> findBySourceStationContainingIgnoreCase(String source);

    /**
     * Search trains arriving at a destination station keyword
     */
    List<Train> findByDestinationStationContainingIgnoreCase(String destination);

    /**
     * Check if train number already exists in database
     */
    boolean existsByTrainNumber(String trainNumber);

    /**
     * Check if train name already exists in database (case-insensitive)
     */
    boolean existsByTrainNameIgnoreCase(String trainName);
}
