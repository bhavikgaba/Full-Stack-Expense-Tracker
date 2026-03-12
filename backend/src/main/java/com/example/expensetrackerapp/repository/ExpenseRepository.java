package com.example.expensetrackerapp.repository;

import com.example.expensetrackerapp.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    // get all expenses for a user sorted by latest
    List<Expense> findByUserIdOrderByCreatedAtDesc(Long userId);

    // for pie chart - group by category and sum amount
    @Query("SELECT e.category, SUM(e.amount) FROM Expense e WHERE e.user.id = :userId GROUP BY e.category")
    List<Object[]> getCategoryWiseTotal(Long userId);

}
