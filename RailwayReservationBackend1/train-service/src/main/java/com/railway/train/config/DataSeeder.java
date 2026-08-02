package com.railway.train.config;

import com.railway.train.entity.Train;
import com.railway.train.repository.TrainRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * ============================================================
 * DEMO DATA SEEDER
 * ============================================================
 * Populates sample Indian Railway trains into the database when the application starts up.
 * This guarantees you have demo data ready for search APIs!
 */
@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(TrainRepository trainRepository) {
        return args -> {
            // Check if database is already populated
            if (trainRepository.count() > 0) {
                System.out.println("====== DATA SEEDER: Database already contains trains. Skipping seeding. ======");
                return;
            }

            System.out.println("====== DATA SEEDER: Pre-loading sample train data... ======");

            List<Train> demoTrains = List.of(
                Train.builder()
                    .trainNumber("12951")
                    .trainName("Mumbai Rajdhani Express")
                    .sourceStation("New Delhi")
                    .destinationStation("Mumbai Central")
                    .departureTime("16:55")
                    .arrivalTime("08:35")
                    .travelDuration("15h 40m")
                    .runningDays("Daily")
                    .availableSeats(120)
                    .fareSleeper(650.0)
                    .fareAC3(1850.0)
                    .fareAC2(2650.0)
                    .fareAC1(4350.0)
                    .build(),

                Train.builder()
                    .trainNumber("12002")
                    .trainName("Bhopal Shatabdi Express")
                    .sourceStation("New Delhi")
                    .destinationStation("Bhopal Junction")
                    .departureTime("06:00")
                    .arrivalTime("14:40")
                    .travelDuration("08h 40m")
                    .runningDays("Daily")
                    .availableSeats(95)
                    .fareSleeper(0.0) // Chair Car only
                    .fareAC3(1150.0)
                    .fareAC2(1650.0)
                    .fareAC1(2100.0)
                    .build(),

                Train.builder()
                    .trainNumber("22436")
                    .trainName("Vande Bharat Express")
                    .sourceStation("New Delhi")
                    .destinationStation("Varanasi Junction")
                    .departureTime("06:00")
                    .arrivalTime("14:00")
                    .travelDuration("08h 00m")
                    .runningDays("Tue, Wed, Fri, Sat, Sun")
                    .availableSeats(180)
                    .fareSleeper(0.0)
                    .fareAC3(1450.0)
                    .fareAC2(2150.0)
                    .fareAC1(2850.0)
                    .build(),

                Train.builder()
                    .trainNumber("12260")
                    .trainName("Sealdah Duronto Express")
                    .sourceStation("New Delhi")
                    .destinationStation("Kolkata Sealdah")
                    .departureTime("19:45")
                    .arrivalTime("12:30")
                    .travelDuration("16h 45m")
                    .runningDays("Mon, Wed, Thu, Sun")
                    .availableSeats(110)
                    .fareSleeper(720.0)
                    .fareAC3(1950.0)
                    .fareAC2(2750.0)
                    .fareAC1(4500.0)
                    .build(),

                Train.builder()
                    .trainNumber("12626")
                    .trainName("Kerala Express")
                    .sourceStation("New Delhi")
                    .destinationStation("Bengaluru City")
                    .departureTime("20:10")
                    .arrivalTime("13:50")
                    .travelDuration("41h 40m")
                    .runningDays("Daily")
                    .availableSeats(210)
                    .fareSleeper(820.0)
                    .fareAC3(2100.0)
                    .fareAC2(3050.0)
                    .fareAC1(5100.0)
                    .build(),

                Train.builder()
                    .trainNumber("12008")
                    .trainName("Mysore Shatabdi Express")
                    .sourceStation("Chennai Central")
                    .destinationStation("Bengaluru City")
                    .departureTime("06:00")
                    .arrivalTime("10:45")
                    .travelDuration("04h 45m")
                    .runningDays("Mon, Wed, Thu, Fri, Sat, Sun")
                    .availableSeats(140)
                    .fareSleeper(0.0)
                    .fareAC3(780.0)
                    .fareAC2(1250.0)
                    .fareAC1(1650.0)
                    .build(),

                Train.builder()
                    .trainNumber("12925")
                    .trainName("Paschim Express")
                    .sourceStation("Mumbai Central")
                    .destinationStation("Amritsar Junction")
                    .departureTime("11:25")
                    .arrivalTime("20:20")
                    .travelDuration("32h 55m")
                    .runningDays("Daily")
                    .availableSeats(165)
                    .fareSleeper(690.0)
                    .fareAC3(1820.0)
                    .fareAC2(2610.0)
                    .fareAC1(4280.0)
                    .build(),

                Train.builder()
                    .trainNumber("82902")
                    .trainName("Tejas Express")
                    .sourceStation("Ahmedabad Junction")
                    .destinationStation("Mumbai Central")
                    .departureTime("06:40")
                    .arrivalTime("13:05")
                    .travelDuration("06h 25m")
                    .runningDays("Mon, Tue, Wed, Fri, Sat, Sun")
                    .availableSeats(130)
                    .fareSleeper(0.0)
                    .fareAC3(1280.0)
                    .fareAC2(1850.0)
                    .fareAC1(2450.0)
                    .build()
            );

            trainRepository.saveAll(demoTrains);
            System.out.println("====== DATA SEEDER: Successfully seeded 8 train routes! ======");
        };
    }
}
