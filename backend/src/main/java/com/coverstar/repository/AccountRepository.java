package com.coverstar.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
}