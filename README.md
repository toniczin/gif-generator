# GIF Generator

Creatomate API + ffmpeg 기반 프로모션 에셋 대량 생산 자동화 도구.

CSV에 텍스트 데이터를 작성하면, Creatomate 템플릿과 결합하여 **MP4 / GIF / WebM / WebP(poster)** 4가지 포맷을 한 번에 생성합니다.

---

## 파이프라인

```
CSV (텍스트 데이터)
  ↓
Creatomate API → MP4 렌더링
  ↓ ffmpeg
  ├── GIF    (2-pass 팔레트, SNS 공유용)
  ├── WebM   (VP9, 웹 최적 — 원본 대비 -94%)
  └── WebP   (첫 프레임 정적 이미지, poster용)
```

---

## 요구 사항

- **Node.js** 18+
- **ffmpeg** — `brew install ffmpeg`
- **Creatomate** 계정 및 API 키 — [creatomate.com](https://creatomate.com)

---

## 설치

```bash
git clone <repository-url>
cd gif-generator
npm install
```

---

## 환경 변수 설정

`.env.example`을 복사하여 `.env` 파일을 생성합니다.

```bash
cp .env.example .env
```

| 변수 | 설명 |
|------|------|
| `CREATOMATE_API_KEY` | Creatomate 대시보드에서 발급받은 API 키 |
| `TEMPLATE_ID` | Creatomate 에디터에서 생성한 템플릿 ID |

---

## 사용법

### 1. CSV 작성

`data/texts.csv`에 텍스트 데이터를 입력합니다.

```csv
slug,title,subtitle,price
gangnam-sale-50off,"강남역","최대 50% 할인","강남"
seongsu-member-benefit,"성수역","가입 즉시 쿠폰 지급","성수"
```

| 컬럼 | 설명 | 규칙 |
|------|------|------|
| `slug` | 파일명 | 영문 소문자 + 하이픈 |
| `title` | 메인 텍스트 | 한글 가능 |
| `subtitle` | 서브 텍스트 | 한글 가능 |
| `price` | 가격/위치 텍스트 | 한글 가능 |

> **Note:** 컬럼명은 Creatomate 템플릿의 요소 이름과 일치해야 합니다.

### 2. 실행

```bash
npm run generate
```

### 3. 결과 확인

`output/YYYY-MM-DD/` 아래에 날짜별로 생성됩니다.

```
output/2026-03-24/
├── mp4/      영상 원본
├── gif/      고품질 GIF (2-pass 팔레트)
├── webm/     WebM VP9 (웹 최적)
└── poster/   정적 썸네일 (WebP)
```

---

## 웹 사용 예시

```html
<video autoplay loop muted playsinline
  poster="poster/gangnam-sale-50off.webp"
  aria-label="강남역 최대 50% 할인 프로모션">
  <source src="webm/gangnam-sale-50off.webm" type="video/webm">
  <source src="mp4/gangnam-sale-50off.mp4" type="video/mp4">
</video>
```

GIF 대신 `<video>` 태그를 사용하면 **용량 최대 94% 절감**, 원본 화질 유지, Lighthouse 경고 해소 등의 이점이 있습니다. 자세한 내용은 [GUIDE-publisher.md](./GUIDE-publisher.md)를 참고하세요.

---

## 포맷별 비교

동일 콘텐츠(480x384px, 5.27초) 기준 실측:

| 포맷 | 평균 크기 | GIF 대비 |
|------|----------|----------|
| GIF | 2,478 KB | 기준 |
| MP4 | 269 KB | -89% |
| WebM | 142 KB | **-94%** |
| WebP (poster) | 9 KB | — |

---

## 프로젝트 구조

```
gif-generator/
├── src/
│   ├── generate.js    # 메인 실행 스크립트
│   └── config.js      # 환경 변수 로드
├── data/
│   └── texts.csv      # 입력 데이터
├── output/            # 생성된 에셋 (git 미추적)
├── GUIDE-designer.md  # 디자이너용 가이드
├── GUIDE-publisher.md # 퍼블리셔용 가이드
├── .env.example       # 환경 변수 템플릿
└── package.json
```

---

## 가이드 문서

- [**디자이너 가이드**](./GUIDE-designer.md) — CSV 작성법, 템플릿 수정, 에러 대처
- [**퍼블리셔 가이드**](./GUIDE-publisher.md) — 웹 마크업, WebM fallback, lazy loading, 접근성
