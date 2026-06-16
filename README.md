<div align="center">

<img src="./public/logo.png" alt="MJE Logo" width="300" />

# 데행사 · 데이트코스 플래닝 서비스

**데이트코스 고민 30분, 이제 30초로.**
원하는 조건 3가지만 입력하면 맛집·카페·놀거리까지 한 번에 추천받는 커플 데이트 플래너

</div>

<br/>

## 📖 목차

- [프로젝트 소개](#-프로젝트-소개)
- [개발 기간 & 배포](#-개발-기간--배포)
- [시작 가이드](#-시작-가이드)
- [기술 스택](#️-기술-스택)
- [주요 기능](#-주요-기능)
- [화면 구성](#-화면-구성)
- [아키텍처](#️-아키텍처)
- [디렉토리 구조](#-디렉토리-구조)

<br/>

## 💡 프로젝트 소개

> 데이트코스 계획이 어려운 커플들을 위한, 가장 쉬운 데이트코스 플래닝.

데이트 준비는 생각보다 손이 많이 갑니다. 인터넷과 SNS를 뒤지다 지쳐 결국 아무 데나 가게 됩니다.\
**데행사**는 이런 고민을 없애기 위해 만들어진 데이트코스 추천 서비스입니다.

원하는 **조건 3가지만 입력**하면, \
맛집·카페·놀거리를 동선까지 고려해 하나의 코스로 묶어
**평균 10초** 만에 완성해 줍니다. 더 이상 데이트 전날 밤을 검색으로 보내지 않아도 됩니다.

| 생성된 코스 | 평균 생성 속도 | 만족도 |
| :---: | :---: | :---: |
| **9,200+** | **10초** | **98%** |

<br/>

## 📅 개발 기간 & 배포

- **개발 기간**: 2026.03 ~ 진행 중
- **배포 환경**: Docker(standalone) 기반 컨테이너 배포 · `:3000`
- **배포 주소**: _배포 준비 중_

<br/>

## 🚀 시작 가이드

### 요구 사항

- **Node.js** 20 이상 (권장: 20-alpine 환경 기준)
- **npm** 10 이상

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone <repository-url>
cd MJE-Frontend

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정 (.env.local)
echo "NEXT_PUBLIC_API_BASE_URL=<백엔드 API 주소>" > .env.local

# 4. 개발 서버 실행
npm run dev
```

개발 서버 실행 후 [http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

### 주요 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 검사 |

### 환경 변수

| 변수명 | 필수 | 설명 |
| --- | :---: | --- |
| `NEXT_PUBLIC_API_BASE_URL` | ✅ | 백엔드 API의 Base URL |

> 필수 환경 변수가 누락되면 실행 시점에 에러를 발생시켜 설정 누락을 방지합니다.

### Docker 실행

```bash
docker build -t mje-frontend .
docker run -p 3000:3000 mje-frontend
```

<br/>

## 🛠️ 기술 스택

### Development

![Next.js](https://img.shields.io/badge/Next.js_16_(App_Router)-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript_5_(strict)-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Jotai](https://img.shields.io/badge/Jotai-000000?style=flat-square&logo=react&logoColor=white)

### Config & Test

![ESLint](https://img.shields.io/badge/ESLint_9-4B32C3?style=flat-square&logo=eslint&logoColor=white)
![PostCSS](https://img.shields.io/badge/PostCSS-DD3A0A?style=flat-square&logo=postcss&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white)

### Deploy

![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js_20-339933?style=flat-square&logo=node.js&logoColor=white)

<br/>

## ✨ 주요 기능

### 🎯 조건 3가지 입력만으로 코스 완성
지역·시간·취향 등 핵심 조건 3가지만 입력하면 데이트 준비가 끝납니다.

### 🍽️ 맛집·카페·놀거리 통합 추천
식사 → 카페 → 액티비티까지 하나의 흐름으로 묶어 추천합니다.

### 🗺️ 동선을 고려한 코스 구성
"맛집은 강남, 카페는 홍대" 같은 엉망인 동선 대신, 이동을 최소화한 코스를 제안합니다.

### ⚡ 평균 10초의 빠른 생성
오래 검색할 필요 없이, 평균 10초 만에 완성된 코스를 받아볼 수 있습니다.

### 🔁 마음에 들지 않으면 다시 추천
코스의 일부가 마음에 들지 않으면 해당 항목만 다시 추천받을 수 있습니다.

<br/>

## 📱 화면 구성

| 화면 | 경로 | 설명 |
| --- | --- | --- |
| 랜딩 | `/` · `/landing` | 서비스 소개 및 진입 CTA |
| 홈 | `/home` | 조건 입력 및 코스 생성 시작 |
| 코스 | `/courses` | 생성된 데이트코스 목록 |
| 코스 상세 | `/courses/detail/[id]` | 개별 코스 상세 보기 |
| 추천 | `/recommendation` · `/recommendation/[id]` | 코스 추천 결과 |

<br/>

## 🏗️ 아키텍처

본 프로젝트는 **Feature 기반 Layered Architecture**를 따르며, Clean Architecture와 DDD 원칙을 기반으로 합니다.

```
┌─────────────────────────────────────────────┐
│                  UI Layer                     │  React 컴포넌트 (Dumb Component)
│                     ↓                         │
│              Application Layer                │  상태 관리 · usecase orchestration
│                     ↓                         │
│                Domain Layer                   │  순수 비즈니스 모델 (가장 안쪽)
│                     ↑                         │
│             Infrastructure Layer              │  외부 시스템 (API, Storage)
└─────────────────────────────────────────────┘
```

### 의존성 규칙

```
UI → Application → Domain
Infrastructure → Domain
```

- **Domain**은 항상 가장 안쪽 레이어이며, 외부 시스템에 의존하지 않습니다.
- `Domain → Application`, `Domain → UI`, `Application → UI` 의존은 **금지**됩니다.

### 설계 원칙

- Single Responsibility Principle
- Open/Closed Principle
- Feature Based Architecture
- Domain Isolation

<br/>

## 📂 디렉토리 구조

```
src/
├── app/                    # Next.js App Router (라우팅 · 엔트리 포인트)
│   ├── api/                # Route Handlers (events, export-logs)
│   ├── home/
│   ├── landing/
│   ├── courses/
│   └── recommendation/
│
├── landing/                # 랜딩 Feature
│   └── ui/components/sections/   # Hero, PainPoint, HotSpot, CTA 등
│
├── home/                   # 홈 Feature (조건 입력)
│
├── courses/                # 코스 Feature
│   ├── application/        # 상태 · usecase
│   ├── services/
│   ├── types/
│   └── ui/components/
│
├── recommendation/         # 추천 Feature
│   ├── application/
│   ├── infrastructure/api/ # 외부 API 어댑터
│   ├── services/
│   └── ui/
│
└── infrastructure/         # 전역 인프라
    ├── api/                # HTTP 클라이언트
    ├── analytics/          # 이벤트 트래킹
    └── config/             # 환경 변수 관리
```

<br/>

## 🔗 Path Alias

`@/*` 는 프로젝트 루트(`./`)에 매핑됩니다.

```ts
import HeroSection from "@/landing/ui/components/sections/HeroSection";
import { clientEnv } from "@/infrastructure/config/env";
```

<br/>

<div align="center">

**MJE** — 데이트, 고민하지 말고 떠나세요 💙

</div>
