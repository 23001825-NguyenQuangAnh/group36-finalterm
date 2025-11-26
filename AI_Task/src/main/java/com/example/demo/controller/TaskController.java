package com.example.demo.controller;

import com.example.demo.dto.request.TaskRequest;
import com.example.demo.dto.request.UpdateTaskRequest;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.TaskResponse;
import com.example.demo.enums.PriorityLevel;
import com.example.demo.enums.TaskStatus;
import com.example.demo.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/task")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping("/create")
    public ApiResponse<TaskResponse> createTask(@RequestBody TaskRequest taskRequest) {
        return ApiResponse.<TaskResponse>builder()
                .result(taskService.createTask(taskRequest))
                .build();
    }

    @PutMapping("/update/{taskId}")
    public ApiResponse<TaskResponse> updateTask(@PathVariable Long taskId, @RequestBody UpdateTaskRequest taskRequest) {
        return ApiResponse.<TaskResponse>builder()
                .result(taskService.updateTask(taskId, taskRequest))
                .build();
    }

    @DeleteMapping("/delete/{taskId}")
    public ApiResponse<Void> deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
        return ApiResponse.<Void>builder()
                .message("Task deleted")
                .build();
    }

    @GetMapping("/getAll")
    public ApiResponse<List<TaskResponse>> getAllTasks() {
        return ApiResponse.<List<TaskResponse>>builder()
                .result(taskService.getAllTasks())
                .build();
    }

    @GetMapping("/getById/{taskId}")
    public ApiResponse<TaskResponse> getTaskById(@PathVariable Long taskId) {
        return ApiResponse.<TaskResponse>builder()
                .result(taskService.getTaskById(taskId))
                .build();
    }

    @GetMapping("/getByStatus/{status}")
    public ApiResponse<List<TaskResponse>> getTaskByStatus(@PathVariable TaskStatus status) {
        return ApiResponse.<List<TaskResponse>>builder()
                .result(taskService.getTaskByStatus(status))
                .build();
    }

    @GetMapping("/getByPriority/{priority}")
    public ApiResponse<List<TaskResponse>> getTaskByPriority(@PathVariable PriorityLevel priority) {
        return ApiResponse.<List<TaskResponse>>builder()
                .result(taskService.getTaskByPriority(priority))
                .build();
    }

    @GetMapping("/getByCategory/{categoryId}")
    public ApiResponse<List<TaskResponse>> getTaskByCategory(@PathVariable Long categoryId) {
        return ApiResponse.<List<TaskResponse>>builder()
                .result(taskService.getTaskByCategory(categoryId))
                .build();
    }

    @GetMapping("/getByMonth")
    public ApiResponse<List<TaskResponse>> getTasksByMonth(@RequestParam int month, @RequestParam int year) {
        return ApiResponse.<List<TaskResponse>>builder()
                .result(taskService.getTasksByMonth(month, year))
                .build();
    }

    @PatchMapping("/{id}/status")
    public TaskResponse updateStatus(
            @PathVariable Long id,
            @RequestParam TaskStatus status
    ) {
        return taskService.updateStatus(id, status);
    }

    @PatchMapping("/{id}/priority")
    public TaskResponse updatePriority(
            @PathVariable Long id,
            @RequestParam PriorityLevel priority
    ) {
        return taskService.updatePriority(id, priority);
    }
    
    @GetMapping("/today/{userId}")
    public ApiResponse<List<TaskResponse>> getTodayTasks(@PathVariable Long userId) {
        return ApiResponse.<List<TaskResponse>>builder()
                .result(taskService.getTodayTasks(userId))
                .build();
    }

    @GetMapping("/overdue/{userId}")
    public ApiResponse<List<TaskResponse>> getOverdueTasks(@PathVariable Long userId) {
        return ApiResponse.<List<TaskResponse>>builder()
                .result(taskService.getOverdueTasks(userId))
                .build();
    }
}
