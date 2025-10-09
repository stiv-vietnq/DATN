package com.coverstar.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseDto implements Serializable {
    private Long productId;
    private Long productDetailId;
    private Long addressId;
    private Long userId;
    private String description;
    private Long quantity;
    private String color;
    private Integer size;
    private BigDecimal total;
    private BigDecimal totalAfterDiscount;
    private Long discountId;
    private String paymentMethod;
}
