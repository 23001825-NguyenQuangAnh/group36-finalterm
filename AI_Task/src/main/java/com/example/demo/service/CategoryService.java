package com.example.demo.service;

import com.example.demo.dto.request.CategoryRequest;
import com.example.demo.dto.response.CategoryResponse;
import com.example.demo.entity.Category;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.mapper.CategoryMapper;
import com.example.demo.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryResponse createCategory(CategoryRequest categoryRequest) {
        // 1. Kiểm tra tên category đã tồn tại chưa
        if(categoryRepository.existsCategoryByName(categoryRequest.getName())){
            throw new AppException(ErrorCode.CATEGORY_EXISTS);
        }
        // 2. Dùng mapper để chuyển request → entity Category
        Category category = categoryMapper.toCategory(categoryRequest);

        // 3. Lưu vào DB và convert lại sang CategoryResponse để trả về client
        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(categoryMapper::toCategoryResponse)
                .toList();
    }

    public CategoryResponse getCategoryById(Long id) {
        // Tìm category theo ID — nếu không có thì ném lỗi NOT_FOUND
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        return categoryMapper.toCategoryResponse(category);
    }

    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        categoryRepository.deleteById(id);
    }
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        // 1. Lấy category từ DB
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        //  Mapper chỉ map các field khác null
        categoryMapper.updateCategoryFromRequest(request, category);

        Category updated = categoryRepository.save(category);
        return categoryMapper.toCategoryResponse(updated);
    }
}
