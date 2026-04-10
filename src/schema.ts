import { z } from "zod";
import { zColor } from "@remotion/zod-types";

// ─── 텍스트 그라데이션 ───
const textGradientSchema = z.object({
  enabled: z.boolean().describe("사용"),
  angle: z.number().min(0).max(360).describe("각도"),
  color1: zColor(),
  color2: zColor(),
});

// ─── 텍스트 외곽선/그림자 ───
const textEffectSchema = z.object({
  strokeColor: zColor(),
  strokeWidth: z.number().min(0).max(15).describe("외곽선 두께"),
  shadowColor: zColor(),
  shadowOffset: z.number().min(0).max(20).describe("그림자 오프셋"),
  glowColor: zColor(),
  glowSize: z.number().min(0).max(100).describe("글로우 크기"),
});

// ─── 텍스트 배경 바 ───
const textBgSchema = z.object({
  enabled: z.boolean().describe("사용"),
  color: zColor(),
  paddingX: z.number().min(0).max(40).describe("좌우 패딩"),
  paddingY: z.number().min(0).max(20).describe("상하 패딩"),
  borderRadius: z.number().min(0).max(30).describe("둥글기"),
});

// ─── 텍스트 요소 스키마 ───
export const textElementSchema = z.object({
  text: z.string().describe("텍스트"),
  top: z.number().min(-20).max(120).describe("top (%)"),
  left: z.number().min(-20).max(120).describe("left (%)"),
  fontSize: z.number().min(10).max(200).describe("크기"),
  fontWeight: z.number().min(100).max(900).step(100).describe("굵기"),
  rotation: z.number().min(-180).max(180).describe("회전"),
  letterSpacing: z.number().min(-10).max(20).describe("자간"),
  color: zColor(),
  gradient: textGradientSchema.describe("텍스트 그라데이션"),
  effect: textEffectSchema.describe("외곽선/그림자"),
  bg: textBgSchema.describe("배경 바"),
  animType: z
    .enum([
      "none",
      "fadeIn",
      "fadeUp",
      "fadeDown",
      "fadeLeft",
      "fadeRight",
      "scaleIn",
      "scaleOut",
      "popIn",
      "rotateIn",
      "blurIn",
    ])
    .describe("애니메이션"),
  animDelay: z.number().min(0).max(300).describe("시작 프레임"),
  endFrame: z.number().min(-1).max(600).describe("종료 프레임 (-1 = 끝까지)"),
});

export type TextElement = z.infer<typeof textElementSchema>;

// ─── 배지 스키마 ───
export const badgeSchema = z.object({
  enabled: z.boolean().describe("표시"),
  text: z.string().describe("텍스트"),
  bgColor: zColor(),
  textColor: zColor(),
  fontSize: z.number().min(8).max(40).describe("크기"),
  top: z.number().min(-10).max(110).describe("top (%)"),
  left: z.number().min(-10).max(110).describe("left (%)"),
  paddingX: z.number().min(2).max(30).describe("좌우 패딩"),
  paddingY: z.number().min(1).max(15).describe("상하 패딩"),
  borderRadius: z.number().min(0).max(20).describe("둥글기"),
  animType: z
    .enum(["none", "bounce", "pulse", "scaleIn", "popIn", "rotateIn", "shake"])
    .describe("애니메이션"),
  animDelay: z.number().min(0).max(300).describe("시작 프레임"),
  endFrame: z.number().min(-1).max(600).describe("종료 프레임 (-1 = 끝까지)"),
});

export type Badge = z.infer<typeof badgeSchema>;

// ─── 오브제 스키마 ───
const blendModeSchema = z.enum([
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity",
]);

export type BlendMode = z.infer<typeof blendModeSchema>;

export const objectSchema = z.object({
  file: z.string().describe("파일명"),
  top: z.number().min(-50).max(150).describe("top (%)"),
  left: z.number().min(-50).max(150).describe("left (%)"),
  size: z.number().min(10).max(500).describe("크기 (px)"),
  floatSpeed: z.number().min(0).max(10).step(0.1).describe("둥실 속도"),
  floatRange: z.number().min(0).max(50).describe("둥실 범위"),
  opacity: z.number().min(0).max(1).step(0.05).describe("투명도"),
  delay: z.number().min(0).max(300).describe("시작 프레임"),
  endFrame: z.number().min(-1).max(600).describe("종료 프레임 (-1 = 끝까지)"),
  rotation: z.number().min(-180).max(180).describe("회전"),
  zIndex: z.number().min(0).max(10).describe("레이어 순서"),
  blendMode: blendModeSchema.describe("블렌드 모드"),
});

export type FloatingObj = z.infer<typeof objectSchema>;

// ─── 배경 그라데이션 ───
const bgGradientSchema = z.object({
  enabled: z.boolean().describe("사용"),
  angle: z.number().min(0).max(360).describe("각도"),
  color1: zColor(),
  stop1: z.number().min(0).max(100).describe("위치1 (%)"),
  color2: zColor(),
  stop2: z.number().min(0).max(100).describe("위치2 (%)"),
  color3: zColor(),
  stop3: z.number().min(0).max(100).describe("위치3 (%)"),
});

// ─── 배경 스키마 ───
const backgroundSchema = z.object({
  imageBlendMode: blendModeSchema.describe("이미지 블렌드 모드"),
  color: zColor(),
  gradient: bgGradientSchema.describe("그라데이션"),
  image: z.string().describe("이미지 파일명"),
});

// ─── 장식 스키마 ───
const decorationSchema = z.object({
  objects: z.array(objectSchema).describe("오브제"),
  sparkleCount: z.number().min(0).max(30).describe("반짝이 개수"),
  sparkleColor: zColor(),
});

// ─── 루트 스키마 ───
export const cardPromoSchema = z.object({
  background: backgroundSchema.describe("배경"),
  textElements: z.array(textElementSchema).describe("텍스트"),
  badge: badgeSchema.describe("배지"),
  decoration: decorationSchema.describe("장식"),
  fontFamily: z.string().describe("폰트"),
  durationInFrames: z.number().min(15).max(600).describe("전체 프레임 길이"),
});

export type CardPromoProps = z.infer<typeof cardPromoSchema>;
