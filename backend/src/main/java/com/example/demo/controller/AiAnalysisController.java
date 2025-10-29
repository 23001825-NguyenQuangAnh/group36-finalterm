package com.example.demo.controller;

import com.example.demo.dto.request.AiAnalysisRequest;
import com.example.demo.dto.response.AiAnalysisResponse;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.service.AiAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/aiAnalysis")
@RequiredArgsConstructor
public class AiAnalysisController {

    private final AiAnalysisService aiAnalysisService;

    @PostMapping("/save/{taskId}")
    public ApiResponse<AiAnalysisResponse> saveAiResult(@PathVariable Long taskId, AiAnalysisRequest request) {
        return ApiResponse.<AiAnalysisResponse>builder()
                .result(aiAnalysisService.saveAiResult(taskId, request))
                .build();
    }

    @GetMapping("/get/{taskId}")
    public ApiResponse<AiAnalysisResponse> getByTaskId(@PathVariable Long taskId) {
        return ApiResponse.<AiAnalysisResponse>builder()
                .result(aiAnalysisService.getByTaskId(taskId))
                .build();
    }

    @GetMapping("/getAll")
    public ApiResponse<List<AiAnalysisResponse>> getAll() {
        return ApiResponse.<List<AiAnalysisResponse>>builder()
                .result(aiAnalysisService.getAll())
                .build();
    }
}
