import React from "react";
import { AbsoluteFill } from "remotion";
import type { CardPromoProps } from "./schema";
import { BackgroundLayer } from "./components/BackgroundLayer";
import { Sparkles } from "./components/Sparkles";
import { FloatingObject } from "./components/FloatingObject";
import { TextElement } from "./components/TextElement";
import { Badge } from "./components/Badge";
import "./fonts.css";

export const CardPromo: React.FC<CardPromoProps> = ({
  background,
  textElements,
  badge,
  decoration,
  fontFamily,
}) => {
  return (
    <AbsoluteFill
      style={{
        fontFamily: `'${fontFamily}', sans-serif`,
        overflow: "hidden",
      }}
    >
      <BackgroundLayer {...background} fontFamily={fontFamily} />

      <Sparkles count={decoration.sparkleCount} color={decoration.sparkleColor} />

      {decoration.objects.map((obj, i) => (
        <FloatingObject key={`obj-${i}`} {...obj} />
      ))}

      {textElements.map((el, i) => (
        <TextElement key={`text-${i}`} {...el} />
      ))}

      {badge.enabled && <Badge {...badge} />}
    </AbsoluteFill>
  );
};
