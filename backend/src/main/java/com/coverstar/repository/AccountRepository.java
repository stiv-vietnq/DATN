package com.coverstar.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.coverstar.entity.Account;

import java.lang.String;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByUsernameOrEmail(String username, String email);

    Optional<Account> findByEmail(String email);

    Optional<Account> findByUsername(String username);

    @Query("SELECT a FROM Account a WHERE a.username LIKE CONCAT('%', :username, '%') ")
    List<Account> findByUsernameChat(String username);

    @Query(
            "SELECT a FROM Account a " +
                    "WHERE (:username IS NULL OR a.username LIKE :username) " +
                    "  AND (:fromDate IS NULL OR a.createdDate >= :fromDate) " +
                    "  AND (:toDate IS NULL OR a.createdDate <= :toDate) " +
                    "  AND (:isActive IS NULL OR a.active = :isActive) " +
                    "  AND (:isLocked IS NULL OR a.locked = :isLocked) "
    )
    List<Account> findAllByConditions(
            @Param("username") String username,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            @Param("isActive") Boolean isActive,
            @Param("isLocked") Boolean isLocked
    );

}