package com.bank.system.repository;

import com.bank.system.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    
    // We added this earlier for the bill payment
    Optional<Account> findByUser_Email(String email);

    // ADD THIS NEW LINE to fix your AccountService error!
    Optional<Account> findByAccountNumber(String accountNumber);
 // Add this to find ALL accounts belonging to a user
    List<Account> findAllByUser_Email(String email);
}