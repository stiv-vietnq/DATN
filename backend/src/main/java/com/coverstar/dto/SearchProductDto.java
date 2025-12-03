package com.coverstar.dto;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class SearchProductDto implements Serializable {
    private Long productTypeId;
    private String name;
    private String minPrice;
    private String maxPrice;
    private Boolean status;
    private List<Long> categoryId;
//    private List<String> shippingMethodIds;
    private String orderBy;
    private String priceOrder;
    private Integer page;
    private Integer size;
    private String quantitySold;
    private String numberOfVisits;
    private String evaluate;
}