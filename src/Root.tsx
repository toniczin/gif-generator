import React from "react";
import { Composition, registerRoot } from "remotion";
import { CardPromo } from "./CardPromo";
import { cardPromoSchema, type CardPromoProps } from "./schema";

const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="CardPromo"
      component={CardPromo}
      schema={cardPromoSchema}
      durationInFrames={90}
      fps={30}
      width={500}
      height={400}
      calculateMetadata={({ props }) => ({
        durationInFrames: (props as CardPromoProps).durationInFrames || 90,
      })}
      defaultProps={{
        durationInFrames: 90,
        background: {
          imageBlendMode: "normal" as const,
          color: "#0d0a1a",
          gradient: { enabled: true, angle: 160, color1: "#1a1040", stop1: 0, color2: "#0d0a1a", stop2: 40, color3: "#060412", stop3: 100 },
          image: "",
        },
        fontFamily: "MangoByeolbyeol",
        textElements: [
          {
            text: "강남 선릉역", top: 32, left: 50, fontSize: 28, fontWeight: 900, rotation: 0, letterSpacing: 3, color: "#c8b0e8",
            gradient: { enabled: false, angle: 180, color1: "#ffffff", color2: "#c8b0e8" },
            effect: { strokeColor: "#4a2070", strokeWidth: 2, shadowColor: "#1a0a30", shadowOffset: 0, glowColor: "rgba(160, 120, 255, 0.4)", glowSize: 15 },
            bg: { enabled: false, color: "rgba(74, 32, 112, 0.7)", paddingX: 12, paddingY: 4, borderRadius: 6 },
            animType: "fadeUp" as const, animDelay: 0, endFrame: -1,
          },
          {
            text: "힐링뷰", top: 48, left: 50, fontSize: 70, fontWeight: 900, rotation: 0, letterSpacing: 3, color: "#c8a0e8",
            gradient: { enabled: true, angle: 180, color1: "#ff93d4", color2: "#a70064" },
            effect: { strokeColor: "#4a2070", strokeWidth: 5, shadowColor: "#1a0a30", shadowOffset: 6, glowColor: "rgba(160, 120, 255, 0.4)", glowSize: 25 },
            bg: { enabled: false, color: "rgba(74, 32, 112, 0.7)", paddingX: 12, paddingY: 4, borderRadius: 6 },
            animType: "scaleIn" as const, animDelay: 6, endFrame: -1,
          },
          {
            text: "테라피", top: 62, left: 50, fontSize: 70, fontWeight: 900, rotation: 0, letterSpacing: 3, color: "#c8a0e8",
            gradient: { enabled: true, angle: 180, color1: "#ff93d4", color2: "#a70064" },
            effect: { strokeColor: "#4a2070", strokeWidth: 5, shadowColor: "#1a0a30", shadowOffset: 6, glowColor: "rgba(160, 120, 255, 0.4)", glowSize: 25 },
            bg: { enabled: false, color: "rgba(74, 32, 112, 0.7)", paddingX: 12, paddingY: 4, borderRadius: 6 },
            animType: "scaleIn" as const, animDelay: 8, endFrame: -1,
          },
          {
            text: "전원 한국인 관리사", top: 78, left: 50, fontSize: 20, fontWeight: 400, rotation: 0, letterSpacing: 5, color: "#b8a8d0",
            gradient: { enabled: false, angle: 180, color1: "#ffffff", color2: "#b8a8d0" },
            effect: { strokeColor: "#4a2070", strokeWidth: 0, shadowColor: "#1a0a30", shadowOffset: 0, glowColor: "rgba(160, 120, 255, 0)", glowSize: 0 },
            bg: { enabled: false, color: "rgba(74, 32, 112, 0.7)", paddingX: 12, paddingY: 4, borderRadius: 6 },
            animType: "fadeUp" as const, animDelay: 16, endFrame: -1,
          },
        ],
        badge: {
          enabled: true, text: "HOT", bgColor: "#ff4444", textColor: "#ffffff", fontSize: 16,
          top: 5, left: 8, paddingX: 14, paddingY: 6, borderRadius: 6,
          animType: "bounce" as const, animDelay: 20, endFrame: -1,
        },
        decoration: {
          objects: [
            { file: "Object.png", top: 2, left: 78, size: 110, floatSpeed: 3, floatRange: 10, opacity: 1, delay: 0, endFrame: -1, rotation: 0, zIndex: 1, blendMode: "normal" as const },
            { file: "Object1.png", top: 55, left: 80, size: 95, floatSpeed: 2, floatRange: 8, opacity: 0.8, delay: 5, endFrame: -1, rotation: 0, zIndex: 1, blendMode: "normal" as const },
            { file: "Object.png", top: 65, left: 3, size: 70, floatSpeed: 4, floatRange: 12, opacity: 0.7, delay: 10, endFrame: -1, rotation: 0, zIndex: 1, blendMode: "normal" as const },
            { file: "Object.png", top: 3, left: 5, size: 60, floatSpeed: 3, floatRange: 8, opacity: 0.9, delay: 3, endFrame: -1, rotation: 0, zIndex: 1, blendMode: "normal" as const },
          ],
          sparkleCount: 10,
          sparkleColor: "#ffffff",
        },
      }}
    />
  );
};

registerRoot(RemotionRoot);
