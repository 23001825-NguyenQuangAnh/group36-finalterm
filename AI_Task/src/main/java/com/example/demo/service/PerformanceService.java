package com.example.demo.service;

import com.example.demo.dto.response.PerformanceOverviewResponse;
import com.example.demo.enums.TaskStatus;
import com.example.demo.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PerformanceService {

    private final TaskRepository taskRepository;

    public PerformanceOverviewResponse getOverview() {

        // ====== TUẦN NÀY ======
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.with(DayOfWeek.MONDAY);   // Thứ 2 tuần này
        LocalDate weekEnd = weekStart.plusDays(7);            // Thứ 2 tuần sau

        LocalDateTime startThisWeek = weekStart.atStartOfDay();
        LocalDateTime endThisWeek = weekEnd.atStartOfDay();

        int totalThisWeek = taskRepository.countInRange(startThisWeek, endThisWeek);
        int completedThisWeek = taskRepository.countCompletedInRange(startThisWeek, endThisWeek);

        double completionRateThisWeek = totalThisWeek == 0
                ? 0
                : (completedThisWeek * 100.0 / totalThisWeek);

        // ====== THỜI LƯỢNG TRUNG BÌNH ======
        var tasksThisWeek = taskRepository.findAllByCreatedAtBetween(startThisWeek, endThisWeek);

        double avgDuration = tasksThisWeek.stream()
                .mapToInt(t -> t.getDurationMinutes() == null ? 0 : t.getDurationMinutes())
                .average()
                .orElse(0);

        // ====== TUẦN TRƯỚC ======
        LocalDate lastWeekStartDate = weekStart.minusWeeks(1);
        LocalDate lastWeekEndDate = weekStart;

        LocalDateTime startLastWeek = lastWeekStartDate.atStartOfDay();
        LocalDateTime endLastWeek = lastWeekEndDate.atStartOfDay();

        int totalLastWeek = taskRepository.countInRange(startLastWeek, endLastWeek);
        int completedLastWeek = taskRepository.countCompletedInRange(startLastWeek, endLastWeek);

        double completionRateLastWeek = totalLastWeek == 0
                ? 0
                : (completedLastWeek * 100.0 / totalLastWeek);

        // ====== TREND ======
        double productivityTrend = completionRateThisWeek - completionRateLastWeek;

        // ====== TASK TRỄ DEADLINE ======
        int missedDeadlines = taskRepository.countByDeadlineBeforeAndStatusNot(
                LocalDateTime.now(),
                TaskStatus.COMPLETED
        );

        return new PerformanceOverviewResponse(
                completionRateThisWeek,
                avgDuration,
                missedDeadlines,
                productivityTrend
        );
    }
}
