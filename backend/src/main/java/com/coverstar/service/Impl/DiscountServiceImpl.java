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
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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
            discount.setName(request.getName());
            discount.setStatus(request.getStatus());
            discount.setDiscountPercent(request.getDiscountPercent());
            discount.setExpiredDate(DateUtill.parseDateMaxTime(request.getExpiredDate()));
            discount.setUpdatedDate(new Date());

            discount = discountRepository.save(discount);

            if (request.getProductIds() != null && !request.getProductIds().isEmpty()) {
                List<Product> productsToAdd = productRepository.findByIdIn(request.getProductIds());
                for (Product p : productsToAdd) {
                    DiscountProduct dp = new DiscountProduct();
                    dp.setDiscount(discount);
                    dp.setProduct(p);
                    discountProductRepository.save(dp);
                }
            }
        } else {
            discount = discountRepository.findById(request.getId())
                    .orElseThrow(() -> new RuntimeException("Discount not found with id = " + request.getId()));

            List<DiscountProduct> currentRelations =
                    discountProductRepository.findByDiscountId(discount.getId());

            Set<String> currentProductIds = currentRelations.stream()
                    .map(dp -> dp.getProduct().getId())
                    .collect(Collectors.toSet());

            Set<String> requestProductIds = new HashSet<>(request.getProductIds());

            Set<String> toDelete = currentProductIds.stream()
                    .filter(id -> !requestProductIds.contains(id))
                    .collect(Collectors.toSet());

            Set<String> toAdd = requestProductIds.stream()
                    .filter(id -> !currentProductIds.contains(id))
                    .collect(Collectors.toSet());

            if (!toDelete.isEmpty()) {
                discountProductRepository.deleteByDiscountIdAndProductIdIn(discount.getId(), toDelete);
            }

            if (!toAdd.isEmpty()) {
                List<Product> productsToAdd = productRepository.findByIdIn(new ArrayList<>(toAdd));
                for (Product p : productsToAdd) {
                    DiscountProduct dp = new DiscountProduct();
                    dp.setDiscount(discount);
                    dp.setProduct(p);
                    discountProductRepository.save(dp);
                }
            }

            discount.setName(request.getName());
            discount.setStatus(request.getStatus());
            discount.setDiscountPercent(request.getDiscountPercent());
            discount.setExpiredDate(DateUtill.parseDateMaxTime(request.getExpiredDate()));
            discount.setUpdatedDate(new Date());

            discount = discountRepository.save(discount);
        }

        return discount;
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

    @Override
    @Transactional
    public void delete(Long discountId) {
        Discount discount = discountRepository.findById(discountId)
                .orElseThrow(() -> new RuntimeException("Discount not found with id = " + discountId));

        discountProductRepository.deleteByDiscountId(discountId);

        discountRepository.delete(discount);
    }
}