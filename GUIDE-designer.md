# 디자이너 가이드

## 시작

```bash
npm run editor
```

브라우저에서 `http://localhost:3000` 자동 오픈.

---

## 화면

```
Layers  |    Preview     |  Props
        +---- Timeline --+
```

| 영역 | 역할 |
|------|------|
| Layers (왼쪽) | 모든 요소 목록 |
| Preview (가운데) | 실시간 미리보기 |
| Props (오른쪽) | 선택 요소 속성 편집 |
| Timeline (아래) | 등장 시점 조절 |

---

## 편집

| 동작 | 방법 |
|------|------|
| 선택 | Preview 또는 Layers에서 클릭 |
| 이동 | Preview에서 드래그 |
| 등장 시점 | Timeline 트랙 막대 드래그 |
| 추가 | Layers 하단 `+ Text` / `+ Object` |
| 삭제 | Layers의 `x` 또는 `Delete` 키 |
| 저장 | 상단 `Save JSON` |
| 불러오기 | 상단 `Load JSON` |

### 단축키
- `Cmd+Z` 실행 취소 / `Cmd+Shift+Z` 다시 실행
- `Delete` 삭제 / `Esc` 선택 해제

---

## 폰트 추가

1. 폰트 파일(`.woff2` / `.ttf` / `.otf`)을 다음 폴더에 복사:
   ```
   public/fonts/
   ```
2. 에디터 재시작 (`npm run editor`)
3. BG 패널 → `fontFamily` 드롭다운에서 선택

> 파일명이 폰트 이름이 됩니다. 예: `SandollGothicNeo1-Bold.woff2` → `SandollGothicNeo1-Bold`

---

## 이미지 추가 (배경, 오브제)

1. 이미지 파일(`.png` / `.jpg` / `.webp`)을 다음 폴더에 복사:
   ```
   public/backgrounds/
   ```
2. 에디터 재시작
3. 사용:
   - **배경**: BG 패널 → `image` 드롭다운
   - **오브제**: 오브제 패널 → `file` 드롭다운

---

## 블렌드 모드

오브제 이미지와 배경 이미지에 합성 효과를 줍니다.

| 모드 | 효과 | 사용 예시 |
|------|------|----------|
| `normal` | 기본 (적용 없음) | 일반 이미지 |
| `screen` | 빛나는 합성 | 네온, 별, 빛 효과 |
| `multiply` | 어둡게 곱하기 | 그림자, 어두운 합성 |
| `overlay` | 대비 강조 | 텍스처 |
| `hard-light` | 강한 입체감 | 강조 효과 |
| `soft-light` | 부드러운 입체감 | 자연스러운 합성 |

설정 위치:
- 배경 이미지: BG 패널 → `image blendMode`
- 오브제: 오브제 패널 → `blendMode`

---

## 렌더링 (대량 생성)

| 명령 | 결과 |
|------|------|
| `npm run render` | 5종 포맷 모두 (PNG/MP4/GIF/WebM/Poster) |
| `npm run render:still` | PNG만 |
| `npm run render:gif` | GIF만 |

저장 위치: `output/오늘날짜/`

---

## 문제 해결

| 증상 | 해결 |
|------|------|
| 폰트 안 보임 | `public/fonts/`에 파일 확인 → 에디터 재시작 |
| 이미지 안 보임 | `public/backgrounds/`에 파일 확인 → 에디터 재시작 |
| 에디터 안 열림 | `npm run editor` 다시 실행 |
| ffmpeg 에러 | `brew install ffmpeg` |
