package com.example.demo.scheduler;

import com.example.demo.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class NotificationCleanupScheduler {

    private final NotificationRepository notificationRepository;

    // 🧹 Chạy mỗi ngày lúc 03:00 sáng
    @Scheduled(cron = "0 0 3 * * *")
    public void cleanReadNotifications() {

        // Lấy mốc thời gian 24h trước hiện tại
        LocalDateTime threshold = LocalDateTime.now().minusHours(24);

        // Xóa tất cả notification:
        //  - đã đọc (isRead = true)
        //  - có readAt < threshold (tức là đã đọc hơn 24h)
        notificationRepository.deleteByIsReadTrueAndReadAtBefore(threshold);
    }
}
