package com.coverstar.service;

import com.coverstar.dto.PurchaseDto;
import com.coverstar.entity.Purchase;

import java.util.List;

public interface PurchaseService {
    List<Purchase> createPurchase(List<PurchaseDto> purchases) throws Exception;

    Purchase updateFirstWave(Long id, Long addressId) throws Exception;

    Purchase updateStatus(Long id, Integer status) throws Exception;

    List<Purchase> getPurchaseByUserId(Long userId, String productName, String status);

    List<Purchase> getAllPurchase(Long userId, String paymentMethod, Integer status);
}
