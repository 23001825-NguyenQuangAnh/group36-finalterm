package com.example.demo.mapper;

import com.example.demo.dto.request.TaskRequest;
import com.example.demo.dto.request.UpdateTaskRequest;
import com.example.demo.dto.response.TaskResponse;
import com.example.demo.entity.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface TaskMapper {
    @Mapping(source = "categoryId", target = "category.id")
    Task toTask(TaskRequest request);

    void updateTaskFromRequest(UpdateTaskRequest request, @MappingTarget Task task);

    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")
    TaskResponse toTaskResponse(Task task);
}
