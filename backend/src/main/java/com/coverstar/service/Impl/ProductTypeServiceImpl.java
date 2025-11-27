package com.coverstar.service.Impl;

import com.coverstar.constant.Constants;
import com.coverstar.dto.ProductTypeSearchDto;
import com.coverstar.entity.Category;
import com.coverstar.entity.Image;
import com.coverstar.entity.Product;
import com.coverstar.entity.ProductType;
import com.coverstar.repository.CategoryRepository;
import com.coverstar.repository.ProductRepository;
import com.coverstar.repository.ProductTypeRepository;
import com.coverstar.service.CategoryService;
import com.coverstar.service.ProductService;
import com.coverstar.service.ProductTypeService;
import com.coverstar.utils.ShopUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
    private CategoryService categoryService;

    @Value("${image.directory}")
    private String imageDirectory;

    @Value("${server.port}")
    private String serverPort;

    private final static String IMAGE_BASE_URL = "/images/";
    private final static String SERVER_PORT = "http://localhost:";

    @Override
    public ProductType createOrUpdateProductType(Long id,
                                                 String code,
                                                 String name,
                                                 MultipartFile imageFile,
                                                 String description,
                                                 String directoryPath) throws Exception {
        ProductType productType = new ProductType();
        try {
            if (id != null) {
                productType = productTypeRepository.findById(id).orElse(null);
                assert productType != null;
                productType.setUpdatedDate(new Date());
            } else {
                boolean isNameExist = productTypeRepository.existsByName(name);
                boolean isCodeExist = productTypeRepository.existsByCode(code);

                if (isNameExist) {
                    throw new Exception(Constants.DUPLICATE_PRODUCT_TYPE);
                }

                if (isCodeExist) {
                    throw new Exception(Constants.DUPLICATE_PRODUCT_TYPE_CODE);
                }
                productType.setCode(code);
                productType.setCreatedDate(new Date());
                productType.setUpdatedDate(new Date());
                productType.setStatus(true);
            }
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

            } else if (directoryPath != null && !directoryPath.isEmpty()) {
                productType.setDirectoryPath(directoryPath);
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
            ProductType productType = productTypeRepository.findById(id).orElse(null);
//            if (productType != null) {
//                String relativePath = productType.getDirectoryPath();
//
//                if (relativePath != null && relativePath.startsWith(imageDirectory)) {
//                    relativePath = relativePath.replace(imageDirectory, SERVER_PORT + serverPort + IMAGE_BASE_URL);
//                    productType.setDirectoryPath(relativePath);
//                }
//            }
            return productType;
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

    @Override
    public List<ProductType> getAllProductTypesByStatus(Boolean status) {
        try {
            List<ProductType> productTypes = productTypeRepository.findProductTypesByStatus(status);
            if (!CollectionUtils.isEmpty(productTypes)) {
                for (ProductType productType : productTypes) {
                    String relativePath = productType.getDirectoryPath();

                    if (relativePath != null && relativePath.startsWith(imageDirectory)) {
                        relativePath = relativePath.replace(imageDirectory, SERVER_PORT + serverPort + IMAGE_BASE_URL);
                        productType.setDirectoryPath(relativePath);
                    }
                }
            }
            return productTypes;
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public List<Product> getProductsByProductTypeId(Long id) {
        try {
            List<Product> products = productRepository.findAllByProductTypeIdAndNumberOfVisits(id, PageRequest.of(0, 30));

            for (Product product : products) {
                Set<Image> images = new HashSet<>();
                if (!CollectionUtils.isEmpty(product.getImages())) {
                    for (Image image : product.getImages()) {

                        if (image.getCommentId() != null) {
                            continue;
                        }

                        String relativePath = image.getDirectoryPath();

                        if (relativePath != null && relativePath.startsWith(imageDirectory)) {
                            relativePath = relativePath.replace(imageDirectory, SERVER_PORT + serverPort + IMAGE_BASE_URL);
                            image.setDirectoryPath(relativePath);
                        }
                        images.add(image);
                    }
                    product.setImages(images);
                }
            }

            return products;
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }
}