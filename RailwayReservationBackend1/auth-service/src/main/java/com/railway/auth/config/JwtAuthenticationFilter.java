package com.railway.auth.config;

import java.io.IOException;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.railway.auth.security.CustomUserDetailsService;
import com.railway.auth.security.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    // Constructor - injects dependencies
    public JwtAuthenticationFilter(
            JwtService jwtService,
            CustomUserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        // STEP 1: Get the Authorization header from the request
        String authHeader = request.getHeader("Authorization");
        
        // STEP 2: Check if header exists and starts with "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // If not, continue to next filter
            filterChain.doFilter(request, response);
            return;
        }

        // STEP 3: Extract the JWT token (remove "Bearer " prefix)
        String token = authHeader.substring(7);
        
        // STEP 4: Extract email from token
        String email = jwtService.extractEmail(token);
        
        // STEP 5: Check if email exists and user is not already authenticated
        if (email != null && 
            SecurityContextHolder.getContext().getAuthentication() == null) {
            
            // STEP 6: Load user details from database using email
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            
            // STEP 7: Validate the token
            if (jwtService.validateToken(token, userDetails)) {
                
                // STEP 8: Create authentication token
                UsernamePasswordAuthenticationToken authToken = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,  // No credentials needed
                        userDetails.getAuthorities()
                    );
                
                // STEP 9: Set request details
                authToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
                );
                
                // STEP 10: Set authentication in SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        // STEP 11: Continue to next filter
        filterChain.doFilter(request, response);
    }
}