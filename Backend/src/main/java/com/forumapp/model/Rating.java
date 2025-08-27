package com.forumapp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

@Document(collection = "ratings")
public class Rating {
    @Id
    private String id; // Unique identifier for the rating
    
    @NotBlank(message = "User ID is required")
    private String userId;    // Reference to user
    
    @NotBlank(message = "Target type is required")
    private String targetType; // Type of the target being rated (e.g., "Comment", "Module")
    
    @NotBlank(message = "Target ID is required")
    private String targetId;   // ID of the target being rated
    
    @NotNull(message = "Rating value is required")
    @Min(value = 1, message = "Rating value must be at least 1")
    @Max(value = 5, message = "Rating value cannot exceed 5")
    private int ratingValue;   // Rating value (e.g., 1 to 5 stars)
    
    private String comment;     // Optional comment associated with the rating

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

    public String getTargetType() {
        return targetType;
    }

    public void setTargetType(String targetType) {
        this.targetType = targetType;
    }

    public String getTargetId() {
        return targetId;
    }

    public void setTargetId(String targetId) {
        this.targetId = targetId;
    }

    public int getRatingValue() {
        return ratingValue;
    }

    public void setRatingValue(int ratingValue) {
        this.ratingValue = ratingValue;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}