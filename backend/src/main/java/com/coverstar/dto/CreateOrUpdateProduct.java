package com.coverstar.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateOrUpdateProduct implements Serializable {
    private Long id;
    private String productName;
    private Long productTypeId;
    private String size;
    private BigDecimal price;
    private Float percentageReduction;
    private String description;
    private String imageIdsToRemove;
    private String listProductDetailIdRemove;
    private List<String> shippingMethodIds;
    private Long brandId;
    private Long categoryId;
    private Boolean status;
    private List<MultipartFile> images;
    private List<ProductDetailDTO> productDetailDTOS;
}
