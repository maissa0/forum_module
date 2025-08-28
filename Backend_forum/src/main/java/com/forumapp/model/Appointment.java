package com.forumapp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

@Document(collection = "appointments")
public class Appointment {
    @Id
    private String id;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotNull(message = "Date is required")
    private LocalDate date;
    
    @NotNull(message = "Time is required")
    private LocalTime time;
    
    @NotBlank(message = "Role is required")
    private String role; // e.g., "Responsible", "Teacher"

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}