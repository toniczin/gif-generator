import React, { useEffect, useRef, useState, type RefObject } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { CardPromo } from "@composition/CardPromo";
import { useEditorStore } from "../store/editorStore";
import { theme } from "../theme";
import { InteractionOverlay } from "./InteractionOverlay";

interface Props {
  playerRef: RefObject<PlayerRef | null>;
}

const COMP_W = 500;
const COMP_H = 400;
const ASPECT = COMP_W / COMP_H;
const CONTROLS_HEIGHT = 50;
const PADDING = 24;

export const EditorCanvas: React.FC<Props> = ({ playerRef }) => {
  const props = useEditorStore((s) => s.props);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 500, h: 400 });

  useEffect(() => {
    const update = () => {
      const el = containerRef.current;
      if (!el) return;
      const availW = el.clientWidth - PADDING * 2;
      const availH = el.clientHeight - PADDING * 2 - CONTROLS_HEIGHT;
      let w = availW;
      let h = w / ASPECT;
      if (h > availH) {
        h = availH;
        w = h * ASPECT;
      }
      setSize({ w: Math.max(100, w), h: Math.max(80, h) });
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: theme.canvas,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", width: size.w, height: size.h + CONTROLS_HEIGHT }}>
        <Player
          ref={playerRef}
          component={CardPromo}
          inputProps={props}
          compositionWidth={COMP_W}
          compositionHeight={COMP_H}
          durationInFrames={props.durationInFrames}
          fps={30}
          style={{ width: size.w, height: size.h + CONTROLS_HEIGHT }}
          controls
          loop
          clickToPlay={false}
          initiallyMuted
          acknowledgeRemotionLicense
        />
        <InteractionOverlay playerRef={playerRef} canvasHeight={size.h} />
      </div>
    </div>
  );
};
