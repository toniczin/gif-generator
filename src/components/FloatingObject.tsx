import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { FloatingObj } from "../schema";

export const FloatingObject: React.FC<FloatingObj> = ({
  file,
  top,
  left,
  size,
  floatSpeed,
  floatRange,
  opacity,
  delay,
  endFrame,
  rotation,
  zIndex,
  blendMode,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (endFrame !== -1 && frame >= endFrame) return null;

  const objSpring = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 80 },
    durationInFrames: 35,
  });
  const objScale = interpolate(objSpring, [0, 1], [0.3, 1]);
  const objOpacity = interpolate(objSpring, [0, 1], [0, opacity]);

  const floatY = Math.sin((frame + delay * 5) * 0.02 * floatSpeed) * floatRange;
  const floatRotate =
    rotation + Math.sin((frame + delay * 3) * 0.015 * floatSpeed) * 3;

  return (
    <div
      style={{
        position: "absolute",
        top: `${top}%`,
        left: `${left}%`,
        width: size,
        height: size,
        opacity: objOpacity,
        transform: `scale(${objScale}) translateY(${floatY}px) rotate(${floatRotate}deg)`,
        zIndex,
        mixBlendMode: blendMode === "normal" ? undefined : blendMode,
      }}
    >
      <Img
        src={staticFile(`backgrounds/${file}`)}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
};
