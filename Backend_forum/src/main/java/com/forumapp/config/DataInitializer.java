package com.forumapp.config;

import com.forumapp.model.User;
import com.forumapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Create a test user if it doesn't exist
        if (userRepository.findByUsername("testuser").isEmpty()) {
            User testUser = new User();
            testUser.setUsername("testuser");
            testUser.setPassword(new BCryptPasswordEncoder().encode("password123"));
            testUser.setEmail("testuser@example.com");
            testUser.setRole("USER");
            userRepository.save(testUser);
            System.out.println("Created test user: testuser / password123");
        }

        // Create an admin user if it doesn't exist
        if (userRepository.findByUsername("admin").isEmpty()) {
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setPassword(new BCryptPasswordEncoder().encode("admin123"));
            adminUser.setEmail("admin@example.com");
            adminUser.setRole("ADMIN");
            userRepository.save(adminUser);
            System.out.println("Created admin user: admin / admin123");
        }
    }
}
