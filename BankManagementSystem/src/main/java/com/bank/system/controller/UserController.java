package com.bank.system.controller;

import com.bank.system.model.User;
import com.bank.system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // --- 1. REGISTER ENDPOINT ---
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists.");
        }
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("CUSTOMER");
        }
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    // --- 2. LOGIN ENDPOINT ---
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            return ResponseEntity.ok(userOpt.get());
        }
        return ResponseEntity.badRequest().body("Invalid credentials");
    }

 // 3. SECURE PROFILE UPDATE
    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String currentPassword = payload.get("currentPassword"); // Must be provided
        String newPhone = payload.get("phone");
        String newAddress = payload.get("mailingAddress");
        String newPassword = payload.get("newPassword"); // Optional

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // SECURITY CHECK: Verify the current password before making any changes
            if (currentPassword == null || !currentPassword.equals(user.getPassword())) {
                return ResponseEntity.badRequest().body("Incorrect current password. Changes not saved.");
            }
            
            // Save Phone
            if (newPhone != null && !newPhone.isEmpty()) {
                user.setPhone(newPhone); 
            }
            
            // Save Address
            if (newAddress != null && !newAddress.isEmpty()) {
                user.setMailingAddress(newAddress);
            }
            
            // Save New Password (Only if the user provided one)
            if (newPassword != null && !newPassword.isEmpty()) {
                user.setPassword(newPassword); 
            }
            
            userRepository.save(user);
            
            return ResponseEntity.ok(Map.of("message", "Profile updated successfully!"));
        }

        return ResponseEntity.badRequest().body("User not found.");
    }
}