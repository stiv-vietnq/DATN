package com.coverstar.repository;

import com.coverstar.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdAndTypeNotOrderByCreatedAtDesc(Long userId, String type);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.userId = :userId AND n.isRead = false")
    long countByUserIdAndReadIsFalse(Long userId);

    @Query("SELECT n FROM Notification n WHERE n.type = :order ORDER BY n.createdAt DESC")
    List<Notification> findAllByOrderByCreatedAtDesc(String order);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.type = :order AND n.isRead = false")
    long countByUserIdAndTypeAndReadIsFalse(String order);
}
