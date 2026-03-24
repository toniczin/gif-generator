# 프로모션 썸네일 — 퍼블리셔 가이드

---

## 권장 마크업

```html
<video autoplay loop muted playsinline
  poster="poster/gangnam-sale-50off.webp"
  aria-label="강남역 최대 50% 할인 프로모션">
  <source src="webm/gangnam-sale-50off.webm" type="video/webm">
  <source src="mp4/gangnam-sale-50off.mp4" type="video/mp4">
</video>
```

---

## 속성별 역할

| 속성 | 역할 | 필수 여부 |
|------|------|-----------|
| `autoplay` | 페이지 로드 시 자동 재생 | 필수 |
| `loop` | 무한 반복 재생 | 필수 |
| `muted` | 음소거 (모바일 autoplay 조건) | **필수** |
| `playsinline` | iOS에서 전체화면 전환 방지 | **필수** |
| `poster` | 영상 로드 전 표시할 정적 이미지 | 권장 |
| `aria-label` | 스크린리더용 대체 텍스트 | **필수** (접근성) |

`muted` + `playsinline`이 없으면 **iOS Safari에서 자동재생이 차단**됩니다.

---

## WebM + MP4 fallback을 쓰는 이유

### 1. 용량

실측 데이터 (동일 콘텐츠, 480x384px, 5.27초 기준):

| 포맷 | 평균 파일 크기 | GIF 대비 |
|------|---------------|----------|
| GIF | 2,478 KB | 기준 |
| MP4 | 269 KB | **-89%** |
| WebM | 142 KB | **-94%** |
| WebP (poster) | 9 KB | — |

썸네일 50개 기준: GIF 약 121 MB vs WebM 약 6.9 MB

### 2. 화질

GIF는 256색 제한으로 그라데이션이 계단 현상(banding)을 보입니다. MP4/WebM은 수백만 색을 지원하여 원본에 가까운 화질을 유지합니다.

### 3. 브라우저 지원

| 포맷 | 글로벌 지원율 | 비고 |
|------|-------------|------|
| MP4 (H.264) | 98%+ | 모든 브라우저 |
| WebM (VP9) | 97%+ | Safari 16.4+(2023.03~) 지원 |

`<source>` 태그 순서대로 브라우저가 지원하는 첫 번째 포맷을 재생합니다. WebM을 먼저 선언하면 지원 브라우저에서는 더 가벼운 WebM을, 미지원 시 MP4로 자동 fallback됩니다.

### 4. Google 권고

Google Lighthouse는 GIF 사용 시 **"Use video formats for animated content"** 경고를 표시합니다. Google web.dev 공식 문서에서도 GIF 대신 `<video>` 태그 사용을 권장합니다.

> 근거: https://web.dev/articles/replace-gifs-with-videos

---

## poster 속성을 넣는 이유

- 영상 로드 전 빈 화면 방지 (첫 프레임 즉시 표시)
- 모바일 데이터 절약 모드에서 autoplay 차단 시 대체 이미지 역할
- WebP 포맷으로 약 9KB — 추가 용량 부담 거의 없음

---

## 접근성 체크리스트

- `aria-label`에 콘텐츠를 설명하는 텍스트 필수 입력
- 자동재생 영상이므로 `muted` 필수 (WCAG 1.4.2)
- 깜빡임이 초당 3회를 초과하지 않도록 주의 (WCAG 2.3.1)

---

## lazy loading 적용 (이미지 많을 경우)

`<video>` 태그는 `loading="lazy"`를 네이티브로 지원하지 않으므로 Intersection Observer로 처리합니다.

```html
<!-- preload="none"으로 초기 로딩 방지 -->
<video class="lazy-video" autoplay loop muted playsinline
  preload="none"
  poster="poster/gangnam-sale-50off.webp"
  aria-label="강남역 최대 50% 할인 프로모션">
  <source data-src="webm/gangnam-sale-50off.webm" type="video/webm">
  <source data-src="mp4/gangnam-sale-50off.mp4" type="video/mp4">
</video>
```

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const video = entry.target;
      video.querySelectorAll('source').forEach((source) => {
        source.src = source.dataset.src;
      });
      video.load();
      observer.unobserve(video);
    }
  });
});

document.querySelectorAll('.lazy-video').forEach((video) => {
  observer.observe(video);
});
```

---

## 파일 네이밍 규칙

모든 파일명은 영문 소문자 + 하이픈(kebab-case)으로 통일되어 있습니다.

| 포맷 | 경로 예시 |
|------|----------|
| WebM | `webm/gangnam-sale-50off.webm` |
| MP4 | `mp4/gangnam-sale-50off.mp4` |
| Poster | `poster/gangnam-sale-50off.webp` |
| GIF | `gif/gangnam-sale-50off.gif` (SNS용) |

---

## 참고 자료

- Google web.dev — GIF를 비디오로 교체: https://web.dev/articles/replace-gifs-with-videos
- Google Lighthouse — 애니메이션 콘텐츠 최적화: https://developer.chrome.com/docs/lighthouse/performance/efficient-animated-content
- MDN — video 요소: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video
- Can I Use — WebM: https://caniuse.com/webm
- MDN — Autoplay guide: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay
