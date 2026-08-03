package com.railway.train.service;

import com.railway.train.entity.Train;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface TrainService {

    public List<Train> getAllTrains();

    public Optional<Train> getTrainById(Long id);

    public Optional<Train> getTrainByNumber(String trainNumber);

    public List<Train> searchTrains(String source, String destination);

    public List<Map<String, Object>> getAllStations();

    public Train addTrain(Train train);

    public Optional<Train> getTrainByIdOrNumber(String idOrNumber);

    public Train bookSeats(String idOrNumber, int seats);

    public Train cancelSeats(String idOrNumber, int seats);

    public Train updateTrain(Long id, Train updatedTrain);

    public void deleteTrain(Long id);
}

