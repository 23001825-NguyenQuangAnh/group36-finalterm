package com.example.demo.dto.request;

import com.example.demo.enums.PriorityLevel;
import com.example.demo.enums.TaskStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UpdateTaskRequest {
    private String title;
    private String description;
    private Integer durationMinutes;
    private LocalDateTime deadline;

    private PriorityLevel priorityLevel;
    private TaskStatus status;
    private Long categoryId;
}
