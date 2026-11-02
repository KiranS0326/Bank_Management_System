package com.bank.system.repository;

import com.bank.system.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    // This exact line is REQUIRED for the history tab to work!
    List<Transaction> findByFromAccountNumberInOrToAccountNumberIn(List<String> fromAccountNumbers, List<String> toAccountNumbers);
}