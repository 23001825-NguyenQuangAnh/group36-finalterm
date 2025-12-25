package com.example.demo.repository;

import com.example.demo.entity.Task;
import com.example.demo.entity.User;
import com.example.demo.enums.PriorityLevel;
import com.example.demo.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    // ========================================
    // TRUY VẤN CƠ BẢN
    // ========================================

    List<Task> findByStatus(TaskStatus status);
    List<Task> findByPriorityLevel(PriorityLevel priorityLevel);
    List<Task> findByCategoryId(Long categoryId);

    List<Task> findByDeadlineBetween(LocalDateTime start, LocalDateTime end);

    List<Task> findByUser(User user);
    List<Task> findByUserAndStatus(User user, TaskStatus status);
    List<Task> findByUserAndPriorityLevel(User user, PriorityLevel priority);
    List<Task> findByUserAndCategoryId(User user, Long categoryId);

    List<Task> findByUserAndDeadlineBetween(User user, LocalDateTime start, LocalDateTime end);


    // ========================================
    // TRUY VẤN THEO USER
    // ========================================

    List<Task> findByUserIdAndDeadlineBeforeAndStatusNot(
            Long userId,
            LocalDateTime deadline,
            TaskStatus status
    );

    int countByUserIdAndDeadlineBeforeAndStatusNot(
            Long userId,
            LocalDateTime now,
            TaskStatus status
    );

    List<Task> findByUserIdAndDeadlineBetween(
            Long userId,
            LocalDateTime startOfDay,
            LocalDateTime endOfDay
    );

    int countByUserIdAndStatus(Long userId, TaskStatus status);

    List<Task> findAllByUserIdAndCreatedAtBetween(
            Long userId,
            LocalDateTime start,
            LocalDateTime end
    );


    // ========================================
    // PRODUCTIVITY TREND (Theo user)
    // ========================================

    // Tổng task tạo trong khoảng
    @Query("""
        SELECT COUNT(t)
        FROM Task t
        WHERE t.user.id = :userId
          AND t.createdAt BETWEEN :start AND :end
    """)
    int countInRangeByUser(Long userId, LocalDateTime start, LocalDateTime end);

    // Tổng task hoàn thành trong khoảng (dựa vào updatedAt)
    @Query("""
        SELECT COUNT(t)
        FROM Task t
        WHERE t.user.id = :userId
          AND t.status = 'COMPLETED'
          AND t.updatedAt BETWEEN :start AND :end
    """)
    int countCompletedInRangeByUser(Long userId, LocalDateTime start, LocalDateTime end);


    // ========================================
    // DAILY COMPLETED BY USER (dùng updatedAt)
    // ========================================

    @Query(value = """
        SELECT 
            SUM(CASE WHEN DAYOFWEEK(t.updated_at) = 2 AND t.status = 'COMPLETED' THEN 1 ELSE 0 END), 
            SUM(CASE WHEN DAYOFWEEK(t.updated_at) = 3 AND t.status = 'COMPLETED' THEN 1 ELSE 0 END), 
            SUM(CASE WHEN DAYOFWEEK(t.updated_at) = 4 AND t.status = 'COMPLETED' THEN 1 ELSE 0 END), 
            SUM(CASE WHEN DAYOFWEEK(t.updated_at) = 5 AND t.status = 'COMPLETED' THEN 1 ELSE 0 END), 
            SUM(CASE WHEN DAYOFWEEK(t.updated_at) = 6 AND t.status = 'COMPLETED' THEN 1 ELSE 0 END), 
            SUM(CASE WHEN DAYOFWEEK(t.updated_at) = 7 AND t.status = 'COMPLETED' THEN 1 ELSE 0 END), 
            SUM(CASE WHEN DAYOFWEEK(t.updated_at) = 1 AND t.status = 'COMPLETED' THEN 1 ELSE 0 END)
        FROM tasks t
        WHERE t.user_id = :userId
    """, nativeQuery = true)
    List<Object[]> countCompletedEachDayOfWeekByUser(Long userId);


    // ========================================
    // WEEKLY COMPLETION RATE BY USER
    // ========================================

    @Query(value = """
        SELECT 
            ROUND(
                100.0 *
                SUM(CASE WHEN t.status = 'COMPLETED' THEN 1 ELSE 0 END)
                / COUNT(*)
            )
        FROM tasks t
        WHERE t.user_id = :userId
        GROUP BY WEEK(t.updated_at)
        ORDER BY WEEK(t.updated_at) DESC
        LIMIT 4
    """, nativeQuery = true)
    List<Number> getWeeklyCompletionRateByUser(Long userId);


    // ========================================
    // QUERIES CŨ (KHÔNG DÙNG THÊO USER)
    // (CÓ THỂ XOÁ SAU NẾU KHÔNG DÙNG)
    // ========================================

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

    int countByStatus(TaskStatus status);
}
