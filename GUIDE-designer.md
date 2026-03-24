# GIF Generator — 디자이너 가이드

---

## 실행 방법

```bash
cd ~/beaulead/gif-generator
npm run generate
```

결과물은 `output/오늘날짜/` 폴더에 생성됩니다.

---

## CSV 작성법

파일 위치: `/Users/izin/beaulead/gif-generator/data/texts.csv`

엑셀 또는 텍스트 에디터로 편집합니다.

| 컬럼 | 설명 | 작성 규칙 | 예시 |
|------|------|-----------|------|
| `slug` | 파일명으로 사용됨 | **영문 소문자 + 하이픈만** 사용 | `gangnam-sale-50off` |
| `title` | 메인 텍스트 | 한글 가능 | `강남역` |
| `subtitle` | 서브 텍스트 | 한글 가능 | `최대 50% 할인` |
| `price` | 가격/위치 텍스트 | 한글 가능 | `강남` |

**주의:** 컬럼명(slug, title, subtitle, price)은 Creatomate 템플릿의 요소 이름과 정확히 일치해야 합니다. 변경하지 마세요.

### CSV 예시

```csv
slug,title,subtitle,price
gangnam-sale-50off,"강남역","최대 50% 할인","강남"
seongsu-member-benefit,"성수역","가입 즉시 쿠폰 지급","성수"
```

---

## 출력 파일 구조

```
output/2026-03-23/
├── mp4/      영상 원본
├── gif/      고품질 GIF
├── webm/     경량 영상 (웹용)
└── poster/   정적 썸네일 이미지 (WebP)
```

---

## 템플릿 수정 (Creatomate)

creatomate.com 에서 직접 수정 가능합니다.

**변경 가능:** 배경, 애니메이션 효과, 폰트, 레이아웃

**변경 금지:** 텍스트 요소 이름 (title, subtitle, price)

---

## 에러 발생 시

| 증상 | 해결 |
|------|------|
| CSV 파싱 에러 | 텍스트 안에 쉼표가 있으면 큰따옴표로 감싸기 |
| ffmpeg not found | `brew install ffmpeg` 실행 |
| 텍스트가 안 바뀜 | CSV 컬럼명과 템플릿 요소 이름이 같은지 확인 |
