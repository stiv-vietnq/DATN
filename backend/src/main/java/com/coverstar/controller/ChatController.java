package com.coverstar.controller;

import com.coverstar.dto.ChatMessage;
import com.coverstar.service.Impl.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ChatController {

    @Autowired
    private ChatbotService chatbotService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/send")
    @SendTo("/topic/messages")
    public ChatMessage sendMessage(ChatMessage message) {
        String botResponse = chatbotService.getResponse(message.getText(), message.getType());
        String timestamp = java.time.LocalTime.now().withNano(0).toString();
        return new ChatMessage("bot", botResponse, timestamp, "");
    }

    @GetMapping("/chat/init")
    public void initChat() {
        String welcome = "Xin kính chào Quý khách, cảm ơn Quý khách đã tìm kiếm đên chúng tôi, Chúng tôi có thể giúp gì được cho bạn.";
        ChatMessage msg = new ChatMessage();
        msg.setSender("bot");
        msg.setText(welcome);
        msg.setTimestamp(java.time.LocalTime.now().withNano(0).toString());
        messagingTemplate.convertAndSend("/topic/messages", msg);
    }
}
