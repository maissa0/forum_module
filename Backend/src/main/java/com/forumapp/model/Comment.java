package com.forumapp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "comments")
public class Comment {
    @Id
    private String id; // Unique identifier for the comment
    
    @NotBlank(message = "User ID is required")
    private String userId; // Reference to user
    
    @NotBlank(message = "Comment text is required")
    @jakarta.validation.constraints.Size(min = 1, max = 1000, message = "Comment text must be between 1 and 1000 characters")
    private String text; // Comment text
    
    @NotNull(message = "Likes count is required")
    @Min(value = 0, message = "Likes count cannot be negative")
    private int likes; // Number of likes
    
    @NotNull(message = "Dislikes count is required")
    @Min(value = 0, message = "Dislikes count cannot be negative")
    private int dislikes; // Number of dislikes
    
    private List<String> emojis; // List of emoji reactions
    
    @NotNull(message = "Created date is required")
    private LocalDateTime createdDate; // Date and time when the comment was created

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

    public int getDislikes() {
        return dislikes;
    }

    public void setDislikes(int dislikes) {
        this.dislikes = dislikes;
    }

    public List<String> getEmojis() {
        return emojis;
    }

    public void setEmojis(List<String> emojis) {
        this.emojis = emojis;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
}
