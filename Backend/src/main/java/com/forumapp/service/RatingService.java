package com.forumapp.service;

import com.forumapp.model.Rating;
import com.forumapp.repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RatingService {
    private final RatingRepository repository;

    @Autowired
    public RatingService(RatingRepository repository) {
        this.repository = repository;
    }

    public List<Rating> getAllRatings() {
        return repository.findAll();
    }

    public Rating getRatingById(String id) {
        return repository.findById(id).orElse(null);
    }

    public Rating createRating(Rating rating) {
        return repository.save(rating);
    }

    public Rating updateRating(String id, Rating rating) {
        if (repository.existsById(id)) {
            rating.setId(id);
            return repository.save(rating);
        }
        return null;
    }

    public void deleteRating(String id) {
        repository.deleteById(id);
    }

    public List<Rating> getRatingsByTargetTypeAndId(String targetType, String targetId) {
        return repository.findByTargetTypeAndTargetId(targetType, targetId);
    }
}