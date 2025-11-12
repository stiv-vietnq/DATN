package com.coverstar.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseDto implements Serializable {
    private Long addressId;
    private Long userId;
    private String description;
    private Long discountId;
    private String paymentMethod;
    private List<PurchaseItemDto> items;
}
