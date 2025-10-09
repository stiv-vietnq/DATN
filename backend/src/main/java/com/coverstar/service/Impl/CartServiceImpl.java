package com.coverstar.service.Impl;

import com.coverstar.dto.CartDto;
import com.coverstar.entity.Cart;
import com.coverstar.repository.CartRepository;
import com.coverstar.service.CartService;
import com.coverstar.service.ProductService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductService productService;

    @Override
    public Cart createOrUpdateCart(CartDto cartDto) {
        Cart cart;
        try {
            if (cartDto.getId() != null) {
                cart = cartRepository.findById(cartDto.getId()).orElse(null);
                cart.setUpdatedDate(new Date());
                if (Objects.equals(cartDto.getProductId(), cart.getProduct().getId())
                        && Objects.equals(cartDto.getUserId(), cart.getUserId())) {
                    cart.setQuantity(cart.getQuantity() + cartDto.getQuantity());
                    cart.setTotal(cart.getTotal().add(cartDto.getTotal()));
                    cart.setColor(cartDto.getColor());
                    cart.setSize(cartDto.getSize());
                    cart.setStatus(true);
                }
            } else {
                cart = cartRepository.findByProductIdAndUserIdAndColorAndSize(cartDto.getProductId(),
                        cartDto.getUserId(), cartDto.getColor(), cartDto.getSize());

                if (cart != null) {
                    cart.setUpdatedDate(new Date());
                    cart.setQuantity(cart.getQuantity() + cartDto.getQuantity());
                    cart.setTotal(cart.getTotal().add(cartDto.getTotal()));
                    cart.setStatus(true);
                } else {
                    cart = new Cart();
                    cart.setCreatedDate(new Date());
                    cart.setProduct(productService.getProductById(cartDto.getProductId()));
                    cart.setUserId(cartDto.getUserId());
                    cart.setQuantity(cartDto.getQuantity());
                    cart.setTotal(cartDto.getTotal());
                    cart.setColor(cartDto.getColor());
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
    public void deleteCartById(Long id) {
        try {
            cartRepository.deleteById(id);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }
}