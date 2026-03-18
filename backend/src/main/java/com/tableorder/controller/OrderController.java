package com.tableorder.controller;

import com.tableorder.dto.order.CreateOrderRequest;
import com.tableorder.dto.order.OrderResponse;
import com.tableorder.security.AuthDetails;
import com.tableorder.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(request));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrdersBySession(
            @RequestParam Long sessionId) {
        return ResponseEntity.ok(orderService.getOrdersBySession(sessionId));
    }
}
