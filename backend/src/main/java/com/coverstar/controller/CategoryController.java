package com.coverstar.controller;

import com.coverstar.constant.Constants;
import com.coverstar.dto.BrandOrCategoryDto;
import com.coverstar.entity.Category;
import com.coverstar.service.CategoryService;
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
                                            @RequestParam("productTypeId") Long productTypeId,
                                            @RequestParam("name") String name,
                                            @RequestParam("status") Boolean status,
                                            @RequestParam("description") String description,
                                            @RequestParam(value = "file", required = false) MultipartFile imageFiles) {
        try {
            Category category = categoryService.createOrUpdate(
                    new BrandOrCategoryDto(id, productTypeId, name, status, description), imageFiles);
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
    public ResponseEntity<?> getAllCategory(@RequestParam(value = "productTypeId", required = false) Long productTypeId,
                                         @RequestParam(value = "name", required = false) String name,
                                         @RequestParam(value = "status", required = false) Boolean status,
                                         @RequestParam(value = "page", required = false) Integer page,
                                         @RequestParam(value = "size", required = false) Integer size) {
        try {
            return ResponseEntity.ok(categoryService.getAllCategory(productTypeId, name, status, page, size));
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
}
