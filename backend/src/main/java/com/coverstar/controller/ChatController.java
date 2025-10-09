package com.coverstar.controller;

import com.coverstar.dto.Message;
import com.coverstar.entity.Account;
import com.coverstar.entity.ChatMessage;
import com.coverstar.repository.ChatMessageRepository;
import com.coverstar.service.AccountService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ChatMessageRepository chatMessageRepository;
    private final AccountService accountService;

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public Message receiveMessage(Message message) throws InterruptedException {
        chatMessageRepository.save(new ChatMessage(
                message.getSenderName(),
                message.getReceiverName(),
                message.getMessage(),
                message.getMedia(),
                message.getMediaType(),
                message.getStatus(),
                System.currentTimeMillis()
        ));
        Thread.sleep(1000);
        return message;
    }


    @MessageMapping("/private-message")
    public void privateMessage(Message message) {
        String receiver = message.getReceiverName();
        simpMessagingTemplate.convertAndSendToUser(receiver, "/private", message);
        chatMessageRepository.save(new ChatMessage(
                message.getSenderName(),
                message.getReceiverName(),
                message.getMessage(),
                message.getMedia(),
                message.getMediaType(),
                message.getStatus(),
                System.currentTimeMillis()
        ));
    }

    @GetMapping("/api/messages/history/{user1}/{user2}")
    public ResponseEntity<List<ChatMessage>> getChatHistory(
            @PathVariable String user1,
            @PathVariable String user2
    ) {
        List<ChatMessage> messages = chatMessageRepository.findByReceiverNameOrSenderName(user1, user2);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/api/users")
    public ResponseEntity<?> findByUsername() {
        List<Account> account = accountService.getAllAccount();
        if (account == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(account);
    }
}

