package com.coverstar.service.Impl;

import com.coverstar.constant.Constants;
import com.coverstar.dto.ProductTypeSearchDto;
import com.coverstar.entity.Category;
import com.coverstar.entity.Brand;
import com.coverstar.entity.Product;
import com.coverstar.entity.ProductType;
import com.coverstar.repository.CategoryRepository;
import com.coverstar.repository.BrandRepository;
import com.coverstar.repository.ProductRepository;
import com.coverstar.repository.ProductTypeRepository;
import com.coverstar.service.CategoryService;
import com.coverstar.service.BrandService;
import com.coverstar.service.ProductService;
import com.coverstar.service.ProductTypeService;
import com.coverstar.utils.ShopUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Date;
import java.util.List;

@Service
public class ProductTypeServiceImpl implements ProductTypeService {

    @Autowired
    private ProductTypeRepository productTypeRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private BrandService brandService;

    @Override
    public ProductType createOrUpdateProductType(Long id, String name, MultipartFile imageFile, String description) throws Exception {
        ProductType productType = new ProductType();
        try {
            boolean isNameExist = id == null
                    ? productTypeRepository.existsByName(name)
                    : productTypeRepository.existsByNameAndIdNot(name, id);

            if (isNameExist) {
                throw new Exception(Constants.DUPLICATE_PRODUCT_TYPE);
            }

            if (id != null) {
                productType = productTypeRepository.findById(id).orElse(null);
                assert productType != null;
                productType.setUpdatedDate(new Date());
            } else {
                productType.setCreatedDate(new Date());
                productType.setUpdatedDate(new Date());
            }
            productType.setStatus(true);
            productType.setName(name);
            productType.setDescription(description);
            productType = productTypeRepository.save(productType);

            if (imageFile != null && !imageFile.isEmpty()) {
                if (productType.getDirectoryPath() != null) {
                    File oldFile = new File(productType.getDirectoryPath());
                    if (oldFile.exists()) {
                        oldFile.delete();
                    }
                }
                String fullPath = ShopUtil.handleFileUpload(imageFile, "productType", productType.getId());
                productType.setDirectoryPath(fullPath);
            }
            productTypeRepository.save(productType);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
        return productType;
    }

    @Override
    public List<ProductType> searchProductType(ProductTypeSearchDto productTypeSearchDto) {
        try {
            String name = productTypeSearchDto.getName();
            Boolean status = productTypeSearchDto.getStatus();
            return productTypeRepository.findProductTypesByConditions(name, status);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public ProductType getProductType(Long id) {
        try {
            return productTypeRepository.findByIdAndType(id);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public void deleteProductType(Long id) throws Exception {
        try {

            List<Category> categories = categoryRepository.findAllByProductTypeId(id);
            if (!CollectionUtils.isEmpty(categories)) {
                for (Category category : categories) {
                    categoryService.delete(category.getId());
                }
            }

            List<Brand> brands = brandRepository.findAllByProductTypeId(id);
            if (!CollectionUtils.isEmpty(brands)) {
                for (Brand brand : brands) {
                    brandService.delete(brand.getId());
                }
            }

            ProductType productType = productTypeRepository.findById(id).orElse(null);

            if (productType != null && productType.getDirectoryPath() != null) {
                File oldFile = new File(productType.getDirectoryPath());
                if (oldFile.exists()) {
                    oldFile.delete();
                }
            } else {
                throw new Exception("Product Type not found");
            }

            productTypeRepository.deleteById(id);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public ProductType updateStatus(Long id, boolean status) {
        try {
            List<Product> products = productRepository.findAllByProductTypeId(id);

            if (!CollectionUtils.isEmpty(products)) {
                for (Product product : products) {
                    productService.updateStatus(product.getId(), status);
                }
            }
            ProductType productType = productTypeRepository.findById(id).orElse(null);
            assert productType != null;
            productType.setStatus(status);
            return productTypeRepository.save(productType);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }
}