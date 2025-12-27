package com.example.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChartDataResponse {
    private List<Integer> dailyCompleted;       // 7 giá trị (Mon–Sun)
    private ChartStatusCounts statusCounts;     // Completed / In progress / Pending
    private List<Integer> weeklyCompletionRate; // Rate 4 tuần gần nhất
}
