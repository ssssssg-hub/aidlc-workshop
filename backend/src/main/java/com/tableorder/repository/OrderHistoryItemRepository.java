package com.tableorder.repository;

import com.tableorder.entity.OrderHistoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderHistoryItemRepository extends JpaRepository<OrderHistoryItem, Long> {
    List<OrderHistoryItem> findByOrderHistoryId(Long orderHistoryId);
}
