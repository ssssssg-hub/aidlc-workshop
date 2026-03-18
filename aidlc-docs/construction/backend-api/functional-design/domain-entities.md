# Domain Entities — Unit 1: Backend API

## Entity Relationship Diagram

```
+----------+     +--------+     +----------+
|  Store   |1---*|  Admin |     | Category |
+----------+     +--------+     +----------+
     |1                              |1
     |                               |
     |*                              |*
+----------+                    +----------+
|  Table   |                    |   Menu   |
+----------+                    +----------+
     |1
     |
     |*
+--------------+
| TableSession |
+--------------+
     |1
     |
     |*
+----------+     +------------+
|  Order   |1---*| OrderItem  |
+----------+     +------------+
     |
     | (결제 완료 시 이동)
     v
+--------------+     +------------------+
| OrderHistory |1---*| OrderHistoryItem |
+--------------+     +------------------+
```

## Entity Definitions

### Store (매장)
| Field | Type | Constraints |
|---|---|---|
| id | Long (PK) | Auto-generated |
| storeIdentifier | String | Unique, Not Null |
| name | String | Not Null |
| createdAt | LocalDateTime | Auto-set |

### Admin (관리자)
| Field | Type | Constraints |
|---|---|---|
| id | Long (PK) | Auto-generated |
| storeId | Long (FK → Store) | Not Null |
| username | String | Unique per store, Not Null |
| passwordHash | String | bcrypt, Not Null |
| failedLoginAttempts | Integer | Default 0 |
| lockedUntil | LocalDateTime | Nullable |
| createdAt | LocalDateTime | Auto-set |

### TableEntity (테이블)
| Field | Type | Constraints |
|---|---|---|
| id | Long (PK) | Auto-generated |
| storeId | Long (FK → Store) | Not Null |
| tableNumber | Integer | Unique per store, Not Null |
| passwordHash | String | bcrypt, Not Null |
| createdAt | LocalDateTime | Auto-set |

### TableSession (테이블 세션)
| Field | Type | Constraints |
|---|---|---|
| id | Long (PK) | Auto-generated |
| sessionUuid | String (UUID) | Unique, Not Null |
| tableId | Long (FK → Table) | Not Null |
| startedAt | LocalDateTime | Auto-set (로그인 시) |
| endedAt | LocalDateTime | Nullable (결제 완료 시 설정) |
| active | Boolean | Default true |

### Category (카테고리)
| Field | Type | Constraints |
|---|---|---|
| id | Long (PK) | Auto-generated |
| storeId | Long (FK → Store) | Not Null |
| name | String | Not Null |
| displayOrder | Integer | Default 0 |

### Menu (메뉴)
| Field | Type | Constraints |
|---|---|---|
| id | Long (PK) | Auto-generated |
| storeId | Long (FK → Store) | Not Null |
| categoryId | Long (FK → Category) | Not Null |
| name | String | Not Null |
| price | Integer | 100 ~ 1,000,000 |
| description | String | Nullable |
| imageUrl | String | Nullable |
| displayOrder | Integer | Default 0 |
| createdAt | LocalDateTime | Auto-set |
| updatedAt | LocalDateTime | Auto-set |

### Order (주문)
| Field | Type | Constraints |
|---|---|---|
| id | Long (PK) | Auto-generated |
| orderNumber | String | Unique, Auto-generated |
| storeId | Long (FK → Store) | Not Null |
| tableId | Long (FK → Table) | Not Null |
| sessionId | Long (FK → TableSession) | Not Null |
| totalAmount | Integer | Calculated |
| status | Enum(PENDING, PREPARING, COMPLETED) | Default PENDING |
| createdAt | LocalDateTime | Auto-set |
| updatedAt | LocalDateTime | Auto-set |

### OrderItem (주문 항목)
| Field | Type | Constraints |
|---|---|---|
| id | Long (PK) | Auto-generated |
| orderId | Long (FK → Order) | Not Null |
| menuId | Long (FK → Menu) | Not Null |
| menuName | String | Not Null (스냅샷) |
| quantity | Integer | Min 1 |
| unitPrice | Integer | Not Null (스냅샷) |

### OrderHistory (주문 이력)
| Field | Type | Constraints |
|---|---|---|
| id | Long (PK) | Auto-generated |
| originalOrderId | Long | Not Null |
| orderNumber | String | Not Null |
| storeId | Long | Not Null |
| tableId | Long | Not Null |
| sessionUuid | String | Not Null |
| totalAmount | Integer | Not Null |
| orderedAt | LocalDateTime | Not Null |
| completedAt | LocalDateTime | Not Null (결제 완료 시각) |

### OrderHistoryItem (주문 이력 항목)
| Field | Type | Constraints |
|---|---|---|
| id | Long (PK) | Auto-generated |
| orderHistoryId | Long (FK → OrderHistory) | Not Null |
| menuName | String | Not Null |
| quantity | Integer | Not Null |
| unitPrice | Integer | Not Null |
