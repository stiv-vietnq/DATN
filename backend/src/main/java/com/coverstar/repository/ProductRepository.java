package com.coverstar.repository;

import com.coverstar.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT DISTINCT p " +
            "FROM Product p " +
            "LEFT JOIN FETCH Image a ON p.id = a.productId AND a.type = 1 " +
            "LEFT JOIN FETCH ProductDetail pd ON p.id = pd.productId " +
            "LEFT JOIN FETCH p.productType pt " +
            "WHERE (:productTypeId IS NULL OR pt.id = :productTypeId) " +
            "AND (:name IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND p.price BETWEEN :minPrice AND :maxPrice " +
            "AND (:categoryIds IS NULL OR p.categoryId IN :categoryIds) " +
            "AND (:status IS NULL OR p.status = :status) " +
            "AND (:evaluate IS NULL OR p.evaluate >= :evaluate)")
    List<Product> findAllWithDetails(
            @Param("productTypeId") Long productTypeId,
            @Param("name") String name,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("categoryIds") List<Long> categoryIds,
            @Param("status") Boolean status,
            @Param("evaluate") Float evaluate
    );

    @Query("SELECT p " +
            "FROM Product p " +
            "INNER JOIN Image a ON p.id = a.productId " +
            "INNER JOIN ProductDetail pd ON p.id = pd.productId " +
            "WHERE p.id = :id " +
            "AND a.type = 1 " +
            "ORDER BY p.id ASC")
    Product getProductById(String id);

    List<Product> findAllByProductTypeId(Long id);

    List<Product> findAllByCategoryId(Long id);

    @Modifying
    @Query("DELETE FROM Product p WHERE p.id = :id")
    void deleteProductById(String id);

    @Query("SELECT p FROM Product p WHERE p.productType.id = :id ORDER BY p.numberOfVisits DESC")
    List<Product> findAllByProductTypeIdAndNumberOfVisits(Long id, Pageable pageable);

    @Query("SELECT p.productName, SUM(p.quantitySold) " +
            "FROM Product p " +
            "WHERE (:startDate IS NULL OR p.createdDate >= :startDate) " +
            "AND (:endDate IS NULL OR p.createdDate <= :endDate) " +
            "AND (p.id IN :productIds) " +
            "GROUP BY p.productName")
    List<Object[]> getProductStatsByDateRangeProduct(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("productIds") List<String> productIds
    );

    @Query("SELECT p.productName, SUM(p.quantitySold) " +
            "FROM Product p " +
            "WHERE FUNCTION('YEAR', p.createdDate) = :year " +
            "AND FUNCTION('MONTH', p.createdDate) = :month " +
            "AND (p.id IN :productIds) " +
            "GROUP BY p.productName")
    List<Object[]> getProductStatsByMonthProduct(
            @Param("year") int year,
            @Param("month") int month,
            @Param("productIds") List<String> productIds
    );

    @Query("SELECT p.productName, SUM(p.quantitySold) " +
            "FROM Product p " +
            "WHERE FUNCTION('YEAR', p.createdDate) = :year " +
            "AND (p.id IN :productIds) " +
            "GROUP BY p.productName")
    List<Object[]> getProductStatsByYear(
            @Param("year") int year,
            @Param("productIds") List<String> productIds);

    @Query("SELECT p.productName, SUM(p.quantitySold) " +
            "FROM Product p " +
            "WHERE (:startDate IS NULL OR p.createdDate >= :startDate) " +
            "AND (:endDate IS NULL OR p.createdDate <= :endDate) " +
            "GROUP BY p.productName")
    List<Object[]> getProductStatsByDateRangeProductNoProductId(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate
    );

    @Query("SELECT p.productName, SUM(p.quantitySold) " +
            "FROM Product p " +
            "WHERE FUNCTION('YEAR', p.createdDate) = :year " +
            "AND FUNCTION('MONTH', p.createdDate) = :month " +
            "GROUP BY p.productName")
    List<Object[]> getProductStatsByMonthProductNoProductId(
            @Param("year") int year,
            @Param("month") int month
    );

    @Query("SELECT p.productName, SUM(p.quantitySold) " +
            "FROM Product p " +
            "WHERE FUNCTION('YEAR', p.createdDate) = :year " +
            "GROUP BY p.productName")
    List<Object[]> getProductStatsByYearNoProductId(
            @Param("year") int year);

}