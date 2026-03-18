package com.tableorder.service;

import com.tableorder.dto.order.*;
import com.tableorder.entity.*;
import com.tableorder.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final MenuRepository menuRepository;
    private final TableSessionRepository sessionRepository;
    private final SseService sseService;
    private final AtomicLong orderSequence = new AtomicLong(1);

    public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository,
                        MenuRepository menuRepository, TableSessionRepository sessionRepository,
                        SseService sseService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.menuRepository = menuRepository;
        this.sessionRepository = sessionRepository;
        this.sseService = sseService;
    }

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        TableSession session = sessionRepository.findById(request.sessionId())
                .orElseThrow(() -> new EntityNotFoundException("Session not found"));
        if (!session.isActive()) {
            throw new IllegalStateException("Session is not active");
        }

        Order order = new Order();
        order.setStoreId(request.storeId());
        order.setTableId(request.tableId());
        order.setSessionId(request.sessionId());
        order.setOrderNumber(generateOrderNumber());
        order.setStatus(OrderStatus.PENDING);

        Order saved = orderRepository.save(order);

        int totalAmount = 0;
        for (OrderItemRequest itemReq : request.items()) {
            Menu menu = menuRepository.findById(itemReq.menuId())
                    .orElseThrow(() -> new EntityNotFoundException("Menu not found: " + itemReq.menuId()));
            OrderItem item = new OrderItem(saved.getId(), menu.getId(), menu.getName(),
                    itemReq.quantity(), menu.getPrice());
            orderItemRepository.save(item);
            totalAmount += menu.getPrice() * itemReq.quantity();
        }

        saved.setTotalAmount(totalAmount);
        orderRepository.save(saved);

        OrderResponse response = toResponse(saved);
        sseService.broadcast("NEW_ORDER", response);
        return response;
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersBySession(Long sessionId) {
        return orderRepository.findBySessionIdOrderByCreatedAtAsc(sessionId).stream()
                .map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByTable(Long tableId) {
        return orderRepository.findByTableIdOrderByCreatedAtDesc(tableId).stream()
                .map(this::toResponse).toList();
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        order.setStatus(status);
        Order saved = orderRepository.save(order);
        sseService.broadcast("ORDER_STATUS_CHANGED",
                new OrderStatusEvent(orderId, status.name(), saved.getTableId()));
        return toResponse(saved);
    }

    @Transactional
    public void deleteOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        Long tableId = order.getTableId();
        orderRepository.delete(order);
        log.info("[SECURITY_EVENT] type=ORDER_DELETED, orderId={}, tableId={}", orderId, tableId);
        sseService.broadcast("ORDER_DELETED", new OrderDeletedEvent(orderId, tableId));
    }

    private String generateOrderNumber() {
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return "ORD-" + date + "-" + String.format("%04d", orderSequence.getAndIncrement());
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = orderItemRepository.findByOrderId(order.getId()).stream()
                .map(i -> new OrderItemResponse(i.getMenuId(), i.getMenuName(), i.getQuantity(), i.getUnitPrice()))
                .toList();
        return new OrderResponse(order.getId(), order.getOrderNumber(), order.getTableId(),
                order.getTotalAmount(), order.getStatus(), order.getCreatedAt(), items);
    }

    public record OrderStatusEvent(Long orderId, String newStatus, Long tableId) {}
    public record OrderDeletedEvent(Long orderId, Long tableId) {}
}
