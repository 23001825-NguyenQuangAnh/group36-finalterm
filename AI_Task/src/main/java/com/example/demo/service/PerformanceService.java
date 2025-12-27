package com.example.demo.service;

import com.example.demo.dto.response.ChartDataResponse;
import com.example.demo.dto.response.ChartStatusCounts;
import com.example.demo.dto.response.PerformanceOverviewResponse;
import com.example.demo.enums.TaskStatus;
import com.example.demo.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PerformanceService {

    private final TaskRepository taskRepository;

    // ===============================
    //   TỔNG QUAN HIỆU SUẤT (THEO USER)
    // ===============================
    public PerformanceOverviewResponse getOverview(Long userId) {

        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.with(DayOfWeek.MONDAY);
        LocalDate weekEnd = weekStart.plusDays(7);

        LocalDateTime startThisWeek = weekStart.atStartOfDay();
        LocalDateTime endThisWeek = weekEnd.atStartOfDay();

        // Tổng số task của user trong tuần này
        int totalThisWeek = taskRepository.countInRangeByUser(
                userId, startThisWeek, endThisWeek
        );

        // Số task đã hoàn thành trong tuần này
        int completedThisWeek = taskRepository.countCompletedInRangeByUser(
                userId, startThisWeek, endThisWeek
        );

        double completionRateThisWeek = totalThisWeek == 0
                ? 0
                : (completedThisWeek * 100.0 / totalThisWeek);

        // Trung bình thời lượng
        var tasksThisWeek = taskRepository.findAllByUserIdAndCreatedAtBetween(
                userId, startThisWeek, endThisWeek
        );

        double avgDuration = tasksThisWeek.stream()
                .mapToInt(t -> t.getDurationMinutes() == null ? 0 : t.getDurationMinutes())
                .average()
                .orElse(0);

        // ===== TUẦN TRƯỚC =====
        LocalDate lastWeekStartDate = weekStart.minusWeeks(1);
        LocalDate lastWeekEndDate = weekStart;

        LocalDateTime startLastWeek = lastWeekStartDate.atStartOfDay();
        LocalDateTime endLastWeek = lastWeekEndDate.atStartOfDay();

        int totalLastWeek = taskRepository.countInRangeByUser(userId, startLastWeek, endLastWeek);
        int completedLastWeek = taskRepository.countCompletedInRangeByUser(userId, startLastWeek, endLastWeek);

        double completionRateLastWeek = totalLastWeek == 0
                ? 0
                : (completedLastWeek * 100.0 / totalLastWeek);

        double productivityTrend = completionRateThisWeek - completionRateLastWeek;

        // Task trễ deadline
        int missedDeadlines = taskRepository.countByUserIdAndDeadlineBeforeAndStatusNot(
                userId,
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

    // ===============================
    //       BIỂU ĐỒ DASHBOARD (THEO USER)
    // ===============================
    public ChartDataResponse getChartData(Long userId) {

        // ===== 1) DAILY COMPLETED =====
        Object[] rawDaily = taskRepository.countCompletedEachDayOfWeekByUser(userId).get(0);

        List<Integer> dailyCompleted = new ArrayList<>();
        for (Object o : rawDaily) {
            dailyCompleted.add(o == null ? 0 : ((Number) o).intValue());
        }

        // ===== 2) STATUS COUNTS =====
        int completed = taskRepository.countByUserIdAndStatus(userId, TaskStatus.COMPLETED);
        int inProgress = taskRepository.countByUserIdAndStatus(userId, TaskStatus.IN_PROGRESS);
        int pending = taskRepository.countByUserIdAndStatus(userId, TaskStatus.PENDING);

        ChartStatusCounts status = new ChartStatusCounts(
                completed,
                inProgress,
                pending
        );

        // ===== 3) WEEKLY COMPLETION RATE =====
        List<Number> weeklyRaw = taskRepository.getWeeklyCompletionRateByUser(userId);

        List<Integer> weeklyRate = weeklyRaw.stream()
                .map(n -> n == null ? 0 : n.intValue())
                .toList();

        return new ChartDataResponse(
                dailyCompleted,
                status,
                weeklyRate
        );
    }

}
