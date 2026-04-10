import { useCallback, type RefObject } from "react";
import type { PlayerRef } from "@remotion/player";

const COMP_WIDTH = 500;
const COMP_HEIGHT = 400;

export function useCoordinateMapping(playerRef: RefObject<PlayerRef | null>) {
  const screenToPercent = useCallback(
    (clientX: number, clientY: number) => {
      const player = playerRef.current;
      if (!player) return null;

      const container = player.getContainerNode();
      if (!container) return null;

      const rect = container.getBoundingClientRect();
      const scale = player.getScale();

      const relX = clientX - rect.left;
      const relY = clientY - rect.top;
      const compX = relX / scale;
      const compY = relY / scale;

      return {
        left: (compX / COMP_WIDTH) * 100,
        top: (compY / COMP_HEIGHT) * 100,
      };
    },
    [playerRef],
  );

  return { screenToPercent };
}
