package com.coverstar.service;

import com.coverstar.dto.CartDto;
import com.coverstar.entity.Cart;

import java.util.List;

public interface CartService {
    Cart createOrUpdateCart(CartDto cartDto);
    List<Cart> getAllCartsByUserId(Long userId, String name, boolean status);
    Cart getCartById(Long id);
    void deleteCartById(Long id);
}