//package com.coverstar.repository;
//
////import com.coverstar.entity.ShippingMethod;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface ShippingMethodRepository extends JpaRepository<ShippingMethod, Long> {
//
//    @Query("SELECT s FROM ShippingMethod s " +
//            "WHERE s.name LIKE CONCAT('%', :name, '%') " +
//            "ORDER BY s.createdDate DESC" )
//    List<ShippingMethod> findAllByConditions(String name);
//}