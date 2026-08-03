package com.railway.train.service;

import com.railway.train.entity.Train;
import com.railway.train.repository.TrainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * ============================================================
 * TRAIN SERVICE CLASS
 * ============================================================
 * Contains business logic for train search, listing, creation, and deletion.
 */
@Service
public class TrainServiceImpl implements TrainService {

    private final TrainRepository trainRepository;

    private static final Map<String, String[]> STATION_METADATA = Map.ofEntries(
        Map.entry("New Delhi", new String[]{"NDLS", "New Delhi"}),
        Map.entry("Mumbai Central", new String[]{"MMCT", "Mumbai"}),
        Map.entry("Bhopal Junction", new String[]{"BPL", "Bhopal"}),
        Map.entry("Varanasi Junction", new String[]{"BSB", "Varanasi"}),
        Map.entry("Kolkata Sealdah", new String[]{"SDAH", "Kolkata"}),
        Map.entry("Bengaluru City", new String[]{"SBC", "Bengaluru"}),
        Map.entry("Chennai Central", new String[]{"MAS", "Chennai"}),
        Map.entry("Amritsar Junction", new String[]{"ASR", "Amritsar"}),
        Map.entry("Ahmedabad Junction", new String[]{"ADI", "Ahmedabad"}),
        Map.entry("Jaipur Junction", new String[]{"JP", "Jaipur"}),
        Map.entry("Lucknow Charbagh", new String[]{"LKO", "Lucknow"}),
        Map.entry("Hyderabad Secunderabad", new String[]{"SC", "Hyderabad"}),
        Map.entry("Pune Junction", new String[]{"PUNE", "Pune"}),
        Map.entry("Howrah Junction", new String[]{"HWH", "Kolkata"}),
        Map.entry("Patna Junction", new String[]{"PNBE", "Patna"})
    );

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
     * Robust Train Lookup by DB ID or Train Number or Index
     */
    @Override
    public Optional<Train> getTrainByIdOrNumber(String idOrNumber) {
        if (idOrNumber == null || idOrNumber.trim().isEmpty()) {
            return Optional.empty();
        }

        String clean = idOrNumber.trim();

        // 1. Try DB primary key ID lookup
        try {
            Long numericId = Long.parseLong(clean);
            Optional<Train> trainById = trainRepository.findById(numericId);
            if (trainById.isPresent()) {
                return trainById;
            }
        } catch (NumberFormatException e) {
            // Not a number, proceed to train number lookup
        }

        // 2. Try Train Number lookup (e.g. "12951")
        Optional<Train> trainByNumber = trainRepository.findByTrainNumber(clean);
        if (trainByNumber.isPresent()) {
            return trainByNumber;
        }

        // 3. Fallback: Check if numeric index matches 1-based index of all trains
        try {
            int index = Integer.parseInt(clean) - 1;
            List<Train> all = trainRepository.findAll();
            if (index >= 0 && index < all.size()) {
                return Optional.of(all.get(index));
            }
        } catch (Exception e) {
            // Ignore index fallback errors
        }

        return Optional.empty();
    }

    /**
     * Decrement available seats upon ticket booking
     */
    @Override
    public Train bookSeats(String idOrNumber, int seats) {
        Train train = getTrainByIdOrNumber(idOrNumber)
                .orElseThrow(() -> new IllegalArgumentException("Train not found with ID or Train Number: " + idOrNumber));

        int currentSeats = train.getAvailableSeats() != null ? train.getAvailableSeats() : 100;
        int seatsToBook = seats > 0 ? seats : 1;

        if (currentSeats < seatsToBook) {
            throw new IllegalArgumentException("Insufficient seats available on train " + train.getTrainName() + ". Seats left: " + currentSeats);
        }

        train.setAvailableSeats(currentSeats - seatsToBook);
        return trainRepository.save(train);
    }

    /**
     * Increment available seats upon ticket cancellation
     */
    @Override
    public Train cancelSeats(String idOrNumber, int seats) {
        Train train = getTrainByIdOrNumber(idOrNumber)
                .orElseThrow(() -> new IllegalArgumentException("Train not found with ID or Train Number: " + idOrNumber));

        int currentSeats = train.getAvailableSeats() != null ? train.getAvailableSeats() : 100;
        int seatsToRestore = seats > 0 ? seats : 1;

        train.setAvailableSeats(currentSeats + seatsToRestore);
        return trainRepository.save(train);
    }

    /**
     * Core Search Functionality: Find trains by source and destination
     */
    @Override
    public List<Train> searchTrains(String source, String destination) {
        boolean hasSource = source != null && !source.trim().isEmpty() && !"ALL".equalsIgnoreCase(source.trim());
        boolean hasDest = destination != null && !destination.trim().isEmpty() && !"ALL".equalsIgnoreCase(destination.trim());

        String cleanSource = hasSource ? source.trim() : null;
        String cleanDest = hasDest ? destination.trim() : null;

        if (hasSource && hasDest) {
            return trainRepository.findBySourceStationContainingIgnoreCaseAndDestinationStationContainingIgnoreCase(
                    cleanSource, cleanDest);
        } else if (hasSource) {
            return trainRepository.findBySourceStationContainingIgnoreCase(cleanSource);
        } else if (hasDest) {
            return trainRepository.findByDestinationStationContainingIgnoreCase(cleanDest);
        }
        return trainRepository.findAll();
    }

    /**
     * Dynamically collects unique stations from the train database
     */
    @Override
    public List<Map<String, Object>> getAllStations() {
        List<Train> trains = trainRepository.findAll();
        Set<String> stationNames = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);

        // Standard station set
        stationNames.addAll(STATION_METADATA.keySet());

        for (Train t : trains) {
            if (t.getSourceStation() != null && !t.getSourceStation().isBlank()) {
                stationNames.add(t.getSourceStation().trim());
            }
            if (t.getDestinationStation() != null && !t.getDestinationStation().isBlank()) {
                stationNames.add(t.getDestinationStation().trim());
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();
        long idCounter = 1;
        for (String sName : stationNames) {
            String[] meta = STATION_METADATA.getOrDefault(sName, new String[]{generateCode(sName), extractCity(sName)});
            Map<String, Object> stationMap = new HashMap<>();
            stationMap.put("id", idCounter);
            stationMap.put("stationId", idCounter);
            stationMap.put("stationCode", meta[0]);
            stationMap.put("stationName", sName);
            stationMap.put("city", meta[1]);
            result.add(stationMap);
            idCounter++;
        }

        return result;
    }

    private String generateCode(String name) {
        if (name == null || name.isBlank()) return "STN";
        String[] parts = name.split("\\s+");
        if (parts.length == 1) {
            return name.substring(0, Math.min(3, name.length())).toUpperCase();
        }
        StringBuilder sb = new StringBuilder();
        for (String p : parts) {
            if (!p.isBlank()) sb.append(p.charAt(0));
        }
        return sb.toString().toUpperCase();
    }

    private String extractCity(String name) {
        if (name == null || name.isBlank()) return "Unknown";
        return name.replaceAll("(?i)\\s+(Junction|Central|Terminus|Express|Railway Station|City)$", "").trim();
    }

    /**
     * Add a new train to the database with duplicate train number & train name validation
     */
    @Override
    public Train addTrain(Train train) {
        if (train.getTrainNumber() != null && !train.getTrainNumber().isBlank()) {
            String trimmedNumber = train.getTrainNumber().trim();
            if (trainRepository.existsByTrainNumber(trimmedNumber)) {
                throw new IllegalArgumentException("Train Number '" + trimmedNumber + "' already exists in database!");
            }
        }

        if (train.getTrainName() != null && !train.getTrainName().isBlank()) {
            String trimmedName = train.getTrainName().trim();
            if (trainRepository.existsByTrainNameIgnoreCase(trimmedName)) {
                throw new IllegalArgumentException("Train Name '" + trimmedName + "' already exists in database!");
            }
        }

        return trainRepository.save(train);
    }

    /**
     * Update an existing train's details (Superuser / Admin edit functionality)
     */
    @Override
    public Train updateTrain(Long id, Train updatedTrain) {
        Train existingTrain = trainRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Train not found with ID: " + id));

        // If train number is modified, verify duplicate check
        if (updatedTrain.getTrainNumber() != null && !updatedTrain.getTrainNumber().isBlank()) {
            String newNumber = updatedTrain.getTrainNumber().trim();
            if (!newNumber.equalsIgnoreCase(existingTrain.getTrainNumber())) {
                if (trainRepository.existsByTrainNumber(newNumber)) {
                    throw new IllegalArgumentException("Train Number '" + newNumber + "' already exists in database!");
                }
                existingTrain.setTrainNumber(newNumber);
            }
        }

        // If train name is modified, verify duplicate check
        if (updatedTrain.getTrainName() != null && !updatedTrain.getTrainName().isBlank()) {
            String newName = updatedTrain.getTrainName().trim();
            if (!newName.equalsIgnoreCase(existingTrain.getTrainName())) {
                if (trainRepository.existsByTrainNameIgnoreCase(newName)) {
                    throw new IllegalArgumentException("Train Name '" + newName + "' already exists in database!");
                }
                existingTrain.setTrainName(newName);
            }
        }

        if (updatedTrain.getSourceStation() != null) existingTrain.setSourceStation(updatedTrain.getSourceStation().trim());
        if (updatedTrain.getDestinationStation() != null) existingTrain.setDestinationStation(updatedTrain.getDestinationStation().trim());
        if (updatedTrain.getDepartureTime() != null) existingTrain.setDepartureTime(updatedTrain.getDepartureTime().trim());
        if (updatedTrain.getArrivalTime() != null) existingTrain.setArrivalTime(updatedTrain.getArrivalTime().trim());
        if (updatedTrain.getTravelDuration() != null) existingTrain.setTravelDuration(updatedTrain.getTravelDuration().trim());
        if (updatedTrain.getRunningDays() != null) existingTrain.setRunningDays(updatedTrain.getRunningDays().trim());

        if (updatedTrain.getAvailableSeats() != null && updatedTrain.getAvailableSeats() >= 0) {
            existingTrain.setAvailableSeats(updatedTrain.getAvailableSeats());
        }
        if (updatedTrain.getFareSleeper() != null) existingTrain.setFareSleeper(updatedTrain.getFareSleeper());
        if (updatedTrain.getFareAC3() != null) existingTrain.setFareAC3(updatedTrain.getFareAC3());
        if (updatedTrain.getFareAC2() != null) existingTrain.setFareAC2(updatedTrain.getFareAC2());
        if (updatedTrain.getFareAC1() != null) existingTrain.setFareAC1(updatedTrain.getFareAC1());

        return trainRepository.save(existingTrain);
    }

    /**
     * Delete train by ID
     */
    @Override
    public void deleteTrain(Long id) {
        trainRepository.deleteById(id);
    }
}

