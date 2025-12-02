package com.coverstar.service.Impl;

import com.coverstar.dto.NotificationRequest;
import com.coverstar.entity.Notification;
import com.coverstar.repository.NotificationRepository;
import com.coverstar.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository repo;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Transactional
    public Notification createAndPush(NotificationRequest req) {
        Notification n = Notification.builder()
                .userId(req.getUserId())
                .title(req.getTitle())
                .message(req.getMessage())
                .failReason(req.getFailReason())
                .type(req.getType())
                .isRead(false)
                .createdAt(new Date())
                .build();

        Notification saved = repo.save(n);

        messagingTemplate.convertAndSend("/topic/notifications/" + req.getUserId(), saved);
        return saved;
    }

    public List<Notification> findByUser(Long userId, String role) {
        if ("ROLE_ADMIN".equalsIgnoreCase(role)) {
            return repo.findAllByOrderByCreatedAtDesc("ORDER");
        }
        return repo.findByUserIdOrderByCreatedAtDesc(userId);
    }


    public long countUnread(Long userId, String role) {
        if ("ROLE_ADMIN".equalsIgnoreCase(role)) {
            return repo.countByUserIdAndTypeAndReadIsFalse("ORDER");
        }
        return repo.countByUserIdAndReadIsFalse(userId);
    }


    @Transactional
    public Notification markAsRead(Long notificationId) {
        Notification n = repo.findById(notificationId).orElseThrow(() -> new RuntimeException("Not found"));
        n.setRead(true);
        return repo.save(n);
    }
}
