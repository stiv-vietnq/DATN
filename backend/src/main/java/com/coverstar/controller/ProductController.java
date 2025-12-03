package com.coverstar.controller;

import com.coverstar.constant.Constants;
import com.coverstar.dto.CreateOrUpdateProduct;
import com.coverstar.dto.ProductSearchDto;
import com.coverstar.dto.SearchProductDto;
import com.coverstar.entity.Product;
import com.coverstar.service.ProductService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/search")
    public ResponseEntity<List<ProductSearchDto>> search(
            @RequestParam(required = false) Long productTypeId,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String minPrice,
            @RequestParam(required = false) String maxPrice,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) String orderBy,
            @RequestParam(required = false) String priceOrder,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String quantitySold,
            @RequestParam(required = false) String numberOfVisits,
            @RequestParam(required = false) String evaluate) {
        try {
            List<Long> categoryIds = null;
            if (StringUtils.isNotEmpty(categoryId)) {
                categoryIds = Arrays.stream(categoryId.split(","))
                        .map(String::trim)
                        .map(Long::parseLong).collect(Collectors.toList());
            }
            Boolean statusValue = null;
            if (StringUtils.isNotEmpty(status)) {
                if ("true".equalsIgnoreCase(status)) {
                    statusValue = true;
                } else if ("false".equalsIgnoreCase(status)) {
                    statusValue = false;
                }
            }
            SearchProductDto searchProductDto = new SearchProductDto();
            searchProductDto.setProductTypeId(productTypeId);
            searchProductDto.setName(name);
            searchProductDto.setMinPrice(minPrice);
            searchProductDto.setMaxPrice(maxPrice);
            searchProductDto.setStatus(statusValue);
            searchProductDto.setCategoryId(categoryIds);
            searchProductDto.setOrderBy(orderBy);
            searchProductDto.setPriceOrder(priceOrder);
            searchProductDto.setPage(page);
            searchProductDto.setSize(size);
            searchProductDto.setQuantitySold(quantitySold);
            searchProductDto.setNumberOfVisits(numberOfVisits);
            searchProductDto.setEvaluate(evaluate);
            List<ProductSearchDto> products = productService.findByNameAndPriceRange(searchProductDto);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/getProduct/{id}")
    public ResponseEntity<?> getProduct(@PathVariable String id) {
        try {
            Product product = productService.getProductById(id);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @PostMapping("/admin/deleteProduct/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable String id) {
        try {
            productService.deleteProductById(id);
            return ResponseEntity.ok(HttpStatus.OK);
        } catch (Exception e) {
            if (Objects.equals(e.getMessage(), "Product not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @PostMapping("/admin/updateStatus")
    public ResponseEntity<?> updateStatus(@RequestParam("id") String id,
                                          @RequestParam("type") Boolean type) {
        try {
            Product product = productService.updateStatus(id, type);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @PostMapping(value = "/admin/createOrUpdate", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadMultipleImages(@ModelAttribute CreateOrUpdateProduct createOrUpdateProduct) {
        try {
            Product product = productService.createOrUpdate(createOrUpdateProduct);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return switch (e.getMessage()) {
                case Constants.NOT_IMAGE,
                        Constants.PRODUCT_TYPE_NOT_FOUND,
                        Constants.PRODUCT_DETAIL_NOT_FOUND ->
                        ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
                default -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
            };
        }
    }

    @GetMapping("/getDiscountedPrice/{id}")
    public ResponseEntity<?> getDiscountedPrice(@PathVariable String id) {
        try {
            BigDecimal discountedPrice = productService.getDiscountedPrice(id);
            return ResponseEntity.ok(discountedPrice);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }
}