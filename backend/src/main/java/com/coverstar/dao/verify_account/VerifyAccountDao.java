package com.coverstar.dao.verify_account;

import java.util.Optional;

import com.coverstar.entity.VerifyAccount;

public interface VerifyAccountDao {

	VerifyAccount create(VerifyAccount verifyAccount);
	Optional<VerifyAccount> findByToken(String token);
	Optional<VerifyAccount> findById(Long id);
}
