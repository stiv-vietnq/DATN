package com.coverstar.repository;

import com.coverstar.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    @Query("SELECT a FROM Cart a" +
            " WHERE a.userId =:userId " +
            " AND a.status =:status" +
            " AND a.productDetail.name LIKE CONCAT('%', :name, '%')" +
            " ORDER BY a.createdDate ASC ")
    List<Cart> findAllByUserIdOrderByCreatedDate(Long userId, String name, boolean status);

    Cart findByProductDetailIdAndUserIdAndSize(Long productId, Long userId, Integer size);
}
