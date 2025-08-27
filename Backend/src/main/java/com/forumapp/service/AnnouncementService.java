package com.forumapp.service;

import com.forumapp.model.Announcement;
import com.forumapp.repository.AnnouncementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnnouncementService {
    
    private final AnnouncementRepository repository;

    @Autowired
    public AnnouncementService(AnnouncementRepository repository) {
        this.repository = repository;
    }

    public List<Announcement> getAllAnnouncements() {
        return repository.findAll();
    }

    public Announcement getAnnouncementById(String id) {
        return repository.findById(id).orElse(null);
    }

    public Announcement createAnnouncement(Announcement announcement) {
        return repository.save(announcement);
    }

    public Announcement updateAnnouncement(String id, Announcement announcement) {
        if (repository.existsById(id)) {
            announcement.setId(id);
            return repository.save(announcement);
        }
        return null;
    }

    public void deleteAnnouncement(String id) {
        repository.deleteById(id);
    }
}
