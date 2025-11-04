package com.coverstar.service;

import com.coverstar.dto.CreateOrUpdateProduct;
import com.coverstar.dto.SearchProductDto;
import com.coverstar.entity.Product;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {

    List<Product> findByNameAndPriceRange(SearchProductDto searchProductDto) throws Exception;

    Product getProductById(String id);

    void deleteProductById(String id) throws Exception;

    Product updateStatus(String id, Boolean type);

    Product createOrUpdate(CreateOrUpdateProduct createOrUpdateProduct) throws Exception;
}