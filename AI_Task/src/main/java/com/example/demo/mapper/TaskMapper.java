package com.example.demo.mapper;

import com.example.demo.dto.request.TaskRequest;
import com.example.demo.dto.request.UpdateTaskRequest;
import com.example.demo.dto.response.TaskResponse;
import com.example.demo.entity.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface TaskMapper {

    // Khi tạo mới task: FE không truyền categoryId nữa
    @Mapping(target = "category", ignore = true)
    Task toTask(TaskRequest request);

    void updateTaskFromRequest(UpdateTaskRequest request, @MappingTarget Task task);

    // Map Task → TaskResponse
    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")

    // ⭐ Các trường AI map trực tiếp từ Task entity
    @Mapping(source = "urgency", target = "urgency")
    @Mapping(source = "importance", target = "importance")
    @Mapping(source = "priorityScore", target = "priorityScore")

    TaskResponse toTaskResponse(Task task);
}
