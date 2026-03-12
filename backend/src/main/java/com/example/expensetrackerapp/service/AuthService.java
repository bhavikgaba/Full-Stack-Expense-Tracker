package com.example.expensetrackerapp.service;

import com.example.expensetrackerapp.dto.JwtResponse;
import com.example.expensetrackerapp.dto.LoginRequest;
import com.example.expensetrackerapp.dto.SignupRequest;
import com.example.expensetrackerapp.model.User;
import com.example.expensetrackerapp.repository.UserRepository;
import com.example.expensetrackerapp.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    public String registerUser(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already exists!";
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            return "Username already taken!";
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);
        return "User registered successfully!";
    }

    public JwtResponse loginUser(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail()).get();
        String token = jwtUtil.generateToken(user.getEmail());

        return new JwtResponse(token, user.getUsername(), user.getEmail());
    }

}
