package com.bank.system.controller;

import com.bank.system.model.Account;
import com.bank.system.model.User;
import com.bank.system.repository.UserRepository;
import com.bank.system.repository.AccountRepository; 
import com.bank.system.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List; 
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:5173")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createAccount(@RequestBody Map<String, Object> payload) {
        try {
            String email = (String) payload.get("userEmail");
            Double initialBalance = Double.valueOf(payload.get("initialBalance").toString());
            String accountType = (String) payload.get("accountType");

            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User with this email does not exist.");
            }

            Account account = new Account();
            account.setBalance(initialBalance);
            account.setAccountType(accountType);
            account.setUser(userOpt.get()); 
            
            // Note: The status will automatically default to "ACTIVE" based on your model

            Account savedAccount = accountService.createAccount(account);

            return ResponseEntity.ok(savedAccount);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error creating account: " + e.getMessage());
        }
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<?> getUserAccounts(@PathVariable String email) {
        try {
            List<Account> accounts = accountRepository.findAllByUser_Email(email);
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching accounts: " + e.getMessage());
        }
    }

    // --- NEW ADMIN ENDPOINTS ---

    // 1. Fetch all accounts for the Admin Dashboard
    @GetMapping("/all")
    public ResponseEntity<?> getAllAccounts() {
        try {
            List<Account> accounts = accountRepository.findAll();
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching accounts: " + e.getMessage());
        }
    }

    // 2. Update an account's status (Freeze/Unfreeze)
    @PutMapping("/{accountNumber}/status")
    public ResponseEntity<?> updateAccountStatus(@PathVariable String accountNumber, @RequestBody Map<String, String> payload) {
        try {
            String newStatus = payload.get("status"); // Should be "ACTIVE" or "FROZEN"
            
            Account account = accountRepository.findByAccountNumber(accountNumber)
                    .orElseThrow(() -> new RuntimeException("Account not found"));
            
            account.setStatus(newStatus);
            accountRepository.save(account);
            
            return ResponseEntity.ok(Map.of("message", "Account status updated to " + newStatus));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error updating status: " + e.getMessage());
        }
    }
}