package com.coverstar.controller;

import com.coverstar.constant.Constants;
import com.coverstar.dto.ProductTypeSearchDto;
import com.coverstar.entity.Product;
import com.coverstar.entity.ProductType;
import com.coverstar.service.ProductTypeService;
import org.apache.commons.lang3.StringUtils;
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
    public ResponseEntity<?> createOrUpdateProductType(@RequestParam(value = "id", required = false) String id,
                                                       @RequestParam("code") String code,
                                                       @RequestParam("name") String name,
                                                       @RequestParam(value = "file", required = false) MultipartFile imageFiles,
                                                       @RequestParam("description") String description,
                                                       @RequestParam(value = "directoryPath", required = false) String directoryPath) {
        try {
            Long longId = null;
            if (StringUtils.isNotEmpty(id)) {
                longId = Long.parseLong(id);
            }
            ProductType productType = productTypeService.createOrUpdateProductType(longId, code, name, imageFiles, description, directoryPath);
            return ResponseEntity.ok(productType);
        } catch (Exception e) {

            if (e.getMessage().equals(Constants.DUPLICATE_PRODUCT_TYPE)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Constants.DUPLICATE_PRODUCT_TYPE);
            }

            if (e.getMessage().equals(Constants.DUPLICATE_PRODUCT_TYPE_CODE)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Constants.DUPLICATE_PRODUCT_TYPE_CODE);
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProductType(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String status) {
        try {
            Boolean statusBool = null;
            if (StringUtils.isNotEmpty(status)) {
                statusBool = Boolean.parseBoolean(status);
            }
            ProductTypeSearchDto productTypeSearchDto = new ProductTypeSearchDto(name, statusBool);
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

    @GetMapping("/getAllProductTypesByStatus")
    public ResponseEntity<?> getAllProductTypesByStatus(@RequestParam(value = "status", required = false) String status) {
        try {
            Boolean statusBool = null;
            if (StringUtils.isNotEmpty(status)) {
                statusBool = Boolean.parseBoolean(status);
            }
            List<ProductType> productTypes = productTypeService.getAllProductTypesByStatus(statusBool);
            return ResponseEntity.ok(productTypes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @GetMapping("/getProductsByProductTypeId/{id}")
    public ResponseEntity<?> getProductsByProductTypeId(@PathVariable Long id) {
        try {
            List<Product> products = productTypeService.getProductsByProductTypeId(id);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }
}