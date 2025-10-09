package com.coverstar.service.Impl;

import com.coverstar.constant.Constants;
import com.coverstar.dto.BrandOrCategoryDto;
import com.coverstar.entity.Brand;
import com.coverstar.entity.Product;
import com.coverstar.entity.ProductType;
import com.coverstar.repository.BrandRepository;
import com.coverstar.repository.ProductRepository;
import com.coverstar.service.BrandService;
import com.coverstar.service.ProductService;
import com.coverstar.service.ProductTypeService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.Date;
import java.util.List;

@Service
public class BrandServiceImpl implements BrandService {

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @Lazy
    @Autowired
    private ProductTypeService productTypeService;

    @Override
    public Brand createOrUpdate(BrandOrCategoryDto categoryDto) throws Exception {
        try {
            Brand brand = new Brand();
            if (categoryDto.getId() != null) {
                brand = brandRepository.getById(categoryDto.getId());
                brand.setUpdatedDate(new Date());
            } else {
                brand.setCreatedDate(new Date());
                brand.setUpdatedDate(new Date());
                ProductType productType = productTypeService.getProductType(categoryDto.getProductTypeId());
                if (productType == null) {
                    throw new Exception(Constants.PRODUCT_TYPE_NOT_FOUND);
                }
                brand.setProductType(productType);
            }
            brand.setName(categoryDto.getName());
            brand.setDescription(categoryDto.getDescription());
            brand.setStatus(categoryDto.getStatus());
            return brandRepository.save(brand);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public void delete(Long id) throws Exception {
        try {
            List<Product> products = productRepository.findAllByBrandId(id);

            if (!CollectionUtils.isEmpty(products)) {
                for (Product product : products) {
                    productService.deleteProductById(product.getId());
                }
            }

            Brand brand = brandRepository.getById(id);
            if (brand == null) {
                throw new Exception(Constants.CATEGORY_NOT_FOUND);
            }
            brandRepository.delete(brand);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public List<Brand> getAllBrand(String name, Boolean status, Long productTypeId) {
        try {
            String nameValue = name != null ? name : StringUtils.EMPTY;
            Boolean statusValue = status != null ? status : null;
            Long productTypeIdValue = productTypeId != null ? productTypeId : null;
            return brandRepository.findAllByConditions(nameValue, statusValue, productTypeIdValue);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public Brand getBrandById(Long id) throws Exception {
        try {
            Brand brand = brandRepository.getById(id);
            if (brand == null) {
                throw new Exception(Constants.CATEGORY_NOT_FOUND);
            }
            return brand;
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }
}
