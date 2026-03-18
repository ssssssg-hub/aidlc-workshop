# Performance Test Instructions — Unit 3: Admin App

## Performance Requirements
- **SSE 이벤트 반영**: 2초 이내 (NFR-PERF-01)
- **페이지 초기 로드 (LCP)**: 3초 이내 (NFR-PERF-02)
- **사용자 인터랙션 응답 (INP)**: 100ms 이내 (NFR-PERF-03)
- **번들 사이즈**: 초기 로드 500KB 이하 gzip (NFR-PERF-04)

## 번들 사이즈 검증

### 1. 빌드 후 사이즈 확인
```bash
cd frontend-admin
npm run build
# Vite 빌드 출력에서 chunk 사이즈 확인
```

### 2. gzip 사이즈 확인
```bash
# dist/assets/ 디렉토리의 js 파일 gzip 사이즈 합산
gzip -k dist/assets/*.js
ls -la dist/assets/*.js.gz
```

## Lighthouse 성능 측정

### 1. Chrome DevTools Lighthouse
1. `npm run preview`로 프로덕션 빌드 서빙
2. Chrome DevTools → Lighthouse 탭
3. "Performance" 카테고리 선택 후 분석
4. LCP, INP, CLS 지표 확인

### 2. 기대 결과
- **LCP**: < 3초
- **INP**: < 100ms
- **Performance Score**: 80 이상

## SSE 지연 측정

### 수동 테스트
1. 대시보드 진입 (SSE 연결)
2. Backend API로 주문 생성 (curl 또는 Postman)
3. 대시보드에 주문 표시되는 시간 측정
4. **기대**: 2초 이내
