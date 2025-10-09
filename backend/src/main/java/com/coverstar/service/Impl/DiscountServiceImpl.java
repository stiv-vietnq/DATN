package com.coverstar.service.Impl;

import com.coverstar.component.mail.MailService;
import com.coverstar.constant.Constants;
import com.coverstar.entity.Account;
import com.coverstar.entity.Discount;
import com.coverstar.repository.AccountRepository;
import com.coverstar.repository.DiscountRepository;
import com.coverstar.service.DiscountService;
import com.coverstar.utils.DateUtill;
import com.coverstar.utils.ShopUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class DiscountServiceImpl implements DiscountService {

    @Autowired
    private DiscountRepository discountRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private MailService mailService;

    @Override
    public Discount createOrUpdateDiscount(Long id,
                                           String name,
                                           String code,
                                           String description,
                                           BigDecimal percent,
                                           MultipartFile imageFile,
                                           String expiredDate,
                                           List<Long> userIds,
                                           Integer discountType,
                                           BigDecimal levelApplied) throws Exception {
        Discount discount = new Discount();
        try {
            String orderTitle = "Có những ưu đãi mới đang chờ đón bạn sử dụng.";
            String subject = "Thông báo.";
            boolean isCodeExist = id == null
                    ? discountRepository.existsByCode(code)
                    : discountRepository.existsByCodeAndIdNot(code, id);

            if (isCodeExist) {
                throw new Exception(Constants.DUPLICATE_DISCOUNT);
            }

            if (id != null) {
                discount = discountRepository.findById(id).orElse(null);
                discount.setUpdatedDate(new Date());
                discount.setStatus(true);
            } else {
                if (imageFile == null || imageFile.isEmpty()) {
                    throw new Exception(Constants.NOT_IMAGE);
                }
                discount.setCreatedDate(new Date());
                discount.setStatus(true);
            }
            discount.setName(name);
            discount.setCode(code);
            discount.setDiscountPercent(percent);
            discount.setDescription(description);
            discount.setExpiredDate(DateUtill.parseDate(expiredDate));
            discount.setDiscountType(discountType);
            discount.setLevelApplied(levelApplied);
            if (userIds != null && !userIds.isEmpty()) {
                Set<Account> accounts = new HashSet<>();
                for (Long usedId : userIds) {
                    Account account = accountRepository.findById(usedId).orElse(null);
                    if (discount != null) {
                        accounts.add(account);
                    }
                    ShopUtil.sendMailPurchaseOrDiscount(account, orderTitle, subject, mailService, 2);
                }
                discount.setAccounts(accounts);
            }
            discount = discountRepository.save(discount);

            if (imageFile != null && !imageFile.isEmpty()) {
                if (discount.getDirectoryPath() != null) {
                    File oldFile = new File(discount.getDirectoryPath());
                    if (oldFile.exists()) {
                        oldFile.delete();
                    }
                }
                String fullPath = ShopUtil.handleFileUpload(imageFile, "discount", discount.getId());
                discount.setDirectoryPath(fullPath);
            }
            discountRepository.save(discount);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
        return discount;
    }

    @Override
    public List<Discount> searchDiscount(String name, Boolean status, String code, Long accountId, Integer discountType) {
        List<Discount> discounts;
        try {
            String nameValue = name != null ? name : StringUtils.EMPTY;
            Boolean statusValue = status != null ? status : null;
            String codeValue = code != null ? code : StringUtils.EMPTY;
            discounts = discountRepository.findAllByStatus(nameValue, statusValue, codeValue, accountId, discountType);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
        return discounts;
    }

    @Override
    public Discount getDiscount(Long id, Integer type) throws Exception {
        try {
            Discount discount = discountRepository.findById(id).orElse(null);
            if (type == 1 && discount != null && discount.getExpiredDate().before(new Date())) {
                discount.setStatus(false);
                discountRepository.save(discount);
                throw new Exception(Constants.DISCOUNT_EXPIRED);
            }
            return discount;
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public void deleteDiscount(Long id) {
        try {
            Discount discount = discountRepository.findById(id).orElse(null);
            if (discount != null && discount.getDirectoryPath() != null) {
                File oldFile = new File(discount.getDirectoryPath());
                if (oldFile.exists()) {
                    oldFile.delete();
                }
            }

            discountRepository.deleteById(id);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public Discount updateStatus(Long id, boolean status) {
        try {
            Discount discount = discountRepository.findById(id).orElse(null);
            if (discount != null) {
                discount.setStatus(status);
                discount.setUpdatedDate(new Date());
                discountRepository.save(discount);
            }
            return discount;
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }
}