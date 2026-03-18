package com.tableorder.service;

import com.tableorder.dto.order.CreateOrderRequest;
import com.tableorder.dto.order.OrderItemRequest;
import com.tableorder.dto.order.OrderResponse;
import com.tableorder.entity.*;
import com.tableorder.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private OrderItemRepository orderItemRepository;
    @Mock private MenuRepository menuRepository;
    @Mock private TableSessionRepository sessionRepository;
    @Mock private SseService sseService;

    @InjectMocks private OrderService orderService;

    @Test
    void createOrder_success() {
        TableSession session = new TableSession("uuid", 1L);
        Menu menu = new Menu();
        menu.setName("Burger");
        menu.setPrice(15000);

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(menuRepository.findById(1L)).thenReturn(Optional.of(menu));
        when(orderRepository.save(any())).thenAnswer(inv -> {
            Order o = inv.getArgument(0);
            return o;
        });
        when(orderItemRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(orderItemRepository.findByOrderId(any())).thenReturn(List.of());

        CreateOrderRequest request = new CreateOrderRequest(1L, 1L, 1L,
                List.of(new OrderItemRequest(1L, 2)));

        OrderResponse response = orderService.createOrder(request);

        assertThat(response.totalAmount()).isEqualTo(30000);
        verify(sseService).broadcast(eq("NEW_ORDER"), any());
    }

    @Test
    void createOrder_inactiveSession_throwsException() {
        TableSession session = new TableSession("uuid", 1L);
        session.endSession();
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        assertThatThrownBy(() -> orderService.createOrder(
                new CreateOrderRequest(1L, 1L, 1L, List.of(new OrderItemRequest(1L, 1)))))
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    void updateOrderStatus_success() {
        Order order = new Order();
        order.setTableId(1L);
        order.setStatus(OrderStatus.PENDING);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any())).thenReturn(order);
        when(orderItemRepository.findByOrderId(any())).thenReturn(List.of());

        OrderResponse response = orderService.updateOrderStatus(1L, OrderStatus.PREPARING);

        assertThat(response.status()).isEqualTo(OrderStatus.PREPARING);
        verify(sseService).broadcast(eq("ORDER_STATUS_CHANGED"), any());
    }

    @Test
    void deleteOrder_success() {
        Order order = new Order();
        order.setTableId(1L);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        orderService.deleteOrder(1L);

        verify(orderRepository).delete(order);
        verify(sseService).broadcast(eq("ORDER_DELETED"), any());
    }

    @Test
    void deleteOrder_notFound_throwsException() {
        when(orderRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.deleteOrder(99L))
                .isInstanceOf(EntityNotFoundException.class);
    }
}
