package com.ecommerce.project.repositories;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ecommerce.project.model.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o")
    Double getTotalRevenue();
    
    Page<Order> findByEmail(String email, Pageable pageable);
    
    @Query("SELECT DISTINCT o FROM Order o " +
           "JOIN o.orderItems oi " +
           "JOIN oi.product p " +
           "WHERE p.user.userId = :sellerId")
    Page<Order> findOrdersBySeller(@Param("sellerId") Long sellerId, Pageable pageable);
}