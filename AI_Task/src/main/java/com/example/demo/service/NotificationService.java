package com.example.demo.service;

import com.example.demo.dto.request.NotificationRequest;
import com.example.demo.dto.response.NotificationResponse;
import com.example.demo.entity.Notification;
import com.example.demo.entity.Task;
import com.example.demo.entity.User;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.mapper.NotificationMapper;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.repository.TaskRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    public NotificationResponse createNotification(NotificationRequest notificationRequest) {
        User user = userRepository.findById(notificationRequest.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Task task = null;
        if(notificationRequest.getTaskId() != null) {
            task = taskRepository.findById(notificationRequest.getTaskId())
                    .orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_FOUND));
        }

        Notification notification = Notification.builder()
                .message(notificationRequest.getMessage())
                .user(user)
                .task(task)
                .sentAt(LocalDateTime.now())
                .isRead(false)
                .build();

        return notificationMapper.toResponse(notificationRepository.save(notification));
    }

    public List<NotificationResponse> getAllNotifications(Long userId) {
        // Kiểm tra user tồn tại
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Lấy danh sách thông báo của user, sắp xếp theo thời gian
        return notificationRepository.findByUserOrderBySentAtDesc(user)
                .stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    // Đánh dấu thông báo đã đọc
    public void markAsRead(Long id) {
        // 1. Lấy thông báo theo ID
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));

        // 2. Update trạng thái đã đọc
        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());

        notificationRepository.save(notification);
    }

    // TẠO NOTIFICATION NHANH CHO TASK
    public NotificationResponse createTaskNotification(Long userId, Long taskId, String message) {
        // Khởi tạo request (giúp tái sử dụng createNotification)
        NotificationRequest request = new NotificationRequest();
        request.setUserId(userId);
        request.setTaskId(taskId);
        request.setMessage(message);

        return createNotification(request);
    }

    // 🟦 TEMPLATE — Task sắp đến hạn
    public String upcomingDeadlineMessage(Task task) {
        return "⏳ Task \"" + task.getTitle() + "\" chỉ còn 1 ngày nữa là đến hạn!\n"
                + "📅 Deadline: " + task.getDeadline().toLocalDate();
    }

    // 🟦 TEMPLATE — Task quá hạn
    public String overdueMessage(Task task) {
        return "⚠️ Task \"" + task.getTitle() + "\" đã quá hạn từ ngày "
                + task.getDeadline().toLocalDate() + ".";
    }

}
