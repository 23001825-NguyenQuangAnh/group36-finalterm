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

    @PostMapping("/create")
    public ApiResponse<NotificationResponse> createNotification(@RequestBody NotificationRequest request) {
        return ApiResponse.<NotificationResponse>builder()
                .result(notificationService.createNotification(request))
                .build();
    }

    @GetMapping("/getAll/{userId}")
    public ApiResponse<List<NotificationResponse>> getAllNotifications(@PathVariable Long userId) {
        return ApiResponse.<List<NotificationResponse>>builder()
                .result(notificationService.getAllNotifications(userId))
                .build();
    }

    @PutMapping("/read/{id}")
    public ApiResponse<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ApiResponse.<Void>builder()
                .message("Notification marked as read")
                .build();
    }


}
