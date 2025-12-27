package com.example.demo.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AiAnalysisResponse {

    private String categoryName;
    private Double urgency;
    private Double importance;
    private LocalDateTime parsedDeadline;
    private Double priorityScore;

    private String rawDescription; // lưu lại mô tả gốc
}
