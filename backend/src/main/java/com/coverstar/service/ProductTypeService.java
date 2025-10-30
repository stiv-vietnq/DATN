package com.coverstar.service;

import com.coverstar.dto.ProductTypeSearchDto;
import com.coverstar.entity.ProductType;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductTypeService {
    ProductType createOrUpdateProductType(Long id,
                                          String name,
                                          MultipartFile imageFiles,
                                          String description,
                                          String directoryPath) throws Exception;

    List<ProductType> searchProductType(ProductTypeSearchDto productTypeSearchDto);

    ProductType getProductType(Long id);

    void deleteProductType(Long id) throws Exception;

    ProductType updateStatus(Long id, boolean status);

    List<ProductType> getAllProductTypesByStatus(Boolean status);
}