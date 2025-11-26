package com.example.demo.scheduler;

import com.example.demo.entity.Notification;
import com.example.demo.entity.Task;
import com.example.demo.entity.User;
import com.example.demo.enums.TaskStatus;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.repository.TaskRepository;
import com.example.demo.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
public class NotificationScheduler {

    private final TaskRepository taskRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    // ⏱ Chạy mỗi 1 phút
    @Scheduled(fixedRate = 60000)
    public void checkDeadlines() {

        LocalDateTime now = LocalDateTime.now();
        List<Task> tasks = taskRepository.findAll();

        for (Task task : tasks) {

            if (task.getDeadline() == null || task.getUser() == null) continue;
            if (task.getStatus() == TaskStatus.COMPLETED) continue;

            User user = task.getUser();
            LocalDateTime deadline = task.getDeadline();

            long minutesLeft = ChronoUnit.MINUTES.between(now, deadline);

            // 🟦 1. Task sắp đến hạn (trong vòng 6 giờ tới)
            if (minutesLeft <= 360 && minutesLeft > 0) {   // <= 6 giờ
                boolean exists = notificationRepository.existsByUserIdAndTaskIdAndMessageContaining(
                        user.getId(), task.getId(), "sắp đến hạn"
                );
                if (!exists) {
                    notificationService.createTaskNotification(
                            user.getId(),
                            task.getId(),
                            "⏳ Task \"" + task.getTitle() + "\" sắp đến hạn (" +
                                    minutesLeft + " phút nữa)"
                    );
                }
            }

            // 🟥 2. Task quá hạn
            if (minutesLeft < 0) {
                boolean exists = notificationRepository.existsByUserIdAndTaskIdAndMessageContaining(
                        user.getId(), task.getId(), "đã quá hạn"
                );
                if (!exists) {
                    notificationService.createTaskNotification(
                            user.getId(),
                            task.getId(),
                            "⚠️ Task \"" + task.getTitle() + "\" đã quá hạn!"
                    );
                }
            }
        }
    }
}
