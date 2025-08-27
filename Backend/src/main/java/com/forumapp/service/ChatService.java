package com.forumapp.service;

import com.forumapp.model.ChatMessage;
import com.forumapp.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    private final ChatMessageRepository repository;

    @Autowired
    public ChatService(ChatMessageRepository repository) {
        this.repository = repository;
    }

    public List<ChatMessage> getAllMessages() {
        return repository.findAll();
    }

    public ChatMessage saveMessage(ChatMessage message) {
        return repository.save(message);
    }

    public void deleteMessage(String id) {
        repository.deleteById(id);
    }
}