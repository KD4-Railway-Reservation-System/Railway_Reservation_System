package com.railway.auth.config;

import com.railway.auth.entity.Role;
import com.railway.auth.entity.User;
import com.railway.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * ============================================================
 * AUTH SERVICE DATA SEEDER
 * ============================================================
 * Seeds initial Admin, Superuser, and User credentials into database upon application startup.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Admin Account: rahul123@gmail.com / rahul123
        if (!userRepository.existsByEmail("rahul123@gmail.com")) {
            User admin = User.builder()
                    .fullName("Admin Rahul")
                    .email("rahul123@gmail.com")
                    .password(passwordEncoder.encode("rahul123"))
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            System.out.println("✅ DataSeeder: Admin user created -> rahul123@gmail.com");
        }

        // 2. Superuser Account: rahul1234@gmail / rahul1234
        if (!userRepository.existsByEmail("rahul1234@gmail")) {
            User superuser1 = User.builder()
                    .fullName("Superuser Rahul")
                    .email("rahul1234@gmail")
                    .password(passwordEncoder.encode("rahul1234"))
                    .role(Role.SUPERUSER)
                    .enabled(true)
                    .build();
            userRepository.save(superuser1);
            System.out.println("✅ DataSeeder: Superuser created -> rahul1234@gmail");
        }

        // 2b. Superuser Account fallback: rahul1234@gmail.com / rahul1234
        if (!userRepository.existsByEmail("rahul1234@gmail.com")) {
            User superuser2 = User.builder()
                    .fullName("Superuser Rahul")
                    .email("rahul1234@gmail.com")
                    .password(passwordEncoder.encode("rahul1234"))
                    .role(Role.SUPERUSER)
                    .enabled(true)
                    .build();
            userRepository.save(superuser2);
            System.out.println("✅ DataSeeder: Superuser created -> rahul1234@gmail.com");
        }

        // 3. Demo Standard User: rahulsrichunar@gmail.com / 123
        if (!userRepository.existsByEmail("rahulsrichunar@gmail.com")) {
            User demoUser = User.builder()
                    .fullName("Rahul Srivastava")
                    .email("rahulsrichunar@gmail.com")
                    .password(passwordEncoder.encode("123"))
                    .role(Role.USER)
                    .enabled(true)
                    .build();
            userRepository.save(demoUser);
            System.out.println("✅ DataSeeder: Standard user created -> rahulsrichunar@gmail.com");
        }
    }
}
