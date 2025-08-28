package com.forumapp.service;

import com.forumapp.model.Comment;
import com.forumapp.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {
    
    private final CommentRepository repository;

    @Autowired
    public CommentService(CommentRepository repository) {
        this.repository = repository;
    }

    public List<Comment> getAllComments() {
        return repository.findAll();
    }

    public Comment getCommentById(String id) {
        return repository.findById(id).orElse(null);
    }

    public Comment createComment(Comment comment) {
        // Set default values for new comments
        comment.setLikes(0);
        comment.setDislikes(0);
        comment.setCreatedDate(LocalDateTime.now());
        return repository.save(comment);
    }

    public Comment updateComment(String id, Comment comment) {
        if (repository.existsById(id)) {
            Comment existingComment = repository.findById(id).orElse(null);
            if (existingComment != null) {
                // Preserve the created date
                comment.setCreatedDate(existingComment.getCreatedDate());
                comment.setId(id);
                return repository.save(comment);
            }
        }
        return null;
    }

    public Comment likeComment(String id) {
        Comment comment = repository.findById(id).orElse(null);
        if (comment != null) {
            comment.setLikes(comment.getLikes() + 1);
            return repository.save(comment);
        }
        return null;
    }

    public Comment dislikeComment(String id) {
        Comment comment = repository.findById(id).orElse(null);
        if (comment != null) {
            comment.setDislikes(comment.getDislikes() + 1);
            return repository.save(comment);
        }
        return null;
    }

    public Comment addEmoji(String id, String emoji) {
        Comment comment = repository.findById(id).orElse(null);
        if (comment != null) {
            List<String> emojis = comment.getEmojis();
            emojis.add(emoji);
            comment.setEmojis(emojis);
            return repository.save(comment);
        }
        return null;
    }

    public void deleteComment(String id) {
        repository.deleteById(id);
    }
}
