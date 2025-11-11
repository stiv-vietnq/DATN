package com.coverstar.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartDto implements Serializable {
    private static final long serialVersionUID = 1L;
    private Long id;
    private Long productDetailId;
    private Long userId;
    private Long quantity;
    private BigDecimal total;
    private Integer size;
}
