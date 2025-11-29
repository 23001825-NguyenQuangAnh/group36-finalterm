package com.example.demo.controller;

import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.ChartDataResponse;
import com.example.demo.dto.response.PerformanceOverviewResponse;
import com.example.demo.service.PerformanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/performance")
public class PerformanceController {

    @Autowired
    private PerformanceService performanceService;

    // API trả về số liệu tổng quan hiệu suất (overview)
    @GetMapping("/overview")
    public ApiResponse<PerformanceOverviewResponse> getOverview() {
        return ApiResponse.<PerformanceOverviewResponse>builder()
                .result(performanceService.getOverview())
                .build();
    }

    // API trả về dữ liệu biểu đồ (chart data)
    @GetMapping("/charts")
    public ApiResponse<ChartDataResponse> getChartData() {
        return ApiResponse.<ChartDataResponse>builder()
                .message("Chart data loaded successfully")
                .result(performanceService.getChartData())
                .build();
    }
}
