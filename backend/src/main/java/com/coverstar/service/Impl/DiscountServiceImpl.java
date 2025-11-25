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
import java.util.*;
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
        boolean isCreate = (request.getId() == null);

        if (isCreate) {
            discount = new Discount();
            discount.setCreatedDate(new Date());
        } else {
            discount = discountRepository.findById(request.getId())
                    .orElseThrow(() -> new RuntimeException("Discount not found with id = " + request.getId()));
        }

        discount.setName(request.getName());
        discount.setStatus(request.getStatus());
        discount.setDiscountPercent(request.getDiscountPercent());
        discount.setExpiredDate(DateUtill.parseDateMaxTime(request.getExpiredDate()));
        discount.setUpdatedDate(new Date());

        discount = discountRepository.save(discount);

        List<String> productIds = request.getProductIds();
        if (productIds == null) productIds = Collections.emptyList();

        if (isCreate && !productIds.isEmpty()) {
            discountProductRepository.deleteByProductIdIn(productIds);

            List<Product> products = productRepository.findByIdIn(productIds);
            Discount finalDiscount1 = discount;
            List<DiscountProduct> discountProducts = products.stream().map(p -> {
                DiscountProduct dp = new DiscountProduct();
                dp.setDiscount(finalDiscount1);
                dp.setProductId(p.getId());
                return dp;
            }).collect(Collectors.toList());

            List<DiscountProduct> savedDiscountProducts = discountProductRepository.saveAll(discountProducts);
            for (DiscountProduct dp : savedDiscountProducts) {
                Product product = productRepository.getProductById(dp.getProductId());
                product.setDiscountProductId(dp.getId());
                productRepository.save(product);
            }
        } else if (!isCreate) {
            if (!productIds.isEmpty()) {
                discountProductRepository.deleteByProductIdInAndDiscountIdNot(productIds, discount.getId());
            }

            List<DiscountProduct> currentRelations = discountProductRepository.findByDiscountId(discount.getId());
            Set<String> currentProductIds = currentRelations.stream()
                    .map(dp -> dp.getProductId())
                    .collect(Collectors.toSet());

            Set<String> requestProductIdSet = new HashSet<>(productIds);

            Set<String> toDelete = new HashSet<>(currentProductIds);
            toDelete.removeAll(requestProductIdSet);

            Set<String> toAdd = new HashSet<>(requestProductIdSet);
            toAdd.removeAll(currentProductIds);

            if (!toDelete.isEmpty()) {
                discountProductRepository.deleteByDiscountIdAndProductIdIn(discount.getId(), toDelete);
            }

            if (!toAdd.isEmpty()) {
                List<Product> products = productRepository.findByIdIn(new ArrayList<>(toAdd));
                Discount finalDiscount = discount;
                List<DiscountProduct> discountProductsToAdd = products.stream().map(p -> {
                    DiscountProduct dp = new DiscountProduct();
                    dp.setDiscount(finalDiscount);
                    dp.setProductId(p.getId());
                    return dp;
                }).collect(Collectors.toList());

                List<DiscountProduct> savedDiscountProducts = discountProductRepository.saveAll(discountProductsToAdd);
                for (DiscountProduct dp : savedDiscountProducts) {
                    Product product = productRepository.getProductById(dp.getProductId());
                    product.setDiscountProductId(dp.getId());
                    productRepository.save(product);
                }
            }
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