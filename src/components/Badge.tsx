import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Badge as BadgeType } from "../schema";

type BadgeProps = Omit<BadgeType, "enabled">;

export const Badge: React.FC<BadgeProps> = ({
  text,
  bgColor,
  textColor,
  fontSize,
  top,
  left,
  paddingX,
  paddingY,
  borderRadius,
  animType,
  animDelay,
  endFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (endFrame !== -1 && frame >= endFrame) return null;

  let opacity = 1;
  let scale = 1;
  let rotation = 0;
  let translateX = 0;

  if (animType !== "none") {
    const standardSpring = spring({
      frame: frame - animDelay,
      fps,
      config: { damping: 10, stiffness: 120 },
      durationInFrames: 25,
    });

    const bouncySpring = spring({
      frame: frame - animDelay,
      fps,
      config: { damping: 6, stiffness: 100 },
      durationInFrames: 35,
    });

    opacity = interpolate(standardSpring, [0, 1], [0, 1]);

    switch (animType) {
      case "bounce":
        scale = interpolate(standardSpring, [0, 1], [0.3, 1]);
        break;
      case "scaleIn":
        scale = interpolate(standardSpring, [0, 1], [0.5, 1]);
        break;
      case "pulse":
        scale = 1 + Math.sin(frame * 0.15) * 0.05;
        break;
      case "popIn":
        scale = interpolate(bouncySpring, [0, 1], [0, 1]);
        break;
      case "rotateIn":
        rotation = interpolate(standardSpring, [0, 1], [-180, 0]);
        scale = interpolate(standardSpring, [0, 1], [0.5, 1]);
        break;
      case "shake":
        translateX = Math.sin((frame - animDelay) * 0.5) * 3;
        break;
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        top: `${top}%`,
        left: `${left}%`,
        backgroundColor: bgColor,
        color: textColor,
        fontSize,
        fontWeight: 900,
        paddingLeft: paddingX,
        paddingRight: paddingX,
        paddingTop: paddingY,
        paddingBottom: paddingY,
        borderRadius,
        opacity,
        transform: `translateX(${translateX}px) scale(${scale}) rotate(${rotation}deg)`,
        zIndex: 4,
        letterSpacing: 1,
      }}
    >
      {text}
    </div>
  );
};
