package com.example.demo.mapper;

import com.example.demo.dto.response.AiAnalysisResponse;
import com.example.demo.entity.AiAnalysis;
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public interface AiAnalysisMapper {

    AiAnalysisResponse toResponse(AiAnalysis aiAnalysis);
    AiAnalysis toEntity(AiAnalysisResponse aiAnalysisResponse);
}
