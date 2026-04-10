# GIF Generator

Remotion 기반 프로모션 카드 에셋 대량 생산 자동화 도구.

CSV 또는 Remotion Studio에서 텍스트/색상/레이아웃을 설정하면 **PNG / MP4 / GIF / WebM / WebP(poster)** 5가지 포맷을 한 번에 생성합니다.

외부 API 없이 100% 로컬에서 동작합니다 (비용 0원).

---

## 파이프라인

```
디자이너: Remotion Studio에서 실시간 편집 (색상 피커, 슬라이더)
         또는 CSV에 텍스트 + 색상 데이터 입력

자동화:
텍스트/색상 설정 + React 컴포넌트
  |  Remotion
  |-- PNG    (정적 캡처)
  |-- MP4    (애니메이션)
  |  ffmpeg
  |-- GIF    (2-pass 팔레트, SNS 공유용)
  |-- WebM   (VP9, 웹 최적)
  +-- WebP   (첫 프레임 poster)
```

---

## 요구 사항

- **Node.js** 18+
- **ffmpeg** -- `brew install ffmpeg`

---

## 설치

```bash
git clone <repository-url>
cd gif-generator
npm install
```

---

## 사용법

### 1. Studio로 편집 (권장)

```bash
npm run dev
```

브라우저에서 Remotion Studio가 열립니다. 사이드바에서 텍스트, 색상, 위치 등을 실시간으로 조절할 수 있습니다. 자세한 내용은 [디자이너 가이드](./GUIDE-designer.md) 참고.

### 2. CSV로 대량 생성

`data/texts.csv`에 데이터를 입력하고 실행합니다.

```bash
npm run render          # 전체 포맷
npm run render:still    # PNG만
npm run render:gif      # GIF만
```

#### CSV 기본 컬럼

| 컬럼 | 설명 | 예시 |
|------|------|------|
| slug | 파일명 | `gangnam-healing` |
| location | 위치 텍스트 | `강남 선릉역` |
| title | 메인 텍스트 (`\\n`으로 줄바꿈) | `힐링뷰\\n테라피` |
| subtitle | 하단 텍스트 | `전원 한국인 관리사` |
| bg-color | 배경색 | `#1a1035` |
| bg-gradient | 그라데이션 | `linear-gradient(...)` |
| title-color | 타이틀 색 | `#c8a0e8` |
| title-stroke-color | 외곽선 색 | `#4a2070` |
| obj1~obj5 | 오브제 이미지 | `Object.png` |

### 3. 결과 확인

```
output/2026-04-08/
|-- png/      정적 이미지
|-- mp4/      애니메이션 영상
|-- gif/      고품질 GIF
|-- webm/     WebM VP9 (웹 최적)
+-- poster/   정적 썸네일 (WebP)
```

---

## 프로젝트 구조

```
gif-generator/
|-- src/
|   |-- schema.ts              Zod 스키마 (Studio UI 자동 생성)
|   |-- CardPromo.tsx           메인 컴포넌트
|   |-- index.tsx               Remotion Composition 등록
|   |-- render.js               배치 렌더링 스크립트
|   |-- fonts.css               폰트 선언
|   +-- components/
|       |-- TextBlock.tsx        텍스트 블록 (자유 배치 + 애니메이션)
|       |-- TextLine.tsx         텍스트 라인 (개별 스타일링)
|       |-- Badge.tsx            배지 컴포넌트
|       |-- FloatingObject.tsx   둥실 오브제
|       |-- Sparkles.tsx         반짝이 별
|       +-- BackgroundLayer.tsx  배경 (색상/그라데이션/이미지)
|-- public/
|   +-- backgrounds/            오브제/배경 이미지 (PNG)
|-- data/
|   +-- texts.csv               입력 데이터
|-- output/                     생성된 에셋 (git 미추적)
|-- GUIDE-designer.md           디자이너용 가이드
|-- GUIDE-publisher.md          퍼블리셔용 가이드
+-- package.json
```

---

## 웹 사용 예시

```html
<video autoplay loop muted playsinline
  poster="poster/gangnam-healing.webp"
  aria-label="강남역 힐링 프로모션">
  <source src="webm/gangnam-healing.webm" type="video/webm">
  <source src="mp4/gangnam-healing.mp4" type="video/mp4">
</video>
```

---

## 가이드 문서

- [**디자이너 가이드**](./GUIDE-designer.md) -- Studio 사용법, CSV 작성법, 색상 조절
- [**퍼블리셔 가이드**](./GUIDE-publisher.md) -- 웹 마크업, WebM fallback, lazy loading, 접근성
