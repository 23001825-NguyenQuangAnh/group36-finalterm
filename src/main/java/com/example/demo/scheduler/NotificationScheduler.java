package com.example.demo.scheduler;

import com.example.demo.entity.Task;
import com.example.demo.repository.TaskRepository;
import com.example.demo.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
public class NotificationScheduler {
    private final NotificationService notificationService;
    private final TaskRepository taskRepository;

    @Scheduled(cron = "0 0 8 * * *")
    public void checkUpcomingDeadlines() {
        LocalDate today = LocalDate.now();
        List<Task> tasks = taskRepository.findAll();

        for (Task task : tasks) {
            if (task.getDeadline() == null || task.getUser() == null) continue;

            long daysLeft = ChronoUnit.DAYS.between(today, task.getDeadline());

            if (daysLeft == 1) {
                notificationService.createTaskNotification(
                        task.getUser().getId(),
                        task.getId(),
                        "⏰ Task " + task.getTitle() + " sắp đến hạn vào ngày " + task.getDeadline() + "!"
                );
            } else if (daysLeft < 0) {
                notificationService.createTaskNotification(
                        task.getUser().getId(),
                        task.getId(),
                        "⚠️ Task " + task.getTitle() + " đã quá hạn từ ngày " + task.getDeadline() + "."
                );
            }
        }
    }

}
