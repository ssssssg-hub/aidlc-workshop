package com.tableorder.service;

import com.tableorder.dto.table.SetupTableRequest;
import com.tableorder.dto.table.TableResponse;
import com.tableorder.entity.*;
import com.tableorder.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TableServiceTest {

    @Mock private TableRepository tableRepository;
    @Mock private TableSessionRepository sessionRepository;
    @Mock private OrderRepository orderRepository;
    @Mock private OrderItemRepository orderItemRepository;
    @Mock private OrderHistoryRepository orderHistoryRepository;
    @Mock private OrderHistoryItemRepository orderHistoryItemRepository;
    @Mock private SseService sseService;
    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks private TableService tableService;

    @Test
    void setupTable_newTable_createsTable() {
        when(tableRepository.findByStoreIdAndTableNumber(1L, 5)).thenReturn(Optional.empty());
        when(passwordEncoder.encode("pass")).thenReturn("$2a$10$encoded");
        when(tableRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        TableResponse response = tableService.setupTable(1L, new SetupTableRequest(5, "pass"));

        assertThat(response.tableNumber()).isEqualTo(5);
        verify(tableRepository).save(any(TableEntity.class));
    }

    @Test
    void completePayment_success() {
        TableSession session = new TableSession("uuid", 1L);
        Order order = new Order();
        order.setOrderNumber("ORD-001");
        order.setStoreId(1L);
        order.setTableId(1L);
        order.setTotalAmount(30000);

        when(sessionRepository.findByTableIdAndActiveTrue(1L)).thenReturn(Optional.of(session));
        when(orderRepository.findBySessionId(any())).thenReturn(List.of(order));
        when(orderItemRepository.findByOrderId(any())).thenReturn(List.of());
        when(orderHistoryRepository.save(any())).thenAnswer(inv -> {
            OrderHistory h = inv.getArgument(0);
            return h;
        });

        tableService.completePayment(1L);

        verify(orderRepository).deleteAll(List.of(order));
        verify(sessionRepository).save(session);
        assertThat(session.isActive()).isFalse();
        verify(sseService).broadcast(eq("PAYMENT_COMPLETED"), any());
    }

    @Test
    void completePayment_noActiveSession_throwsException() {
        when(sessionRepository.findByTableIdAndActiveTrue(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> tableService.completePayment(99L))
                .isInstanceOf(EntityNotFoundException.class);
    }
}
