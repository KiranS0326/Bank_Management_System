package com.bank.system.service;

import com.bank.system.dto.AccountResponse;
import com.bank.system.model.Account;
import com.bank.system.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    public Account createAccount(Account account) {
        // Automatically generate a unique 10-digit account number before saving
        if (account.getAccountNumber() == null || account.getAccountNumber().isEmpty()) {
            String randomAccNum = String.valueOf((long) (Math.random() * 9000000000L) + 1000000000L);
            account.setAccountNumber(randomAccNum);
        }
        
        return accountRepository.save(account);
    }

    public AccountResponse getAccountDetails(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        // Convert the raw database Account into a safe AccountResponse DTO
        return new AccountResponse(
                account.getAccountNumber(), 
                account.getBalance(), 
                account.getUser().getName()
        );
    }
}