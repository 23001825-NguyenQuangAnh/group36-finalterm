package com.example.demo.dto.request;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AiAnalysisRequest {
    private Long taskId;
    private String title;
    private String description;
}
