package com.coverstar.controller;

import com.coverstar.constant.Constants;
import com.coverstar.dto.BrandOrCategoryDto;
import com.coverstar.entity.Brand;
import com.coverstar.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/brands")
public class BrandController {

    @Autowired
    private BrandService brandService;

    @PostMapping("/admin/createOrUpdate")
    public ResponseEntity<?> createOrUpdate(@RequestBody @Valid BrandOrCategoryDto categoryDto, BindingResult bindingResult) {
        try {

            if (bindingResult.hasErrors()) {
                List<String> errors = bindingResult.getFieldErrors().stream()
                        .map(error -> error.getField() + ": " + error.getDefaultMessage())
                        .collect(Collectors.toList());
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            Brand brand = brandService.createOrUpdate(categoryDto);
            return ResponseEntity.ok(brand);
        } catch (Exception e) {

            if (e.getMessage().equals(Constants.PRODUCT_TYPE_NOT_FOUND)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Constants.PRODUCT_TYPE_NOT_FOUND);
            }

            if (e.getMessage().equals(Constants.BRAND_NOT_FOUND)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Constants.BRAND_NOT_FOUND);
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @PostMapping("/admin/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        try {
            brandService.delete(id);
            return ResponseEntity.ok(HttpStatus.OK);
        } catch (Exception e) {
            if (e.getMessage().equals(Constants.BRAND_NOT_FOUND)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Constants.BRAND_NOT_FOUND);
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @GetMapping("/getAllBrand")
    public ResponseEntity<?> getAllBrand(@RequestParam(value = "name", required = false) String name,
                                            @RequestParam(value = "productTypeId", required = false) Long productTypeId,
                                            @RequestParam(value = "status", required = false) Boolean status) {
        try {
            return ResponseEntity.ok(brandService.getAllBrand(name, status, productTypeId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @GetMapping("/getBrandById/{id}")
    public ResponseEntity<?> getBrandById(@PathVariable("id") Long id) {
        try {
            return ResponseEntity.ok(brandService.getBrandById(id));
        } catch (Exception e) {
            if (e.getMessage().equals(Constants.BRAND_NOT_FOUND)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Constants.BRAND_NOT_FOUND);
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }
}
