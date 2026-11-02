package com.bank.system.controller;

import com.bank.system.model.Account;
import com.bank.system.model.Transaction;
import com.bank.system.repository.AccountRepository;
import com.bank.system.repository.TransactionRepository;
import com.bank.system.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @PostMapping("/pay-bill")
    public ResponseEntity<?> processBillPayment(@RequestBody Map<String, Object> payload) {
        try {
            String email = (String) payload.get("email");
            Double amount = Double.valueOf(payload.get("amount").toString());

            // Call your service layer
            Double newBalance = transactionService.payBill(email, amount);

            return ResponseEntity.ok(Map.of(
                "message", "Bill paid successfully",
                "newBalance", newBalance
            ));
        } catch (Exception e) {
            // This will catch your custom exceptions and return a 400 Bad Request
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // New endpoint to fetch transaction history for the React frontend
    @GetMapping("/user/{email}")
    public ResponseEntity<?> getUserTransactions(@PathVariable String email) {
        try {
            // 1. Find all accounts belonging to this user
            List<Account> accounts = accountRepository.findAllByUser_Email(email);
            List<String> accountNumbers = accounts.stream()
                    .map(Account::getAccountNumber)
                    .collect(Collectors.toList());
            
            // If they have no accounts, return an empty list
            if (accountNumbers.isEmpty()) {
                return ResponseEntity.ok(java.util.Collections.emptyList());
            }

            // 2. Fetch all transactions matching those account numbers
            List<Transaction> transactions = 
                    transactionRepository.findByFromAccountNumberInOrToAccountNumberIn(accountNumbers, accountNumbers);
            
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching transactions: " + e.getMessage());
        }
    }
}