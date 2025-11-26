package com.example.demo.mapper;

import com.example.demo.dto.response.NotificationResponse;
import com.example.demo.entity.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.username", target = "username")
    @Mapping(source = "task.id", target = "taskId")
    @Mapping(source = "task.title", target = "taskTitle")
    @Mapping(source = "sentAt", target = "sentAt")
    NotificationResponse toResponse(Notification notification);
}
