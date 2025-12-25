package com.example.demo.controller;

import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.ChartDataResponse;
import com.example.demo.dto.response.PerformanceOverviewResponse;
import com.example.demo.entity.User;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.PerformanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/performance")
@RequiredArgsConstructor
public class PerformanceController {

    private final PerformanceService performanceService;
    private final UserRepository userRepository;

    // ============================
    // Lấy userId từ JWT
    // ============================
    private Long getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return user.getId();
    }

    // ============================
    // API: Tổng quan hiệu suất
    // ============================
    @GetMapping("/overview")
    public ApiResponse<PerformanceOverviewResponse> getOverview() {
        Long userId = getCurrentUserId();

        return ApiResponse.<PerformanceOverviewResponse>builder()
                .result(performanceService.getOverview(userId))
                .build();
    }

    // ============================
    // API: Dữ liệu biểu đồ dashboard
    // ============================
    @GetMapping("/charts")
    public ApiResponse<ChartDataResponse> getChartData() {
        Long userId = getCurrentUserId();

        return ApiResponse.<ChartDataResponse>builder()
                .message("Chart data loaded successfully")
                .result(performanceService.getChartData(userId))
                .build();
    }
}
