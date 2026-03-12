package com.example.expensetrackerapp.controller;

import com.example.expensetrackerapp.dto.ExpenseRequest;
import com.example.expensetrackerapp.model.Expense;
import com.example.expensetrackerapp.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @PostMapping("/add")
    public ResponseEntity<?> addExpense(@RequestBody ExpenseRequest request, Authentication authentication) {
        try {
            if (request.getCategory() == null || request.getCategory().isEmpty()) {
                Map<String, String> err = new HashMap<>();
                err.put("message", "Category is required");
                return ResponseEntity.badRequest().body(err);
            }
            if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                Map<String, String> err = new HashMap<>();
                err.put("message", "Amount must be greater than 0");
                return ResponseEntity.badRequest().body(err);
            }

            String email = authentication.getName();
            Expense expense = expenseService.addExpense(request, email);
            return ResponseEntity.ok(expense);
        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(err);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllExpenses(Authentication authentication) {
        try {
            String email = authentication.getName();
            List<Expense> expenses = expenseService.getAllExpensesForUser(email);
            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(err);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateExpense(@PathVariable Long id,
                                           @RequestBody ExpenseRequest request,
                                           Authentication authentication) {
        try {
            String email = authentication.getName();
            Expense updated = expenseService.updateExpense(id, request, email);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id, Authentication authentication) {
        try {
            String email = authentication.getName();
            expenseService.deleteExpense(id, email);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Expense deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    // for pie chart
    @GetMapping("/category-summary")
    public ResponseEntity<?> getCategorySummary(Authentication authentication) {
        try {
            String email = authentication.getName();
            Map<String, BigDecimal> summary = expenseService.getCategoryWiseData(email);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(err);
        }
    }

}
