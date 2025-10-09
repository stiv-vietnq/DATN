package com.coverstar.controller;

import com.coverstar.constant.Constants;
import com.coverstar.dto.*;
import com.coverstar.entity.Account;
import com.coverstar.service.AccountService;
import org.apache.commons.lang3.StringUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.ConstraintViolation;
import javax.validation.Valid;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
public class AccountController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private javax.validation.Validator validator;

    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@Valid @RequestBody AccountCreateDto accountCreateDto, BindingResult bindingResult) {
        try {

            if (bindingResult.hasErrors()) {
                List<String> errors = bindingResult.getFieldErrors().stream()
                        .map(error -> error.getField() + ": " + error.getDefaultMessage())
                        .collect(Collectors.toList());
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            Account account = accountService.createMember(accountCreateDto);
            accountCreateDto.setId(account.getId());
            return ResponseEntity.ok(accountCreateDto);

        } catch (Exception e) {
            if (e.getMessage().equals(Constants.DUPLICATE_EMAIL)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Constants.DUPLICATE_EMAIL);
            }
            if (e.getMessage().equals(Constants.DUPLICATE_USERNAME)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Constants.DUPLICATE_USERNAME);
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCodeAction(@Valid @RequestBody VerifyCodeDto verifyCodeDto) {
        try {
            accountService.verifyCode(verifyCodeDto);
            return ResponseEntity.ok(Constants.VALID_VERIFICATION);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.VERIFYING_ERROR);
        }
    }

    @PostMapping("/sign-in")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginDto loginDto) {
        try {
            Map<String, String> response = accountService.authenticateUser(loginDto);
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            if (e.getMessage().equals(Constants.LOCK_ACCOUNT)) {
                return ResponseEntity.status(HttpStatus.LOCKED).body(Constants.LOCK_ACCOUNT);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Constants.INVALID_USERNAME);
        } catch (Exception e) {

            if (e.getMessage().equals(Constants.EMAIL_INVALID)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Constants.EMAIL_INVALID);
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.VERIFYING_ERROR);
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordDto changePasswordDto) {
        try {
            if (!changePasswordDto.isPasswordsMatch()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Constants.INVALID_PASSWORD);
            }

            boolean isPasswordCorrect = accountService.checkPassword(changePasswordDto.getUsernameOrEmail(), changePasswordDto.getOldPassword());
            if (!isPasswordCorrect) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Constants.INVALID_OLD_PASSWORD);
            }

            accountService.changePassword(changePasswordDto.getUsernameOrEmail(), changePasswordDto.getNewPassword());
            return ResponseEntity.ok(HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR_PASSWORD);
        }
    }

    @PostMapping("/forgot-password/{usernameOrEmail}")
    public ResponseEntity<?> forgotPassword(@PathVariable String usernameOrEmail) {
        try {
            if (StringUtils.isBlank(usernameOrEmail)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Constants.USERNAME_EMAIL_REQUIRED);
            }

            accountService.forgotPassword(usernameOrEmail);
            return ResponseEntity.ok(HttpStatus.OK);
        } catch (Exception e) {

            if (e.getMessage().equals(Constants.EMAIL_INVALID)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Constants.EMAIL_INVALID);
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR_EMAIL);
        }
    }

//    @GetMapping("/user")
//    public Map<String, Object> getUser(@AuthenticationPrincipal OAuth2User oAuth2User) {
//        return oAuth2User.getAttributes();
//    }

    @PostMapping("/unlock-account/{usernameOrEmail}")
    public ResponseEntity<?> unlockAccount(@PathVariable String usernameOrEmail) {
        try {
            if (StringUtils.isBlank(usernameOrEmail)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Constants.USERNAME_EMAIL_REQUIRED);
            }
            accountService.unlockAccount(usernameOrEmail);
            return ResponseEntity.ok(HttpStatus.OK);
        } catch (Exception e) {

            if (e.getMessage().equals(Constants.EMAIL_INVALID)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Constants.EMAIL_INVALID);
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR_UNLOCK);
        }
    }

    @GetMapping("/account/{id}")
    public ResponseEntity<?> getAccount(@PathVariable Long id) {
        try {
            Account account = accountService.findById(id);
            if (account == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Constants.ACCOUNT_NOTFOUND);
            }
            ModelMapper modelMapper = new ModelMapper();
            AccountDto accountDto = modelMapper.map(account, AccountDto.class);
            return ResponseEntity.ok(accountDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Constants.ACCOUNT_NOTFOUND);
        }
    }

    @GetMapping("/admin/getAll")
    public ResponseEntity<?> getAllAccount() {
        try {
            List<Account> accounts = accountService.getAllAccount();
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR_GET_ALL_ACCOUNT);
        }
    }

    @PostMapping("/admin/lock-account/{usernameOrEmail}")
    public ResponseEntity<?> lockAccount(@PathVariable String usernameOrEmail) {
        try {
            if (StringUtils.isBlank(usernameOrEmail)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Constants.USERNAME_EMAIL_REQUIRED);
            }

            accountService.lockAccount(usernameOrEmail);
            return ResponseEntity.ok(HttpStatus.OK);
        } catch (Exception e) {

            if (e.getMessage().equals(Constants.EMAIL_INVALID)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Constants.EMAIL_INVALID);
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @PostMapping("/update-account")
    public ResponseEntity<?> updateAccount(@RequestParam("id") Long id,
                                           @RequestParam("firstName") String firstName,
                                           @RequestParam("lastName") String lastName,
                                           @RequestParam("dateOfBirth") @DateTimeFormat(pattern = "dd/MM/yyyy") Date dateOfBirth,
                                           @RequestParam("sex") Integer sex,
                                           @RequestParam("phoneNumber") String phoneNumber,
                                           @RequestParam(value = "file", required = false) MultipartFile imageFiles) {
        try {
            AccountUpdateDto accountUpdateDto = new AccountUpdateDto(id, firstName, lastName, dateOfBirth,
                    sex, phoneNumber, imageFiles);

            if (!accountUpdateDto.isValidFile()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Constants.OVER_CAPACITY);
            }

            Set<ConstraintViolation<AccountUpdateDto>> violations = validator.validate(accountUpdateDto);
            if (!violations.isEmpty()) {
                String errorMessage = violations.stream()
                        .map(ConstraintViolation::getMessage)
                        .collect(Collectors.joining(", "));
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
            }

            AccountUpdateDto account = accountService.updateAccount(accountUpdateDto);
            return ResponseEntity.ok(account);
        } catch (Exception e) {

            if (e.getMessage().equals(Constants.ACCOUNT_NOTFOUND)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Constants.ACCOUNT_NOTFOUND);
            }

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Constants.ACCOUNT_NOTFOUND);
        }
    }

    @PostMapping("/change-email")
    public ResponseEntity<?> changeEmail(@Valid @RequestBody ChangeEmailDto changeEmailDto, BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                List<String> errors = bindingResult.getFieldErrors().stream()
                        .map(error -> error.getField() + ": " + error.getDefaultMessage())
                        .collect(Collectors.toList());
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }
            ChangeEmailDto emailDto = accountService.changeEmail(changeEmailDto);
            return ResponseEntity.ok(emailDto);
        } catch (Exception e) {

            if (e.getMessage().equals(Constants.ACCOUNT_NOTFOUND)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Constants.ACCOUNT_NOTFOUND);
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR_EMAIL);
        }
    }
}
