package com.coverstar.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.coverstar.dto.*;
import com.coverstar.entity.Account;

import javax.mail.MessagingException;

public interface AccountService {

	Account createMember(AccountCreateDto accountDto) throws Exception;

	Account findById(Long id);

	void verifyCode(VerifyCodeDto verifyCodeDto);

    void changePassword(String username, String newPassword);

	boolean checkPassword(String username, String oldPassword);

	void forgotPassword(String usernameOrEmail);

	Map<String, String> authenticateUser(LoginDto loginDto);

	void unlockAccount(String usernameOrEmail);

	List<Account> getAllAccount(String username,
								String fromDate,
								String toDate,
								String isActive,
								String isLocked);

	void lockAccount(String usernameOrEmail, Map<String, String> body);

	List<Account> findByUsernameChat(String username);

	AccountUpdateDto updateAccount(AccountUpdateDto accountUpdateDto) throws Exception;

	ChangeEmailDto changeEmail(ChangeEmailDto changeEmailDto);
}
