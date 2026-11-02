package com.bank.system.service;

import com.bank.system.dto.LoginRequest;
import com.bank.system.model.User;
import com.bank.system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        // In a real-world app, you would encrypt the password here using BCrypt before saving!
        return userRepository.save(user);
    }

    public User login(LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Compare the password from the database with the password from the React form
            if (user.getPassword().equals(loginRequest.getPassword())) {
                return user; // Login successful
            }
        }
        // Throw a standard exception if login fails
        throw new RuntimeException("Invalid email or password");
    }
}