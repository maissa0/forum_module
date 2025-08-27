package com.forumapp.controller;

import com.forumapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cleanup")
public class DataCleanupController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/users")
    public ResponseEntity<Map<String, Object>> cleanupUsers() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Delete all users to start fresh
            userRepository.deleteAll();
            response.put("message", "All users deleted successfully");
            response.put("status", "success");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Error cleaning up users: " + e.getMessage());
            response.put("status", "error");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/users/count")
    public ResponseEntity<Map<String, Object>> getUserCount() {
        Map<String, Object> response = new HashMap<>();
        long count = userRepository.count();
        response.put("userCount", count);
        response.put("message", "Current user count in database");
        return ResponseEntity.ok(response);
    }
}
