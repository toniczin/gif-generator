import React, { useCallback, type RefObject } from "react";
import type { PlayerRef } from "@remotion/player";
import { useEditorStore } from "../store/editorStore";
import { useCoordinateMapping } from "../hooks/useCoordinateMapping";
import { useDragElement } from "../hooks/useDragElement";
import { hitTest } from "../lib/hitTest";

interface Props {
  playerRef: RefObject<PlayerRef | null>;
  canvasHeight: number;
}

export const InteractionOverlay: React.FC<Props> = ({ playerRef, canvasHeight }) => {
  const { props, selectElement } = useEditorStore();
  const { screenToPercent } = useCoordinateMapping(playerRef);
  const { startDrag, moveDrag, endDrag, isDragging } = useDragElement();

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const percent = screenToPercent(e.clientX, e.clientY);
      if (!percent) return;

      const hit = hitTest(percent, props);
      selectElement(hit);

      if (hit && hit.type !== "background") {
        startDrag(hit, percent);
      }
    },
    [props, selectElement, screenToPercent, startDrag],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging()) return;
      const percent = screenToPercent(e.clientX, e.clientY);
      if (!percent) return;
      moveDrag(percent);
    },
    [screenToPercent, moveDrag, isDragging],
  );

  const handleMouseUp = useCallback(() => {
    endDrag();
  }, [endDrag]);

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: canvasHeight,
        cursor: isDragging() ? "grabbing" : "default",
        zIndex: 10,
      }}
    />
  );
};
