package com.forumapp.controller;

import com.forumapp.model.Comment;
import com.forumapp.service.CommentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class CommentControllerTest {

    @Mock
    private CommentService commentService;

    @InjectMocks
    private CommentController commentController;

    private Comment testComment;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        testComment = new Comment();
        testComment.setId("1");
        testComment.setText("Test comment");
        testComment.setUserId("user1");
        testComment.setLikes(0);
        testComment.setDislikes(0);
        testComment.setCreatedDate(LocalDateTime.now());
    }

    @Test
    void getAllComments_ShouldReturnListOfComments() {
        // Arrange
        List<Comment> comments = Arrays.asList(testComment);
        when(commentService.getAllComments()).thenReturn(comments);

        // Act
        ResponseEntity<List<Comment>> response = commentController.getAllComments();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals("Test comment", response.getBody().get(0).getText());
    }

    @Test
    void getCommentById_ShouldReturnComment() {
        // Arrange
        when(commentService.getCommentById("1")).thenReturn(testComment);

        // Act
        ResponseEntity<Comment> response = commentController.getCommentById("1");

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Test comment", response.getBody().getText());
    }

    @Test
    void createComment_ShouldCreateNewComment() {
        // Arrange
        when(commentService.createComment(any(Comment.class))).thenReturn(testComment);

        // Act
        ResponseEntity<Comment> response = commentController.createComment(testComment);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("Test comment", response.getBody().getText());
    }

    @Test
    void likeComment_ShouldIncrementLikes() {
        // Arrange
        Comment likedComment = new Comment();
        likedComment.setId("1");
        likedComment.setLikes(1);
        when(commentService.likeComment("1")).thenReturn(likedComment);

        // Act
        ResponseEntity<Comment> response = commentController.likeComment("1");

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().getLikes());
    }

    @Test
    void dislikeComment_ShouldIncrementDislikes() {
        // Arrange
        Comment dislikedComment = new Comment();
        dislikedComment.setId("1");
        dislikedComment.setDislikes(1);
        when(commentService.dislikeComment("1")).thenReturn(dislikedComment);

        // Act
        ResponseEntity<Comment> response = commentController.dislikeComment("1");

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().getDislikes());
    }

    @Test
    void deleteComment_ShouldDeleteComment() {
        // Arrange
        doNothing().when(commentService).deleteComment("1");

        // Act
        ResponseEntity<Void> response = commentController.deleteComment("1");

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(commentService, times(1)).deleteComment("1");
    }
}
