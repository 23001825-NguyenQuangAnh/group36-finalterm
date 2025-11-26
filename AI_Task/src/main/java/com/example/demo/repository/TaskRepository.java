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

    @Query("""
    SELECT 
        SUM(CASE WHEN DAYOFWEEK(t.createdAt) = 2 AND t.status = 'COMPLETED' THEN 1 ELSE 0 END),
        SUM(CASE WHEN DAYOFWEEK(t.createdAt) = 3 AND t.status = 'COMPLETED' THEN 1 ELSE 0 END),
        SUM(CASE WHEN DAYOFWEEK(t.createdAt) = 4 AND t.status = 'COMPLETED' THEN 1 ELSE 0 END),
        SUM(CASE WHEN DAYOFWEEK(t.createdAt) = 5 AND t.status = 'COMPLETED' THEN 1 ELSE 0 END),
        SUM(CASE WHEN DAYOFWEEK(t.createdAt) = 6 AND t.status = 'COMPLETED' THEN 1 ELSE 0 END),
        SUM(CASE WHEN DAYOFWEEK(t.createdAt) = 7 AND t.status = 'COMPLETED' THEN 1 ELSE 0 END),
        SUM(CASE WHEN DAYOFWEEK(t.createdAt) = 1 AND t.status = 'COMPLETED' THEN 1 ELSE 0 END)
    FROM Task t
""")
    List<Object[]> countCompletedEachDayOfWeekRaw();


    @Query("""
    SELECT 
        ROUND(100.0 * SUM(CASE WHEN t.status = 'COMPLETED' THEN 1 ELSE 0 END) / COUNT(*))
    FROM Task t
    GROUP BY WEEK(t.createdAt)
    ORDER BY WEEK(t.createdAt) DESC
    LIMIT 4
""")
    List<Number> getWeeklyCompletionRateRaw();

    int countByStatus(TaskStatus status);

}
