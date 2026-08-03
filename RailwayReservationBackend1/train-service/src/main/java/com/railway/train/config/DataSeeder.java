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
 */
@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(TrainRepository trainRepository) {
        return args -> {
            trainRepository.deleteAll();
            System.out.println("====== DATA SEEDER: Pre-loading 24 Indian Railway train routes... ======");

            List<Train> demoTrains = List.of(
                // 1 & 2: Delhi <-> Mumbai
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
                    .fareSleeper(1.0)
                    .fareAC3(2.0)
                    .fareAC2(3.0)
                    .fareAC1(4.0)
                    .build(),

                Train.builder()
                    .trainNumber("12954")
                    .trainName("August Kranti Rajdhani")
                    .sourceStation("Mumbai Central")
                    .destinationStation("New Delhi")
                    .departureTime("17:10")
                    .arrivalTime("09:45")
                    .travelDuration("16h 35m")
                    .runningDays("Daily")
                    .availableSeats(110)
                    .fareSleeper(1.0)
                    .fareAC3(2.0)
                    .fareAC2(3.0)
                    .fareAC1(4.0)
                    .build(),

                // 3 & 4: Delhi <-> Bhopal
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
                    .fareSleeper(1.0)
                    .fareAC3(2.0)
                    .fareAC2(3.0)
                    .fareAC1(4.0)
                    .build(),

                Train.builder()
                    .trainNumber("20172")
                    .trainName("Rani Kamlapati Vande Bharat")
                    .sourceStation("Bhopal Junction")
                    .destinationStation("New Delhi")
                    .departureTime("15:05")
                    .arrivalTime("22:45")
                    .travelDuration("07h 40m")
                    .runningDays("Daily")
                    .availableSeats(160)
                    .fareSleeper(1.0)
                    .fareAC3(2.0)
                    .fareAC2(3.0)
                    .fareAC1(4.0)
                    .build(),

                // 5 & 6: Delhi <-> Varanasi
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
                    .fareSleeper(1.0)
                    .fareAC3(2.0)
                    .fareAC2(3.0)
                    .fareAC1(4.0)
                    .build(),

                Train.builder()
                    .trainNumber("15128")
                    .trainName("Kashi Vishwanath Express")
                    .sourceStation("Varanasi Junction")
                    .destinationStation("New Delhi")
                    .departureTime("13:30")
                    .arrivalTime("06:00")
                    .travelDuration("16h 30m")
                    .runningDays("Daily")
                    .availableSeats(140)
                    .fareSleeper(1.0)
                    .fareAC3(2.0)
                    .fareAC2(3.0)
                    .fareAC1(4.0)
                    .build(),

                // 7 & 8: Delhi <-> Kolkata Sealdah
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
                    .fareSleeper(1.0)
                    .fareAC3(2.0)
                    .fareAC2(3.0)
                    .fareAC1(4.0)
                    .build(),

                Train.builder()
                    .trainNumber("12314")
                    .trainName("Sealdah Rajdhani Express")
                    .sourceStation("Kolkata Sealdah")
                    .destinationStation("New Delhi")
                    .departureTime("16:50")
                    .arrivalTime("10:25")
                    .travelDuration("17h 35m")
                    .runningDays("Daily")
                    .availableSeats(130)
                    .fareSleeper(1.0)
                    .fareAC3(2.0)
                    .fareAC2(3.0)
                    .fareAC1(4.0)
                    .build(),

                // 9 & 10: Delhi <-> Bengaluru
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
                    .fareSleeper(1.0)
                    .fareAC3(2.0)
                    .fareAC2(3.0)
                    .fareAC1(4.0)
                    .build(),

                Train.builder()
                    .trainNumber("12628")
                    .trainName("Karnataka Express")
                    .sourceStation("Bengaluru City")
                    .destinationStation("New Delhi")
                    .departureTime("19:20")
                    .arrivalTime("12:00")
                    .travelDuration("40h 40m")
                    .runningDays("Daily")
                    .availableSeats(190)
                    .fareSleeper(1.0)
                    .fareAC3(2.0)
                    .fareAC2(3.0)
                    .fareAC1(4.0)
                    .build(),

                // 11 & 12: Chennai <-> Bengaluru
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
                    .fareSleeper(1.0)
                    .fareAC3(2.0)
                    .fareAC2(3.0)
                    .fareAC1(4.0)
                    .build(),

                Train.builder()
                    .trainNumber("12639")
                    .trainName("Brindavan Express")
                    .sourceStation("Bengaluru City")
                    .destinationStation("Chennai Central")
                    .departureTime("15:00")
                    .arrivalTime("21:05")
                    .travelDuration("06h 05m")
                    .runningDays("Daily")
                    .availableSeats(175)
                    .fareSleeper(1.0)
                    .fareAC3(2.0)
                    .fareAC2(3.0)
                    .fareAC1(4.0)
                    .build(),

                // 13 & 14: Mumbai <-> Amritsar
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
                    .fareSleeper(1.0)
                    .fareAC3(2.0)
                    .fareAC2(3.0)
                    .fareAC1(4.0)
                    .build(),

                Train.builder()
                    .trainNumber("12903")
                    .trainName("Golden Temple Mail")
                    .sourceStation("Amritsar Junction")
                    .destinationStation("Mumbai Central")
                    .departureTime("21:25")
                    .arrivalTime("05:20")
                    .travelDuration("31h 55m")
                    .runningDays("Daily")
                    .availableSeats(150)
                    .fareSleeper(1.0)
                    .fareAC3(2.0)
                    .fareAC2(3.0)
                    .fareAC1(4.0)
                    .build(),

                // 15 & 16: Ahmedabad <-> Mumbai
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
                    .fareSleeper(1.0)
                    .fareAC3(2.0)
                    .fareAC2(3.0)
                    .fareAC1(4.0)
                    .build(),

                Train.builder()
                    .trainNumber("12932")
                    .trainName("Double Decker Express")
                    .sourceStation("Mumbai Central")
                    .destinationStation("Ahmedabad Junction")
                    .departureTime("14:30")
                    .arrivalTime("21:25")
                    .travelDuration("06h 55m")
                    .runningDays("Mon, Tue, Wed, Thu, Fri, Sat")
                    .availableSeats(220)
                    .fareSleeper(1.0)
                    .fareAC3(2.0)
                    .fareAC2(3.0)
                    .fareAC1(4.0)
                    .build(),

                // 17 & 18: Delhi <-> Jaipur
                Train.builder()
                    .trainNumber("12015")
                    .trainName("Ajmer Shatabdi Express")
                    .sourceStation("New Delhi")
                    .destinationStation("Jaipur Junction")
                    .departureTime("06:10")
                    .arrivalTime("10:40")
                    .travelDuration("04h 30m")
                    .runningDays("Daily")
                    .availableSeats(145)
                    .fareSleeper(1.0)
                    .fareAC3(2.0)
                    .fareAC2(3.0)
                    .fareAC1(4.0)
                    .build(),

                Train.builder()
                    .trainNumber("12916")
                    .trainName("Ashram Express")
                    .sourceStation("Jaipur Junction")
                    .destinationStation("New Delhi")
                    .departureTime("20:25")
                    .arrivalTime("01:30")
                    .travelDuration("05h 05m")
                    .runningDays("Daily")
                    .availableSeats(170)
                    .fareSleeper(1.0)
                    .fareAC3(2.0)
                    .fareAC2(3.0)
                    .fareAC1(4.0)
                    .build(),

                // 19 & 20: Delhi <-> Lucknow
                Train.builder()
                    .trainNumber("12004")
                    .trainName("Lucknow Swarna Shatabdi")
                    .sourceStation("New Delhi")
                    .destinationStation("Lucknow Charbagh")
                    .departureTime("06:10")
                    .arrivalTime("12:40")
                    .travelDuration("06h 30m")
                    .runningDays("Daily")
                    .availableSeats(160)
                    .fareSleeper(1.0)
                    .fareAC3(2.0)
                    .fareAC2(3.0)
                    .fareAC1(4.0)
                    .build(),

                Train.builder()
                    .trainNumber("12583")
                    .trainName("Lucknow Double Decker")
                    .sourceStation("Lucknow Charbagh")
                    .destinationStation("New Delhi")
                    .departureTime("15:30")
                    .arrivalTime("22:15")
                    .travelDuration("06h 45m")
                    .runningDays("Mon, Tue, Thu, Fri, Sat")
                    .availableSeats(185)
                    .fareSleeper(1.0)
                    .fareAC3(2.0)
                    .fareAC2(3.0)
                    .fareAC1(4.0)
                    .build(),

                // 21 & 22: Delhi / Hyderabad / Pune / Patna
                Train.builder()
                    .trainNumber("12724")
                    .trainName("Telangana Express")
                    .sourceStation("New Delhi")
                    .destinationStation("Hyderabad Secunderabad")
                    .departureTime("16:00")
                    .arrivalTime("17:15")
                    .travelDuration("25h 15m")
                    .runningDays("Daily")
                    .availableSeats(155)
                    .fareSleeper(1.0)
                    .fareAC3(2.0)
                    .fareAC2(3.0)
                    .fareAC1(4.0)
                    .build(),

                Train.builder()
                    .trainNumber("12124")
                    .trainName("Deccan Queen Express")
                    .sourceStation("Pune Junction")
                    .destinationStation("Mumbai Central")
                    .departureTime("07:15")
                    .arrivalTime("10:25")
                    .travelDuration("03h 10m")
                    .runningDays("Daily")
                    .availableSeats(195)
                    .fareSleeper(1.0)
                    .fareAC3(2.0)
                    .fareAC2(3.0)
                    .fareAC1(4.0)
                    .build(),

                Train.builder()
                    .trainNumber("12394")
                    .trainName("Sampoorna Kranti Express")
                    .sourceStation("New Delhi")
                    .destinationStation("Patna Junction")
                    .departureTime("17:30")
                    .arrivalTime("06:50")
                    .travelDuration("13h 20m")
                    .runningDays("Daily")
                    .availableSeats(200)
                    .fareSleeper(1.0)
                    .fareAC3(2.0)
                    .fareAC2(3.0)
                    .fareAC1(4.0)
                    .build(),

                Train.builder()
                    .trainNumber("12759")
                    .trainName("Charminar Express")
                    .sourceStation("Hyderabad Secunderabad")
                    .destinationStation("Chennai Central")
                    .departureTime("18:00")
                    .arrivalTime("08:00")
                    .travelDuration("14h 00m")
                    .runningDays("Daily")
                    .availableSeats(165)
                    .fareSleeper(1.0)
                    .fareAC3(2.0)
                    .fareAC2(3.0)
                    .fareAC1(4.0)
                    .build()
            );

            trainRepository.saveAll(demoTrains);
            System.out.println("====== DATA SEEDER: Successfully seeded 24 train routes! ======");
        };
    }
}

