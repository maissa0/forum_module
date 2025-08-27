package com.forumapp.repository;

import com.forumapp.model.Rating;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends MongoRepository<Rating, String> {
    List<Rating> findByTargetTypeAndTargetId(String targetType, String targetId);
}