package com.example.demo.service;

import com.example.demo.dto.request.AiAnalysisRequest;
import com.example.demo.dto.response.AiAnalysisResponse;
import com.example.demo.entity.AiAnalysis;
import com.example.demo.entity.Category;
import com.example.demo.entity.Task;
import com.example.demo.enums.PriorityLevel;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.mapper.AiAnalysisMapper;
import com.example.demo.repository.AiAnalysisRepository;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiAnalysisService {

    private final AiAnalysisRepository aiAnalysisRepository;
    private final TaskRepository taskRepository;
    private final CategoryRepository categoryRepository;
    private final AiAnalysisMapper aiAnalysisMapper;
    private final RestTemplate restTemplate;

    // ví dụ: http://localhost:8001/priority/analyze
    @Value("${fastapi.url}")
    private String fastApiUrl;

    /**
     * Gọi FastAPI → nhận AI response → update Task (trong RAM)
     * → lưu/ cập nhật bản ghi AiAnalysis trong DB → trả kết quả.
     */
    public AiAnalysisResponse analyzeTask(AiAnalysisRequest req) {

        // 1️⃣ Gửi request sang FastAPI
        Map<String, Object> body = Map.of(
                "title", req.getTitle(),
                "description", req.getDescription()
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<AiAnalysisResponse> response;
        try {
            response = restTemplate.exchange(
                    fastApiUrl,
                    HttpMethod.POST,
                    entity,
                    AiAnalysisResponse.class
            );
        } catch (Exception e) {
            log.error("🔥 Error calling FastAPI: {}", e.getMessage());
            throw new AppException(ErrorCode.AI_SERVICE_FAILED);
        }

        AiAnalysisResponse ai = response.getBody();
        if (ai == null) {
            throw new AppException(ErrorCode.AI_SERVICE_FAILED);
        }

        log.info("🔍 FastAPI AI Response: {}", ai);

        // 2️⃣ Lấy task từ DB
        Task task = taskRepository.findById(req.getTaskId())
                .orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_FOUND));

        // 3️⃣ Update các field AI vào Task (CHƯA save ở đây)
        task.setUrgency(ai.getUrgency());
        task.setImportance(ai.getImportance());
        task.setPriorityScore(ai.getPriorityScore());

        // 3.1 → Set PriorityLevel dựa trên priorityScore
        if (ai.getPriorityScore() != null && ai.getPriorityScore() >= 0.7) {
            task.setPriorityLevel(PriorityLevel.HIGH);
        } else {
            task.setPriorityLevel(PriorityLevel.NORMAL);
        }

        // 3.2 CategoryName → Category entity
        if (ai.getCategoryName() != null) {
            Category category = categoryRepository.findByNameIgnoreCase(ai.getCategoryName());
            if (category != null) {
                task.setCategory(category);
            } else {
                log.warn("⚠ Không tìm thấy category với tên: {}", ai.getCategoryName());
                // Có thể gán category default nếu bạn muốn
            }
        }

        // ⚡️ CHỈ cập nhật deadline nếu người dùng KHÔNG nhập deadline
        if (task.getDeadline() == null && ai.getParsedDeadline() != null) {
            task.setDeadline(ai.getParsedDeadline());
        }

        // ❗ Không save task ở đây.
        // Task sẽ được save ở TaskService sau khi gọi analyzeTaskFromTask()


        // 4️⃣ Lưu / cập nhật bản ghi AIAnalysis
        // Yêu cầu: trong AiAnalysisRepository nên có:
        // Optional<AiAnalysis> findByTask(Task task);
        AiAnalysis aiEntity = aiAnalysisRepository.findByTask(task).orElse(null);
        if (aiEntity == null) {
            aiEntity = new AiAnalysis();
            aiEntity.setTask(task);
        }

        aiEntity.setUrgency(ai.getUrgency());
        aiEntity.setImportance(ai.getImportance());
        aiEntity.setPriorityScore(ai.getPriorityScore());
        aiEntity.setCategoryName(ai.getCategoryName());
        aiEntity.setParsedDeadline(ai.getParsedDeadline());
        aiEntity.setRawDescription(req.getDescription());

        aiAnalysisRepository.save(aiEntity);

        return ai;
    }

    /**
     * Dùng khi muốn phân tích trực tiếp từ Task entity (create/update Task)
     */
    public AiAnalysisResponse analyzeTaskFromTask(Task task) {
        AiAnalysisRequest req = new AiAnalysisRequest();
        req.setTaskId(task.getId());
        req.setTitle(task.getTitle());
        req.setDescription(task.getDescription());
        return analyzeTask(req);
    }

    public List<AiAnalysisResponse> getAllAnalyses() {
        return aiAnalysisRepository.findAll()
                .stream()
                .map(aiAnalysisMapper::toResponse)
                .toList();
    }
}
