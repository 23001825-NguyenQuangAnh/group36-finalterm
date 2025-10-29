package com.example.demo.service;

import com.example.demo.dto.request.AiAnalysisRequest;
import com.example.demo.dto.response.AiAnalysisResponse;
import com.example.demo.entity.AiAnalysis;
import com.example.demo.entity.Task;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.mapper.AiAnalysisMapper;
import com.example.demo.repository.AiAnalysisRepository;
import com.example.demo.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AiAnalysisService {
    private final AiAnalysisRepository aiAnalysisRepository;
    private final TaskRepository taskRepository;
    private final AiAnalysisMapper aiAnalysisMapper;

    public AiAnalysisResponse saveAiResult(Long taskId, AiAnalysisRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_FOUND));

        // Tìm bản ghi cũ nếu có, ngược lại tạo mới
        AiAnalysis entity = aiAnalysisRepository.findByTaskId(taskId)
                .orElseGet(() -> aiAnalysisMapper.toEntity(request));

        aiAnalysisMapper.updateEntityFromRequest(request, entity);

        entity.setTask(task);

        return aiAnalysisMapper.toResponse(aiAnalysisRepository.save(entity));
    }

    public AiAnalysisResponse getByTaskId(Long taskId) {
        AiAnalysis entity = aiAnalysisRepository.findByTaskId(taskId)
                .orElseThrow(() -> new RuntimeException("AI analysis not found for taskId: " + taskId));
        return aiAnalysisMapper.toResponse(entity);
    }

    public List<AiAnalysisResponse> getAll() {
        return aiAnalysisRepository.findAll()
                .stream()
                .map(aiAnalysisMapper::toResponse)
                .toList();
    }
}
