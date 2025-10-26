package com.ecommerce.project.controller;

import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.Order;
import com.ecommerce.project.payload.OrderDTO;
import com.ecommerce.project.payload.OrderRequestDTO;
import com.ecommerce.project.repositories.OrderRepository;
import com.ecommerce.project.service.OrderService;
import com.ecommerce.project.service.VNPayService;
import com.ecommerce.project.util.AuthUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment/vnpay")
public class VNPayController {

    @Autowired
    private VNPayService vnPayService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private AuthUtil authUtil;

    @Value("${frontend.url}")
    private String frontendUrl;

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createPayment(
            @RequestBody OrderRequestDTO orderRequestDTO,
            HttpServletRequest request) {
        
        try {
            String emailId = authUtil.loggedInEmail();
            
            // Create order first with PENDING status
            OrderDTO order = orderService.placeOrder(
                    emailId,
                    orderRequestDTO.getAddressId(),
                    "VNPay",
                    "VNPay",
                    null,
                    "Awaiting payment",
                    "Awaiting payment",
                    "PENDING"
            );

            // Generate VNPay payment URL
            String orderInfo = "Payment for Order #" + order.getOrderId();
            String paymentUrl = vnPayService.createPaymentUrl(
                    order.getOrderId(),
                    order.getTotalAmount(),
                    orderInfo,
                    request
            );

            Map<String, String> response = new HashMap<>();
            response.put("paymentUrl", paymentUrl);
            response.put("orderId", String.valueOf(order.getOrderId()));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/callback")
    public RedirectView paymentCallback(@RequestParam Map<String, String> params) {
        System.out.println("=== VNPay Callback Received ===");
        System.out.println("Params: " + params);
        
        Map<String, String> result = vnPayService.processCallback(params);
        
        System.out.println("Processing result: " + result);
        
        String orderId = result.get("orderId");
        String status = result.get("status");

        // Update order status based on payment result
        if ("success".equals(status)) {
            try {
                // Get order to find email
                Order order = orderRepository.findById(Long.parseLong(orderId))
                        .orElseThrow(() -> new ResourceNotFoundException("Order", "orderId", Long.parseLong(orderId)));
                
                // Update order status to Accepted
                orderService.updateOrder(Long.parseLong(orderId), "Accepted");
                
                // Confirm payment: Clear cart and reduce stock
                orderService.confirmOrderPayment(Long.parseLong(orderId), order.getEmail());
                
                System.out.println("Order " + orderId + " payment confirmed - status set to Accepted, cart cleared, stock updated");
                
                // Redirect to success page
                return new RedirectView(frontendUrl + "/order-success?orderId=" + orderId + "&status=success");
            } catch (Exception e) {
                System.err.println("Error updating order: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            // Payment failed or cancelled - mark order as CANCELLED
            System.out.println("Payment failed/cancelled for order " + orderId);
            try {
                orderService.updateOrder(Long.parseLong(orderId), "CANCELLED");
                System.out.println("Order " + orderId + " marked as CANCELLED - cart NOT cleared");
            } catch (Exception e) {
                System.err.println("Error cancelling order: " + e.getMessage());
            }
        }

        // Redirect to home page for failed/cancelled payments
        return new RedirectView(frontendUrl + "/?payment=cancelled&orderId=" + orderId);
    }
}
