import type { TextElement } from "../schema";

export function buildTextShadow(el: TextElement): string {
  const { strokeColor, strokeWidth, shadowColor, shadowOffset, glowColor, glowSize } = el.effect;
  const shadows: string[] = [];

  if (strokeWidth > 0) {
    const offsets = [
      [0, -1], [0, 1], [-1, 0], [1, 0],
      [-1, -1], [1, -1], [-1, 1], [1, 1],
    ];
    for (const [x, y] of offsets) {
      shadows.push(`${x * strokeWidth}px ${y * strokeWidth}px 0 ${strokeColor}`);
    }
  }

  if (shadowOffset > 0) {
    shadows.push(`${shadowOffset}px ${shadowOffset}px 0 ${shadowColor}`);
    shadows.push(`${shadowOffset + 1}px ${shadowOffset + 1}px 0 ${shadowColor}`);
  }

  if (glowSize > 0) {
    shadows.push(`0 0 ${glowSize}px ${glowColor}`);
    shadows.push(`0 0 ${glowSize * 2}px ${glowColor}`);
  }

  return shadows.join(", ");
}
