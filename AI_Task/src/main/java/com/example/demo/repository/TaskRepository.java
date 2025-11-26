package com.example.demo.repository;

import com.example.demo.entity.Task;
import com.example.demo.entity.User;
import com.example.demo.enums.PriorityLevel;
import com.example.demo.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByStatus(TaskStatus status);
    List<Task> findByPriorityLevel(PriorityLevel priorityLevel);
    List<Task> findByCategoryId(Long categoryId);

    List<Task> findByDeadlineBetween(LocalDateTime start, LocalDateTime end);

    List<Task> findByUser(User user);
    List<Task> findByUserAndStatus(User user, TaskStatus status);
    List<Task> findByUserAndPriorityLevel(User user, PriorityLevel priority);
    List<Task> findByUserAndCategoryId(User user, Long categoryId);

    List<Task> findByUserAndDeadlineBetween(User user, LocalDateTime start, LocalDateTime end);

    // Lấy task theo khoảng thời gian tạo
    List<Task> findAllByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    // Đếm task quá hạn nhưng không completed
    int countByDeadlineBeforeAndStatusNot(LocalDateTime now, TaskStatus taskStatus);

    // ======= 2 QUERY quan trọng để tính Productivity Trend =======

    @Query("""
        SELECT COUNT(t)
        FROM Task t
        WHERE t.createdAt BETWEEN :start AND :end
    """)
    int countInRange(LocalDateTime start, LocalDateTime end);

    @Query("""
        SELECT COUNT(t)
        FROM Task t
        WHERE t.status = 'COMPLETED'
        AND t.createdAt BETWEEN :start AND :end
    """)
    int countCompletedInRange(LocalDateTime start, LocalDateTime end);

    List<Task> findByUserIdAndDeadlineBeforeAndStatusNot(
            Long userId,
            LocalDateTime now,
            TaskStatus status
    );
    List<Task> findByUserIdAndDeadlineBetween(Long userId, LocalDateTime startOfDay, LocalDateTime endOfDay);
}
