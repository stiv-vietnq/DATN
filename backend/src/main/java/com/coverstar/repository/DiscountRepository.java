package com.coverstar.repository;

import com.coverstar.entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.text.DecimalFormatSymbols;
import java.util.List;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, Long> {

    @Query("SELECT a FROM Discount a " +
            "JOIN a.accounts acc " +
            "WHERE (:name IS NULL OR a.name LIKE CONCAT('%', :name, '%')) " +
            "AND (:status IS NULL OR a.status = :status) " +
            "AND (:code IS NULL OR a.code LIKE CONCAT('%', :code, '%')) " +
            "AND (:discountType IS NULL OR a.discountType = :discountType) " +
            "AND (:accountId IS NULL OR acc.id = :accountId) " +
            "ORDER BY a.createdDate DESC")
    List<Discount> findAllByStatus(String name, Boolean status, String code, Long accountId, Integer discountType);


    boolean existsByCode(String name);

    boolean existsByCodeAndIdNot(String name, Long id);

    @Query("SELECT a.discountPercent FROM Discount a WHERE a.code = :code")
    Long findByCode(String code);
}
