package com.example.demo.repository;

import com.example.demo.entity.Notification;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Lấy tất cả các thông báo (Notification) của user đó,
    // và sắp xếp giảm dần theo thời gian gửi
    List<Notification> findByUserOrderBySentAtDesc(User user);
    boolean existsByUserIdAndTaskIdAndMessageContaining(Long userId, Long taskId, String text);
    void deleteByIsReadTrueAndReadAtBefore(LocalDateTime time);

}
