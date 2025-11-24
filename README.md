# Chaos Zero Nightmare Save Data Calculator

[![Version](https://img.shields.io/badge/version-1.1.1-blue.svg)](https://github.com/yourusername/CZN_calc)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Electron](https://img.shields.io/badge/Electron-28.0.0-47848F.svg)](https://www.electronjs.org/)

**Chaos Zero Nightmare (CZN)** 덱 빌딩 게임의 세이브 포인트를 정확하게 계산하는 데스크톱 애플리케이션입니다.

> **Inspired by 카제나 채널**
> 바이브 코딩으로 만든 실전형 덱 계산기

---

## 목차

- [주요 기능](#주요-기능)
- [설치 방법](#설치-방법)
- [사용 방법](#사용-방법)
- [포인트 계산 규칙](#포인트-계산-규칙)
- [기술 스택](#기술-스택)
- [개발 가이드](#개발-가이드)
- [버전 히스토리](#버전-히스토리)
- [라이선스](#라이선스)

---

## 주요 기능

### 카드 관리
- **기본 카드 4장** 자동 생성 (일반 3장, 희귀 1장)
- **고유 카드** 추가 (일반/희귀/전설/신화 등급)
- **일반 카드** 추가 (중립 +20pt, 금기 +20pt, 몬스터 +80pt)
- **카드 복제** 기능 - 덱 전체 복제 횟수 추적
  - 0회차: 0pt
  - 1회차: 10pt
  - 2회차: 30pt
  - 3회차: 50pt
  - 4회차 이상: 70pt
- **카드 제거** 기능 - 순차적 제거 비용 계산
- **카드 변환** 기능 (+10pt)

### 옵션 시스템
- **번뜩임** 옵션
  - 기본 카드 4장 + 최초 고유 카드 4장 (ID 낮은 순): **0pt**
  - 그 외 모든 카드: **10pt**
- **신뜩임** 옵션: **20pt** (모든 카드 동일)

### 저장 시스템
- **5개 슬롯** 지원 - 각 슬롯에 이름 지정 가능
- **로컬 스토리지** 기반 자동 저장
- 티어, 나이트메어 모드, 보정치 설정 포함 저장

### 실시간 계산
- 티어별 저장 용량 자동 계산: `(티어 × 10) + 20 + 보정치`
- 나이트메어 모드: 티어 +1 적용
- 포인트 초과 시 경고 표시
- 카드 이름 더블클릭으로 즉석 편집

---

## 설치 방법

### Windows 사용자

1. [Releases 페이지](https://github.com/yourusername/CZN_calc/releases)에서 최신 버전 다운로드
2. `CZN-Calculator-Setup-1.1.1.exe` 실행
3. 설치 경로 선택 후 설치 진행

### 소스 코드에서 빌드

```bash
# 저장소 클론
git clone https://github.com/yourusername/CZN_calc.git
cd CZN_calc

# 의존성 설치
npm install

# 개발 모드 실행
npm run dev

# 빌드 (Windows)
npm run build-win
```

---

## 사용 방법

### 1. 기본 설정

1. **티어 선택**: 현재 진행 중인 카오스 티어 입력 (1-20)
2. **나이트메어 모드**: 활성화 시 티어 +1 적용
3. **보정치**: 추가 포인트 조정 (선택사항)

### 2. 덱 구성

#### 초기 덱 생성
- **"초기 덱 생성"** 버튼 클릭
- 기본 카드 4장 자동 추가 (일반 3장, 희귀 1장)

#### 고유 카드 추가
1. 카드 이름 입력
2. 등급 선택 (일반/희귀/전설/신화)
3. **"고유 카드 추가"** 버튼 클릭

#### 일반 카드 추가
1. 카드 이름 입력
2. 타입 선택 (중립/금기/몬스터)
3. **"일반 카드 추가"** 버튼 클릭

### 3. 카드 조작

| 기능 | 방법 |
|------|------|
| **이름 수정** | 카드 이름 더블클릭 → 입력 → Enter |
| **옵션 선택** | 번뜩임/신뜩임 체크박스 클릭 (하나만 선택 가능) |
| **제거 표시** | "제거" 체크박스 클릭 |
| **변환 표시** | "변환" 체크박스 클릭 |
| **복제** | "복제" 버튼 클릭 |
| **삭제** | "삭제" 버튼 클릭 |

### 4. 덱 저장/불러오기

#### 슬롯 저장
1. 슬롯의 **"저장"** 버튼 클릭
2. 슬롯 이름 입력 (예: "티어7 기본 덱")
3. 확인

#### 슬롯 불러오기
- 슬롯의 **"불러오기"** 버튼 클릭

---

## 포인트 계산 규칙

### 카드 타입 기본 비용

| 타입 | 비용 |
|------|------|
| 기본 카드 | 0pt |
| 고유 카드 | 0pt |
| 중립 카드 | 20pt |
| 금기 카드 | 20pt |
| 몬스터 카드 | 80pt |

### 복제 비용 (덱 전체 공유)

| 복제 순서 | 비용 |
|-----------|------|
| 1번째 복제 | 0pt |
| 2번째 복제 | 10pt |
| 3번째 복제 | 30pt |
| 4번째 복제 | 50pt |
| 5번째 이상 | 70pt |

**특징:**
- 덱 전체의 복제 횟수를 공유
- 복제된 카드 삭제 시 자동으로 비용 재계산
- 중간 순서 삭제 시에도 정확한 포인트 유지

### 제거 비용

| 제거 순서 | 기본 비용 | 기본/번뜩임 카드 추가 |
|-----------|-----------|----------------------|
| 1번째 제거 | 0pt | +20pt |
| 2번째 제거 | 10pt | +20pt |
| 3번째 제거 | 30pt | +20pt |
| 4번째 제거 | 50pt | +20pt |
| 5번째 이상 | 70pt | +20pt |

### 옵션 비용

| 옵션 | 대상 | 비용 |
|------|------|------|
| **번뜩임** | 기본 카드 4장 + 최초 고유 카드 4장 | **0pt** |
| **번뜩임** | 그 외 모든 카드 | **10pt** |
| **신뜩임** | 모든 카드 | **20pt** |

**초기 카드 판정 기준:**
- 기본 카드: 항상 초기 카드로 간주
- 고유 카드: **ID가 낮은 순서대로 4장**만 초기 카드
  - 중간에 고유 카드를 삭제해도 자동으로 재계산
  - 예: ID 5, 6, 7, 8, 9 중 ID 6 삭제 → ID 5, 7, 8, 9가 초기 4장

### 변환 비용
- 모든 카드: **10pt**

### 저장 용량 계산
```
저장 용량 = (티어 × 10) + 20 + 보정치
나이트메어 모드 활성화 시: (티어 + 1) × 10 + 20 + 보정치
```

**예시:**
- 티어 5, 일반: (5 × 10) + 20 = **70pt**
- 티어 5, 나이트메어: (6 × 10) + 20 = **80pt**
- 티어 7, 보정치 +10: (7 × 10) + 20 + 10 = **100pt**

---

## 기술 스택

### Core
- **Electron 28.0.0** - 크로스 플랫폼 데스크톱 앱 프레임워크
- **Vanilla JavaScript** - 순수 자바스크립트 (프레임워크 없음)
- **HTML5/CSS3** - 모던 웹 표준

### Build Tools
- **electron-builder** - Windows 인스톨러 생성
- **Node.js** - 개발 환경

### Features
- **localStorage API** - 클라이언트 측 데이터 저장
- **IPC (Inter-Process Communication)** - Electron 프로세스 간 통신

---

## 개발 가이드

### 프로젝트 구조

```
CZN_calc/
├── main.js              # Electron 메인 프로세스
├── renderer.js          # 렌더러 프로세스 (UI 로직)
├── index.html           # 메인 UI
├── styles.css           # 스타일시트
├── package.json         # 프로젝트 설정
├── assets/              # 아이콘 및 리소스
│   └── icon.ico
└── dist/                # 빌드 출력 폴더
```

### 주요 파일 설명

#### `main.js`
- Electron 메인 프로세스
- 창 생성 및 관리
- IPC 이벤트 핸들러

#### `renderer.js`
- 덱 상태 관리 (`deck`, `nextCardId`, `totalDuplicateCount`)
- 포인트 계산 로직
- UI 업데이트 및 이벤트 처리
- localStorage 연동

#### `index.html`
- 사용자 인터페이스 구조
- 티어 설정, 카드 추가, 덱 리스트, 슬롯 시스템

### 개발 명령어

```bash
# 개발 모드 실행 (DevTools 자동 오픈)
npm run dev

# 프로덕션 모드 실행
npm start

# Windows 빌드
npm run build-win

# 모든 플랫폼 빌드
npm run build
```

### 디버깅

```bash
# 개발자 도구와 함께 실행
npm run dev

# 또는
electron . --dev
```

---

## 버전 히스토리

### v1.1.1 (2025-11-13) - Current
**Bug Fixes & Improvements**
- 카드 복제 시스템 전면 개선
  - 덱 전체 복제 횟수 추적 기능 추가
  - 복제된 카드 삭제 시 포인트 재계산 로직 구현
  - 중간 순서 카드 삭제 시 포인트 불일치 문제 해결
- 번뜩임 비용 계산 개선
  - 기본 카드 4장 + ID 낮은 고유 카드 4장만 번뜩임 무료
  - 고유 카드 삭제 시 초기 카드 자동 재판정

### v1.1.0 (2025-11-13)
**Major Features**
- 5개 슬롯 저장/불러오기 시스템 추가
- 슬롯별 이름 지정 기능
- 입력 필드 이벤트 리스너 버그 수정
- Windows 빌드 설정 최적화

### v1.0.0 (2025-11-13)
**Initial Release**
- Chaos Zero Nightmare 덱 계산기 최초 릴리즈
- 실시간 세이브 포인트 계산
- 카드 추가/복제/제거/변환 기능
- localStorage 기반 저장 시스템
- Electron 기반 데스크톱 애플리케이션

---

## 기여하기

버그 리포트, 기능 제안, 풀 리퀘스트 모두 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 라이선스

이 프로젝트는 **MIT License**를 따릅니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

## 연락처

- **Author**: Gilbert
- **Inspired by**: 카제나 채널
- **Project Link**: [https://github.com/yourusername/CZN_calc](https://github.com/yourusername/CZN_calc)

---

## 감사의 말

이 프로젝트는 **카제나 채널**의 유저들의 아이디어와 제보를 받아 제작되었습니다.
카제나 게임이 추구하는 AI 코딩 정신으로 즉시~ 사용 가능한 도구를 만드는 것이 목표입니다.

---

<div align="center">
Made with love for CZN Players
</div>
