package com.coverstar.service.Impl;

import com.coverstar.entity.ProductDetail;
import com.coverstar.repository.ProductDetailRepository;
import com.coverstar.service.ProductDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductDetailServiceImpl implements ProductDetailService {

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Override
    public ProductDetail getProductById(Long productDetailId) {
        return productDetailRepository.findById(productDetailId).orElse(null);
    }
}
