package com.coverstar.service;

import java.util.Optional;

import com.coverstar.entity.VerifyAccount;

public interface VerifyAccountService {

	VerifyAccount create(VerifyAccount verifyAccount);
	Optional<VerifyAccount> findByToken(String token);
	Optional<VerifyAccount> findById(Long id);
	
}
