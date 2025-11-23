package com.coverstar.controller;

import com.coverstar.constant.Constants;
import com.coverstar.dto.DiscountCreateRequest;
import com.coverstar.entity.Discount;
import com.coverstar.service.DiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/discounts")
public class DiscountController {

    @Autowired
    private DiscountService discountService;

    @PostMapping("/admin/createOrUpdate")
    public ResponseEntity<?> createOrUpdate(@Valid @RequestBody DiscountCreateRequest discountCreateRequest) {
        try {
            Discount discount = discountService.createOrUpdateDiscount(discountCreateRequest);
            return ResponseEntity.ok(discount);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @PostMapping("/admin/updateStatus/{discountId}")
    public ResponseEntity<?> updateStatus(@RequestParam(name = "status", required = false) Boolean status,
                                          @PathVariable Long discountId) {
        try {
            Discount discount = discountService.updateStatus(discountId, status);
            return ResponseEntity.ok(discount);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @PostMapping("/admin/updateExpiredDate/{discountId}")
    public ResponseEntity<?> updateExpiredDate(@RequestParam(name = "expiredDate", required = false) String expiredDate,
                                          @PathVariable Long discountId) {
        try {
            Discount discount = discountService.updateExpiredDate(discountId, expiredDate);
            return ResponseEntity.ok(discount);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @GetMapping("/admin/getById/{discountId}")
    public ResponseEntity<?> getById(@PathVariable Long discountId) {
        try {
            Discount discount = discountService.getById(discountId);
            return ResponseEntity.ok(discount);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @GetMapping("/admin/search")
    public ResponseEntity<?> search(
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "status", required = false) Boolean status) {
        try {
            List<Discount> discounts = discountService.search(name, status);
            return ResponseEntity.ok(discounts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }
}