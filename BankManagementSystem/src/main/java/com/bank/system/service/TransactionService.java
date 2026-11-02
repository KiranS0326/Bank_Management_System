package com.bank.system.service;

import com.bank.system.model.Account;
import com.bank.system.model.Transaction;
import com.bank.system.repository.AccountRepository;
import com.bank.system.repository.TransactionRepository;
import com.bank.system.exception.AccountNotFoundException;
import com.bank.system.exception.InsufficientFundsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class TransactionService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository; // Allows us to save receipts

    public Double payBill(String email, Double amount) {
        // 1. Find the account using the relationship mapping
        Account account = accountRepository.findByUser_Email(email)
                .orElseThrow(() -> new AccountNotFoundException("Account not found for email: " + email));

        // 2. Check the balance
        if (account.getBalance() < amount) {
            throw new InsufficientFundsException("Insufficient funds to pay this bill.");
        }

        // 3. Deduct the money and save
        account.setBalance(account.getBalance() - amount);
        accountRepository.save(account);

        // 4. Create and save the exact Transaction matching your model
        Transaction transaction = new Transaction();
        transaction.setFromAccountNumber(account.getAccountNumber());
        transaction.setToAccountNumber("BILLER"); // Represents the utility company
        transaction.setAmount(amount);
        transaction.setTimestamp(LocalDateTime.now());
        
        transactionRepository.save(transaction); // Save receipt to database

        return account.getBalance(); // Return the new balance to the frontend
    }
}