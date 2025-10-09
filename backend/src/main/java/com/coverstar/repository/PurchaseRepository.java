package com.coverstar.repository;

import com.coverstar.entity.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {

    @Query("SELECT p FROM Purchase p" +
            " WHERE p.userId = :userId" +
            " AND p.product.productName LIKE CONCAT('%', :productName, '%') " +
            " ORDER BY p.createdDate DESC")
    List<Purchase> findAllByUserId(Long userId, String productName);

    @Query("SELECT a FROM Purchase a " +
            " WHERE a.userId = :userId " +
            " AND a.paymentMethod LIKE CONCAT('%', :paymentMethod, '%') " +
            " AND a.status = :status " +
            " ORDER BY a.createdDate DESC")
    List<Purchase> findAllByUserIdAndPaymentMethodContainingAndStatus(Long userId,
                                                                      String paymentMethod,
                                                                      Integer status);

    @Query("SELECT MONTH(o.createdDate) AS month, COUNT(o) AS total " +
            "FROM Purchase o WHERE YEAR(o.createdDate) = :year AND o.status = :status " +
            "GROUP BY MONTH(o.createdDate) ORDER BY MONTH(o.createdDate)")
    List<Object[]> getOrderCountByMonthAndYear(@Param("year") int year, @Param("status") Integer status);

    @Query("SELECT DAY(o.createdDate) AS day, COUNT(o) AS total " +
            "FROM Purchase o WHERE YEAR(o.createdDate) = :year AND MONTH(o.createdDate) = :month AND o.status = :status " +
            "GROUP BY DAY(o.createdDate) ORDER BY DAY(o.createdDate)")
    List<Object[]> getOrderCountByDayAndMonth(@Param("year") int year, @Param("month") int month, @Param("status") Integer status);
}
