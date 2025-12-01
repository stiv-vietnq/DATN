package com.coverstar.service.Impl;

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
    public Notification createAndPush(Long userId, String title, String message) {
        Notification n = Notification.builder()
                .userId(userId)
                .title(title)
                .message(message)
                .build();
        n.setCreatedAt(new Date());


        Notification saved = repo.save(n);

        messagingTemplate.convertAndSend("/topic/notifications/" + userId, saved);
        return saved;
    }


    public List<Notification> findByUser(Long userId) {
        return repo.findByUserIdOrderByCreatedAtDesc(userId);
    }


    public long countUnread(Long userId) {
        return repo.countByUserIdAndReadIsFalse(userId);
    }


    @Transactional
    public Notification markAsRead(Long notificationId) {
        Notification n = repo.findById(notificationId).orElseThrow(() -> new RuntimeException("Not found"));
        n.setRead(true);
        return repo.save(n);
    }
}
