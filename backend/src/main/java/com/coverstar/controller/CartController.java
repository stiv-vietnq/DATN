package com.coverstar.controller;

import com.coverstar.constant.Constants;
import com.coverstar.dto.CartDto;
import com.coverstar.dto.ChangeQuantityDTO;
import com.coverstar.entity.Cart;
import com.coverstar.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/carts")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/createOrUpdateCart")
    public ResponseEntity<?> createOrUpdateCart(@RequestBody @Valid CartDto cartDto) {
        try {
            Cart cart = cartService.createOrUpdateCart(cartDto);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @GetMapping("/getAllCartsByUserId/{userId}")
    public ResponseEntity<?> getAllCartsByUserId(@PathVariable Long userId,
                                                 @RequestParam String name,
                                                 @RequestParam boolean status) {
        try {
            List<Cart> carts = cartService.getAllCartsByUserId(userId, name, status);
            return ResponseEntity.ok(carts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @GetMapping("/getCartById/{id}")
    public ResponseEntity<?> getCartById(@PathVariable Long id) {
        try {
            Cart cart = cartService.getCartById(id);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @PostMapping("/deleteCart")
    public ResponseEntity<?> deleteCart(@RequestBody Map<String, List<Long>> request) {
        try {
            List<Long> ids = request.get("itemIds");
            cartService.deleteCart(ids);
            return ResponseEntity.ok(HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @PostMapping("/changeQuantityAndTotal/{id}")
    public ResponseEntity<?> changeQuantityAndTotal(@PathVariable Long id,
                                                    @RequestBody ChangeQuantityDTO changeQuantityDTO) {
        try {
            Cart cart = cartService.changeQuanlityAndTotal(id, changeQuantityDTO.getQuantity(), changeQuantityDTO.getTotal());
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }
}