package com.coverstar.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.coverstar.entity.VerifyAccount;

public interface VerifyAccountRepository extends JpaRepository<VerifyAccount, Long>{

	Optional<VerifyAccount> findByToken(String token);
	
}
