package com.forumapp.repository;

import com.forumapp.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    // Find by username - returns Optional to handle potential duplicates
    Optional<User> findByUsername(String username);
    
    // Check if username exists
    boolean existsByUsername(String username);
    
    // Find by email
    Optional<User> findByEmail(String email);
}