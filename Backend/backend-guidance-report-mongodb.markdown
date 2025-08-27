# Guidance Report for Implementing a Spring Boot Backend for Forum Features

## Introduction

This guidance report is designed to assist an AI developer agent in building a Spring Boot backend to support the Angular 16 frontend for a forum application with the following features:

- **Prise de rendez-vous**: CRUD operations for appointments with role-based access (responsables see all, enseignants see their own) and calendar integration support.
- **Gestion des commentaires**: CRUD for comments, a forbidden words dictionary for moderation, and sorting for pertinent comments (based on ratings).
- **Rating**: Evaluations for modules (star ratings), comments (likes/dislikes/emojis), and partners (quality of service, formations). Ratings are managed alongside comments.
- **Chat**: Real-time messaging between connected members using WebSockets.

The backend will use Spring Boot 3.x, Spring Data JPA for database interactions, Spring Security for authentication/authorization, and Spring WebSocket for real-time chat. It assumes a PostgreSQL database but can be adapted for other databases. The report provides step-by-step instructions, code snippets, and best practices to ensure a scalable, secure, and maintainable backend.

## Prerequisites

1. **Environment Setup**:
   - Install Java 17+ (required for Spring Boot 3.x).
   - Install Maven or Gradle (Maven preferred for this guide).
   - Set up PostgreSQL (local or cloud-hosted).
   - Use an IDE like IntelliJ IDEA or VS Code.
   - Initialize a Spring Boot project via Spring Initializr (https://start.spring.io):
     - Dependencies: Spring Web, Spring Data JPA, PostgreSQL Driver, Spring Security, Spring WebSocket, Spring Boot DevTools.
     - Java 17, Maven, JAR packaging.
   - Command to generate: `curl https://start.spring.io/starter.zip -d dependencies=web,jpa,postgresql,security,websocket,devtools -d javaVersion=17 -d packageName=com.forum -o forum-backend.zip`.

2. **Assumptions**:
   - Authentication: JWT-based with user roles (e.g., RESPONSABLE, ENSEIGNANT, USER).
   - Database: PostgreSQL with tables for appointments, comments, ratings, users, and partners.
   - API Base URL: `/api`.
   - WebSocket Endpoint: `/ws` for chat.
   - CORS: Enabled for Angular frontend (e.g., `http://localhost:4200`).

3. **Project Structure**:
   ```plaintext
   forum-backend/
   ├── src/main/java/com/forum/
   │   ├── config/          # Security, CORS, WebSocket configs
   │   ├── controller/      # REST controllers
   │   ├── service/         # Business logic
   │   ├── repository/      # JPA repositories
   │   ├── model/           # Entity classes
   │   ├── dto/             # Data Transfer Objects
   │   ├── websocket/       # WebSocket handlers
   │   └── exception/       # Custom exceptions
   ├── src/main/resources/
   │   ├── application.yml  # Configuration
   │   └── data.sql        # Initial data (optional)
   └── pom.xml              # Maven dependencies
   ```

## Configuration

1. **Dependencies in `pom.xml`**:
   ```xml
   <dependencies>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-web</artifactId>
       </dependency>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-data-jpa</artifactId>
       </dependency>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-security</artifactId>
       </dependency>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-websocket</artifactId>
       </dependency>
       <dependency>
           <groupId>org.postgresql</groupId>
           <artifactId>postgresql</artifactId>
           <scope>runtime</scope>
       </dependency>
       <dependency>
           <groupId>io.jsonwebtoken</groupId>
           <artifactId>jjwt</artifactId>
           <version>0.9.1</version>
       </dependency>
   </dependencies>
   ```

2. **Application Configuration (`application.yml`)**:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/forumdb
       username: postgres
       password: yourpassword
       driver-class-name: org.postgresql.Driver
     jpa:
       hibernate:
         ddl-auto: update
       show-sql: true
   server:
     port: 8080
   cors:
     allowed-origins: http://localhost:4200
   jwt:
     secret: your-256-bit-secret
     expiration: 86400000
   ```

3. **Security Configuration**:
   - Create `SecurityConfig.java`:
     ```java
     package com.forum.config;

     import org.springframework.context.annotation.Bean;
     import org.springframework.context.annotation.Configuration;
     import org.springframework.security.config.annotation.web.builders.HttpSecurity;
     import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
     import org.springframework.security.web.SecurityFilterChain;
     import org.springframework.web.cors.CorsConfiguration;
     import org.springframework.web.cors.CorsConfigurationSource;
     import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

     @Configuration
     @EnableWebSecurity
     public class SecurityConfig {

         @Bean
         public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
             http
                 .cors().and()
                 .csrf().disable()
                 .authorizeHttpRequests()
                 .requestMatchers("/api/auth/**").permitAll()
                 .requestMatchers("/api/**").authenticated()
                 .and()
                 .addFilter(new JwtAuthenticationFilter(authenticationManager(), jwtService()))
                 .addFilter(new JwtAuthorizationFilter(authenticationManager(), jwtService()));
             return http.build();
         }

         @Bean
         public CorsConfigurationSource corsConfigurationSource() {
             CorsConfiguration configuration = new CorsConfiguration();
             configuration.addAllowedOrigin("http://localhost:4200");
             configuration.addAllowedMethod("*");
             configuration.addAllowedHeader("*");
             configuration.setAllowCredentials(true);
             UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
             source.registerCorsConfiguration("/**", configuration);
             return source;
         }
     }
     ```
   - Implement `JwtService`, `JwtAuthenticationFilter`, and `JwtAuthorizationFilter` for JWT handling.

## Database Schema

1. **Entities**:
   - `User.java`:
     ```java
     package com.forum.model;

     import jakarta.persistence.*;
     import java.util.Set;

     @Entity
     public class User {
         @Id
         @GeneratedValue(strategy = GenerationType.IDENTITY)
         private Long id;
         private String username;
         private String password;
         private String role; // RESPONSABLE, ENSEIGNANT, USER
         // Getters, setters
     }
     ```
   - `Appointment.java`:
     ```java
     package com.forum.model;

     import jakarta.persistence.*;
     import java.time.LocalDateTime;

     @Entity
     public class Appointment {
         @Id
         @GeneratedValue(strategy = GenerationType.IDENTITY)
         private Long id;
         private LocalDateTime date;
         @ManyToOne
         private User user;
         @ManyToOne
         private User responsable;
         private String title;
         // Getters, setters
     }
     ```
   - `Comment.java`:
     ```java
     package com.forum.model;

     import jakarta.persistence.*;
     import java.util.List;

     @Entity
     public class Comment {
         @Id
         @GeneratedValue(strategy = GenerationType.IDENTITY)
         private Long id;
         private String text;
         @ManyToOne
         private User user;
         @ManyToOne
         private Module module;
         private int likes;
         private int dislikes;
         @ElementCollection
         private List<String> emojis;
         // Getters, setters
     }
     ```
   - `Module.java` (for ratings):
     ```java
     package com.forum.model;

     import jakarta.persistence.*;

     @Entity
     public class Module {
         @Id
         @GeneratedValue(strategy = GenerationType.IDENTITY)
         private Long id;
         private String name;
         private double averageRating;
         // Getters, setters
     }
     ```
   - `PartnerRating.java`:
     ```java
     package com.forum.model;

     import jakarta.persistence.*;

     @Entity
     public class PartnerRating {
         @Id
         @GeneratedValue(strategy = GenerationType.IDENTITY)
         private Long id;
         @ManyToOne
         private User partner; // e.g., enseignant
         private int qualityRating;
         private int formationRating;
         @ManyToOne
         private User rater;
         // Getters, setters
     }
     ```

2. **Repositories**:
   - Example for `AppointmentRepository`:
     ```java
     package com.forum.repository;

     import com.forum.model.Appointment;
     import com.forum.model.User;
     import org.springframework.data.jpa.repository.JpaRepository;
     import java.util.List;

     public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
         List<Appointment> findByUserOrResponsable(User user, User responsable);
     }
     ```

## Feature 1: Prise de rendez-vous

### REST Endpoints
- **Controller**: `AppointmentController.java`
  ```java
  package com.forum.controller;

  import com.forum.dto.AppointmentDTO;
  import com.forum.service.AppointmentService;
  import org.springframework.http.ResponseEntity;
  import org.springframework.security.core.annotation.AuthenticationPrincipal;
  import org.springframework.web.bind.annotation.*;

  @RestController
  @RequestMapping("/api/appointments")
  public class AppointmentController {
      private final AppointmentService appointmentService;

      public AppointmentController(AppointmentService appointmentService) {
          this.appointmentService = appointmentService;
      }

      @GetMapping
      public ResponseEntity<List<AppointmentDTO>> getAppointments(@AuthenticationPrincipal User user) {
          return ResponseEntity.ok(appointmentService.getAppointmentsByRole(user));
      }

      @PostMapping
      public ResponseEntity<AppointmentDTO> createAppointment(@RequestBody AppointmentDTO dto, @AuthenticationPrincipal User user) {
          return ResponseEntity.ok(appointmentService.createAppointment(dto, user));
      }

      @PutMapping("/{id}")
      public ResponseEntity<AppointmentDTO> updateAppointment(@PathVariable Long id, @RequestBody AppointmentDTO dto, @AuthenticationPrincipal User user) {
          return ResponseEntity.ok(appointmentService.updateAppointment(id, dto, user));
      }

      @DeleteMapping("/{id}")
      public ResponseEntity<Void> deleteAppointment(@PathVariable Long id, @AuthenticationPrincipal User user) {
          appointmentService.deleteAppointment(id, user);
          return ResponseEntity.ok().build();
      }
  }
  ```
- **Service**: `AppointmentService.java`:
  - Implement role-based logic (e.g., RESPONSABLE sees all, ENSEIGNANT sees own).
  - Use DTOs to map entities to API responses.

### Best Practices
- Validate DTOs with `@Valid` and Bean Validation (e.g., `@NotNull`).
- Role-based filtering in `findByUserOrResponsable`.

## Feature 2: Gestion des commentaires

### REST Endpoints
- **Controller**: `CommentController.java`
  ```java
  package com.forum.controller;

  import com.forum.dto.CommentDTO;
  import com.forum.service.CommentService;
  import org.springframework.http.ResponseEntity;
  import org.springframework.security.core.annotation.AuthenticationPrincipal;
  import org.springframework.web.bind.annotation.*;

  @RestController
  @RequestMapping("/api/comments")
  public class CommentController {
      private final CommentService commentService;

      public CommentController(CommentService commentService) {
          this.commentService = commentService;
      }

      @GetMapping("/module/{moduleId}")
      public ResponseEntity<List<CommentDTO>> getComments(@PathVariable Long moduleId) {
          return ResponseEntity.ok(commentService.getCommentsByModule(moduleId));
      }

      @PostMapping
      public ResponseEntity<CommentDTO> createComment(@RequestBody CommentDTO dto, @AuthenticationPrincipal User user) {
          return ResponseEntity.ok(commentService.createComment(dto, user));
      }

      @PutMapping("/{id}")
      public ResponseEntity<CommentDTO> updateComment(@PathVariable Long id, @RequestBody CommentDTO dto, @AuthenticationPrincipal User user) {
          return ResponseEntity.ok(commentService.updateComment(id, dto, user));
      }

      @DeleteMapping("/{id}")
      public ResponseEntity<Void> deleteComment(@PathVariable Long id, @AuthenticationPrincipal User user) {
          commentService.deleteComment(id, user);
          return ResponseEntity.ok().build();
      }
  }
  ```

### Forbidden Words Dictionary
- Create `ForbiddenWordsService`:
  ```java
  package com.forum.service;

  import org.springframework.stereotype.Service;

  @Service
  public class ForbiddenWordsService {
      private static final List<String> FORBIDDEN_WORDS = List.of("badword1", "badword2");

      public boolean containsForbiddenWords(String text) {
          return FORBIDDEN_WORDS.stream().anyMatch(word -> text.toLowerCase().contains(word.toLowerCase()));
      }
  }
  ```
- In `CommentService`, validate on create/update:
  ```java
  if (forbiddenWordsService.containsForbiddenWords(dto.getText())) {
      throw new IllegalArgumentException("Comment contains forbidden words");
  }
  ```

### Pertinent Comments
- In `CommentService.getCommentsByModule`, sort by `(likes - dislikes)`:
  ```java
  List<Comment> comments = commentRepository.findByModuleId(moduleId);
  return comments.stream()
      .sorted((c1, c2) -> Integer.compare(c2.getLikes() - c2.getDislikes(), c1.getLikes() - c1.getDislikes()))
      .map(this::toDTO)
      .collect(Collectors.toList());
  ```

## Feature 3: Rating

### REST Endpoints
- **Controller**: `RatingController.java`
  ```java
  package com.forum.controller;

  import com.forum.dto.ModuleRatingDTO;
  import com.forum.dto.CommentRatingDTO;
  import com.forum.dto.PartnerRatingDTO;
  import com.forum.service.RatingService;
  import org.springframework.http.ResponseEntity;
  import org.springframework.security.core.annotation.AuthenticationPrincipal;
  import org.springframework.web.bind.annotation.*;

  @RestController
  @RequestMapping("/api/ratings")
  public class RatingController {
      private final RatingService ratingService;

      public RatingController(RatingService ratingService) {
          this.ratingService = ratingService;
      }

      @PostMapping("/module")
      public ResponseEntity<ModuleRatingDTO> rateModule(@RequestBody ModuleRatingDTO dto, @AuthenticationPrincipal User user) {
          return ResponseEntity.ok(ratingService.rateModule(dto, user));
      }

      @PostMapping("/comment/like/{commentId}")
      public ResponseEntity<CommentRatingDTO> likeComment(@PathVariable Long commentId, @AuthenticationPrincipal User user) {
          return ResponseEntity.ok(ratingService.likeComment(commentId, user));
      }

      @PostMapping("/comment/dislike/{commentId}")
      public ResponseEntity<CommentRatingDTO> dislikeComment(@PathVariable Long commentId, @AuthenticationPrincipal User user) {
          return ResponseEntity.ok(ratingService.dislikeComment(commentId, user));
      }

      @PostMapping("/comment/emoji/{commentId}")
      public ResponseEntity<CommentRatingDTO> addEmoji(@PathVariable Long commentId, @RequestBody String emoji, @AuthenticationPrincipal User user) {
          return ResponseEntity.ok(ratingService.addEmoji(commentId, emoji, user));
      }

      @PostMapping("/partner")
      public ResponseEntity<PartnerRatingDTO> ratePartner(@RequestBody PartnerRatingDTO dto, @AuthenticationPrincipal User user) {
          return ResponseEntity.ok(ratingService.ratePartner(dto, user));
      }
  }
  ```

### Service Logic
- `RatingService` updates `Comment` (likes/dislikes/emojis) and `Module` (averageRating).
- Ensure atomic updates (e.g., use `@Transactional`).

## Feature 4: Chat

### WebSocket Configuration
- `WebSocketConfig.java`:
  ```java
  package com.forum.config;

  import org.springframework.context.annotation.Configuration;
  import org.springframework.messaging.simp.config.MessageBrokerRegistry;
  import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
  import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
  import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

  @Configuration
  @EnableWebSocketMessageBroker
  public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
      @Override
      public void configureMessageBroker(MessageBrokerRegistry config) {
          config.enableSimpleBroker("/topic");
          config.setApplicationDestinationPrefixes("/app");
      }

      @Override
      public void registerStompEndpoints(StompEndpointRegistry registry) {
          registry.addEndpoint("/ws").setAllowedOrigins("http://localhost:4200").withSockJS();
      }
  }
  ```

### Chat Controller
- `ChatController.java`:
  ```java
  package com.forum.controller;

  import com.forum.dto.MessageDTO;
  import org.springframework.messaging.handler.annotation.MessageMapping;
  import org.springframework.messaging.handler.annotation.SendTo;
  import org.springframework.stereotype.Controller;

  @Controller
  public class ChatController {
      @MessageMapping("/chat.sendMessage")
      @SendTo("/topic/messages")
      public MessageDTO sendMessage(MessageDTO message) {
          return message; // Broadcast to all subscribers
      }

      @MessageMapping("/chat.sendPrivateMessage")
      @SendTo("/topic/private/{toUserId}")
      public MessageDTO sendPrivateMessage(MessageDTO message) {
          return message;
      }
  }
  ```
- `MessageDTO`:
  ```java
  package com.forum.dto;

  public class MessageDTO {
      private String content;
      private String fromUserId;
      private String toUserId;
      // Getters, setters
  }
  ```

## Best Practices

- **Security**: Use Spring Security to restrict endpoints by role; validate JWT for WebSocket connections.
- **Error Handling**: Use `@ControllerAdvice` for global exception handling (e.g., return 400 for forbidden words).
- **Performance**: Enable pagination in repositories (`Pageable`).
- **Logging**: Use SLF4J for debugging.
- **Testing**: Use JUnit and TestRestTemplate for unit/integration tests.

## Deployment

- Build: `mvn clean package`.
- Run: `java -jar target/forum-backend.jar`.
- Deploy: Use Docker or a cloud provider (e.g., AWS, Heroku).

Follow this report to implement the backend, ensuring compatibility with the Angular frontend. Test all endpoints with Postman before frontend integration.