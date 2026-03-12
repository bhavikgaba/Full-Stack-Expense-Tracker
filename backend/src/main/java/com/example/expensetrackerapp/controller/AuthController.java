package com.example.expensetrackerapp.controller;

import com.example.expensetrackerapp.dto.JwtResponse;
import com.example.expensetrackerapp.dto.LoginRequest;
import com.example.expensetrackerapp.dto.SignupRequest;
import com.example.expensetrackerapp.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        // basic validation
        if (request.getUsername() == null || request.getUsername().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Username is required");
            return ResponseEntity.badRequest().body(error);
        }
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Email is required");
            return ResponseEntity.badRequest().body(error);
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Password must be at least 6 characters");
            return ResponseEntity.badRequest().body(error);
        }

        try {
            String result = authService.registerUser(request);
            Map<String, String> response = new HashMap<>();
            response.put("message", result);

            if (result.contains("successfully")) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Something went wrong: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            JwtResponse response = authService.loginUser(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid email or password");
            return ResponseEntity.badRequest().body(error);
        }
    }

}
