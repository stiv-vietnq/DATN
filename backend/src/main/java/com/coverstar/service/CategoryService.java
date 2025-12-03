package com.coverstar.service;

import com.coverstar.dto.BrandOrCategoryDto;
import com.coverstar.entity.Category;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CategoryService {
    Category createOrUpdate(BrandOrCategoryDto brandOrCategoryDto, MultipartFile imageFiles) throws Exception;

    void delete(Long id) throws Exception;

    List<Category> getAllCategory(Long productTypeId, String name, Boolean status);

    Category getCategoryById(Long id) throws Exception;

    List<Category> getCategoryByIds(List<Long> ids) throws Exception;
}
