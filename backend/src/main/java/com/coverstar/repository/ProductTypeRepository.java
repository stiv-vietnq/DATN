package com.coverstar.repository;

import com.coverstar.entity.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductTypeRepository extends JpaRepository<ProductType, Long> {

    @Query("SELECT b FROM ProductType b " +
            "WHERE (:name IS NULL OR b.name LIKE CONCAT('%', :name, '%')) " +
            "AND (:status IS NULL OR b.status = :status) " +
            "ORDER BY b.createdDate ASC")
    List<ProductType> findProductTypesByConditions(
            String name,
            Boolean status
    );

    boolean existsByName(String name);

    @Query("SELECT b FROM ProductType b WHERE b.id = :id ")
    ProductType findByIdAndType(Long id);

    @Query("SELECT b FROM ProductType b " +
            "WHERE (:status IS NULL OR b.status = :status) " +
            "ORDER BY b.createdDate ASC")
    List<ProductType> findProductTypesByStatus(
            Boolean status
    );

    boolean existsByCode(String code);

    List<ProductType> findByNameContainingIgnoreCase(String message);
}
