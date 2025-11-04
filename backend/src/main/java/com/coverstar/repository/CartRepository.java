package com.coverstar.repository;

import com.coverstar.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    @Query("SELECT a FROM Cart a" +
            " WHERE a.userId =:userId " +
            " AND a.status =:status" +
            " AND a.product.productName LIKE CONCAT('%', :name, '%')" +
            " ORDER BY a.createdDate ASC ")
    List<Cart> findAllByUserIdOrderByCreatedDate(Long userId, String name, boolean status);

    Cart findByProductIdAndUserIdAndColorAndSize(String productId, Long userId, String color, Integer size);
}
