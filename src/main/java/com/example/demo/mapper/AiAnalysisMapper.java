package com.example.demo.mapper;

import com.example.demo.dto.request.AiAnalysisRequest;
import com.example.demo.dto.response.AiAnalysisResponse;
import com.example.demo.entity.AiAnalysis;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface AiAnalysisMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "task", ignore = true)
    AiAnalysis toEntity(AiAnalysisRequest request);

    @Mapping(target = "taskId", source = "task.id")
    AiAnalysisResponse toResponse(AiAnalysis entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "task", ignore = true)
    void updateEntityFromRequest(AiAnalysisRequest request, @MappingTarget AiAnalysis entity);
}
