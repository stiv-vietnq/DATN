package com.coverstar.repository;

import com.coverstar.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    @Query("SELECT a FROM Address a WHERE a.userId = :userId")
    List<Address> findByUserId(Long userId);

    @Query("SELECT a FROM Address a WHERE a.userId = :userId AND a.defaultValue = :isDefault")
    Address findByUserIdAndDefault(Long userId, Integer isDefault);
}
