package com.coverstar.service;

import com.coverstar.dto.NotificationRequest;
import com.coverstar.entity.Notification;

import java.util.List;

public interface NotificationService {
    Notification createAndPush(NotificationRequest req);

    List<Notification> findByUser(Long userId, String role);

    long countUnread(Long userId, String role);

    Notification markAsRead(Long notificationId);
}
