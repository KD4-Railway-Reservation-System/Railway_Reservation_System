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
     * Search trains matching source and destination stations (case-insensitive).
     * Example SQL generated: SELECT * FROM trains WHERE LOWER(source_station) = LOWER(?) AND LOWER(destination_station) = LOWER(?)
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
}
