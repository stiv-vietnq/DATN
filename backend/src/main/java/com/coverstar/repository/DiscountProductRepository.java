package com.coverstar.repository;

import com.coverstar.entity.DiscountProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DiscountProductRepository extends JpaRepository<DiscountProduct, Long> {

    @Modifying
    @Query("DELETE FROM DiscountProduct dp WHERE dp.discount.id = ?1")
    void deleteByDiscountId(Long id);
}
