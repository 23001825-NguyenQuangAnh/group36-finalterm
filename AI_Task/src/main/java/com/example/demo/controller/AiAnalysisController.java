package com.example.demo.controller;

import com.example.demo.dto.response.AiAnalysisResponse;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.entity.Task;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.repository.TaskRepository;
import com.example.demo.service.AiAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/aiAnalysis")
@RequiredArgsConstructor
public class AiAnalysisController {

    private final AiAnalysisService aiAnalysisService;
    private final TaskRepository taskRepository;

    @PostMapping("/analyze/{taskId}")
    public ApiResponse<AiAnalysisResponse> analyze(@PathVariable Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_FOUND));

        return ApiResponse.<AiAnalysisResponse>builder()
                .result(aiAnalysisService.analyzeTaskFromTask(task))
                .build();
    }

    @GetMapping("/getAll")
    public ApiResponse<List<AiAnalysisResponse>> getAll() {
        return ApiResponse.<List<AiAnalysisResponse>>builder()
                .result(aiAnalysisService.getAllAnalyses())
                .build();
    }
}
