package com.coverstar.controller;

import com.coverstar.constant.Constants;
import com.coverstar.dto.PurchaseDto;
import com.coverstar.entity.Purchase;
import com.coverstar.service.PurchaseService;
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

@RestController
@RequestMapping("/purchases")
public class PurchaseController {

    @Autowired
    private PurchaseService purchaseService;

    @PostMapping("/createPurchase")
    public ResponseEntity<?> createPurchase(@RequestBody @Valid List<PurchaseDto> purchases) {
        try {
            purchaseService.createPurchase(purchases);
            return ResponseEntity.ok().build();
        } catch (Exception e) {

            if (e.getMessage().equals(Constants.DISCOUNT_EXPIRED)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Constants.DISCOUNT_EXPIRED);
            }

            if (e.getMessage().equals(Constants.INSUFFICIENT_PRODUCT_QUANTITY)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Constants.INSUFFICIENT_PRODUCT_QUANTITY);
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @PostMapping("/updateFirstWave/{id}")
    public ResponseEntity<?> updateFirstWave(@PathVariable Long id, @RequestParam Long addressId) {
        try {
            Purchase purchase = purchaseService.updateFirstWave(id, addressId);
            return ResponseEntity.ok(purchase);
        } catch (Exception e) {
            if (e.getMessage().equals(Constants.PURCHASE_NOT_FOUND)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Constants.PURCHASE_NOT_FOUND);
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @PostMapping("/updateStatus/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        try {
            Purchase purchase = purchaseService.updateStatus(id, status);
            return ResponseEntity.ok(purchase);
        } catch (Exception e) {

            if (e.getMessage().equals(Constants.ERROR_STATUS_UPDATE)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Constants.ERROR_STATUS_UPDATE);
            }

            if (e.getMessage().equals(Constants.PURCHASE_NOT_FOUND)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Constants.PURCHASE_NOT_FOUND);
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @GetMapping("/getPurchaseByUserId/{userId}")
    public ResponseEntity<?> getPurchaseByUserId(@PathVariable Long userId, @RequestParam String productName) {
        try {
            List<Purchase> purchases = purchaseService.getPurchaseByUserId(userId, productName);
            return ResponseEntity.ok(purchases);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @GetMapping("/admin/getAllPurchase")
    public ResponseEntity<?> getAllPurchase(@RequestParam Long userId,
                                            @RequestParam String paymentMethod,
                                            @RequestParam Integer status) {
        try {
            List<Purchase> purchases = purchaseService.getAllPurchase(userId, paymentMethod, status);
            return ResponseEntity.ok(purchases);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }
}
