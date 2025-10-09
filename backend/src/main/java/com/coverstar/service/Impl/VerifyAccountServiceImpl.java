package com.coverstar.service.Impl;

import com.coverstar.dao.verify_account.VerifyAccountDao;
import com.coverstar.entity.VerifyAccount;
import com.coverstar.service.VerifyAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class VerifyAccountServiceImpl implements VerifyAccountService {

    @Autowired
    private VerifyAccountDao verifyAccountDao;

    @Override
    public VerifyAccount create(VerifyAccount verifyAccount) {
        return verifyAccountDao.create(verifyAccount);
    }

    @Override
    public Optional<VerifyAccount> findByToken(String token) {
        return verifyAccountDao.findByToken(token);
    }

    @Override
    public Optional<VerifyAccount> findById(Long id) {
        return verifyAccountDao.findById(id);
    }

}
