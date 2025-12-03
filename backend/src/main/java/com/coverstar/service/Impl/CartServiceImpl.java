package com.coverstar.service.Impl;

import com.coverstar.dto.CartDto;
import com.coverstar.entity.Cart;
import com.coverstar.repository.CartRepository;
import com.coverstar.service.CartService;
import com.coverstar.service.ProductDetailService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductDetailService productDetailService;

    @Override
    public Cart createOrUpdateCart(CartDto cartDto) {
        Cart cart;
        try {
            if (cartDto.getId() != null) {
                cart = cartRepository.findById(cartDto.getId()).orElse(null);
                cart.setUpdatedDate(new Date());
                if (Objects.equals(cartDto.getProductDetailId(), cart.getProductDetail().getId())
                        && Objects.equals(cartDto.getUserId(), cart.getUserId())) {
                    cart.setQuantity(cart.getQuantity() + cartDto.getQuantity());
                    cart.setTotal(cart.getTotal().add(cartDto.getTotal()));
                    cart.setSize(cartDto.getSize());
                    cart.setStatus(true);
                }
            } else {
                cart = cartRepository.findByProductDetailIdAndUserIdAndSize(cartDto.getProductDetailId(),
                        cartDto.getUserId(), cartDto.getSize());

                if (cart != null) {
                    cart.setUpdatedDate(new Date());
                    cart.setQuantity(cart.getQuantity() + cartDto.getQuantity());
                    cart.setTotal(cart.getTotal().add(cartDto.getTotal()));
                    cart.setStatus(true);
                } else {
                    cart = new Cart();
                    cart.setCreatedDate(new Date());
                    cart.setProductDetail(productDetailService.getProductById(cartDto.getProductDetailId()));
                    cart.setUserId(cartDto.getUserId());
                    cart.setQuantity(cartDto.getQuantity());
                    cart.setTotal(cartDto.getTotal());
                    cart.setSize(cartDto.getSize());
                    cart.setStatus(true);
                }
            }
            return cartRepository.save(cart);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public List<Cart> getAllCartsByUserId(Long userId, String name, boolean status) {
        try {
            String nameValue = name != null ? name : StringUtils.EMPTY;
            return cartRepository.findAllByUserIdOrderByCreatedDate(userId, nameValue, status);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }

    }

    @Override
    public Cart getCartById(Long id) {
        try {
            return cartRepository.findById(id).orElse(null);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public void deleteCart(List<Long> id) {
        try {
            for (Long cartId : id) {
                cartRepository.deleteById(cartId);
            }
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public Cart changeQuanlityAndTotal(Long id, Long quantity, String total) {
        Cart cart = getCartById(id);
        BigDecimal totalUpdate = new BigDecimal(total);
        cart.setQuantity(quantity);
        cart.setTotal(totalUpdate);
        cartRepository.save(cart);
        return cart;
    }
}