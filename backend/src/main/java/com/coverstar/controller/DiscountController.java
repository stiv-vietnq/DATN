package com.coverstar.controller;

import com.coverstar.constant.Constants;
import com.coverstar.entity.Discount;
import com.coverstar.service.DiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/discounts")
public class DiscountController {

    @Autowired
    private DiscountService discountService;

    @PostMapping("/admin/createOrUpdateDiscount")
    public ResponseEntity<?> createOrUpdateDiscount(
            @RequestParam(value = "id", required = false) Long id,
            @RequestParam("name") String name,
            @RequestParam("code") String code,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("percent") BigDecimal percent,
            @RequestParam(value = "file", required = false) MultipartFile imageFiles,
            @RequestParam("expiredDate") String expiredDate,
            @RequestParam(value = "userIds", required = false) List<Long> discountIds,
            @RequestParam("discountType") Integer discountType,
            @RequestParam("levelApplied") BigDecimal levelApplied) {
        try {
            Discount discount = discountService.createOrUpdateDiscount(id, name, code,
                    description, percent, imageFiles, expiredDate, discountIds, discountType, levelApplied);
            return ResponseEntity.ok(discount);
        } catch (Exception e) {

            if (e.getMessage().equals(Constants.NOT_IMAGE)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Constants.NOT_IMAGE);
            }

            if (e.getMessage().equals(Constants.DUPLICATE_DISCOUNT)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Constants.DUPLICATE_DISCOUNT);
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchDiscount(@RequestParam(value = "name", required = false) String name,
                                            @RequestParam(value = "status", required = false) Boolean status,
                                            @RequestParam(value = "code", required = false) String code,
                                            @RequestParam(value = "accountId", required = false) Long accountId,
                                            @RequestParam(value = "discountType", required = false) Integer discountType) {
        try {
            List<Discount> discounts = discountService.searchDiscount(name, status, code, accountId, discountType);
            return ResponseEntity.ok(discounts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @GetMapping("/getDiscount/{id}")
    public ResponseEntity<?> getDiscount(@PathVariable Long id,
                                         @RequestParam("type") Integer type) {
        try {
            Discount discount = discountService.getDiscount(id, type);
            return ResponseEntity.ok(discount);
        } catch (Exception e) {

            if (e.getMessage().equals(Constants.DISCOUNT_EXPIRED)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Constants.DISCOUNT_EXPIRED);
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @PostMapping("/admin/deleteDiscount/{id}")
    public ResponseEntity<?> deleteDiscount(@PathVariable Long id) {
        try {
            discountService.deleteDiscount(id);
            return ResponseEntity.ok(HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @PostMapping("/admin/updateStatus/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam("status") boolean status) {
        try {
            Discount discount = discountService.updateStatus(id, status);
            return ResponseEntity.ok(discount);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }


}