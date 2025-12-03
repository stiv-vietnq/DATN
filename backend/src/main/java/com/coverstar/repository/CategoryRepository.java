package com.coverstar.repository;

import com.coverstar.entity.Category;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    @EntityGraph(attributePaths = "productType")
    @Query("SELECT c FROM Category c " +
            "INNER JOIN c.productType pt " +
            "WHERE (:productTypeId IS NULL OR pt.id = :productTypeId) " +
            "AND (:nameValue IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :nameValue, '%'))) " +
            "AND (:status IS NULL OR c.status = :status) " +
            "ORDER BY c.id DESC")
    List<Category> findAllByConditions(
            @Param("productTypeId") Long productTypeId,
            @Param("status") Boolean status,
            @Param("nameValue") String nameValue
    );

    List<Category> findAllByProductTypeId(Long id);

    Optional<Category> findByName(String name);

    List<Category> findByNameContainingIgnoreCase(String message);
}
