# Component Methods

## Backend — Controller / Service Methods

### AuthController
| Method | HTTP | Path | Input | Output |
|---|---|---|---|---|
| loginAdmin | POST | /api/admin/auth/login | LoginRequest(storeId, username, password) | TokenResponse(token, expiresIn) |
| loginTable | POST | /api/table/auth/login | TableLoginRequest(storeId, tableNumber, password) | TableTokenResponse(token, sessionId) |

### MenuController
| Method | HTTP | Path | Input | Output |
|---|---|---|---|---|
| getMenusByCategory | GET | /api/menus?category={id} | categoryId (optional) | List\<MenuResponse\> |
| getMenuDetail | GET | /api/menus/{id} | menuId | MenuDetailResponse |
| createMenu | POST | /api/admin/menus | CreateMenuRequest(name, price, description, categoryId, imageUrl, displayOrder) | MenuResponse |
| updateMenu | PUT | /api/admin/menus/{id} | UpdateMenuRequest | MenuResponse |
| deleteMenu | DELETE | /api/admin/menus/{id} | menuId | void |
| updateMenuOrder | PUT | /api/admin/menus/order | List\<MenuOrderRequest(menuId, displayOrder)\> | void |
| getCategories | GET | /api/categories | — | List\<CategoryResponse\> |

### OrderController
| Method | HTTP | Path | Input | Output |
|---|---|---|---|---|
| createOrder | POST | /api/orders | CreateOrderRequest(storeId, tableId, sessionId, items[]) | OrderResponse(orderId, orderNumber) |
| getOrdersBySession | GET | /api/orders?sessionId={id} | sessionId | List\<OrderResponse\> |
| getOrdersByTable | GET | /api/admin/orders?tableId={id} | tableId | List\<OrderResponse\> |
| updateOrderStatus | PUT | /api/admin/orders/{id}/status | UpdateStatusRequest(status) | OrderResponse |
| deleteOrder | DELETE | /api/admin/orders/{id} | orderId | void |

### TableController
| Method | HTTP | Path | Input | Output |
|---|---|---|---|---|
| setupTable | POST | /api/admin/tables | SetupTableRequest(tableNumber, password) | TableResponse |
| completePayment | POST | /api/admin/tables/{id}/payment-complete | tableId | void |
| getTableStatus | GET | /api/admin/tables | — | List\<TableStatusResponse\> |
| getOrderHistory | GET | /api/admin/tables/{id}/history?date={date} | tableId, date (optional) | List\<OrderHistoryResponse\> |

### SSEController
| Method | HTTP | Path | Input | Output |
|---|---|---|---|---|
| subscribeOrders | GET | /api/admin/orders/stream | — | SseEmitter (event stream) |

### RecommendationController
| Method | HTTP | Path | Input | Output |
|---|---|---|---|---|
| getRecommendation | POST | /api/recommendations | RecommendRequest(partySize, diningType) | List\<RecommendationResponse\> |

### ImageController
| Method | HTTP | Path | Input | Output |
|---|---|---|---|---|
| uploadImage | POST | /api/admin/images | MultipartFile | ImageResponse(imageUrl) |
| getImage | GET | /api/images/{filename} | filename | byte[] (image file) |
