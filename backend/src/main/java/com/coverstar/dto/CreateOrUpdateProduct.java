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
    private String id;
    private String productName;
    private String productTypeId;
    private String size;
    private String price;
    private String percentageReduction;
    private String description;
    private String imageIdsToRemove;
    private String listProductDetailIdRemove;
//    private List<String> shippingMethodIds;
    private String categoryId;
    private String status;
    private List<MultipartFile> images;
    private List<ProductDetailDTO> productDetailDTOS;
}
