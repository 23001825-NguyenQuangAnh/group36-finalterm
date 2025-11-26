package com.example.demo.service;

import com.example.demo.dto.request.TaskRequest;
import com.example.demo.dto.request.UpdateTaskRequest;
import com.example.demo.dto.response.TaskResponse;
import com.example.demo.entity.Category;
import com.example.demo.entity.Task;
import com.example.demo.entity.User;
import com.example.demo.enums.PriorityLevel;
import com.example.demo.enums.TaskStatus;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.mapper.TaskMapper;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.TaskRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskMapper taskMapper;
    private final TaskRepository taskRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final AiAnalysisService aiAnalysisService;

    /**
     * ============================
     *        CREATE TASK
     * ============================
     */
    public TaskResponse createTask(TaskRequest request) {

        // 1. Lấy user hiện tại
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 2. Map request → entity (title, description, duration, deadline)
        Task task = taskMapper.toTask(request);
        task.setUser(user);

        // ⭐ FE không gửi status nữa → backend đặt default
        task.setStatus(TaskStatus.PENDING);

        // ⭐ FE không gửi priorityLevel nữa → đặt default tạm thời
        task.setPriorityLevel(PriorityLevel.NORMAL);

        // ⭐ FE không gửi categoryId nữa → AI sẽ set
        task.setCategory(null);

        // 3. Lưu task thô trước (để có taskId)
        taskRepository.save(task);

        // 4. Gọi AI để phân tích task
        try {
            aiAnalysisService.analyzeTaskFromTask(task);
        } catch (Exception e) {
            System.err.println("⚠️ AI analysis failed for task " + task.getId() + ": " + e.getMessage());
        }

        // 5. Lưu lại task đã được AI update
        taskRepository.save(task);

        // 6. Trả kết quả
        return taskMapper.toTaskResponse(task);
    }


    /**
     * ============================
     *       UPDATE TASK
     * ============================
     */
    public TaskResponse updateTask(Long taskId, UpdateTaskRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_FOUND));

        // MapStruct cập nhật đầy đủ: title, desc, duration, deadline, priorityLevel, status
        taskMapper.updateTaskFromRequest(request, task);

        // Nếu categoryId != null → gán category mới
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
            task.setCategory(category);
        }

        taskRepository.save(task);

        // Nếu mô tả thay đổi → AI re-analyze
        if (request.getDescription() != null) {
            try {
                aiAnalysisService.analyzeTaskFromTask(task);
            } catch (Exception e) {
                System.err.println("⚠️ AI re-analysis failed: " + e.getMessage());
            }
        }

        return taskMapper.toTaskResponse(task);
    }


    /**
     * ============================
     *        DELETE TASK
     * ============================
     */
    public void deleteTask(Long id){
        if(!taskRepository.existsById(id)) {
            throw new AppException(ErrorCode.TASK_NOT_FOUND);
        }
        taskRepository.deleteById(id);
    }


    /**
     * ============================
     *        GET ALL TASKS
     * ============================
     */
    public List<TaskResponse> getAllTasks() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return taskRepository.findByUser(user)
                .stream()
                .map(taskMapper::toTaskResponse)
                .toList();
    }


    /**
     * ============================
     *        GET BY ID
     * ============================
     */
    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_FOUND));
        return taskMapper.toTaskResponse(task);
    }


    /**
     * ============================
     *     FILTERS
     * ============================
     */
    public List<TaskResponse> getTaskByStatus(TaskStatus status) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return taskRepository.findByUserAndStatus(user, status)
                .stream()
                .map(taskMapper::toTaskResponse)
                .toList();
    }

    public List<TaskResponse> getTaskByPriority(PriorityLevel priority) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return taskRepository.findByUserAndPriorityLevel(user, priority)
                .stream()
                .map(taskMapper::toTaskResponse)
                .toList();
    }

    public List<TaskResponse> getTaskByCategory(Long categoryId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return taskRepository.findByUserAndCategoryId(user, categoryId)
                .stream()
                .map(taskMapper::toTaskResponse)
                .toList();
    }

    public List<TaskResponse> getTasksByMonth(int month, int year) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        LocalDateTime start = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime end = start.plusMonths(1);

        return taskRepository.findByUserAndDeadlineBetween(user, start, end)
                .stream()
                .map(taskMapper::toTaskResponse)
                .toList();
    }


    /**
     * ============================
     *   UPDATE STATUS / PRIORITY
     * ============================
     */
    public TaskResponse updateStatus(Long id, TaskStatus status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_FOUND));

        task.setStatus(status);
        task.setUpdatedAt(LocalDateTime.now());
        taskRepository.save(task);

        return taskMapper.toTaskResponse(task);
    }

    public TaskResponse updatePriority(Long id, PriorityLevel priority) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_FOUND));

        task.setPriorityLevel(priority);
        task.setUpdatedAt(LocalDateTime.now());

        taskRepository.save(task);

        return taskMapper.toTaskResponse(task);
    }

    // Lấy các task trong hôm nay
    public List<TaskResponse> getTodayTasks(Long userId){
        LocalDate today = LocalDate.now(); // ngày hôm nay

        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay(); // 00:00 ngày mai

        return taskRepository
                .findByUserIdAndDeadlineBetween(userId, startOfDay, endOfDay)
                .stream()
                .map(taskMapper::toTaskResponse)
                .toList();
    }

    // Lấy danh sách task quá hạn
    public List<TaskResponse> getOverdueTasks(Long userId) {
        LocalDateTime now = LocalDateTime.now();

        return taskRepository
                .findByUserIdAndDeadlineBeforeAndStatusNot(
                        userId,
                        now,
                        TaskStatus.COMPLETED
                )
                .stream()
                .map(taskMapper::toTaskResponse)
                .toList();
    }

}
