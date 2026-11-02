package com.bank.system.repository;

import com.bank.system.model.LoanApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {
    // For the Customer: find only their loans
    List<LoanApplication> findByUserEmailOrderByApplicationDateDesc(String email);
    
    // For the Admin: find all loans
    List<LoanApplication> findAllByOrderByApplicationDateDesc();
}