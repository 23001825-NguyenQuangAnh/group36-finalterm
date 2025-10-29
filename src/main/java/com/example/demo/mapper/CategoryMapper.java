package com.example.demo.mapper;

import com.example.demo.dto.request.CategoryRequest;
import com.example.demo.dto.response.CategoryResponse;
import com.example.demo.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CategoryMapper {
    Category toCategory(CategoryRequest request);

    @Mapping(target = "taskCount", expression = "java(category.getTasks() != null ? (long) category.getTasks().size() : 0L)")
    CategoryResponse toCategoryResponse(Category category);

    void updateCategoryFromRequest(CategoryRequest request, @MappingTarget Category category);
}
