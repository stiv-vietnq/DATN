package com.coverstar.controller;

import com.coverstar.constant.Constants;
import com.coverstar.dto.BrandOrCategoryDto;
import com.coverstar.entity.Category;
import com.coverstar.service.CategoryService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping("/admin/createOrUpdate")
    public ResponseEntity<?> createOrUpdate(@RequestParam(value = "id", required = false) Long id,
                                            @RequestParam("productTypeId") String productTypeId,
                                            @RequestParam("name") String name,
                                            @RequestParam("status") String status,
                                            @RequestParam("description") String description,
                                            @RequestParam(value = "file", required = false) MultipartFile imageFiles,
                                            @RequestParam(value = "directoryPath", required = false) String directoryPath) {
        try {
            Long productTypeIdLong = null;
            if (StringUtils.isNotEmpty(productTypeId)) {
                productTypeIdLong = Long.parseLong(productTypeId);
            }
            Boolean statusBool = Boolean.parseBoolean(status);
            Category category = categoryService.createOrUpdate(
                    new BrandOrCategoryDto(id, productTypeIdLong, name, statusBool, description, directoryPath), imageFiles);
            return ResponseEntity.ok(category);
        } catch (Exception e) {

            if (e.getMessage().equals(Constants.PRODUCT_TYPE_NOT_FOUND)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Constants.PRODUCT_TYPE_NOT_FOUND);
            }

            if (e.getMessage().equals(Constants.NOT_IMAGE)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Constants.NOT_IMAGE);
            }

            if (e.getMessage().equals(Constants.CATEGORY_NOT_FOUND)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Constants.CATEGORY_NOT_FOUND);
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @GetMapping("/getAllCategory")
    public ResponseEntity<?> getAllCategory(@RequestParam(value = "productTypeId", required = false) String productTypeId,
                                            @RequestParam(value = "name", required = false) String name,
                                            @RequestParam(value = "status", required = false) String status) {
        try {
            Long productTypeIdLong = null;
            if (StringUtils.isNotEmpty(productTypeId)) {
                productTypeIdLong = Long.parseLong(productTypeId);
            }

            Boolean statusBool = null;
            if (StringUtils.isNotEmpty(status)) {
                statusBool = Boolean.parseBoolean(status);
            }
            return ResponseEntity.ok(categoryService.getAllCategory(productTypeIdLong, name, statusBool));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @GetMapping("/getCategoryById/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable("id") Long id) {
        try {
            return ResponseEntity.ok(categoryService.getCategoryById(id));
        } catch (Exception e) {

            if (e.getMessage().equals(Constants.CATEGORY_NOT_FOUND)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Constants.CATEGORY_NOT_FOUND);
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @PostMapping("/admin/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        try {
            categoryService.delete(id);
            return ResponseEntity.ok(HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @PostMapping("/getCategorysByProductTypeId")
    public ResponseEntity<?> getCategorysByProductTypeId(@RequestParam("productTypeId") Long productTypeId) {
        try {
            return ResponseEntity.ok(categoryService.getAllCategory(productTypeId, null, true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }
}
