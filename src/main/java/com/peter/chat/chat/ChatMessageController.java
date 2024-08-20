package com.peter.chat.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ChatMessageController {
    @Autowired
    private ChatMessageRepo chatMessageRepo;

    @GetMapping("/messages")
    public List<ChatMessage> getAllMessages() {
        return chatMessageRepo.findAll();
    }
}