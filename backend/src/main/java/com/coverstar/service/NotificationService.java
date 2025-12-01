package com.coverstar.service;

import com.coverstar.entity.Notification;

import java.util.List;

public interface NotificationService {
    Notification createAndPush(Long userId, String title, String message);

    List<Notification> findByUser(Long userId);

    long countUnread(Long userId);

    Notification markAsRead(Long notificationId);
}
