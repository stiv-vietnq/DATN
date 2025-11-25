package com.coverstar.repository;

import com.coverstar.entity.DiscountProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Repository
public interface DiscountProductRepository extends JpaRepository<DiscountProduct, Long> {


    @Modifying
    @Query("DELETE FROM DiscountProduct dp WHERE dp.discount.id = ?1 AND dp.productId IN ?2")
    void deleteByDiscountIdAndProductIdIn(Long id, Set<String> toDelete);

    @Query("SELECT dp FROM DiscountProduct dp WHERE dp.discount.id = ?1")
    List<DiscountProduct> findByDiscountId(Long id);

    @Modifying
    @Query("DELETE FROM DiscountProduct dp WHERE dp.discount.id = ?1")
    void deleteByDiscountId(Long discountId);

    @Modifying
    @Query("DELETE FROM DiscountProduct dp WHERE dp.productId IN ?1")
    void deleteByProductIdIn(List<String> productIds);

    @Modifying
    @Query("DELETE FROM DiscountProduct dp WHERE dp.productId IN ?1 AND dp.discount.id <> ?2")
    void deleteByProductIdInAndDiscountIdNot(List<String> productIds, Long id);

    @Query("SELECT dp.discount.discountPercent FROM DiscountProduct dp WHERE dp.id = ?1")
    BigDecimal findDiscountPriceByDiscountProductId(Long discountProductId);

    @Query("SELECT dp.discount.discountPercent FROM DiscountProduct dp WHERE dp.productId = ?1")
    BigDecimal findDiscountPriceByProductId(String productId);
}