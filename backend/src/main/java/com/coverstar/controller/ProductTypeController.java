package com.coverstar.controller;

import com.coverstar.constant.Constants;
import com.coverstar.dto.ProductTypeSearchDto;
import com.coverstar.entity.ProductType;
import com.coverstar.service.ProductTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/productTypes")
public class ProductTypeController {

    @Autowired
    private ProductTypeService productTypeService;

    @PostMapping("/admin/createOrUpdateProductType")
    public ResponseEntity<?> createOrUpdateProductType(@RequestParam(value = "id", required = false) Long id,
                                                       @RequestParam("name") String name,
                                                       @RequestParam("file") MultipartFile imageFiles,
                                                       @RequestParam("description") String description) {
        try {
            ProductType productType = productTypeService.createOrUpdateProductType(id, name, imageFiles, description);
            return ResponseEntity.ok(productType);
        } catch (Exception e) {
            if (e.getMessage().equals(Constants.DUPLICATE_PRODUCT_TYPE)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Constants.DUPLICATE_PRODUCT_TYPE);
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProductType(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Boolean status) {
        try {
            ProductTypeSearchDto productTypeSearchDto = new ProductTypeSearchDto(name, status);
            List<ProductType> productTypes = productTypeService.searchProductType(productTypeSearchDto);
            return ResponseEntity.ok(productTypes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @GetMapping("/getProductType/{id}")
    public ResponseEntity<?> getProductType(@PathVariable Long id) {
        try {
            ProductType productType = productTypeService.getProductType(id);
            return ResponseEntity.ok(productType);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @PostMapping("/admin/deleteProductType/{id}")
    public ResponseEntity<?> deleteProductType(@PathVariable Long id) {
        try {
            productTypeService.deleteProductType(id);
            return ResponseEntity.ok(HttpStatus.OK);
        } catch (Exception e) {
            if (e.getMessage().equals("Product Type not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product Type not found");
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @PostMapping("/admin/updateStatus")
    public ResponseEntity<?> updateStatus(@RequestParam("id") Long id,
                                          @RequestParam("status") boolean status) {
        try {
            ProductType productType = productTypeService.updateStatus(id, status);
            return ResponseEntity.ok(productType);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }
}