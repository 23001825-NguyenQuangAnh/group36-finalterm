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

@RestController                       // Đánh dấu đây là Controller REST trả JSON
@RequestMapping("/aiAnalysis")        // Base URL cho toàn bộ controller này
@RequiredArgsConstructor              // Tự tạo constructor chứa các dependency final
public class AiAnalysisController {

    private final AiAnalysisService aiAnalysisService;
    private final TaskRepository taskRepository;

    @PostMapping("/analyze/{taskId}")
    // API dùng để phân tích AI cho 1 task cụ thể (dựa trên taskId)
    public ApiResponse<AiAnalysisResponse> analyze(@PathVariable Long taskId) {

        // Tìm task theo ID, nếu không có thì ném lỗi TASK_NOT_FOUND
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_FOUND));

        return ApiResponse.<AiAnalysisResponse>builder()
                .result(aiAnalysisService.analyzeTaskFromTask(task))
                .build();
    }

    @GetMapping("/getAll")
    // API trả về danh sách tất cả các bản phân tích AI đã lưu trong database
    public ApiResponse<List<AiAnalysisResponse>> getAll() {
        return ApiResponse.<List<AiAnalysisResponse>>builder()
                .result(aiAnalysisService.getAllAnalyses())
                .build();
    }
}
