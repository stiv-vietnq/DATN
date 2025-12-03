package com.coverstar.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseItemDto implements Serializable {
    private String productId;
    private Long productDetailId;
    private Long quantity;
    private String total;
    private String totalAfterDiscount;
}

