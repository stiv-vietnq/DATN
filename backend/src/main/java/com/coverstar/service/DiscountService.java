package com.coverstar.service;

import com.coverstar.dto.DiscountCreateRequest;
import com.coverstar.entity.Discount;

import java.util.List;

public interface DiscountService {
    Discount createOrUpdateDiscount(DiscountCreateRequest request);

    Discount updateStatus(Long discountId, Boolean status);

    Discount updateExpiredDate(Long discountId, String expiredDate);

    Discount getById(Long discountId);

    List<Discount> search(String name, Boolean status);

    void delete(Long discountId);
}