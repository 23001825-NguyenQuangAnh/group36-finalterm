package com.example.demo.controller;

import com.example.demo.dto.request.NotificationRequest;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.NotificationResponse;
import com.example.demo.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notification")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // API tạo thông báo mới (ví dụ: khi AI phân tích, khi có task mới, khi task sắp đến hạn)
    @PostMapping("/create")
    public ApiResponse<NotificationResponse> createNotification(@RequestBody NotificationRequest request) {
        return ApiResponse.<NotificationResponse>builder()
                .result(notificationService.createNotification(request))
                .build();
    }

    // API lấy danh sách thông báo của 1 user dựa vào userId
    @GetMapping("/getAll/{userId}")
    public ApiResponse<List<NotificationResponse>> getAllNotifications(@PathVariable Long userId) {
        return ApiResponse.<List<NotificationResponse>>builder()
                .result(notificationService.getAllNotifications(userId))
                .build();
    }

    // API đánh dấu một thông báo là "đã đọc"
    @PutMapping("/read/{id}")
    public ApiResponse<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ApiResponse.<Void>builder()
                .message("Notification marked as read")
                .build();
    }


}
