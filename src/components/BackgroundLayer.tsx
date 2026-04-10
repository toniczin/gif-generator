import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import type { BlendMode } from "../schema";

type Props = {
  imageBlendMode: BlendMode;
  color: string;
  gradient: {
    enabled: boolean;
    angle: number;
    color1: string;
    stop1: number;
    color2: string;
    stop2: number;
    color3: string;
    stop3: number;
  };
  image: string;
  fontFamily: string;
};

export const BackgroundLayer: React.FC<Props> = ({
  imageBlendMode,
  color,
  gradient,
  image,
  fontFamily,
}) => {
  let bg: string | undefined;
  if (gradient.enabled) {
    bg = `linear-gradient(${gradient.angle}deg, ${gradient.color1} ${gradient.stop1}%, ${gradient.color2} ${gradient.stop2}%, ${gradient.color3} ${gradient.stop3}%)`;
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: color,
        background: bg,
        fontFamily: `'${fontFamily}', sans-serif`,
        overflow: "hidden",
      }}
    >
      {image && (
        <Img
          src={staticFile(`backgrounds/${image}`)}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            mixBlendMode: imageBlendMode === "normal" ? undefined : imageBlendMode,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
