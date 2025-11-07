package com.coverstar.service.Impl;

import com.coverstar.component.mail.Mail;
import com.coverstar.component.mail.MailService;
import com.coverstar.constant.Constants;
import com.coverstar.entity.UserVisits;
import com.coverstar.repository.UserVisitRepository;
import com.coverstar.utils.DateUtill;
import com.coverstar.utils.RandomUtil;
import com.coverstar.dao.account.AccountDao;
import com.coverstar.dao.verify_account.VerifyAccountDao;
import com.coverstar.dto.*;
import com.coverstar.entity.Account;
import com.coverstar.entity.Role;
import com.coverstar.entity.VerifyAccount;
import com.coverstar.repository.AccountRepository;
import com.coverstar.service.AccountService;
import com.coverstar.service.RoleService;
import com.coverstar.utils.ShopUtil;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.mail.MessagingException;
import java.io.File;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    private AccountDao accountDao;

    @Autowired
    private RoleService roleService;

    @Autowired
    private MailService mailService;

    @Autowired
    private VerifyAccountDao verifyAccountDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserVisitRepository userVisitRepository;

    @Override
    public Map<String, String> authenticateUser(LoginDto loginDto) {
        try {
            Account account = getEmailOrUser(loginDto.getUsernameOrEmail());
            if (account.isLocked()) {
                throw new BadCredentialsException(Constants.LOCK_ACCOUNT);
            }
            if (account.getCountLock() < 5) {
                account.setCountLock(0);
                accountDao.update(account);
            }
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginDto.getUsernameOrEmail(), loginDto.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
            String role = authorities.stream()
                    .map(GrantedAuthority::getAuthority)
                    .findFirst()
                    .orElse(null);
            SecretKey KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
            String token = Jwts.builder().setSubject(userDetails.getUsername()).setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                    .claim("role", role)
                    .signWith(SignatureAlgorithm.HS256, KEY).compact();
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("username", userDetails.getUsername());
            response.put("role", role);
            response.put("firstName", userDetails.getFirstName());
            response.put("lastName", userDetails.getLastName());

            return response;
        } catch (Exception e) {
            try {
                Account account = getEmailOrUser(loginDto.getUsernameOrEmail());
                if (account.getCountLock() == null) {
                    account.setCountLock(0);
                }
                int newCountLock = account.getCountLock() + 1;

                if (newCountLock >= 5) {
                    account.setLocked(true);
                }
                account.setCountLock(newCountLock);
                accountDao.update(account);
            } catch (Exception exception) {
                exception.fillInStackTrace();
            }
            throw e;
        }
    }

    @Override
    public Account createMember(AccountCreateDto accountDto) throws Exception {

        String email = accountDto.getEmail();
        String username = accountDto.getUsername();
        String password = accountDto.getPassword();
        String firstName = accountDto.getFirstName();
        String lastName = accountDto.getLastName();

        if (accountDao.findByEmail(email).isPresent()) {
            throw new Exception(Constants.DUPLICATE_EMAIL);
        }

        if (accountDao.findByUsername(username).isPresent()) {
            throw new Exception(Constants.DUPLICATE_USERNAME);
        }

        Account account = new Account();
        account.setEmail(email);
        account.setUsername(username);
        account.setFirstName(firstName);
        account.setLastName(lastName);
        account.setPassword(passwordEncoder.encode(password));
        account.setActive(false);
        account.setLocked(false);
        account.setCreatedDate(new Date());
        account.setUpdatedDate(new Date());

        if (roleService.findById(2l).isPresent()) {
            Role role = roleService.findById(2l).get();
            account.addRole(role);
        }
        sendEmail(account);
        return accountDao.create(account);
    }

    @Override
    public Account findById(Long id) {
        Account account = accountRepository.findById(id).orElse(null);
        return account;
    }
    @Override
    public void verifyCode(VerifyCodeDto verifyCodeDto) {
        try {
            UserVisits userVisits = userVisitRepository.findByVisitDate(new Date(), 1);
            if (userVisits == null) {
                userVisits = new UserVisits();
                userVisits.setVisitDate(new Date());
                userVisits.setVisitCount(1L);
                userVisits.setType(1);
                userVisitRepository.save(userVisits);
            } else {
                userVisits.setVisitCount(userVisits.getVisitCount() + 1);
                userVisitRepository.save(userVisits);
            }
            String token = verifyCodeDto.getToken();
            Optional<VerifyAccount> verifyAccount = verifyAccountDao.findByToken(token);
            Account account = verifyAccount.get().getAccount();
            account.setActive(true);
            account.setCountLock(0);
            account.setLocked(false);
            accountDao.update(account);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    public boolean checkPassword(String userNameOrEmail, String oldPassword) {
        try {
            Account account = getEmailOrUser(userNameOrEmail);
            return passwordEncoder.matches(oldPassword, account.getPassword());
        } catch (Exception e) {
            e.fillInStackTrace();
            return false;
        }
    }

    public void changePassword(String userNameOrEmail, String newPassword) {
        Account account = getEmailOrUser(userNameOrEmail);
        account.setPassword(passwordEncoder.encode(newPassword));
        account.setActive(false);
        sendEmail(account);
        accountDao.update(account);
    }

    private void sendEmail(Account account) {
        try {
            String token = RandomUtil.generateRandomStringNumber(6).toUpperCase();

            VerifyAccount verifyAccount = new VerifyAccount();
            verifyAccount.setAccount(account);
            verifyAccount.setCreatedDate(LocalDateTime.now());
            verifyAccount.setExpiredDataToken(5);
            verifyAccount.setToken(token);
            verifyAccountDao.create(verifyAccount);

            Map<String, Object> maps = new HashMap<>();
            maps.put("account", account);
            maps.put("token", token);

            Mail mail = new Mail();
            mail.setFrom("postmaster@mg.iteacode.com");
            mail.setSubject("Mail xác nhận đăng ký.");
            mail.setTo(account.getEmail());
            mail.setModel(maps);
            mailService.sendEmail(mail);
        } catch (Exception e) {
            e.fillInStackTrace();
        }
    }

    @Override
    public void forgotPassword(String usernameOrEmail) {
        try {
            Account account = getEmailOrUser(usernameOrEmail);
            String password = generateRandomPassword();
            account.setPassword(passwordEncoder.encode(password));
            accountDao.update(account);
            VerifyAccount verifyAccount = new VerifyAccount();
            verifyAccount.setAccount(account);
            verifyAccount.setCreatedDate(LocalDateTime.now());
            verifyAccount.setExpiredDataToken(5);
            verifyAccount.setToken(password);
            verifyAccountDao.create(verifyAccount);

            Map<String, Object> maps = new HashMap<>();
            maps.put("account", account);
            maps.put("token", password);

            Mail mail = new Mail();
            mail.setFrom("postmaster@mg.iteacode.com");
            mail.setSubject("Mail xác nhận đăng ký.");
            mail.setTo(account.getEmail());
            mail.setModel(maps);
            mailService.sendEmail(mail);
        } catch (Exception e) {
            e.fillInStackTrace();
        }
    }

    private String generateRandomPassword() {
        int length = 12;
        String upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
        String digits = "0123456789";
        String specialChars = "!@#$%^&*()-_=+<>?";

        String allChars = upperCaseChars + lowerCaseChars + digits + specialChars;
        Random random = new Random();

        StringBuilder password = new StringBuilder();

        password.append(upperCaseChars.charAt(random.nextInt(upperCaseChars.length())));
        password.append(lowerCaseChars.charAt(random.nextInt(lowerCaseChars.length())));
        password.append(digits.charAt(random.nextInt(digits.length())));
        password.append(specialChars.charAt(random.nextInt(specialChars.length())));

        for (int i = password.length(); i < length; i++) {
            password.append(allChars.charAt(random.nextInt(allChars.length())));
        }

        Collections.shuffle(Arrays.asList(password.toString().split("")));

        return password.toString();
    }

    private Account getEmailOrUser(String usernameOrEmail) {
        try {
            EmailOrUser emailOrUser = new EmailOrUser();
            if (usernameOrEmail.contains("@")) {
                if (!isValidEmail(usernameOrEmail)) {
                    throw new RuntimeException(Constants.EMAIL_INVALID);
                }
                emailOrUser.setEmail(usernameOrEmail);
            } else {
                emailOrUser.setUsername(usernameOrEmail);
            }
            Account account = accountDao.findByUsernameOrEmail(emailOrUser.getUsername(),
                    emailOrUser.getEmail()).orElseThrow(() -> new RuntimeException(Constants.ACCOUNT_NOTFOUND));
            return account;
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public void unlockAccount(String usernameOrEmail) {
        try {
            Account account = getEmailOrUser(usernameOrEmail);
            account.setActive(false);
            sendEmail(account);
        } catch (Exception e) {
            e.fillInStackTrace();
        }
    }

    @Override
    public List<Account> getAllAccount(String username,
                                       String fromDate,
                                       String toDate,
                                       String isActive,
                                       String isLocked) {
        Boolean isActiveBl = null;
        if (StringUtils.isEmpty(isActive)) {
            isActiveBl = null;
        } else if ("true".equalsIgnoreCase(isActive)) {
            isActiveBl = true;
        } else if ("false".equalsIgnoreCase(isActive)) {
            isActiveBl = false;
        }
        Boolean isLockedBl = null;
        if (StringUtils.isEmpty(isLocked)) {
            isLockedBl = null;
        } else if ("true".equalsIgnoreCase(isLocked)) {
            isLockedBl = true;
        } else if ("false".equalsIgnoreCase(isLocked)) {
            isLockedBl = false;
        }
        LocalDateTime fromDateStr = null;
        if (StringUtils.isNotEmpty(fromDate)) {
            fromDateStr =  DateUtill.toStartOfDay(fromDate);
        }
        LocalDateTime toDateStr = null;
        if (StringUtils.isNotEmpty(toDate)) {
            toDateStr = DateUtill.toEndOfDay(toDate);
        }

        List<Account> accounts = accountRepository.findAllByConditions(
                StringUtils.isEmpty(username) ? null : username,
                fromDateStr,
                toDateStr,
                isActiveBl,
                isLockedBl
        );
        return accounts;
    }

    @Override
    public void lockAccount(String usernameOrEmail, Map<String, String> body) {
        try {
            String isLocked = body.get("isLocked");
            Account account = getEmailOrUser(usernameOrEmail);
            if ("false".equals(isLocked)) {
                account.setLocked(false);
            } else {
                account.setLocked(true);
            }
            accountDao.update(account);
        } catch (Exception e) {
            e.fillInStackTrace();
        }
    }

    @Override
    public List<Account> findByUsernameChat(String username) {
        return accountRepository.findByUsernameChat(username);
    }

    @Override
    public AccountUpdateDto updateAccount(AccountUpdateDto accountUpdateDto) throws Exception {
        try {
            Account account = accountDao.findById(accountUpdateDto.getId())
                    .orElseThrow(() -> new RuntimeException(Constants.ACCOUNT_NOTFOUND));
            account.setFirstName(accountUpdateDto.getFirstName());
            account.setLastName(accountUpdateDto.getLastName());
            account.setSex(accountUpdateDto.getSex());
            account.setPhoneNumber(accountUpdateDto.getPhoneNumber());
            if (accountUpdateDto.getImageFiles() != null && !accountUpdateDto.getImageFiles().isEmpty()) {
                if (account.getDirectoryPath() != null) {
                    File oldFile = new File(account.getDirectoryPath());
                    if (oldFile.exists()) {
                        oldFile.delete();
                    }
                }
                String fullPath = ShopUtil.handleFileUpload(accountUpdateDto.getImageFiles(), "accounts", account.getId());
                account.setDirectoryPath(fullPath);
            }
            account.setUpdatedDate(new Date());
            accountDao.update(account);
            return accountUpdateDto;
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public ChangeEmailDto changeEmail(ChangeEmailDto changeEmailDto) {
        try {
            Account account = accountRepository.findById(changeEmailDto.getId())
                    .orElseThrow(() -> new RuntimeException(Constants.ACCOUNT_NOTFOUND));
            account.setEmail(changeEmailDto.getEmail());
            accountRepository.save(account);
            return changeEmailDto;
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    private boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
        Pattern pattern = Pattern.compile(emailRegex);
        return pattern.matcher(email).matches();
    }
}