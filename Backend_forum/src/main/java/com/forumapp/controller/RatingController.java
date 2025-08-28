package com.forumapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.forumapp.model.Rating;
import com.forumapp.service.RatingService;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private final RatingService service;

    @Autowired
    public RatingController(RatingService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Rating>> getAllRatings() {
        List<Rating> ratings = service.getAllRatings();
        return ResponseEntity.ok(ratings);
    }

    @PostMapping
    public ResponseEntity<Rating> createRating(@RequestBody Rating rating) {
        Rating createdRating = service.createRating(rating);
        return ResponseEntity.status(201).body(createdRating);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rating> getRatingById(@PathVariable String id) {
        Rating rating = service.getRatingById(id);
        return ResponseEntity.ok(rating);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Rating> updateRating(@PathVariable String id, @RequestBody Rating rating) {
        Rating updatedRating = service.updateRating(id, rating);
        return ResponseEntity.ok(updatedRating);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRating(@PathVariable String id) {
        service.deleteRating(id);
        return ResponseEntity.noContent().build();
    }
}