import React from "react";
import { useCurrentFrame } from "remotion";

const StarSVG: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" />
  </svg>
);

const SPARKLE_POSITIONS = [
  { top: "8%", left: "10%", size: 36, delay: 0 },
  { top: "18%", right: "15%", size: 24, delay: 8 },
  { bottom: "22%", left: "12%", size: 14, delay: 16 },
  { bottom: "35%", right: "8%", size: 24, delay: 24 },
  { top: "50%", left: "6%", size: 14, delay: 12 },
];

type SparklePosition = (typeof SPARKLE_POSITIONS)[number];

export const Sparkles: React.FC<{ count: number; color: string }> = ({
  count,
  color,
}) => {
  const frame = useCurrentFrame();

  const positions: SparklePosition[] = [];
  for (let i = 0; i < Math.min(count, SPARKLE_POSITIONS.length); i++) {
    positions.push(SPARKLE_POSITIONS[i]);
  }

  if (count > SPARKLE_POSITIONS.length) {
    for (let i = SPARKLE_POSITIONS.length; i < count; i++) {
      positions.push({
        top: `${10 + ((i * 17) % 70)}%`,
        left: `${5 + ((i * 23) % 80)}%`,
        size: 12 + ((i * 7) % 24),
        delay: (i * 5) % 30,
      });
    }
  }

  return (
    <>
      {positions.map((sparkle, i) => {
        const sparklePhase = ((frame + sparkle.delay * 3) % 60) / 60;
        const sparkleOpacity = Math.sin(sparklePhase * Math.PI);
        const sparkleScale = 0.3 + sparkleOpacity * 0.8;
        const sparkleRotate = sparklePhase * 30;

        return (
          <div
            key={`sparkle-${i}`}
            style={{
              position: "absolute",
              ...("top" in sparkle && sparkle.top ? { top: sparkle.top } : {}),
              ...("bottom" in sparkle && sparkle.bottom
                ? { bottom: sparkle.bottom }
                : {}),
              ...("left" in sparkle && sparkle.left
                ? { left: sparkle.left }
                : {}),
              ...("right" in sparkle && sparkle.right
                ? { right: sparkle.right }
                : {}),
              opacity: sparkleOpacity,
              transform: `scale(${sparkleScale}) rotate(${sparkleRotate}deg)`,
              filter: `drop-shadow(0 0 4px rgba(200, 170, 255, 0.8))`,
              zIndex: 3,
            }}
          >
            <StarSVG size={sparkle.size} color={color} />
          </div>
        );
      })}
    </>
  );
};
