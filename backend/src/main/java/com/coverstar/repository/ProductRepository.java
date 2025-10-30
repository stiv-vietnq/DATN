package com.coverstar.repository;

import com.coverstar.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT DISTINCT p " +
            "FROM Product p " +
            "INNER JOIN Image a ON p.id = a.productId " +
            "INNER JOIN ProductDetail pd ON p.id = pd.productId " +
//            "INNER JOIN p.shippingMethods sm " +
            "INNER JOIN p.productType pt " +
            "WHERE (:productTypeId IS NULL OR pt.id = :productTypeId) " +
            "AND (:name IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND p.price BETWEEN :minPrice AND :maxPrice " +
            "AND (COALESCE(:categoryIds, NULL) IS NULL OR p.categoryId IN :categoryIds) " +
//            "AND (COALESCE(:shippingMethodIds, NULL) IS NULL OR sm.id IN :shippingMethodIds) " +
            "AND a.type = 1 " +
            "AND (:status IS NULL OR p.status = :status) " +
            "AND (:evaluate IS NULL OR p.evaluate >= :evaluate)")
    Page<Product> findByNameContainingAndPriceBetweenWithDetails(
            @Param("productTypeId") Long productTypeId,
            @Param("name") String name,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("categoryIds") List<Long> categoryIds,
//            @Param("shippingMethodIds") List<Long> shippingMethodIds,
            @Param("status") Boolean status,
            @Param("evaluate") Float evaluate,
            Pageable pageable);


    @Query("SELECT p " +
            "FROM Product p " +
            "INNER JOIN Image a ON p.id = a.productId " +
            "INNER JOIN ProductDetail pd ON p.id = pd.productId " +
            "WHERE p.id = :id " +
            "AND a.type = 1 " +
            "ORDER BY p.id ASC")
    Product getProductById(Long id);

    List<Product> findAllByProductTypeId(Long id);

    List<Product> findAllByCategoryId(Long id);
}