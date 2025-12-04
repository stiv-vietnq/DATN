package com.coverstar.controller;

import com.coverstar.config.momo.ConfigEnvironment;
import com.coverstar.constant.Constants;
import com.coverstar.constant.enums.RequestType;
import com.coverstar.dto.momos.PaymentResponse;
import com.coverstar.service.momo.CreateOrderMoMo;
import com.coverstar.service.paypal.PaypalService;
import com.coverstar.service.vnpay.VNPayService;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/payments")
@Slf4j
public class PaymentController {

    @Autowired
    private VNPayService vnPayService;

    @Autowired
    private PaypalService paypalService;

    @PostMapping("/submitOrderVnPay")
    public ResponseEntity<?> submitOrderVnPay(@RequestParam("amount") int orderTotal,
                                              @RequestParam("orderInfo") String orderInfo) {
        try {
            String baseUrl = "http://localhost:8888/payments";
            String vnpayUrl = vnPayService.createOrder(orderTotal, orderInfo, baseUrl);
            return ResponseEntity.ok(vnpayUrl);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @GetMapping("/vnpayPayment")
    public void handlePaymentReturn(HttpServletRequest request, HttpServletResponse response) throws Exception {
        int paymentStatus = vnPayService.orderReturn(request);
        if (paymentStatus == 1) {
            response.sendRedirect("http://localhost:4200/payment-success");
        } else {
            response.sendRedirect("http://localhost:4200/payment-failed");
        }
    }

    @PostMapping("/submitOrderMomo")
    public ResponseEntity<?> submitOrderMomo(@RequestParam("amount") String orderTotal) {
        try {
            long amount = (long) Double.parseDouble(orderTotal);
            String requestId = String.valueOf(System.currentTimeMillis());
            String orderId = String.valueOf(System.currentTimeMillis());
            String orderInfo = "Pay With MoMo";
            String returnURL = "http://localhost:4200/payment-success";
            String notifyURL = "http://localhost:4200/payment-failed";
            ConfigEnvironment configEnvironment = ConfigEnvironment.selectEnv("dev");
            PaymentResponse captureATMMoMoResponse = CreateOrderMoMo.process(configEnvironment, orderId, requestId,
                    String.valueOf(amount), orderInfo, returnURL, notifyURL, "", RequestType.PAY_WITH_ATM, null);
            return ResponseEntity.ok(captureATMMoMoResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createPayment(
            @RequestParam("method") String method,
            @RequestParam("amount") String amount,
            @RequestParam("currency") String currency,
            @RequestParam("description") String description
    ) {
        try {
            String successUrl = "http://localhost:4200/payment-success";
            String cancelUrl = "http://localhost:4200/payment-failed";
            Payment payment = paypalService.createPayment(
                    Double.valueOf(amount),
                    currency,
                    method,
                    "sale",
                    description,
                    cancelUrl,
                    successUrl
            );

            for (Links links : payment.getLinks()) {
                if (links.getRel().equals("approval_url")) {
                    return ResponseEntity.ok(links.getHref());
                }
            }
        } catch (PayPalRESTException e) {
            log.error("Error occurred:: ", e);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
    }

    @GetMapping("/success")
    public ResponseEntity<?> paymentSuccess(
            @RequestParam("paymentId") String paymentId,
            @RequestParam("PayerID") String payerId
    ) {
        try {
            Payment payment = paypalService.executePayment(paymentId, payerId);
            if (payment.getState().equals("approved")) {
                return ResponseEntity.ok("purchases-success");
            }
        } catch (PayPalRESTException e) {
            log.error("Error occurred:: ", e);
        }
        return ResponseEntity.ok("paymentSuccess");
    }

    @GetMapping("/cancel")
    public ResponseEntity<?> paymentCancel() {
        return ResponseEntity.ok("paymentCancel");
    }

    @GetMapping("/error")
    public ResponseEntity<?> paymentError() {
        return ResponseEntity.ok("paymentError");
    }
}
