package com.forumapp.repository;

import com.forumapp.model.Announcement;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnnouncementRepository extends MongoRepository<Announcement, String> {
    // Custom query methods can be added here if needed
}
