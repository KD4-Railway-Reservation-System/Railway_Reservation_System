package com.railway.auth.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.railway.auth.dto.AuthResponse;
import com.railway.auth.dto.LoginRequest;
import com.railway.auth.dto.RegisterRequest;
import com.railway.auth.entity.Role;
import com.railway.auth.entity.User;
import com.railway.auth.repository.UserRepository;
import com.railway.auth.security.JwtService;

@Service
public class AuthServiceImpl implements AuthService {
    
    // Dependencies that this service needs
    private final UserRepository userRepository;        // To save/find users in database
    private final PasswordEncoder passwordEncoder;      // To encrypt passwords
    private final JwtService jwtService;                // To generate JWT tokens
    private final AuthenticationManager authManager;    // To verify login credentials

    // Constructor - injects all the dependencies
    public AuthServiceImpl(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService,
                          AuthenticationManager authManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authManager = authManager;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        // STEP 1: Check if email already exists in database
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }

        // STEP 2: Create new user object
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Encrypt password
        user.setRole(Role.USER); // Default role is USER

        // STEP 3: Save user to database
        user = userRepository.save(user);

        // STEP 4: Generate JWT token for the new user
        String token = jwtService.generateToken(user);

        // STEP 5: Return response with user info and token
        return buildAuthResponse(user, token);
    }

    @Override
    public AuthResponse createAdmin(RegisterRequest request) {
        // STEP 1: Check if email already exists in database
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User with email " + request.getEmail() + " already exists!");
        }

        // STEP 2: Create new admin user object
        User adminUser = new User();
        adminUser.setFullName(request.getFullName());
        adminUser.setEmail(request.getEmail());
        adminUser.setPassword(passwordEncoder.encode(request.getPassword()));
        adminUser.setRole(Role.ADMIN); // Role explicitly assigned to ADMIN by Superuser

        // STEP 3: Save admin user to database
        adminUser = userRepository.save(adminUser);

        // STEP 4: Generate JWT token for the admin user
        String token = jwtService.generateToken(adminUser);

        // STEP 5: Return response with admin user info and token
        return buildAuthResponse(adminUser, token);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // STEP 1: Create authentication token with email and password
        UsernamePasswordAuthenticationToken authToken = 
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword());

        // STEP 2: Verify credentials (throws exception if invalid)
        authManager.authenticate(authToken);

        // STEP 3: Find user in database
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found!"));

        // STEP 4: Generate JWT token for the logged-in user
        String token = jwtService.generateToken(user);

        // STEP 5: Return response with user info and token
        return buildAuthResponse(user, token);
    }

    // Helper method to build the response
    private AuthResponse buildAuthResponse(User user, String token) {
        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setTokenType("Bearer");
        response.setUserId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());
        return response;
    }
}