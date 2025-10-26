package com.ecommerce.project.service;

import com.ecommerce.project.payload.OrderDTO;
import com.ecommerce.project.payload.OrderResponse;
import jakarta.transaction.Transactional;

public interface OrderService {
    @Transactional
    OrderDTO placeOrder(String emailId, Long addressId, String paymentMethod, String pgName, String pgPaymentId, String pgStatus, String pgResponseMessage);

    @Transactional
    OrderDTO placeOrder(String emailId, Long addressId, String paymentMethod, String pgName, String pgPaymentId, String pgStatus, String pgResponseMessage, String orderStatus);

    @Transactional
    void confirmOrderPayment(Long orderId, String emailId);

    OrderResponse getAllOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    OrderDTO updateOrder(Long orderId, String status);

    OrderResponse getAllSellerOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    OrderResponse getOrdersByUser(String emailId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
}
