package com.tableorder.service;

import com.tableorder.dto.order.OrderItemResponse;
import com.tableorder.dto.order.OrderResponse;
import com.tableorder.dto.table.*;
import com.tableorder.entity.*;
import com.tableorder.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class TableService {

    private static final Logger log = LoggerFactory.getLogger(TableService.class);
    private final TableRepository tableRepository;
    private final TableSessionRepository sessionRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderHistoryRepository orderHistoryRepository;
    private final OrderHistoryItemRepository orderHistoryItemRepository;
    private final SseService sseService;
    private final PasswordEncoder passwordEncoder;

    public TableService(TableRepository tableRepository, TableSessionRepository sessionRepository,
                        OrderRepository orderRepository, OrderItemRepository orderItemRepository,
                        OrderHistoryRepository orderHistoryRepository,
                        OrderHistoryItemRepository orderHistoryItemRepository,
                        SseService sseService, PasswordEncoder passwordEncoder) {
        this.tableRepository = tableRepository;
        this.sessionRepository = sessionRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.orderHistoryRepository = orderHistoryRepository;
        this.orderHistoryItemRepository = orderHistoryItemRepository;
        this.sseService = sseService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public TableResponse setupTable(Long storeId, SetupTableRequest request) {
        var existing = tableRepository.findByStoreIdAndTableNumber(storeId, request.tableNumber());
        if (existing.isPresent()) {
            TableEntity table = existing.get();
            table.setPasswordHash(passwordEncoder.encode(request.password()));
            return new TableResponse(table.getId(), table.getTableNumber());
        }
        TableEntity table = new TableEntity(storeId, request.tableNumber(),
                passwordEncoder.encode(request.password()));
        TableEntity saved = tableRepository.save(table);
        return new TableResponse(saved.getId(), saved.getTableNumber());
    }

    @Transactional
    public void completePayment(Long tableId) {
        TableSession session = sessionRepository.findByTableIdAndActiveTrue(tableId)
                .orElseThrow(() -> new EntityNotFoundException("No active session for table"));

        List<Order> orders = orderRepository.findBySessionId(session.getId());
        LocalDateTime completedAt = LocalDateTime.now();

        for (Order order : orders) {
            OrderHistory history = new OrderHistory();
            history.setOriginalOrderId(order.getId());
            history.setOrderNumber(order.getOrderNumber());
            history.setStoreId(order.getStoreId());
            history.setTableId(order.getTableId());
            history.setSessionUuid(session.getSessionUuid());
            history.setTotalAmount(order.getTotalAmount());
            history.setOrderedAt(order.getCreatedAt());
            history.setCompletedAt(completedAt);
            OrderHistory savedHistory = orderHistoryRepository.save(history);

            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
            for (OrderItem item : items) {
                orderHistoryItemRepository.save(new OrderHistoryItem(
                        savedHistory.getId(), item.getMenuName(), item.getQuantity(), item.getUnitPrice()));
            }
        }

        orderRepository.deleteAll(orders);
        session.endSession();
        sessionRepository.save(session);

        log.info("[SECURITY_EVENT] type=PAYMENT_COMPLETED, tableId={}, sessionId={}, orderCount={}",
                tableId, session.getSessionUuid(), orders.size());
        sseService.broadcast("PAYMENT_COMPLETED", new PaymentCompletedEvent(tableId));
    }

    @Transactional(readOnly = true)
    public List<TableStatusResponse> getTableStatuses(Long storeId) {
        return tableRepository.findByStoreId(storeId).stream().map(table -> {
            var session = sessionRepository.findByTableIdAndActiveTrue(table.getId());
            boolean hasActive = session.isPresent();
            int totalAmount = 0;
            List<OrderResponse> recentOrders = List.of();

            if (hasActive) {
                List<Order> orders = orderRepository.findBySessionId(session.get().getId());
                totalAmount = orders.stream().mapToInt(Order::getTotalAmount).sum();
                recentOrders = orders.stream()
                        .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                        .limit(3)
                        .map(o -> {
                            var items = orderItemRepository.findByOrderId(o.getId()).stream()
                                    .map(i -> new OrderItemResponse(i.getMenuId(), i.getMenuName(),
                                            i.getQuantity(), i.getUnitPrice()))
                                    .toList();
                            return new OrderResponse(o.getId(), o.getOrderNumber(), o.getTableId(),
                                    o.getTotalAmount(), o.getStatus(), o.getCreatedAt(), items);
                        }).toList();
            }
            return new TableStatusResponse(table.getId(), table.getTableNumber(),
                    hasActive, totalAmount, recentOrders);
        }).toList();
    }

    @Transactional(readOnly = true)
    public List<OrderHistoryResponse> getOrderHistory(Long tableId, LocalDate date) {
        List<OrderHistory> histories;
        if (date != null) {
            histories = orderHistoryRepository.findByTableIdAndCompletedAtBetweenOrderByCompletedAtDesc(
                    tableId, date.atStartOfDay(), date.atTime(LocalTime.MAX));
        } else {
            histories = orderHistoryRepository.findByTableIdOrderByCompletedAtDesc(tableId);
        }
        return histories.stream().map(h -> {
            var items = orderHistoryItemRepository.findByOrderHistoryId(h.getId()).stream()
                    .map(i -> new OrderItemResponse(null, i.getMenuName(), i.getQuantity(), i.getUnitPrice()))
                    .toList();
            return new OrderHistoryResponse(h.getId(), h.getOrderNumber(), h.getTotalAmount(),
                    h.getOrderedAt(), h.getCompletedAt(), items);
        }).toList();
    }

    public record PaymentCompletedEvent(Long tableId) {}
}
