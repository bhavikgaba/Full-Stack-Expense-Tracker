package com.example.expensetrackerapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {

    private String token;
    private String username;
    private String email;

}
