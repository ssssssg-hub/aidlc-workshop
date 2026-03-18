# Performance Test Instructions — Unit 2: Customer App

## 성능 요구사항
- **초기 로딩**: 5초 이내 (MVP)
- **번들 크기**: 200KB 이하 (gzip)
- **장바구니 조작**: 즉각 반응 (클라이언트 로컬)
- **페이지 전환**: SPA 즉각 전환

## 번들 크기 검증

### 빌드 후 크기 확인
```bash
cd frontend-customer
npm run build

# gzip 크기 확인
find dist/assets -name "*.js" -exec gzip -k {} \;
ls -la dist/assets/*.gz

# 또는 Vite 빌드 출력에서 확인 (빌드 시 자동 표시)
```

### 기준
- `dist/assets/index-*.js` (gzip): 200KB 이하
- 초과 시: 불필요한 의존성 제거, 코드 스플리팅 확인

## 초기 로딩 시간 측정

### Chrome DevTools
1. Chrome에서 http://localhost:3001 접속
2. DevTools → Network 탭 → "Disable cache" 체크
3. Ctrl+Shift+R (하드 리로드)
4. **확인**: DOMContentLoaded, Load 이벤트 시간
5. **기준**: Load < 5초

### Lighthouse
```bash
# Chrome DevTools → Lighthouse 탭
# Mobile 프리셋으로 실행
# Performance 점수 및 FCP, LCP 확인
```

## 페이지 전환 성능
1. 메뉴 → 장바구니 → 주문내역 탭 전환
2. **확인**: React.lazy 로딩 후 즉각 전환 (네트워크 요청 없음)
3. **기준**: 체감 지연 없음

## 장바구니 조작 성능
1. 메뉴 20개를 장바구니에 추가
2. 수량 증가/감소 반복
3. **확인**: UI 반응 즉각적 (프레임 드롭 없음)
