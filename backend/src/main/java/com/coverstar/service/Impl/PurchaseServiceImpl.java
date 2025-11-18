package com.coverstar.service.Impl;

import com.coverstar.component.mail.Mail;
import com.coverstar.component.mail.MailService;
import com.coverstar.constant.Constants;
import com.coverstar.dto.PurchaseDto;
import com.coverstar.dto.PurchaseItemDto;
import com.coverstar.entity.*;
import com.coverstar.repository.*;
import com.coverstar.service.*;
import com.coverstar.utils.ShopUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.util.*;

@Service
public class PurchaseServiceImpl implements PurchaseService {

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private AddressService addressService;

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserVisitRepository userVisitRepository;

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Autowired
    private DiscountService discountService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private MailService mailService;

    @Override
    @Transactional
    public List<Purchase> createPurchase(List<PurchaseDto> purchaseDtos) throws Exception {
        List<Purchase> purchases = new ArrayList<>();

        try {
            for (PurchaseDto purchaseDto : purchaseDtos) {
                getUserVisits(4);

                if (purchaseDto.getDiscountId() != null) {
                    discountService.getDiscount(purchaseDto.getDiscountId(), 1);
                }

                Purchase purchase = new Purchase();
                purchase.setUserId(purchaseDto.getUserId());
                purchase.setAddress(addressService.getAddressById(purchaseDto.getAddressId()));
                purchase.setDescription(purchaseDto.getDescription());
                purchase.setPaymentMethod(purchaseDto.getPaymentMethod());
                purchase.setStatus(Integer.valueOf(Constants.Number.ONE));
                purchase.setFirstWave(Integer.valueOf(Constants.Number.ONE));
                purchase.setCreatedDate(new Date());
                purchase.setUpdatedDate(new Date());
                purchase.setPurchaseItems(new ArrayList<>());

                if (purchaseDto.getItems() == null || purchaseDto.getItems().isEmpty()) {
                    throw new Exception("Danh sách sản phẩm trong đơn hàng trống!");
                }

                for (PurchaseItemDto itemDto : purchaseDto.getItems()) {

                    Product product = productService.getProductById(itemDto.getProductId());
                    ProductDetail productDetail = productDetailRepository
                            .findById(itemDto.getProductDetailId())
                            .orElseThrow(() -> new Exception("Không tìm thấy chi tiết sản phẩm"));

                    if (productDetail.getQuantity() < itemDto.getQuantity()) {
                        throw new Exception(Constants.INSUFFICIENT_PRODUCT_QUANTITY);
                    }

                    productDetail.setQuantity(productDetail.getQuantity() - itemDto.getQuantity());
                    productDetail.setQuantitySold(
                            (productDetail.getQuantitySold() == null ? 0L : productDetail.getQuantitySold()) + itemDto.getQuantity()
                    );
                    productDetailRepository.save(productDetail);

                    if (product.getQuantitySold() == null) product.setQuantitySold(0L);
                    product.setQuantitySold(product.getQuantitySold() + itemDto.getQuantity());
                    productRepository.save(product);

                    Category category = categoryService.getCategoryById(product.getCategoryId());
                    if (category.getQuantitySold() == null) category.setQuantitySold(0L);
                    category.setQuantitySold(category.getQuantitySold() + itemDto.getQuantity());
                    categoryRepository.save(category);

                    PurchaseItem item = new PurchaseItem();
                    item.setPurchase(purchase);
                    item.setProduct(product);
                    item.setProductDetail(productDetail);
                    item.setQuantity(itemDto.getQuantity());
                    item.setTotal(new BigDecimal(itemDto.getTotal()));
                    item.setTotalAfterDiscount(new BigDecimal(itemDto.getTotalAfterDiscount()));

                    purchase.getPurchaseItems().add(item);
                }

                getUserVisits(2);

                purchase = purchaseRepository.save(purchase);
                purchases.add(purchase);
            }

            String orderTitle = "Người gửi xác nhận đơn hàng.";
            String subject = "Đặt hàng thành công.";
            Account account = accountService.findById(purchaseDtos.get(0).getUserId());
            ShopUtil.sendMailPurchaseOrDiscount(account, orderTitle, subject, mailService, 1);

            return purchases;
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }


    @Override
    public Purchase updateFirstWave(Long id, Long addressId) throws Exception {
        try {
            Purchase purchase = purchaseRepository.findById(id).orElse(null);
            if (purchase == null) {
                throw new Exception(Constants.PURCHASE_NOT_FOUND);
            }
            purchase.setAddress(addressService.getAddressById(addressId));
            purchase.setFirstWave(Integer.valueOf(Constants.Number.TWO));
            purchase.setUpdatedDate(new Date());
            return purchaseRepository.save(purchase);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public Purchase updateStatus(Long id, Integer status) throws Exception {
        try {
            Purchase purchase = purchaseRepository.findById(id)
                    .orElseThrow(() -> new Exception(Constants.PURCHASE_NOT_FOUND));

            if (purchase.getStatus() == 4 || purchase.getStatus() == 5) {
                throw new Exception(Constants.ERROR_STATUS_UPDATE);
            }

            String orderTitle = "";
            String subject = "";

            if (status == 5) {
                for (PurchaseItem item : purchase.getPurchaseItems()) {
                    Product product = productService.getProductById(item.getProduct().getId());
                    ProductDetail productDetail = productDetailRepository.getById(item.getProductDetail().getId());

                    if (product.getQuantitySold() < item.getQuantity()) {
                        throw new Exception(Constants.ERROR);
                    }
                    product.setQuantitySold(product.getQuantitySold() - item.getQuantity());
                    productRepository.save(product);

                    productDetail.setQuantity(productDetail.getQuantity() + item.getQuantity());
                    productDetailRepository.save(productDetail);
                }

                orderTitle = "Người gửi đã xác nhận đơn hàng bị hủy.";
                subject = "Hủy đơn hàng thành công.";
            } else if (status == 2) {
                orderTitle = "Đơn hàng chuẩn bị bàn giao cho đơn vị vận chuyển.";
                subject = "Đang được chuẩn bị.";
            } else if (status == 3) {
                orderTitle = "Đơn hàng đã được bàn giao cho đơn vị vận chuyển.";
                subject = "Đã bàn giao cho đơn vị vận chuyển.";
            } else if (status == 4) {
                orderTitle = "Đơn hàng đã được giao thành công.";
                subject = "Đã giao hàng thành công.";
            }

            if (!orderTitle.isEmpty()) {
                Account account = accountService.findById(purchase.getUserId());
                ShopUtil.sendMailPurchaseOrDiscount(account, orderTitle, subject, mailService, 1);
            }

            purchase.setStatus(status);
            purchase.setUpdatedDate(new Date());
            return purchaseRepository.save(purchase);

        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }


    @Override
    public List<Purchase> getPurchaseByUserId(Long userId, String productName, String status) {
        try {
            Integer statusValue = null;
            if (StringUtils.isNotEmpty(status)) {
                statusValue = Integer.parseInt(status);
            }
            String productNameValue = productName != null ? productName : StringUtils.EMPTY;
            return purchaseRepository.findAllByUserId(userId, productNameValue, statusValue);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public List<Purchase> getAllPurchase(Long userId, String paymentMethod, Integer status) {
        try {
            Long userIdValue = userId != 0 ? userId : null;
            Integer statusValue = status != 0 ? status : null;
            String paymentMethodValue = StringUtils.EMPTY.equals(paymentMethod) ? paymentMethod : null;
            return purchaseRepository.findAllByUserIdAndPaymentMethodContainingAndStatus(userIdValue, paymentMethodValue, statusValue);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    private void getUserVisits(Integer type) {
        try {
            UserVisits userVisits = userVisitRepository.findByVisitDate(type);
            if (userVisits == null) {
                userVisits = new UserVisits();
                userVisits.setVisitDate(new Date());
                userVisits.setVisitCount(1L);
                userVisits.setType(type);
                userVisitRepository.save(userVisits);
            } else {
                userVisits.setVisitCount(userVisits.getVisitCount() + 1);
                userVisitRepository.save(userVisits);
            }
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }
}
