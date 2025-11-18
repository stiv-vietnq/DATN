package com.coverstar.repository;

import com.coverstar.entity.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {

    @Query("SELECT DISTINCT p FROM Purchase p " +
            "JOIN p.purchaseItems pi " +
            "JOIN pi.productDetail pd " +
            "WHERE p.userId = :userId " +
            "AND (:status IS NULL OR p.status = :status) " +
            "AND (:productName IS NULL OR LOWER(pd.name) LIKE LOWER(CONCAT('%', :productName, '%'))) " +
            "ORDER BY p.createdDate DESC")
    List<Purchase> findAllByUserId(Long userId, String productName, Integer status);

    @Query("SELECT a FROM Purchase a " +
            "WHERE (:userId IS NULL OR a.userId = :userId) " +
            "AND (:paymentMethod IS NULL OR a.paymentMethod LIKE CONCAT('%', :paymentMethod, '%')) " +
            "AND (:status IS NULL OR a.status = :status) " +
            "ORDER BY a.createdDate DESC")
    List<Purchase> findAllByUserIdAndPaymentMethodContainingAndStatus(
            @Param("userId") Long userId,
            @Param("paymentMethod") String paymentMethod,
            @Param("status") Integer status);

    @Query("SELECT MONTH(o.createdDate) AS month, COUNT(o) AS total " +
            "FROM Purchase o WHERE YEAR(o.createdDate) = :year AND o.status = :status " +
            "GROUP BY MONTH(o.createdDate) ORDER BY MONTH(o.createdDate)")
    List<Object[]> getOrderCountByMonthAndYear(@Param("year") int year, @Param("status") Integer status);

    @Query("SELECT DAY(o.createdDate) AS day, COUNT(o) AS total " +
            "FROM Purchase o WHERE YEAR(o.createdDate) = :year AND MONTH(o.createdDate) = :month AND o.status = :status " +
            "GROUP BY DAY(o.createdDate) ORDER BY DAY(o.createdDate)")
    List<Object[]> getOrderCountByDayAndMonth(@Param("year") int year, @Param("month") int month, @Param("status") Integer status);

    @Query("SELECT o.createdDate, COUNT(o) " +
            "FROM Purchase o " +
            "WHERE o.createdDate BETWEEN :startDate AND :endDate " +
            "AND o.status = :status " +
            "GROUP BY o.createdDate " +
            "ORDER BY o.createdDate")
    List<Object[]> getOrderCountByDateRange(@Param("startDate") Date startDate,
                                            @Param("endDate") Date endDate,
                                            @Param("status") Integer status);

    @Query("SELECT p.createdDate, SUM(i.totalAfterDiscount) " +
            "FROM PurchaseItem i " +
            "JOIN i.purchase p " +
            "WHERE p.createdDate BETWEEN :from AND :to " +
            "GROUP BY p.createdDate " +
            "ORDER BY p.createdDate")
    List<Object[]> getRevenueByDateRange(Date from, Date to);

    @Query("SELECT FUNCTION('MONTH', p.createdDate), SUM(i.totalAfterDiscount) " +
            "FROM PurchaseItem i " +
            "JOIN i.purchase p " +
            "WHERE FUNCTION('YEAR', p.createdDate) = :year " +
            "GROUP BY FUNCTION('MONTH', p.createdDate) " +
            "ORDER BY FUNCTION('MONTH', p.createdDate)")
    List<Object[]> getRevenueOfYear(int year);

}
