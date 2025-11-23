package com.coverstar.service.Impl;

import com.coverstar.dto.DiscountCreateRequest;
import com.coverstar.entity.Discount;
import com.coverstar.entity.DiscountProduct;
import com.coverstar.entity.Product;
import com.coverstar.repository.DiscountProductRepository;
import com.coverstar.repository.DiscountRepository;
import com.coverstar.repository.ProductRepository;
import com.coverstar.service.DiscountService;
import com.coverstar.utils.DateUtill;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;

@Service
public class DiscountServiceImpl implements DiscountService {

    @Autowired
    private DiscountRepository discountRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private DiscountProductRepository discountProductRepository;

    @Override
    @Transactional
    public Discount createOrUpdateDiscount(DiscountCreateRequest request) {

        Discount discount;

        if (request.getId() == null) {
            discount = new Discount();
            discount.setCreatedDate(new Date());
        } else {
            discount = discountRepository.findById(request.getId())
                    .orElseThrow(() -> new RuntimeException("Discount not found with id = " + request.getId()));

            discountProductRepository.deleteByDiscountId(discount.getId());
        }

        discount.setName(request.getName());
        discount.setStatus(request.getStatus());
        discount.setDiscountPercent(request.getDiscountPercent());
        discount.setExpiredDate(DateUtill.parseDateMaxTime(request.getExpiredDate()));
        discount.setUpdatedDate(new Date());

        Discount savedDiscount = discountRepository.save(discount);

        List<Product> products = productRepository.findByIdIn(request.getProductIds());

        for (Product p : products) {
            DiscountProduct dp = new DiscountProduct();
            dp.setDiscount(savedDiscount);
            dp.setProduct(p);
            discountProductRepository.save(dp);
        }

        return savedDiscount;
    }

    @Override
    public Discount updateStatus(Long discountId, Boolean status) {
        Discount discount = discountRepository.findById(discountId)
                .orElseThrow(() -> new RuntimeException("Discount not found with id = " + discountId));

        discount.setStatus(status);
        discount.setUpdatedDate(new Date());

        return discountRepository.save(discount);
    }

    @Override
    public Discount updateExpiredDate(Long discountId, String expiredDate) {
        Discount discount = discountRepository.findById(discountId)
                .orElseThrow(() -> new RuntimeException("Discount not found with id = " + discountId));

        discount.setExpiredDate(DateUtill.parseDateMaxTime(expiredDate));
        discount.setUpdatedDate(new Date());

        return discountRepository.save(discount);
    }

    @Override
    public Discount getById(Long discountId) {
        return discountRepository.findById(discountId)
                .orElseThrow(() -> new RuntimeException("Discount not found with id = " + discountId));
    }

    @Override
    public List<Discount> search(String name, Boolean status) {
        String nameValue = name != null ? name : StringUtils.EMPTY;
        return discountRepository.search(nameValue, status);
    }
}