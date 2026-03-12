package com.example.expensetrackerapp.service;

import com.example.expensetrackerapp.dto.ExpenseRequest;
import com.example.expensetrackerapp.model.Expense;
import com.example.expensetrackerapp.model.User;
import com.example.expensetrackerapp.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    public Expense addExpense(ExpenseRequest request, String email) {
        User user = userDetailsService.getUserByEmail(email);

        Expense expense = new Expense();
        expense.setCategory(request.getCategory());
        expense.setAmount(request.getAmount());
        expense.setComments(request.getComments());
        expense.setUser(user);

        return expenseRepository.save(expense);
    }

    public List<Expense> getAllExpensesForUser(String email) {
        User user = userDetailsService.getUserByEmail(email);
        return expenseRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public Expense updateExpense(Long expenseId, ExpenseRequest request, String email) {
        User user = userDetailsService.getUserByEmail(email);

        Optional<Expense> optionalExpense = expenseRepository.findById(expenseId);
        if (optionalExpense.isEmpty()) {
            throw new RuntimeException("Expense not found with id: " + expenseId);
        }

        Expense expense = optionalExpense.get();

        // check if this expense belongs to the logged in user
        if (!expense.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to update this expense");
        }

        expense.setCategory(request.getCategory());
        expense.setAmount(request.getAmount());
        expense.setComments(request.getComments());

        return expenseRepository.save(expense);
    }

    public void deleteExpense(Long expenseId, String email) {
        User user = userDetailsService.getUserByEmail(email);

        Optional<Expense> optionalExpense = expenseRepository.findById(expenseId);
        if (optionalExpense.isEmpty()) {
            throw new RuntimeException("Expense not found");
        }

        Expense expense = optionalExpense.get();

        if (!expense.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to delete this expense");
        }

        expenseRepository.delete(expense);
    }

    public Map<String, BigDecimal> getCategoryWiseData(String email) {
        User user = userDetailsService.getUserByEmail(email);
        List<Object[]> results = expenseRepository.getCategoryWiseTotal(user.getId());

        Map<String, BigDecimal> categoryMap = new HashMap<>();
        for (Object[] row : results) {
            String category = (String) row[0];
            BigDecimal total = (BigDecimal) row[1];
            categoryMap.put(category, total);
        }

        return categoryMap;
    }

}
