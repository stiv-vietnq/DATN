package com.coverstar.service.Impl;

import com.coverstar.constant.Constants;
import com.coverstar.dto.CreateOrUpdateProduct;
import com.coverstar.dto.ProductDetailDTO;
import com.coverstar.dto.SearchProductDto;
import com.coverstar.entity.*;
import com.coverstar.repository.*;
import com.coverstar.service.CategoryService;
import com.coverstar.service.ProductService;
import com.coverstar.service.ProductTypeService;
import com.coverstar.utils.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Value("${image.directory}")
    private String imageDirectory;

    @Autowired
    private ProductDetailRepository productDetailRepository;

//    @Autowired
//    private ShippingMethodRepository shippingMethodRepository;

    @Lazy
    @Autowired
    private CategoryService categoryService;

    @Lazy
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserVisitRepository userVisitRepository;

    @Lazy
    @Autowired
    private ProductTypeService productTypeService;

//    @Override
//    public Product saveOrUpdateProduct(Long id,
//                                       String productName,
//                                       Long productTypeId,
//                                       String size,
//                                       BigDecimal price,
//                                       Float percentageReduction,
//                                       String description,
//                                       List<MultipartFile> imageFiles,
//                                       String imageIdsToRemove,
//                                       MultiValueMap<String, String> productDetailsParams,
//                                       List<MultipartFile> productDetailsFiles,
//                                       String listProductDetailIdRemove,
//                                       List<String> shippingMethodIds,
//                                       Long brandId,
//                                       Long categoryId,
//                                       Boolean status) throws Exception {
//        try {
//
//            List<ProductDetailDTO> productDetails = new ArrayList<>();
//            int i = 0;
//            while (productDetailsParams.containsKey("productDetails[" + i + "].nameDT")) {
//                Long idDT = null;
//                if (StringUtils.isNotEmpty(productDetailsParams.getFirst("productDetails[" + i + "].idDT"))) {
//                    idDT = Long.valueOf(Objects.requireNonNull(productDetailsParams.getFirst("productDetails[" + i + "].idDT")));
//                }
//                String name = productDetailsParams.getFirst("productDetails[" + i + "].nameDT");
//                Long quantity = Long.valueOf(Objects.requireNonNull(productDetailsParams.getFirst("productDetails[" + i + "].quantityDT")));
//                BigDecimal priceDT = new BigDecimal(Objects.requireNonNull(productDetailsParams.getFirst("productDetails[" + i + "].priceDT")));
//                Float percentageReductionDT = Float.valueOf(Objects.requireNonNull(productDetailsParams.getFirst("productDetails[" + i + "].percentageReductionDT")));
//                MultipartFile imageFile = (productDetailsFiles != null && productDetailsFiles.size() > i) ? productDetailsFiles.get(i) : null;
//                String descriptionDT = productDetailsParams.getFirst("productDetails[" + i + "].descriptionDT");
//                Integer type = Integer.valueOf(Objects.requireNonNull(productDetailsParams.getFirst("productDetails[" + i + "].typeDT")));
//
//                ProductDetailDTO productDetailDTO = new ProductDetailDTO(idDT, name, quantity, priceDT,
//                        percentageReductionDT, imageFile, descriptionDT, type);
//                productDetails.add(productDetailDTO);
//                i++;
//            }
//
//            Product product = new Product();
//            if (id != null) {
//                product = productRepository.getProductById(id);
//                product.setUpdatedDate(new Date());
//            } else {
//                if (!FileUtils.isValidFileList(imageFiles)) {
//                    throw new Exception(Constants.NOT_IMAGE);
//                }
//                product.setCreatedDate(new Date());
//                product.setUpdatedDate(new Date());
//                product.setStatus(true);
//            }
//            product.setProductName(productName);
//            ProductType productType = productTypeService.getProductType(productTypeId);
//            if (productType == null) {
//                throw new Exception(Constants.PRODUCT_TYPE_NOT_FOUND);
//            }
//            product.setProductType(productType);
//            product.setSize(size);
//            product.setPrice(price);
//            product.setPercentageReduction(percentageReduction);
//            product.setBrandId(brandId);
//            product.setCategoryId(categoryId);
//            product.setStatus(status);
//
//            List<ShippingMethod> shippingMethods = shippingMethodRepository.findAllById(
//                    shippingMethodIds.stream().map(Long::parseLong).collect(Collectors.toList())
//            );
//            product.setShippingMethods(new HashSet<>(shippingMethods));
//            product.setDescription(description);
//            if (StringUtils.isNotEmpty(imageIdsToRemove)) {
//                List<Long> imageIdsToRemoveDT = Arrays.stream(imageIdsToRemove.split(","))
//                        .map(Long::parseLong)
//                        .collect(Collectors.toList());
//                if (!imageIdsToRemoveDT.isEmpty()) {
//                    for (Long imageId : imageIdsToRemoveDT) {
//                        Image image = imageRepository.findImageById(imageId);
//                        File file = new File(image.getDirectoryPath());
//                        if (file.exists()) {
//                            file.delete();
//                        }
//                        imageRepository.deleteById(imageId);
//                    }
//                }
//            }
//            product = productRepository.save(product);
//            saveProductDetails(product, productDetails, listProductDetailIdRemove);
//            return saveImageProduct(imageFiles, product);
//        } catch (Exception e) {
//            e.fillInStackTrace();
//            throw e;
//        }
//    }

    private Product saveImageProduct(List<MultipartFile> imageFiles, Product product) throws Exception {
        try {
            if (imageFiles != null && !imageFiles.isEmpty()) {
                Set<Image> images = new HashSet<>();
                for (MultipartFile file : imageFiles) {
                    String filePath = imageDirectory + "products" + File.separator + product.getId();
                    File directory = new File(filePath);
                    if (!directory.exists()) {
                        directory.mkdirs();
                    }
                    String fullPath = filePath + File.separator + file.getOriginalFilename();
                    file.transferTo(new File(fullPath));

                    Image image = new Image();
                    image.setProductId(product.getId());
                    image.setDirectoryPath(fullPath);
                    image.setType(Integer.valueOf(Constants.Number.ONE));
                    images.add(image);
                }
                product.setImages(images);
            }
            return productRepository.save(product);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    private void saveProductDetails(Product product, List<ProductDetailDTO> productDetailDTOs, String listProductDetailIdRemove) throws Exception {

        if (StringUtils.isNotEmpty(listProductDetailIdRemove)) {
            List<Long> productDetailIdRemove = Arrays.stream(listProductDetailIdRemove.split(","))
                    .map(Long::parseLong)
                    .collect(Collectors.toList());
            for (Long id : productDetailIdRemove) {
                ProductDetail productDetail = productDetailRepository.findById(id)
                        .orElseThrow(() -> new Exception(Constants.PRODUCT_DETAIL_NOT_FOUND));
                File file = new File(productDetail.getDirectoryPath());
                if (file.exists()) {
                    file.delete();
                }
                productDetailRepository.deleteById(id);
            }
        }

        for (ProductDetailDTO productDetailDTO : productDetailDTOs) {
            ProductDetail productDetail;

            if (productDetailDTO.getId() != null) {
                productDetail = productDetailRepository.findById(productDetailDTO.getId())
                        .orElseThrow(() -> new Exception(Constants.PRODUCT_DETAIL_NOT_FOUND));
                productDetail.setUpdatedDate(new Date());
            } else {
                productDetail = new ProductDetail();
                productDetail.setCreatedDate(new Date());
                productDetail.setUpdatedDate(new Date());
            }

            productDetail.setProductId(product.getId());
            productDetail.setName(productDetailDTO.getName());
            productDetail.setQuantity(productDetailDTO.getQuantity());
            productDetail.setPrice(productDetailDTO.getPrice());
            productDetail.setPercentageReduction(productDetailDTO.getPercentageReduction());
            productDetail.setDescription(productDetailDTO.getDescription());
            productDetail.setType(productDetailDTO.getType());

            productDetail = productDetailRepository.save(productDetail);

            if (productDetailDTO.getImageFile() != null && !productDetailDTO.getImageFile().isEmpty()) {
                if (productDetailDTO.getId() != null) {
                    File file = new File(productDetail.getDirectoryPath());
                    if (file.exists()) {
                        file.delete();
                    }
                }
                String imagePath = saveImage(productDetailDTO.getImageFile(), productDetail.getId());
                productDetail.setDirectoryPath(imagePath);
                productDetailRepository.save(productDetail);
            }
        }
    }

    private String saveImage(MultipartFile imageFile, Long productDetailId) throws Exception {
        String filePath = imageDirectory + "productDetail" + File.separator + productDetailId;
        File directory = new File(filePath);
        if (!directory.exists()) {
            directory.mkdirs();
        }
        String fullPath = filePath + File.separator + imageFile.getOriginalFilename();
        imageFile.transferTo(new File(fullPath));
        return fullPath;
    }


    @Override
    public List<Product> findByNameAndPriceRange(SearchProductDto searchProductDto) throws Exception {
        try {
            UserVisits userVisits = userVisitRepository.findByVisitDate(new Date(), 3);
            if (userVisits == null) {
                userVisits = new UserVisits();
                userVisits.setVisitDate(new Date());
                userVisits.setVisitCount(1L);
                userVisits.setType(3);
                userVisitRepository.save(userVisits);
            } else {
                userVisits.setVisitCount(userVisits.getVisitCount() + 1);
                userVisitRepository.save(userVisits);
            }
            String nameValue = searchProductDto.getName() != null ? searchProductDto.getName() : StringUtils.EMPTY;
            BigDecimal minPriceValue = searchProductDto.getMinPrice() != null ? searchProductDto.getMinPrice() : BigDecimal.ZERO;
            BigDecimal maxPriceValue = searchProductDto.getMaxPrice() != null ? searchProductDto.getMaxPrice() : BigDecimal.valueOf(Double.MAX_VALUE);
            Long productTypeId = searchProductDto.getProductTypeId() != null ? searchProductDto.getProductTypeId() : 0L;
            if (searchProductDto.getCategoryId() != null) {
                Category category = categoryService.getCategoryById(searchProductDto.getCategoryId());
                long numberOfVisits;
                if (category.getNumberOfVisits() == null) {
                    numberOfVisits = 1L;
                } else {
                    numberOfVisits = category.getNumberOfVisits() + 1;
                }
                category.setNumberOfVisits(numberOfVisits);
                categoryRepository.save(category);
            }
            Long categoryId = searchProductDto.getCategoryId() != null ? searchProductDto.getCategoryId() : 0L;
//            List<Long> shippingMethodIds = searchProductDto.getShippingMethodIds().stream()
//                    .map(Long::parseLong)
//                    .collect(Collectors.toList());
            Boolean status = searchProductDto.getStatus() != null ? searchProductDto.getStatus() : null;
            String orderBy = searchProductDto.getOrderBy() != null ? searchProductDto.getOrderBy() : Constants.DESC;
            String priceOrder = searchProductDto.getPriceOrder() != null ? searchProductDto.getPriceOrder() : Constants.DESC;
            String quantitySold = searchProductDto.getQuantitySold() != null ? searchProductDto.getQuantitySold() : Constants.DESC;
            String numberOfVisits = searchProductDto.getNumberOfVisits() != null ? searchProductDto.getNumberOfVisits() : Constants.DESC;
            Float evaluate = searchProductDto.getEvaluate() != null ? Float.valueOf(searchProductDto.getEvaluate()) : null;

            Sort.Order priceSort = Constants.ASC.equalsIgnoreCase(priceOrder) ?
                    Sort.Order.asc(Constants.PRICE) : Sort.Order.desc(Constants.PRICE);

            Sort.Order dateSort = Constants.ASC.equalsIgnoreCase(orderBy) ?
                    Sort.Order.asc(Constants.CREATED_DATE) : Sort.Order.desc(Constants.CREATED_DATE);

            Sort.Order quantitySort = Constants.ASC.equalsIgnoreCase(quantitySold) ?
                    Sort.Order.asc(Constants.QUANTITY_SOLD) : Sort.Order.desc(Constants.QUANTITY_SOLD);

            Sort.Order numberOfVisitsSort = Constants.ASC.equalsIgnoreCase(numberOfVisits) ?
                    Sort.Order.asc(Constants.NUMBER_OF_VISITS) : Sort.Order.desc(Constants.NUMBER_OF_VISITS);

            Sort sort = Sort.by(priceSort, dateSort, quantitySort, numberOfVisitsSort);

            Pageable pageable = PageRequest.of(searchProductDto.getPage(), searchProductDto.getSize(), sort);
            return productRepository.findByNameContainingAndPriceBetweenWithDetails(productTypeId, nameValue,
                    minPriceValue, maxPriceValue, categoryId
//                    , shippingMethodIds
                    , status, evaluate, pageable);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public Product getProductById(Long id) {
        try {
            Product product = productRepository.getProductById(id);
            Set<Comment> comments = commentRepository.findCommentById(id);
            if (CollectionUtils.isEmpty(comments)) {
                comments = new HashSet<>();
            }
            product.setComments(comments);

            long numberOfVisits;
            if (product.getNumberOfVisits() == null) {
                numberOfVisits = 1L;
            } else {
                numberOfVisits = product.getNumberOfVisits() + 1;
            }
            product.setNumberOfVisits(numberOfVisits);
            productRepository.save(product);
            return product;
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public void deleteProductById(Long id) throws Exception {
        try {
            Product product = productRepository.getProductById(id);
            if (product == null) {
                throw new Exception("Product not found");
            }
            Set<Comment> commentLasts = commentRepository.findCommentById(id);
            if (CollectionUtils.isEmpty(commentLasts)) {
                commentLasts = new HashSet<>();
            }
            product.setComments(commentLasts);

            Set<Comment> comments = product.getComments();
            if (comments != null && !comments.isEmpty()) {
                for (Comment comment : comments) {
                    Set<Image> images = comment.getImages();
                    for (Image image : images) {
                        File file = new File(image.getDirectoryPath());
                        if (file.exists()) {
                            file.delete();
                        }
                    }
                }
            }

            Set<ProductDetail> productDetails = product.getProductDetails();
            if (productDetails != null && !productDetails.isEmpty()) {
                for (ProductDetail productDetail : productDetails) {
                    File file = new File(productDetail.getDirectoryPath());
                    if (file.exists()) {
                        file.delete();
                    }
                }
            }

            Set<Image> images = product.getImages();
            if (images != null && !images.isEmpty()) {
                for (Image image : images) {
                    File file = new File(image.getDirectoryPath());
                    if (file.exists()) {
                        file.delete();
                    }
                }
            }
            productRepository.deleteById(id);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public Product updateStatus(Long id, Boolean type) {
        try {
            Product product = productRepository.getProductById(id);
            product.setStatus(type);
            return productRepository.save(product);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public Product createOrUpdate(CreateOrUpdateProduct productDto) throws Exception {
        try {
            Product product = new Product();
            if ( productDto != null && productDto.getId() != null) {
                product = productRepository.getProductById(productDto.getId());
                product.setUpdatedDate(new Date());
            } else {
                if (!FileUtils.isValidFileList(productDto.getImages())) {
                    throw new Exception(Constants.NOT_IMAGE);
                }
                product.setCreatedDate(new Date());
                product.setUpdatedDate(new Date());
                product.setStatus(true);
            }
            product.setProductName(productDto.getProductName());
            ProductType productType = productTypeService.getProductType(productDto.getProductTypeId());
            if (productType == null) {
                throw new Exception(Constants.PRODUCT_TYPE_NOT_FOUND);
            }
            product.setProductType(productType);
            product.setSize(productDto.getSize());
            product.setPrice(productDto.getPrice());
            product.setPercentageReduction(productDto.getPercentageReduction());
            product.setCategoryId(productDto.getCategoryId());
            product.setStatus(productDto.getStatus());

//            List<ShippingMethod> shippingMethods = shippingMethodRepository.findAllById(
//                    productDto.getShippingMethodIds().stream().map(Long::parseLong).collect(Collectors.toList())
//            );
//            product.setShippingMethods(new HashSet<>(shippingMethods));
            product.setDescription(productDto.getDescription());
            if (StringUtils.isNotEmpty(productDto.getImageIdsToRemove())) {
                List<Long> imageIdsToRemoveDT = Arrays.stream(productDto.getImageIdsToRemove().split(","))
                        .map(Long::parseLong)
                        .collect(Collectors.toList());
                if (!imageIdsToRemoveDT.isEmpty()) {
                    for (Long imageId : imageIdsToRemoveDT) {
                        Image image = imageRepository.findImageById(imageId);
                        File file = new File(image.getDirectoryPath());
                        if (file.exists()) {
                            file.delete();
                        }
                        imageRepository.deleteById(imageId);
                    }
                }
            }
            product = productRepository.save(product);
            saveProductDetails(product, productDto.getProductDetailDTOS(), productDto.getListProductDetailIdRemove());
            return saveImageProduct(productDto.getImages(), product);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }
}