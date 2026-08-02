package com.railway.train.service;

import com.railway.train.entity.Train;

import java.util.List;
import java.util.Optional;

public interface TrainService {

    public List<Train> getAllTrains();

    public Optional<Train> getTrainById(Long id);

    public Optional<Train> getTrainByNumber(String trainNumber);

    public List<Train> searchTrains(String source, String destination);

    public Train addTrain(Train train);

    public void deleteTrain(Long id);
}
