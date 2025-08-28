package com.forumapp.websocket;

import com.forumapp.model.ChatMessage;
import com.forumapp.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    private final ChatService service;

    public ChatController(ChatService service) {
        this.service = service;
    }

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public ChatMessage sendMessage(ChatMessage message) {
        service.saveMessage(message);
        return message;
    }
}