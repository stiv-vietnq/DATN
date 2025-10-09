package com.coverstar.controller;

import com.coverstar.config.momo.ConfigEnvironment;
import com.coverstar.constant.Constants;
import com.coverstar.constant.enums.RequestType;
import com.coverstar.dto.momos.PaymentResponse;
import com.coverstar.service.momo.CreateOrderMoMo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/momo")
public class MomoController {

    @Autowired
    private CreateOrderMoMo createOrderMoMo;

    @PostMapping("/submitOrder")
    public ResponseEntity<?> submidOrder(@RequestParam("amount") BigDecimal orderTotal,
                                         @RequestParam("username") String username) {
        try {
            String requestId = String.valueOf(System.currentTimeMillis());
            String orderId = String.valueOf(System.currentTimeMillis());
            String orderInfo = "Pay With MoMo";
            String returnURL = "https://google.com.vn";
            String notifyURL = "https://google.com.vn";
            ConfigEnvironment configEnvironment = ConfigEnvironment.selectEnv("dev");
            PaymentResponse captureATMMoMoResponse = CreateOrderMoMo.process(configEnvironment, orderId, requestId,
                    String.valueOf(orderTotal), orderInfo, returnURL, notifyURL, "", RequestType.PAY_WITH_ATM, null);
            return ResponseEntity.ok(captureATMMoMoResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }
}
