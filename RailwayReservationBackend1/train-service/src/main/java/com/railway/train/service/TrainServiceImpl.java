package com.railway.train.service;

import com.railway.train.entity.Train;
import com.railway.train.repository.TrainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * ============================================================
 * TRAIN SERVICE CLASS
 * ============================================================
 * Contains business logic for train search, listing, creation, and deletion.
 */
@Service
public class TrainServiceImpl implements TrainService {

    private final TrainRepository trainRepository;

    @Autowired
    public TrainServiceImpl(TrainRepository trainRepository) {
        this.trainRepository = trainRepository;
    }

    /**
     * Get all trains in the database
     */
    @Override
    public List<Train> getAllTrains() {
        return trainRepository.findAll();
    }

    /**
     * Get train details by ID
     */
    @Override
    public Optional<Train> getTrainById(Long id) {
        return trainRepository.findById(id);
    }

    /**
     * Search train by unique train number
     */
    @Override
    public Optional<Train> getTrainByNumber(String trainNumber) {
        return trainRepository.findByTrainNumber(trainNumber);
    }

    /**
     * Core Search Functionality: Find trains by source and destination
     */
    @Override
    public List<Train> searchTrains(String source, String destination) {
        if (source != null && destination != null) {
            return trainRepository.findBySourceStationIgnoreCaseAndDestinationStationIgnoreCase(source.trim(),
                    destination.trim());
        } else if (source != null) {
            return trainRepository.findBySourceStationContainingIgnoreCase(source.trim());
        } else if (destination != null) {
            return trainRepository.findByDestinationStationContainingIgnoreCase(destination.trim());
        }
        return trainRepository.findAll();
    }

    /**
     * Add a new train to the database
     */
    @Override
    public Train addTrain(Train train) {
        return trainRepository.save(train);
    }

    /**
     * Delete train by ID
     */
    @Override
    public void deleteTrain(Long id) {
        trainRepository.deleteById(id);
    }
}
