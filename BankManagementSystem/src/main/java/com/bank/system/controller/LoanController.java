package com.bank.system.controller;

import com.bank.system.model.LoanApplication;
import com.bank.system.repository.LoanApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/loans")
@CrossOrigin(origins = "http://localhost:5173")
public class LoanController {

    @Autowired
    private LoanApplicationRepository loanRepository;

    // 1. Customer applies for a loan
    @PostMapping("/apply")
    public ResponseEntity<?> applyForLoan(@RequestBody LoanApplication application) {
        try {
            application.setStatus("PENDING");
            application.setApplicationDate(LocalDateTime.now());
            LoanApplication savedApp = loanRepository.save(application);
            return ResponseEntity.ok(Map.of("message", "Loan application submitted successfully!"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // 2. Customer fetches their own loans
    @GetMapping("/user/{email}")
    public ResponseEntity<List<LoanApplication>> getUserLoans(@PathVariable String email) {
        return ResponseEntity.ok(loanRepository.findByUserEmailOrderByApplicationDateDesc(email));
    }

    // 3. Admin fetches ALL loans
    @GetMapping("/all")
    public ResponseEntity<List<LoanApplication>> getAllLoans() {
        return ResponseEntity.ok(loanRepository.findAllByOrderByApplicationDateDesc());
    }

    // 4. Admin Approves or Rejects a loan
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateLoanStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Optional<LoanApplication> appOpt = loanRepository.findById(id);
        if (appOpt.isPresent()) {
            LoanApplication app = appOpt.get();
            app.setStatus(payload.get("status")); // Should be "APPROVED" or "REJECTED"
            loanRepository.save(app);
            return ResponseEntity.ok(Map.of("message", "Status updated successfully to " + app.getStatus()));
        }
        return ResponseEntity.badRequest().body("Loan application not found.");
    }
}