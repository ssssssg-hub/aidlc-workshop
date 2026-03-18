# Component Dependencies

## Dependency Matrix

| Component | Depends On |
|---|---|
| AuthController | AuthService |
| AuthService | AdminRepository, TableRepository, JwtUtil, PasswordEncoder |
| MenuController | MenuService |
| MenuService | MenuRepository, CategoryRepository, ImageService |
| OrderController | OrderService |
| OrderService | OrderRepository, OrderItemRepository, SseService |
| TableController | TableService |
| TableService | TableRepository, OrderRepository, OrderHistoryRepository, SseService |
| SSEController | SseService |
| SseService | (SseEmitter 내부 관리) |
| RecommendationController | RecommendationService |
| RecommendationService | MenuRepository, OpenAI API Client |
| ImageController | ImageService |
| ImageService | 파일시스템 |

## Communication Patterns

### Frontend → Backend
```
Customer App  --REST API--> Spring Boot Backend
Admin App     --REST API--> Spring Boot Backend
Admin App     <---SSE----- Spring Boot Backend
```

### Backend Internal
```
Controller --> Service --> Repository --> PostgreSQL
                  |
                  +--> SseService (이벤트 발행)
                  +--> OpenAI API (외부 호출)
                  +--> 파일시스템 (이미지 저장)
```

## Data Flow

### 주문 생성 흐름
```
Customer App
    |
    | POST /api/orders
    v
OrderController
    |
    v
OrderService
    |-- OrderRepository.save()  --> PostgreSQL
    |-- SseService.broadcast()  --> Admin App (SSE)
    v
OrderResponse --> Customer App
```

### 결제 완료 흐름
```
Admin App
    |
    | POST /api/admin/tables/{id}/payment-complete
    v
TableController
    |
    v
TableService
    |-- OrderRepository.findBySession()
    |-- OrderHistoryRepository.saveAll()  --> PostgreSQL (이력)
    |-- OrderRepository.deleteBySession() --> PostgreSQL (현재 주문 삭제)
    |-- TableRepository.resetSession()    --> PostgreSQL (세션 리셋)
    |-- SseService.broadcast()            --> Admin App (SSE)
    v
Success Response --> Admin App
```

### AI 추천 흐름
```
Customer App
    |
    | POST /api/recommendations
    v
RecommendationController
    |
    v
RecommendationService
    |-- MenuRepository.findAll()  --> PostgreSQL (메뉴 목록)
    |-- OpenAI API call           --> 외부 (추천 생성)
    v
List<RecommendationResponse> --> Customer App
```
