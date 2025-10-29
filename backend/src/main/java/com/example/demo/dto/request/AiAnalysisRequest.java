package com.example.demo.dto.request;

import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
public class AiAnalysisRequest {
    private String rawDescription;       // Mô tả gốc AI đã phân tích
    private LocalDateTime parsedDeadline; // Hạn được AI trích xuất
    private Double urgency;               // Độ khẩn cấp
    private Double importance;            // Độ quan trọng
    private String category;              // Phân loại AI (work/study/etc.)
}
