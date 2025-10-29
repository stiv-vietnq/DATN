//package com.coverstar.controller;
//
//import com.coverstar.constant.Constants;
//import com.coverstar.dto.ShippingMethodDto;
//import com.coverstar.entity.ShippingMethod;
//import com.coverstar.service.ShippingMethodService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import javax.validation.Valid;
//import java.util.List;
//
//@RestController
//@RequestMapping("/shipping-methods")
//public class ShippingMethodController {
//
//    @Autowired
//    private ShippingMethodService shippingMethodService;
//
//    @GetMapping("/getAllShippingMethod")
//    public ResponseEntity<?> getAllShippingMethod(@RequestParam(value = "name", required = false) String name) {
//        try {
//            List<ShippingMethod> shippingMethods = shippingMethodService.getAllShippingMethod(name);
//            return ResponseEntity.ok(shippingMethods);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
//        }
//    }
//
//    @PostMapping("/admin/createOrUpdate")
//    public ResponseEntity<?> createOrUpdate(@RequestBody @Valid ShippingMethodDto shippingMethodDto) {
//        try {
//            ShippingMethod shippingMethod = shippingMethodService.createOrUpdate(shippingMethodDto);
//            return ResponseEntity.ok(shippingMethod);
//        } catch (Exception e) {
//            if (e.getMessage().equals(Constants.DUPLICATE_SHIPPING)) {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Constants.DUPLICATE_SHIPPING);
//            }
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
//        }
//    }
//
//    @PostMapping("/admin/delete/{id}")
//    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
//        try {
//            shippingMethodService.delete(id);
//            return ResponseEntity.ok(HttpStatus.OK);
//        } catch (Exception e) {
//            if (e.getMessage().equals(Constants.DUPLICATE_SHIPPING)) {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Constants.DUPLICATE_SHIPPING);
//            }
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
//        }
//    }
//
//    @GetMapping("/admin/getShippingMethodById/{id}")
//    public ResponseEntity<?> getShippingMethodById(@PathVariable("id") Long id) {
//        try {
//            return ResponseEntity.ok(shippingMethodService.getShippingMethodById(id));
//        } catch (Exception e) {
//            if (e.getMessage().equals(Constants.DUPLICATE_SHIPPING)) {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Constants.DUPLICATE_SHIPPING);
//            }
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
//        }
//    }
//}
