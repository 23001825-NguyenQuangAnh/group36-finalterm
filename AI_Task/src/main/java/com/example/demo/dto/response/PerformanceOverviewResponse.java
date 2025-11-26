package com.example.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceOverviewResponse {
    private double completionRate;
    private double avgDuration;
    private int missedDeadlines;
    private double productivityTrend;
}
