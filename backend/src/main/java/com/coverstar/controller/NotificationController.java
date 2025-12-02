package com.coverstar.controller;

import com.coverstar.dto.MarkReadRequest;
import com.coverstar.dto.NotificationRequest;
import com.coverstar.entity.Notification;
import com.coverstar.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    @Autowired
    private NotificationService service;

    @PostMapping("/send")
    public ResponseEntity<Notification> send(@RequestBody NotificationRequest req) {
        Notification saved = service.createAndPush(req);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getByUser(@PathVariable Long userId,
                                                        @RequestParam(required = false) String role) {
        return ResponseEntity.ok(service.findByUser(userId, role));
    }

    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Long> unreadCount(@PathVariable Long userId,
                                            @RequestParam(required = false) String role) {
        return ResponseEntity.ok(service.countUnread(userId, role));
    }

    @PostMapping("/mark-read")
    public ResponseEntity<Notification> markRead(@RequestBody MarkReadRequest req) {
        return ResponseEntity.ok(service.markAsRead(req.getNotificationId()));
    }
}
