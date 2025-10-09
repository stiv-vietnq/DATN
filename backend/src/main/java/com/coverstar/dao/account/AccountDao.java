package com.coverstar.dao.account;

import java.util.Optional;

import com.coverstar.dao.IOperations;
import com.coverstar.entity.Account;

public interface AccountDao extends IOperations<Account> {

	Optional<Account> findByUsernameOrEmail(String username, String email);

	Optional<Account> findByEmail(String email);

	Optional<Account> findByUsername(String username);
	
}