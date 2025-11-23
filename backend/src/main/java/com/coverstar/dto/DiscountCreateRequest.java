package com.coverstar.dto;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class DiscountCreateRequest implements Serializable {

    private static final long serialVersionUID = 5253639254740532576L;

    private Long id;
    private String name;
    private Boolean status;
    private BigDecimal discountPercent;
    private String expiredDate;
    private List<String> productIds;
}

