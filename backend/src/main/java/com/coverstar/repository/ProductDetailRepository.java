package com.coverstar.repository;

import com.coverstar.entity.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ProductDetailRepository extends JpaRepository<ProductDetail, Long> {

    @Query("SELECT p.productName, SUM(pd.quantity) " +
            "FROM ProductDetail pd " +
            "JOIN Product p ON pd.productId = p.id " +
            "WHERE (:startDate IS NULL OR pd.createdDate >= :startDate) " +
            "AND (:endDate IS NULL OR pd.createdDate <= :endDate) " +
            "AND (pd.productId IN :productIds) " +
            "GROUP BY p.productName")
    List<Object[]> getProductStatsByDateRangeDetail(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("productIds") List<String> productIds
    );


    @Query("SELECT p.productName, SUM(pd.quantity) " +
            "FROM ProductDetail pd " +
            "JOIN Product p ON pd.productId = p.id " +
            "WHERE FUNCTION('YEAR', pd.createdDate) = :year " +
            "AND FUNCTION('MONTH', pd.createdDate) = :month " +
            "AND (p.id IN :productIds) " +
            "GROUP BY p.productName")
    List<Object[]> getProductStatsByMonthDetail(
            @Param("year") int year,
            @Param("month") int month,
            @Param("productIds") List<String> productIds
    );

    @Query("SELECT p.productName, SUM(pd.quantity) " +
            "FROM ProductDetail pd " +
            "JOIN Product p ON pd.productId = p.id " +
            "WHERE FUNCTION('YEAR', pd.createdDate) = :year " +
            "AND (p.id IN :productIds) " +
            "GROUP BY p.productName")
    List<Object[]> getProductStatsByYearDetail(
            @Param("year") int year,
            @Param("productIds") List<String> productIds
    );

    @Query("SELECT pd.name, COALESCE(SUM(pd.quantitySold), 0), COALESCE(SUM(pd.quantity), 0) " +
            "FROM ProductDetail pd " +
            "WHERE pd.productId = :productId " +
            "AND (:startDate IS NULL OR pd.createdDate >= :startDate) " +
            "AND (:endDate IS NULL OR pd.createdDate <= :endDate) " +
            "GROUP BY pd.name " +
            "ORDER BY pd.name ASC")
    List<Object[]> getProductDetailByDate(
            @Param("productId") String productId,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate
    );

    @Query("SELECT pd.name, COALESCE(SUM(pd.quantitySold), 0), COALESCE(SUM(pd.quantity), 0) " +
            "FROM ProductDetail pd " +
            "WHERE pd.productId = :productId " +
            "AND FUNCTION('YEAR', pd.createdDate) = :year " +
            "AND FUNCTION('MONTH', pd.createdDate) = :month " +
            "GROUP BY pd.name " +
            "ORDER BY pd.name ASC")
    List<Object[]> getProductDetailByMonth(
            @Param("productId") String productId,
            @Param("year") int year,
            @Param("month") int month
    );

    // Theo năm
    @Query("SELECT pd.name, COALESCE(SUM(pd.quantitySold), 0), COALESCE(SUM(pd.quantity), 0) " +
            "FROM ProductDetail pd " +
            "WHERE pd.productId = :productId " +
            "AND FUNCTION('YEAR', pd.createdDate) = :year " +
            "GROUP BY pd.name " +
            "ORDER BY pd.name ASC")
    List<Object[]> getProductDetailByYear(
            @Param("productId") String productId,
            @Param("year") int year
    );

    @Query("SELECT p.productName, SUM(pd.quantity) " +
            "FROM ProductDetail pd " +
            "JOIN Product p ON pd.productId = p.id " +
            "WHERE FUNCTION('YEAR', pd.createdDate) = :year " +
            "AND FUNCTION('MONTH', pd.createdDate) = :month " +
            "GROUP BY p.productName")
    List<Object[]> getProductStatsByMonthDetailNoProductId(
            @Param("year") int year,
            @Param("month") int month
    );

    @Query("SELECT p.productName, SUM(pd.quantity) " +
            "FROM ProductDetail pd " +
            "JOIN Product p ON pd.productId = p.id " +
            "WHERE FUNCTION('YEAR', pd.createdDate) = :year " +
            "GROUP BY p.productName")
    List<Object[]> getProductStatsByYearDetailNoProductId(
            @Param("year") int year
    );

    @Query("SELECT p.productName, SUM(pd.quantity) " +
            "FROM ProductDetail pd " +
            "JOIN Product p ON pd.productId = p.id " +
            "WHERE (:startDate IS NULL OR pd.createdDate >= :startDate) " +
            "AND (:endDate IS NULL OR pd.createdDate <= :endDate) " +
            "GROUP BY p.productName")
    List<Object[]> getProductStatsByDateRangeDetailNoProductId(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate
    );

}