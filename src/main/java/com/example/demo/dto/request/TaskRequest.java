package com.example.demo.dto.request;

import com.example.demo.enums.PriorityLevel;
import com.example.demo.enums.TaskStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TaskRequest {
    private String title;
    private String description;
    private Integer durationMinutes;
    private LocalDateTime deadline;

    private Double urgency;      // độ khẩn cấp
    private Double importance;   // độ quan trọng

    private PriorityLevel priorityLevel;  // NORMAL hoặc HIGH
    private TaskStatus status;            // PENDING, IN_PROGRESS, COMPLETED

    private Long categoryId;
}
