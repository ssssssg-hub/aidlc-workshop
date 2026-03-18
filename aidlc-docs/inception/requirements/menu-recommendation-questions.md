# 메뉴 추천 기능 명확화 질문

메뉴 추천 기능 추가 요청에 대해 아래 질문에 답변해 주세요.

## Question 1
메뉴 추천 로직은 어떻게 구현하시겠습니까?

A) 규칙 기반 — 관리자가 사전에 인원수별/식사유형별 추천 조합을 등록
B) 자동 계산 — 메뉴 카테고리와 가격 기반으로 시스템이 자동 조합 생성 (예: 메인 N개 + 사이드 N개)
C) AI/LLM 기반 — 외부 AI API를 호출하여 추천
D) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 2
"쉐어 및 단독식사" 구분에 따라 추천이 어떻게 달라져야 합니까?

A) 쉐어: 대용량/공유 메뉴 위주 추천, 단독: 1인분 메뉴 위주 추천
B) 쉐어: 다양한 종류 소량씩 추천, 단독: 인원수만큼 개별 세트 추천
C) 관리자가 메뉴별로 "쉐어용/단독용" 태그를 설정하고 그에 따라 필터링
D) Other (please describe after [Answer]: tag below)

[Answer]: D AI 가 추천해준걸 기반으로 판단해줘.

## Question 3
추천 결과를 고객에게 어떻게 보여주시겠습니까?

A) 추천 조합 1개만 표시 → 장바구니에 바로 추가
B) 추천 조합 2~3개 표시 → 고객이 선택 후 장바구니에 추가
C) 추천 조합 표시 + 고객이 개별 메뉴를 수정(추가/삭제) 후 장바구니에 추가
D) Other (please describe after [Answer]: tag below)

[Answer]: B