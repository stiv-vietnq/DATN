package com.coverstar.controller;

import com.coverstar.constant.Constants;
import com.coverstar.dto.CreateOrUpdateProduct;
import com.coverstar.dto.SearchProductDto;
import com.coverstar.entity.Product;
import com.coverstar.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

//    @PostMapping("/admin/createOrUpdateProduct")
//    public ResponseEntity<?> createOrUpdateProduct(@RequestParam(value = "id", required = false) Long id,
//                                                   @RequestParam("productName") String productName,
//                                                   @RequestParam("productTypeId") Long productTypeId,
//                                                   @RequestParam("size") String size,
//                                                   @RequestParam("price") BigDecimal price,
//                                                   @RequestParam("percentageReduction") Float percentageReduction,
//                                                   @RequestParam(value = "description", required = false) String description,
//                                                   @RequestParam("file") List<MultipartFile> imageFiles,
//                                                   @RequestParam(value = "imageIdsToRemove", required = false) String imageIdsToRemove,
//                                                   @RequestParam MultiValueMap<String, String> productDetailsParams,
//                                                   @RequestParam(value = "productDetailsFiles", required = false) List<MultipartFile> productDetailsFiles,
//                                                   @RequestParam(value = "listProductDetailIdRemove", required = false) String listProductDetailIdRemove,
//                                                   @RequestParam("shippingMethodIds") List<String> shippingMethodIds,
//                                                   @RequestParam("brandId") Long brandId,
//                                                   @RequestParam("categoryId") Long categoryId,
//                                                   @RequestParam("status") Boolean status) {
//        try {
//            Product product = productService.saveOrUpdateProduct(
//                    id,
//                    productName,
//                    productTypeId,
//                    size,
//                    price,
//                    percentageReduction,
//                    description,
//                    imageFiles,
//                    imageIdsToRemove,
//                    productDetailsParams,
//                    productDetailsFiles,
//                    listProductDetailIdRemove,
//                    shippingMethodIds,
//                    brandId,
//                    categoryId,
//                    status);
//            return ResponseEntity.ok(product);
//        } catch (Exception e) {
//            if (Objects.equals(e.getMessage(), "ProductDetail not found")) {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ProductDetail not found");
//            }
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
//        }
//    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> search(@RequestBody @Valid SearchProductDto searchProductDto) {
        try {
            List<Product> products = productService.findByNameAndPriceRange(searchProductDto);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/getProduct/{id}")
    public ResponseEntity<?> getProduct(@PathVariable Long id) {
        try {
            Product product = productService.getProductById(id);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @PostMapping("/admin/deleteProduct/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
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
    public ResponseEntity<?> updateStatus(@RequestParam("id") Long id,
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
}