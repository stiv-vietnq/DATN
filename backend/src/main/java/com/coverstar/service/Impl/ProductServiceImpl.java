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
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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

    @Value("${server.port}")
    private String serverPort;

    private final static String IMAGE_BASE_URL = "/images/";
    private final static String SERVER_PORT = "http://localhost:";

//    @Autowired
//    private ShippingMethodRepository shippingMethodRepository;

//    @Lazy
//    @Autowired
//    private CategoryService categoryService;
//
//    @Lazy
//    @Autowired
//    private CategoryRepository categoryRepository;

    @Autowired
    private UserVisitRepository userVisitRepository;

    @Lazy
    @Autowired
    private ProductTypeService productTypeService;


    private Product saveImageProduct(List<MultipartFile> imageFiles, Product product) throws Exception {
        try {
            if (imageFiles != null && !imageFiles.isEmpty()) {
                Set<Image> images = new HashSet<>();
                for (MultipartFile file : imageFiles) {
                    String filePath = imageDirectory + "products" + "/" + product.getId();
                    File directory = new File(filePath);
                    if (!directory.exists()) {
                        directory.mkdirs();
                    }
                    String fullPath = filePath + "/" + file.getOriginalFilename();
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
        String filePath = imageDirectory + "productDetail" + "/" + productDetailId;
        File directory = new File(filePath);
        if (!directory.exists()) {
            directory.mkdirs();
        }
        String fullPath = filePath + "/" + imageFile.getOriginalFilename();
        imageFile.transferTo(new File(fullPath));
        return fullPath;
    }

    @Override
    public List<Product> findByNameAndPriceRange(SearchProductDto searchProductDto) throws Exception {
        try {
            // --- Update userVisits ---
            UserVisits userVisits = userVisitRepository.findByVisitDate(3);
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

            BigDecimal SQLSERVER_MAX_DECIMAL = new BigDecimal("9999999999999999.99");
            String minPrice = searchProductDto.getMinPrice();
            String maxPrice = searchProductDto.getMaxPrice();
            String nameValue = searchProductDto.getName() != null ? searchProductDto.getName() : StringUtils.EMPTY;
            BigDecimal minPriceValue = StringUtils.isNotEmpty(minPrice) ? new BigDecimal(minPrice) : BigDecimal.ZERO;
            BigDecimal maxPriceValue = StringUtils.isNotEmpty(maxPrice) ? new BigDecimal(maxPrice) : SQLSERVER_MAX_DECIMAL;
            Long productTypeId = searchProductDto.getProductTypeId() != null ? searchProductDto.getProductTypeId() : null;
            List<Long> categoryIds = searchProductDto.getCategoryId() != null ? searchProductDto.getCategoryId() : null;
            Boolean status = searchProductDto.getStatus() != null ? searchProductDto.getStatus() : null;
            Float evaluate = searchProductDto.getEvaluate() != null ? Float.valueOf(searchProductDto.getEvaluate()) : null;

            List<Product> products = productRepository.findAllWithDetails(
                    productTypeId, nameValue, minPriceValue, maxPriceValue,
                    categoryIds, status, evaluate
            );

            List<Product> distinctProducts = products.stream()
                    .collect(Collectors.toMap(Product::getId, p -> p, (p1, p2) -> p1))
                    .values().stream()
                    .collect(Collectors.toList());

            for (Product product : distinctProducts) {
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

            Comparator<Product> comparator = Comparator
                    .comparing(Product::getPrice)
                    .thenComparing(Product::getCreatedDate)
                    .thenComparing(Product::getQuantitySold)
                    .thenComparing(Product::getNumberOfVisits);

            if (Constants.DESC.equalsIgnoreCase(searchProductDto.getPriceOrder())) {
                comparator = comparator.reversed();
            }

            // Price
            if (searchProductDto.getPriceOrder() != null) {
                comparator = Constants.ASC.equalsIgnoreCase(searchProductDto.getPriceOrder()) ?
                        Comparator.comparing(Product::getPrice) :
                        Comparator.comparing(Product::getPrice).reversed();
            }

            // CreatedDate
            if (searchProductDto.getOrderBy() != null) {
                Comparator<Product> dateComparator = Constants.ASC.equalsIgnoreCase(searchProductDto.getOrderBy()) ?
                        Comparator.comparing(Product::getCreatedDate) :
                        Comparator.comparing(Product::getCreatedDate).reversed();
                comparator = comparator.thenComparing(dateComparator);
            }

            // QuantitySold
            if (searchProductDto.getQuantitySold() != null) {
                Comparator<Product> quantityComparator = Constants.ASC.equalsIgnoreCase(searchProductDto.getQuantitySold()) ?
                        Comparator.comparing(Product::getQuantitySold) :
                        Comparator.comparing(Product::getQuantitySold).reversed();
                comparator = comparator.thenComparing(quantityComparator);
            }

            // NumberOfVisits
            if (searchProductDto.getNumberOfVisits() != null) {
                Comparator<Product> visitsComparator = Constants.ASC.equalsIgnoreCase(searchProductDto.getNumberOfVisits()) ?
                        Comparator.comparing(Product::getNumberOfVisits) :
                        Comparator.comparing(Product::getNumberOfVisits).reversed();
                comparator = comparator.thenComparing(visitsComparator);
            }

            distinctProducts.sort(comparator);

            return distinctProducts;

        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }


    @Override
    public Product getProductById(String id) {
        try {
            Product product = productRepository.getProductById(id);
            if (product == null) {
                return null;
            }
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

            if (!CollectionUtils.isEmpty(product.getProductDetails())) {
                Set<ProductDetail> productDetails = new HashSet<>();
                for (ProductDetail productDetail : product.getProductDetails()) {
                    String relativePath = productDetail.getDirectoryPath();

                    if (relativePath != null && relativePath.startsWith(imageDirectory)) {
                        relativePath = relativePath.replace(imageDirectory, SERVER_PORT + serverPort + IMAGE_BASE_URL);
                        productDetail.setDirectoryPath(relativePath);
                    }
                    productDetails.add(productDetail);
                }
                product.setProductDetails(productDetails);
            }

            Set<Comment> comments = commentRepository.findCommentById(id);
            if (CollectionUtils.isEmpty(comments)) {
                comments = new HashSet<>();
            } else {
                float voteAverage;
                long totalVotes = 0;
                for (Comment comment : comments) {
                    Set<Image> commentImages = new HashSet<>();
                    if (!CollectionUtils.isEmpty(comment.getImages())) {
                        for (Image image : comment.getImages()) {
                            String relativePath = image.getDirectoryPath();

                            if (relativePath != null && relativePath.startsWith(imageDirectory)) {
                                relativePath = relativePath.replace(imageDirectory, SERVER_PORT + serverPort + IMAGE_BASE_URL);
                                image.setDirectoryPath(relativePath);
                            }
                            commentImages.add(image);
                        }
                        comment.setImages(commentImages);
                    }
                    totalVotes += comment.getEvaluate();
                }
                voteAverage = (float) totalVotes / comments.size();
                product.setEvaluate(voteAverage);
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
    public void deleteProductById(String id) throws Exception {
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
            productRepository.deleteProductById(id);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public Product updateStatus(String id, Boolean type) {
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
            if (productDto != null && productDto.getId() != null) {
                product = productRepository.getProductById(productDto.getId());
                product.setUpdatedDate(new Date());
            } else {
                if (!FileUtils.isValidFileList(productDto.getImages())) {
                    throw new Exception(Constants.NOT_IMAGE);
                }
                String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
                String id = productDto.getBrandCode() + "_" + timestamp;
                product.setId(id);
                product.setCreatedDate(new Date());
                product.setUpdatedDate(new Date());
                product.setStatus(true);
            }
            product.setProductName(productDto.getProductName());
            ProductType productType = productTypeService.getProductType(Long.valueOf(productDto.getProductTypeId()));
            if (productType == null) {
                throw new Exception(Constants.PRODUCT_TYPE_NOT_FOUND);
            }
            BigDecimal price = StringUtils.isNotEmpty(productDto.getPrice()) ? new BigDecimal(productDto.getPrice()) : BigDecimal.ZERO;
            product.setProductType(productType);
            product.setSize(productDto.getSize());
            product.setPrice(price);
            product.setCategoryId(Long.valueOf(productDto.getCategoryId()));
            product.setStatus(Boolean.valueOf(productDto.getStatus()));
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