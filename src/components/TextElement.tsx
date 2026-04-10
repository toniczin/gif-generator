import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { TextElement as TextElementType } from "../schema";
import { buildTextShadow } from "../lib/textShadow";

export const TextElement: React.FC<TextElementType> = (el) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const textShadow = buildTextShadow(el);

  if (el.endFrame !== -1 && frame >= el.endFrame) return null;

  let opacity = 1;
  let translateX = 0;
  let translateY = 0;
  let scale = 1;
  let animRotation = 0;
  let blur = 0;

  if (el.animType !== "none") {
    const standardSpring = spring({
      frame: frame - el.animDelay,
      fps,
      config: { damping: 15, stiffness: 100 },
      durationInFrames: 30,
    });

    const bouncySpring = spring({
      frame: frame - el.animDelay,
      fps,
      config: { damping: 8, stiffness: 100 },
      durationInFrames: 40,
    });

    opacity = interpolate(standardSpring, [0, 1], [0, 1]);

    switch (el.animType) {
      case "fadeIn":
        break;
      case "fadeUp":
        translateY = interpolate(standardSpring, [0, 1], [40, 0]);
        break;
      case "fadeDown":
        translateY = interpolate(standardSpring, [0, 1], [-40, 0]);
        break;
      case "fadeLeft":
        translateX = interpolate(standardSpring, [0, 1], [40, 0]);
        break;
      case "fadeRight":
        translateX = interpolate(standardSpring, [0, 1], [-40, 0]);
        break;
      case "scaleIn":
        scale = interpolate(standardSpring, [0, 1], [0.85, 1]);
        break;
      case "scaleOut":
        scale = interpolate(standardSpring, [0, 1], [1.5, 1]);
        break;
      case "popIn":
        scale = interpolate(bouncySpring, [0, 1], [0, 1]);
        break;
      case "rotateIn":
        animRotation = interpolate(standardSpring, [0, 1], [-15, 0]);
        scale = interpolate(standardSpring, [0, 1], [0.85, 1]);
        break;
      case "blurIn":
        blur = interpolate(standardSpring, [0, 1], [10, 0]);
        break;
    }
  }

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    top: `${el.top}%`,
    left: `${el.left}%`,
    transform: `translate(-50%, -50%) translateX(${translateX}px) translateY(${translateY}px) scale(${scale}) rotate(${el.rotation + animRotation}deg)`,
    opacity,
    fontSize: el.fontSize,
    fontWeight: el.fontWeight,
    letterSpacing: el.letterSpacing,
    lineHeight: 1.25,
    whiteSpace: "nowrap",
    zIndex: 2,
    textShadow: textShadow || undefined,
    filter: blur > 0 ? `blur(${blur}px)` : undefined,
  };

  if (el.gradient.enabled) {
    Object.assign(baseStyle, {
      background: `linear-gradient(${el.gradient.angle}deg, ${el.gradient.color1}, ${el.gradient.color2})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    });
  } else {
    baseStyle.color = el.color;
  }

  if (el.effect.strokeWidth > 0 && !el.gradient.enabled) {
    baseStyle.WebkitTextStroke = `${el.effect.strokeWidth}px ${el.effect.strokeColor}`;
    baseStyle.paintOrder = "stroke fill";
  }

  if (el.bg.enabled) {
    return (
      <div style={baseStyle}>
        <span
          style={{
            display: "inline-block",
            backgroundColor: el.bg.color,
            paddingLeft: el.bg.paddingX,
            paddingRight: el.bg.paddingX,
            paddingTop: el.bg.paddingY,
            paddingBottom: el.bg.paddingY,
            borderRadius: el.bg.borderRadius,
          }}
        >
          {el.text}
        </span>
      </div>
    );
  }

  return <div style={baseStyle}>{el.text}</div>;
};
