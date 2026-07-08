# MJE Frontend — Dehangsa

### 1-1. 프로젝트 소개

Dehangsa는 20~30대를 위한 맞춤형 데이트 코스 추천 서비스입니다.

- 사용자가 지역, 시간, 이동수단 정보를 입력하면 조건에 맞는 데이트 코스를 자동으로 추천합니다.
- 추천 코스는 Main Course 1개와 Sub Course 2개로 구성되며, 사용자는 원하는 코스를 확인하고 링크로 공유할 수 있습니다.

### 1-2. 문제 정의

사용자 인터뷰와 관찰을 통해 20~30대 사용자가 데이트 코스를 계획하는 과정에서 반복적인 탐색 피로를 겪는다는 점을 확인했습니다.

- 데이트 코스를 정할 때 사용자는 지역, 시간, 이동수단, 상대방의 취향, 분위기, 예산 등 다양한 요소를 함께 고려해야 합니다.
- 여러 장소를 탐색하고 비교하지만, 적절한 코스를 찾지 못하면 다시 검색을 반복하게 됩니다.
- 결과적으로 탐색 실패가 재탐색 루프로 이어지고, 의사결정 피로도가 증가하면서 계획 수립을 포기하거나 서비스에서 이탈하는 문제가 발생했습니다.

→ 따라서 Dehangsa는 사용자의 조건에 맞는 데이트 코스를 빠르게 추천함으로써 탐색 부담을 줄이고, 데이트 계획 수립 과정을 더 쉽게 만드는 것을 목표로 했습니다.

### 1-3. 해결 방안

**사용자 맞춤 데이트 코스 추천**
- 사용자의 상황과 조건을 기반으로 데이트 코스를 추천하여, 직접 장소를 탐색하고 조합해야 하는 부담을 줄이고자 했습니다.

**기대 효과**
- **탐색 범위 감소**: 여러 플랫폼에서 장소를 직접 비교하지 않아도 되도록 추천 코스를 제공
- **의사결정 피로도 완화**: 선택지를 무작위로 많이 제공하기보다, 상황에 맞는 코스를 제안해 결정 부담 감소
- **핵심 행동 측정 용이**: 추천 결과 카드 클릭률, 코스 생성률, 공유 클릭률 등을 통해 사용자 반응 확인 가능


### 2-1. 핵심 기능
초기 MVP 단계에서 탐색 진입을 원활하게 하는 것을 목적으로, 시작 단계에서의 의사결정 피로도를 낮추기 위해 사용자 맞춤 데이트 코스 추천 기능을 제공하는 Next.js 기반 웹 클라이언트입니다.

- **랜딩 페이지**: 서비스 소개 및 홈 진입 유도 (데스크톱/모바일 레이아웃 분리 구현)
- **홈 화면**: 지역·시간·이동수단 입력 후 코스 생성 요청
- **코스 추천 결과**: Today Pick 1개 + Sub Course 2개 카드 형태로 노출, 다시 추천받기(Try Again) 지원
- **코스 상세 조회**: 지도 동선(Kakao Map), 장소별 카드(식당/카페/액티비티), 다른 코스 목록 제공
- **코스 공유**: 상세 페이지 링크 복사 모달 제공
- **행동 이벤트 트래킹**: 랜딩/홈/코스 화면의 주요 클릭·조회 이벤트를 세션 단위로 백엔드에 기록

### 2-2. 시스템 구성

```
Browser
  └─▶ Next.js App Router (dehangsa.com)
         ├─▶ Route Handler (/app/api/*)   ← 이벤트 트래킹 프록시
         │        └─▶ FastAPI Backend (event 저장)
         ├─▶ Server/Client Component
         │        └─▶ FastAPI Backend (코스 추천/상세 조회 API)
         └─▶ Kakao Map SDK                ← 지도 렌더링 (클라이언트 사이드)
```

- **렌더링**: Next.js App Router (Server/Client Component 혼합)
- **배포 환경**: AWS EC2 + Docker + CloudFront (백엔드와 동일 인프라에서 서빙)
- **백엔드 연동**: 브라우저 → Next.js Route Handler(`/app/api/*`)를 거쳐 백엔드로 이벤트 전송 (BFF 방식), 코스 조회/생성은 서버 컴포넌트·서버 액션에서 백엔드 API를 직접 호출
- **외부 SDK**: Kakao Map SDK로 코스 동선 지도 렌더링

### 2-3. 기술 스택

| 분류 | 라이브러리 | 버전 |
|------|-----------|------|
| 프레임워크 | Next.js (App Router) | ^16.2.4 |
| UI 라이브러리 | React / React DOM | ^19.2.5 |
| 언어 | TypeScript (strict) | ^6.0.3 |
| 스타일링 | Tailwind CSS | ^4.2.4 |
| 린트 | ESLint (eslint-config-next) | ^10.2.1 / ^16.2.4 |
| E2E 테스트 | Playwright | ^1.60.0 |
| 외부 지도 SDK | Kakao Map SDK | - |

### 2-4. 프로젝트 구조

Feature 기반 Layered Architecture를 따르며, 각 Feature는 `application / infrastructure / ui(+ hooks, services, types)` 계층으로 구성됩니다.

```
mje-frontend/
├── src/
│   ├── app/                        # Next.js App Router (진입점, 라우팅)
│   │   ├── landing/page.tsx
│   │   ├── home/page.tsx
│   │   ├── recommendation/page.tsx
│   │   ├── recommendation/[id]/page.tsx
│   │   ├── courses/detail/[id]/page.tsx
│   │   └── api/                    # Route Handler (이벤트 트래킹 프록시)
│   │       ├── home/events/
│   │       ├── landing/events/
│   │       ├── courses/events/
│   │       └── export-logs/
│   │
│   ├── landing/                    # 랜딩 페이지 Feature
│   │   ├── hooks/                  # 트래킹 훅 (top/bottom/view)
│   │   ├── types/
│   │   └── ui/components/          # 데스크톱/모바일 섹션 분리
│   │
│   ├── home/                       # 홈 화면 Feature
│   │   ├── hooks/                  # 트래킹 훅 (logo/tab/view)
│   │   ├── types/
│   │   └── ui/{components,layout}/ # HeroSection, SearchBar, Header 등
│   │
│   ├── recommendation/             # 코스 추천 Feature
│   │   ├── application/actions/    # 코스 생성, 액티비티/카페/식당/다른코스 조회 액션
│   │   ├── infrastructure/api/     # 백엔드 API 어댑터 (recommendationsApi, createCourse 등)
│   │   └── types/
│   │
│   ├── courses/                    # 코스 상세/생성 UI Feature
│   │   ├── application/            # 세션 관리 (courseSession)
│   │   ├── hooks/                  # 코스 생성, 상세 데이터(액티비티/카페/식당), 검색박스
│   │   ├── types/
│   │   └── ui/components/          # 지도, 카드, 라벨, 공유 모달 등 세부 컴포넌트
│   │
│   └── infrastructure/             # 전역 공통 인프라
│       ├── api/                    # 공통 HTTP 클라이언트 (client.ts, ApiError)
│       ├── analytics/              # 이벤트 트래킹 (eventTracker, sessionId)
│       └── config/                 # 환경 변수 검증 (env.ts)
│
├── public/                         # 정적 자산 (couple-images, landing 이미지, 로고)
└── next.config.ts                  # standalone 출력, "/" → "/landing" 리다이렉트
```

**의존성 방향**: `UI → Application → Infrastructure` (Infrastructure는 외부 API/브라우저 스토리지 담당, UI는 상태·비즈니스 로직을 갖지 않는 Dumb Component)

> 참고: CLAUDE.md에는 `domain` 계층을 포함한 auth 중심 아키텍처가 기술되어 있으나, 현재 코드베이스에는 `auth` Feature가 없고 `landing / home / recommendation / courses` 4개 Feature로 구성되어 있으며 일부 Feature는 `domain` 계층 없이 `application/infrastructure/ui`만으로 구성됩니다.

### 2-5. 데이터 흐름 (Frontend는 자체 DB 없음)

프론트엔드는 별도의 데이터베이스를 두지 않고, 모든 영속 데이터(코스, 이벤트 로그)는 백엔드 API에 위임합니다.

| 구분 | 저장/전달 방식 |
|------|--------------|
| 코스 추천/상세 데이터 | 클라이언트 상태로만 보관, 새로고침 시 백엔드 API 재조회 |
| 세션 식별자 | `infrastructure/analytics/sessionId.ts`에서 브라우저 세션 단위로 생성, 이벤트 전송 시 함께 첨부 |
| 이벤트 로그 | `infrastructure/analytics/eventTracker.ts` → `/app/api/*` Route Handler → 백엔드 `*/events` API로 전달 (BFF 프록시) |
| 코스 공유 링크 | 별도 저장 없이 `course_id` 기반 URL(`/recommendation/[id]`, `/courses/detail/[id]`)로 상태 재현 |

### 2-6. API

#### 내부 Route Handler (이벤트 트래킹 프록시)

| Method | Path | 설명 |
|--------|------|------|
| `POST` | `/api/home/events` | 홈 화면 이벤트를 백엔드 `/home/events`로 전달 |
| `POST` | `/api/landing/events` | 랜딩 페이지 이벤트를 백엔드 `/landing/events`로 전달 |
| `POST` | `/api/courses/events` | 코스 화면 이벤트를 백엔드 `/courses/events`로 전달 |
| `POST` | `/api/export-logs` | 코스 내보내기 이벤트를 백엔드 `/api/v1/export-logs`로 전달 |

#### 백엔드 연동 (서버 컴포넌트 / 서버 액션에서 직접 호출)

| Method | 대상 Path | 설명 |
|--------|-----------|------|
| `POST` | `/courses/recommendations` | 데이트 코스 추천 생성 |
| `GET` | `/courses/{course_id}` | 코스 상세 조회 |
| `GET` | `/recommendations/courses/{course_id}` | 코스 상세 (프론트엔드용) |
| `GET` | `/recommendations/detail/{course_id}/other-courses` | 같은 세션의 다른 코스 목록 |
| `GET` | `/recommendations/detail/{course_id}/activities` | 코스 내 액티비티 목록 |
| `GET` | `/recommendations/detail/{course_id}/cafes` | 코스 내 카페 목록 |
| `GET` | `/recommendations/detail/{course_id}/restaurants` | 코스 내 식당 목록 |

---

## Build & Development

```bash
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 검사
```

필수 환경 변수: `NEXT_PUBLIC_API_BASE_URL` (누락 시 `infrastructure/config/env.ts`에서 즉시 에러 발생)

### 3-1. 핵심 구현 내용

이 프로젝트는 사용자가 장소·시간·이동수단을 입력하여 맞춤 데이트 코스를 추천받을 수 있도록 구현했습니다.
전체 구조는 프론트엔드 / 백엔드 / DB / 외부 API로 나누어 설계했으며, 주요 데이터 흐름은 다음과 같습니다.

1. 사용자가 장소·시간·이동수단을 입력하고 코스 생성 버튼을 클릭한다.
2. 프론트엔드에서 입력값을 검증한 뒤 서버로 요청을 보낸다.
3. 서버는 요청받은 장소를 DB에서 조회한 후, 추천 코스를 Kakao Map API로 검증하여 반환한다
4. Today Pick 1개 + Sub Course 2개(Course A, Course B)로 구성된 추천 결과를 사용자 화면에 반영한다.

**주요 기능**

- **코스 추천**: 사용자 입력값(장소·시간·이동수단) 기반으로 음식점·카페·활동 유형을 조합한 데이트 코스 3개를 생성
- **코스 상세 조회**: 지도 동선, 장소명·주소·이동 소요시간을 카드 형태로 제공
- **코스 공유**: 코스 상세페이지 링크를 공유하여 다른 사람도 동일한 코스를 확인 가능

### 3-2. 기술적 의사결정

- **Next.js App Router**: 파일 기반 라우팅으로 랜딩·홈·추천·코스 상세 화면을 구조화하고, Server/Client Component를 혼합해 초기 로딩 성능과 상호작용성을 함께 확보하기 위해 선택
- **React 19 + TypeScript(strict)**: 코스 카드, 지도, 라벨 등 반복되는 UI 컴포넌트가 많아 타입 안정성과 컴포넌트 재사용성을 확보하기 위해 strict 모드로 운영
- **Route Handler 기반 BFF 프록시**: 이벤트 트래킹 요청을 브라우저가 백엔드에 직접 쏘지 않고 `/app/api/*`를 경유하도록 구성. CORS 이슈를 없애고, 실패 로그(`console.error`)를 프론트 서버 단에서 남길 수 있도록 하기 위함
- **Tailwind CSS 4**: 랜딩 페이지의 데스크톱/모바일 레이아웃을 분리 구현해야 했기 때문에, 유틸리티 클래스 기반으로 반응형 스타일을 빠르게 조정할 수 있는 점을 고려하여 선택
- **Kakao Map SDK (클라이언트 사이드)**: 백엔드가 Kakao Map API로 장소 데이터를 검증·제공하는 것과 동일한 지도 생태계를 프론트 지도 렌더링(`CourseMap`)에도 사용하여 좌표·주소 체계 불일치를 방지
- **Playwright**: 코스 생성 → 상세 조회 → 공유로 이어지는 핵심 사용자 플로우의 회귀를 잡기 위해 E2E 테스트 도구로 도입
- **Docker + AWS EC2 + CloudFront**: 백엔드와 동일한 배포 파이프라인(EC2/Docker)에 올리기 위해 `next.config.ts`에서 `output: "standalone"`으로 빌드해 이미지 크기를 최소화

### 3-3. 성능 개선

초기 구현에서는 코스 추천 결과를 백엔드에서 받아올 때까지 화면이 그대로 멈춰 있어 체감 대기 시간이 길고, 이벤트 트래킹 요청이 페이지 이동을 막는 문제가 있었습니다. 이를 해결하기 위해 다음과 같은 개선을 진행했습니다.

- **Suspense 기반 스트리밍**: `app/recommendation/page.tsx`에서 추천 결과 영역을 `Suspense`로 감싸고 `RecommendationLoading` 등 스켈레톤 컴포넌트를 fallback으로 노출하여, 백엔드 응답을 기다리는 동안에도 레이아웃이 먼저 그려지도록 개선
- **로딩 스켈레톤 컴포넌트 분리**: `CourseMapSkeleton`, `DetailCourseSkeleton`을 별도 컴포넌트로 두어 지도·상세 데이터가 비동기로 채워지는 동안 체감 성능을 개선
- **이벤트 트래킹 non-blocking 처리**: `eventTracker.ts`에서 `fetch(..., { keepalive: true })`를 사용해 이벤트 전송이 페이지 이동이나 언마운트로 끊기지 않으면서도 렌더링을 블로킹하지 않도록 처리
- **Docker standalone 빌드**: `next.config.ts`의 `output: "standalone"`으로 배포 이미지 크기를 줄여 배포/재시작 속도를 개선

### 3-4. 테스트

자동화 테스트 없이 로컬/배포 환경에서 직접 화면을 조작하며 수동 테스트를 진행했습니다. (Playwright가 devDependency로 등록되어 있으나 아직 설정 파일과 테스트 스위트는 구성되지 않은 상태입니다.)

- 랜딩 → 홈 → 추천 → 코스 상세로 이어지는 라우팅 정상 동작 여부
- 홈 화면 입력 폼(지역·시간·이동수단) 검증 및 코스 생성 요청 정상 동작 여부
- 코스 상세 화면 Kakao Map 지도 렌더링 및 마커 표시 정상 여부
- 코스 공유 링크 복사 모달 동작 여부
- 이벤트 트래킹 요청이 Route Handler(`/api/*`)를 거쳐 정상 전달되는지 여부
- 데스크톱/모바일 반응형 레이아웃 정상 동작 여부
- 배포 환경에서 실제 동작 여부

### 3-5. 트러블 슈팅

#### 문제 1. 모바일 환경에서 레이아웃 깨짐

- **문제 상황**: 초기 UI가 웹(데스크톱) 화면 기준으로 설계되어, 모바일 화면에서 랜딩 페이지의 히어로 섹션을 비롯한 주요 섹션들의 레이아웃이 깨지는 문제가 발생
- **원인**: 데스크톱 뷰포트 기준 고정 값 위주로 스타일링되어 있어, 좁은 화면에서 텍스트·이미지·버튼 배치가 의도한 대로 반응하지 않음
- **해결 방법**: 웹 디자인 시안에 맞춰 랜딩 페이지 섹션들을 데스크톱/모바일 컴포넌트로 분리(`landing/ui/components/sections`, `landing/ui/components/mobile/sections`)하고, Tailwind 반응형 유틸리티로 브레이크포인트별 레이아웃을 재구성하여 반응형 웹으로 대응
- **진행 상황**: 랜딩 페이지는 반응형 대응을 완료했으며, 홈·추천·코스 상세 등 나머지 페이지는 웹 디자인을 기준으로 모바일 레이아웃을 지속적으로 수정·개선하는 중
- **배운 점**: UI 구현 초기 단계부터 반응형 레이아웃을 함께 설계하지 않으면, 이후 디바이스별 분기 대응 비용이 커진다는 것을 확인

### 3-6. 배포

**배포 아키텍처**

```
사용자 → dehangsa.com → Route 53 → CloudFront → EC2 (Docker/Nginx)
                                    (HTTPS 지원)   (Frontend + Backend)
```

**배포 과정**

1. GitHub main 브랜치에 코드를 푸시
2. GitHub Actions가 자동으로 Docker 이미지를 빌드
3. 빌드된 이미지를 GHCR(GitHub Container Registry)에 푸시
4. AWS EC2 서버에서 이미지를 Pull하여 docker-compose로 실행
5. Route 53으로 도메인(dehangsa.com)을 연결하고 CloudFront를 통해 HTTPS 통신 지원
6. 배포 환경에서 실제 동작 여부 확인

배포 후에는 환경변수(.env) 설정을 통해 DB 및 외부 API 연결을 관리

---

### 4-1. 프로젝트 성과

**진행 기간**: 2026-04-01 ~ 진행중

**누적 사용자**: 3,000명

**퍼널 전환율 목표 KPI**

| 지표 | 목표 |
|------|------|
| 랜딩 → 홈 진입 | 35% |
| 코스 생성 | 50% |
| 추천 카드 클릭 | 70% |
| Share 버튼 클릭 | 25% |
| 공유 링크 클릭 | 80% |

**Cycle 1~6** (핵심 퍼널 전환율 측정)

| 지표 | 평균 전환율 |
|------|------------|
| 홈 진입 후 코스 생성률 | 58% (v6에서 80%까지 개선) |
| 추천 코스 카드 클릭 | 86.3% |
| Share 버튼 클릭 | 29% |
| 공유 링크 클릭 | 90.0% |

**Cycle 7** (PMF 가능성 검증, 유입 이후 핵심 행동까지 세분화 측정)

| 지표 | 평균 전환율 |
|------|------------|
| 랜딩 → 홈 진입 | 36.8% |
| 홈 진입 후 코스 생성 | 86.9% |
| 추천 코스 카드 클릭 | 71% |
| Share 버튼 클릭 | 16.7% |
| 공유 링크 클릭 | 95.0% |

→ 핵심 플로우에 진입한 사용자는 서비스 가치를 경험할 가능성이 높다는 점을 확인

### 4-2. 배운 점

- 사용자를 관찰하고, 그 안에서 근본적인 문제를 정의하는 과정의 중요성을 체감
- 단순히 기능을 먼저 구현하는 것이 아니라, 사용자가 어떤 상황에서 어떤 불편을 겪는지 파악한 뒤 그 문제를 해결하기 위한 방향으로 의사결정을 진행해야 한다는 점을 상기
- 문제 정의 → 해결 아이디어 도출 → 기능 구현 → 데이터 검증의 흐름으로 프로젝트를 진행하면서, 개발 단계에서도 "진짜 사용자의 문제를 해결하는 기능인가?"라는 관점이 중요하다는 것을 경험

### 4-3. 한계점

- 초기 MVP 단계였기 때문에 추천 코스의 다양성과 상세 정보 제공에 한계가 있었음
- 사용자에게 맞춤형 코스를 추천하는 구조는 구현했지만, 장소 Pool이 충분하지 않아 코스 구성이 제한적이었고, 추천 장소에 대한 이미지와 상세 정보도 부족
- 코스 장소와 무관한 이미지가 노출되는 문제 및 추천 결과의 신뢰도를 높이기 위한 데이터 정제와 이미지 매칭 로직 개선 필요
- 체류시간, 리텐션, Device별 유입 경로를 측정할 수 있는 구조를 초기부터 설계하지 못해 사용자 이탈 구간 및 유입 환경에 대한 세부 분석에 어려움이 있었음

### 4-4. 향후 개선 방향

- Device별 사용자 유입, 체류시간, 리텐션을 측정할 수 있도록 데이터 수집 구조 개선 예정
- 단순 퍼널 전환율뿐 아니라 사용자의 이탈 구간과 반복 사용 가능성을 더 세밀하게 분석하는 것을 목표
- 사용자 입력 카테고리를 세분화하여 맞춤형 코스 추천 정확도를 향상할 계획 (예: 소개팅 첫 만남, 비 오는 날, 실내 데이트, 가성비 데이트 등 상황 기반 조건 반영)
- 코스 장소 Pool을 확장하여 최신 트렌드와 핫플레이스를 반영하고, 추천 장소의 이미지와 상세 정보를 보강
- 광고 배너, 추천 장소 제휴, 쿠폰 제공 등 BM 가능성도 함께 검토 중