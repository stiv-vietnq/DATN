package com.coverstar.repository;

import com.coverstar.entity.DiscountProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface DiscountProductRepository extends JpaRepository<DiscountProduct, Long> {


    @Modifying
    @Query("DELETE FROM DiscountProduct dp WHERE dp.discount.id = ?1 AND dp.product.id IN ?2")
    void deleteByDiscountIdAndProductIdIn(Long id, Set<String> toDelete);

    @Query("SELECT dp FROM DiscountProduct dp WHERE dp.discount.id = ?1")
    List<DiscountProduct> findByDiscountId(Long id);

    @Modifying
    @Query("DELETE FROM DiscountProduct dp WHERE dp.discount.id = ?1")
    void deleteByDiscountId(Long discountId);
}
