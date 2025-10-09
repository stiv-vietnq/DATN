package com.coverstar.dao.account.impl;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.coverstar.dao.account.AccountDao;
import com.coverstar.entity.Account;
import com.coverstar.repository.AccountRepository;

@Repository
public class AccountDaoImpl implements AccountDao{

	@Autowired
	private AccountRepository accountRepository;

	@Override
	public Optional<Account> findById(long id) {
		return accountRepository.findById(id);
	}

	@Override
	public List<Account> findAll() {
		return accountRepository.findAll();
	}

	@Transactional
	@Override
	public Account create(Account entity) {
		return accountRepository.save(entity);
	}

	@Transactional
	@Override
	public Account update(Account entity) {
		return accountRepository.save(entity);
	}

	@Transactional
	@Override
	public void delete(Account entity) {
		accountRepository.delete(entity);
	}

	@Override
	public void deleteById(long entityId) {
		accountRepository.deleteById(entityId);
	}

	@Override
	public Optional<Account> findByUsernameOrEmail(String username, String email) {
		return accountRepository.findByUsernameOrEmail(username, email);
	}

	@Override
	public Optional<Account> findByEmail(String email) {
		return accountRepository.findByEmail(email);
	}

	@Override
	public Optional<Account> findByUsername(String username) {
		return accountRepository.findByUsername(username);
	}
}
