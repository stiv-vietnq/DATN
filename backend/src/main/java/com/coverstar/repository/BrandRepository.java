package com.coverstar.repository;

import com.coverstar.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {

    @Query("SELECT c FROM Brand c " +
            "INNER JOIN c.productType pt " +
            "WHERE (:productTypeId IS NULL OR pt.id = :productTypeId) " +
            "AND (:name IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND (:status IS NULL OR c.status = :status)" +
            "ORDER BY c.createdDate")
    List<Brand> findAllByConditions(String name, Boolean status, Long productTypeId);

    List<Brand> findAllByProductTypeId(Long id);
}
