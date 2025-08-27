package com.forumapp.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Forum Backend API is running");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Welcome to Forum Backend API");
        response.put("version", "1.0.0");
        response.put("endpoints", new String[]{
            "/api/auth/register",
            "/api/auth/login",
            "/api/users",
            "/api/appointments",
            "/api/comments",
            "/api/ratings",
            "/health"
        });
        return ResponseEntity.ok(response);
    }
}
