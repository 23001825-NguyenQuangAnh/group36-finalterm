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

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskMapper taskMapper;
    private final TaskRepository taskRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    // Tao task moi
    public TaskResponse createTask(TaskRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Task task = taskMapper.toTask(request);
        task.setUser(user);

        if(request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
            task.setCategory(category);
        }
        taskRepository.save(task);
        return taskMapper.toTaskResponse(task);
    }

    // Cap nhat task
    public TaskResponse updateTask(Long taskId, UpdateTaskRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_FOUND));

        taskMapper.updateTaskFromRequest(request, task);

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
            task.setCategory(category);
        }

        taskRepository.save(task);

        return taskMapper.toTaskResponse(task);
    }

    // Xoa task
    public void deleteTask(Long id){
        if(!taskRepository.existsById(id)) {
            throw new AppException(ErrorCode.TASK_NOT_FOUND);
        }
        taskRepository.deleteById(id);
    }

    // Lay tat ca cac task
    public List<TaskResponse> getAllTasks() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return taskRepository.findByUser(user)
                .stream()
                .map(taskMapper::toTaskResponse)
                .toList();
    }

    // Lay task theo ID
    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_FOUND));
        return taskMapper.toTaskResponse(task);
    }

    // Loc task theo trang thai
    public List<TaskResponse> getTaskByStatus(TaskStatus status) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return taskRepository.findByUserAndStatus(user, status)
                .stream()
                .map(taskMapper::toTaskResponse)
                .toList();
    }

    // Loc task theo uc uu tien
    public List<TaskResponse> getTaskByPriority(PriorityLevel priority) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return taskRepository.findByUserAndPriorityLevel(user, priority)
                .stream()
                .map(taskMapper::toTaskResponse)
                .toList();
    }

    // Loc theo category
    public List<TaskResponse> getTaskByCategory(Long categoryId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return taskRepository.findByUserAndCategoryId(user, categoryId)
                .stream()
                .map(taskMapper::toTaskResponse)
                .toList();
    }

    // Loc theo thang
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
}
