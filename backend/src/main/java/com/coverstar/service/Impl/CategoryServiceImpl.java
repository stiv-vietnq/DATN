package com.coverstar.service.Impl;

import com.coverstar.constant.Constants;
import com.coverstar.dto.BrandOrCategoryDto;
import com.coverstar.entity.Category;
import com.coverstar.entity.Product;
import com.coverstar.entity.ProductType;
import com.coverstar.repository.CategoryRepository;
import com.coverstar.repository.ProductRepository;
import com.coverstar.service.CategoryService;
import com.coverstar.service.ProductService;
import com.coverstar.service.ProductTypeService;
import com.coverstar.utils.ShopUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Lazy
    @Autowired
    private ProductRepository productRepository;

    @Lazy
    @Autowired
    private ProductService productService;

    @Lazy
    @Autowired
    private ProductTypeService productTypeService;

    @Override
    public Category createOrUpdate(BrandOrCategoryDto brandOrCategoryDto, MultipartFile imageFiles) throws Exception {
        try {
            Category category = new Category();
            if (brandOrCategoryDto.getId() != null) {
                category = categoryRepository.getById(brandOrCategoryDto.getId());
                category.setUpdatedDate(new Date());
            } else {
                ProductType productType = productTypeService.getProductType(brandOrCategoryDto.getProductTypeId());

                if (productType == null) {
                    throw new Exception(Constants.PRODUCT_TYPE_NOT_FOUND);
                }

                if (imageFiles == null || imageFiles.isEmpty()) {
                    throw new Exception(Constants.NOT_IMAGE);
                }

                category.setCreatedDate(new Date());
                category.setUpdatedDate(new Date());
                category.setProductType(productType);
            }
            category.setName(brandOrCategoryDto.getName());
            category.setDescription(brandOrCategoryDto.getDescription());
            category.setStatus(brandOrCategoryDto.getStatus());
            category.setDirectoryPath(null);
            category = categoryRepository.save(category);

            if (imageFiles != null && !imageFiles.isEmpty()) {
                if (category.getDirectoryPath() != null) {
                    File oldFile = new File(category.getDirectoryPath());
                    if (oldFile.exists()) {
                        oldFile.delete();
                    }
                }
                String fullPath = ShopUtil.handleFileUpload(imageFiles, "categories", category.getId());
                category.setDirectoryPath(fullPath);
            }

            return categoryRepository.save(category);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public void delete(Long id) throws Exception {
        try {
            List<Product> products = productRepository.findAllByCategoryId(id);

            if (!CollectionUtils.isEmpty(products)) {
                for (Product product : products) {
                    productService.deleteProductById(product.getId());
                }
            }
            Category category = categoryRepository.getById(id);
            if (category == null) {
                throw new Exception(Constants.CATEGORY_NOT_FOUND);
            }
            categoryRepository.delete(category);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public List<Category> getAllCategory(Long productTypeId, String name, Boolean status, Integer page, Integer size) {
        try {
            String nameValue = name != null ? name : StringUtils.EMPTY;
            Long productTypeIdValue = productTypeId != null ? productTypeId : null;
            Boolean statusValue = status != null ? status : null;
            Pageable pageable = PageRequest.of(page != null ? page : 0, size != null ? size : 10);
            return categoryRepository.findAllByConditions(productTypeIdValue, statusValue, pageable, nameValue);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public Category getCategoryById(Long id) throws Exception {
        try {
            Category category = categoryRepository.getById(id);
            if (category == null) {
                throw new Exception(Constants.CATEGORY_NOT_FOUND);
            }
            return category;
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public List<Category> getCategoryByIds(List<Long> id) throws Exception {
        try {
            List<Category> categories = new ArrayList<>();
            for (Long categoryId : id) {
                Category category = categoryRepository.getById(categoryId);
                if (category == null) {
                    throw new Exception(Constants.CATEGORY_NOT_FOUND);
                }
                categories.add(category);
            }
            return categories;
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }
}
