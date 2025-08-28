package com.forumapp.service;

import com.forumapp.model.User;
import com.forumapp.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    private final SecretKey SECRET_KEY;
    private final long EXPIRATION_TIME;

    public AuthService(@Value("${jwt.secret}") String secret,
                     @Value("${jwt.expiration}") long expirationTime) {
        this.SECRET_KEY = Keys.hmacShaKeyFor(secret.getBytes());
        this.EXPIRATION_TIME = expirationTime;
    }

    public String register(User user) {
        // Check if username already exists
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        // Check if email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }
        
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        userRepository.save(user);
        return "User registered successfully";
    }

    public String login(String username, String password) {
        // Use Optional to handle potential duplicates
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (new BCryptPasswordEncoder().matches(password, user.getPassword())) {
                return generateToken(user.getUsername(), user.getRole());
            }
        }
        
        throw new IllegalArgumentException("Invalid username or password");
    }

    private String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY)
                .compact();
    }
}