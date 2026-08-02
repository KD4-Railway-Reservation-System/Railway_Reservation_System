package com.railway.auth.service;
import com.railway.auth.dto.AuthResponse;
import com.railway.auth.dto.LoginRequest;
import com.railway.auth.dto.RegisterRequest;


public interface AuthService {
	    AuthResponse register(RegisterRequest request);	    
	    AuthResponse login(LoginRequest request);
}
