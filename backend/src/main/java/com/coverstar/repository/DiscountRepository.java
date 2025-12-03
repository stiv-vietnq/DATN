package com.coverstar.repository;

import com.coverstar.entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, Long> {

    @Query("SELECT d FROM Discount d " +
            "WHERE (:nameValue IS NULL OR LOWER(d.name) LIKE LOWER(CONCAT('%', :nameValue, '%'))) " +
            "AND (:status IS NULL OR d.status = :status)")
    List<Discount> search(String nameValue, Boolean status);
}
