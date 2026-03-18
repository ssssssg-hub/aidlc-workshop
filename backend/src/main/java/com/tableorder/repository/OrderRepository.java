package com.tableorder.repository;

import com.tableorder.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findBySessionIdOrderByCreatedAtAsc(Long sessionId);
    List<Order> findByTableIdOrderByCreatedAtDesc(Long tableId);
    List<Order> findBySessionId(Long sessionId);
}
