package com.example.demo.repository;

import com.example.demo.entity.Task;
import com.example.demo.entity.User;
import com.example.demo.enums.PriorityLevel;
import com.example.demo.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByPriorityLevel(PriorityLevel priorityLevel);
    List<Task> findByCategoryId(Long categoryId);
    List<Task> findByDeadlineBetween(LocalDateTime start, LocalDateTime end);

    List<Task> findByUser(User user);

    List<Task> findByUserAndStatus(User user, TaskStatus status);

    List<Task> findByUserAndPriorityLevel(User user, PriorityLevel priority);

    List<Task> findByUserAndCategoryId(User user, Long categoryId);

    List<Task> findByUserAndDeadlineBetween(User user, java.time.LocalDateTime start, java.time.LocalDateTime end);
}
