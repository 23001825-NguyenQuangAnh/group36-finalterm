package com.example.demo.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AiAnalysisResponse {
    private Long id;
    private String rawDescription;
    private LocalDateTime parsedDeadline;
    private Double urgency;
    private Double importance;
    private String category;
    private LocalDateTime createdAt;
    private Long taskId;
}
