package com.bank.system.repository;

import java.util.Optional; // Make sure to add this import!
import org.springframework.data.jpa.repository.JpaRepository;
import com.bank.system.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    
    // Spring Boot automatically translates this into: 
    // SELECT * FROM bank_users WHERE email = ?
    Optional<User> findByEmail(String email);
    
}