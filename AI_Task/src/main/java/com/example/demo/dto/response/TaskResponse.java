package com.example.demo.dto.response;

import com.example.demo.enums.PriorityLevel;
import com.example.demo.enums.TaskStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private Integer durationMinutes;

    private LocalDateTime deadline; // deadline cuối cùng (AI overwrite)

    private PriorityLevel priorityLevel;
    private TaskStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Long categoryId;
    private String categoryName;

    // ===== Thông tin AI =====
    private Double urgency;
    private Double importance;
    private Double priorityScore;
}
