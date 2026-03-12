package com.example.expensetrackerapp.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ExpenseRequest {

    private String category;
    private BigDecimal amount;
    private String comments;

}
