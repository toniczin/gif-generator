import React, { useEffect, useRef, useState, useCallback, type RefObject } from "react";
import type { PlayerRef } from "@remotion/player";
import { useEditorStore, type ElementSelection } from "../store/editorStore";
import { theme } from "../theme";

const TRACK_HEIGHT = 24;
const LABEL_WIDTH = 120;
const RULER_HEIGHT = 24;
const HANDLE_WIDTH = 6;

interface Props {
  playerRef: RefObject<PlayerRef | null>;
}

interface TrackItem {
  selection: ElementSelection;
  label: string;
  startFrame: number;
  endFrame: number; // -1 means until total
  color: string;
}

type DragMode = "move" | "resizeStart" | "resizeEnd";

export const Timeline: React.FC<Props> = ({ playerRef }) => {
  const { props, selectedElement, selectElement, updateProps } = useEditorStore();
  const total = props.durationInFrames;
  const [currentFrame, setCurrentFrame] = useState(0);
  const tracksRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    idx: number;
    mode: DragMode;
    startX: number;
    startStart: number;
    startEnd: number;
  } | null>(null);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    const handler = (e: { detail: { frame: number } }) => setCurrentFrame(e.detail.frame);
    player.addEventListener("frameupdate", handler);
    return () => player.removeEventListener("frameupdate", handler);
  }, [playerRef]);

  const tracks: TrackItem[] = [];
  props.textElements.forEach((el, i) => {
    tracks.push({
      selection: { type: "text", index: i },
      label: `T: ${el.text || "(empty)"}`,
      startFrame: el.animDelay,
      endFrame: el.endFrame,
      color: "#6c63ff",
    });
  });
  props.decoration.objects.forEach((obj, i) => {
    tracks.push({
      selection: { type: "object", index: i },
      label: `O: ${obj.file}`,
      startFrame: obj.delay,
      endFrame: obj.endFrame,
      color: "#63a6ff",
    });
  });
  if (props.badge.enabled) {
    tracks.push({
      selection: { type: "badge" },
      label: `B: ${props.badge.text}`,
      startFrame: props.badge.animDelay,
      endFrame: props.badge.endFrame,
      color: "#ff6b9d",
    });
  }

  const isSelected = (s: ElementSelection): boolean => {
    if (!selectedElement) return false;
    if (selectedElement.type !== s.type) return false;
    if ("index" in s && "index" in selectedElement) return s.index === selectedElement.index;
    return true;
  };

  const seekTo = useCallback((frame: number) => {
    playerRef.current?.seekTo(Math.max(0, Math.min(total - 1, frame)));
  }, [playerRef, total]);

  const handleRulerClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const frame = Math.round((x / rect.width) * total);
    seekTo(frame);
  };

  const startBarDrag = (idx: number, mode: DragMode, e: React.MouseEvent) => {
    e.stopPropagation();
    const track = tracks[idx];
    dragRef.current = {
      idx,
      mode,
      startX: e.clientX,
      startStart: track.startFrame,
      startEnd: track.endFrame === -1 ? total : track.endFrame,
    };
  };

  const setTrackFrames = (track: TrackItem, start: number, end: number) => {
    updateProps((d) => {
      const setBoth = (obj: { animDelay?: number; delay?: number; endFrame: number }, useDelay: boolean) => {
        if (useDelay) {
          (obj as { delay: number }).delay = start;
        } else {
          (obj as { animDelay: number }).animDelay = start;
        }
        obj.endFrame = end >= total ? -1 : end;
      };

      if (track.selection.type === "text") {
        setBoth(d.textElements[track.selection.index], false);
      } else if (track.selection.type === "object") {
        setBoth(d.decoration.objects[track.selection.index], true);
      } else if (track.selection.type === "badge") {
        setBoth(d.badge, false);
      }
    });
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const tracksEl = tracksRef.current;
      if (!tracksEl) return;
      const trackWidth = tracksEl.clientWidth - LABEL_WIDTH;
      const deltaX = e.clientX - drag.startX;
      const deltaFrames = Math.round((deltaX / trackWidth) * total);
      const track = tracks[drag.idx];

      let newStart = drag.startStart;
      let newEnd = drag.startEnd;

      if (drag.mode === "move") {
        const length = drag.startEnd - drag.startStart;
        newStart = Math.max(0, Math.min(total - length, drag.startStart + deltaFrames));
        newEnd = newStart + length;
      } else if (drag.mode === "resizeStart") {
        newStart = Math.max(0, Math.min(drag.startEnd - 1, drag.startStart + deltaFrames));
      } else if (drag.mode === "resizeEnd") {
        newEnd = Math.max(drag.startStart + 1, Math.min(total, drag.startEnd + deltaFrames));
      }

      setTrackFrames(track, newStart, newEnd);
    };
    const onUp = () => {
      dragRef.current = null;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [tracks, updateProps, total]);

  const playheadPercent = (currentFrame / total) * 100;

  return (
    <div
      style={{
        height: 240,
        background: theme.panel,
        borderTop: `1px solid ${theme.border}`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "6px 12px",
          fontSize: 11,
          color: theme.textSecondary,
          borderBottom: `1px solid ${theme.border}`,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 1,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span>Timeline</span>
        <span style={{ color: theme.textTertiary, textTransform: "none", letterSpacing: 0 }}>
          frame {currentFrame} / {total}
        </span>
        <div style={{ flex: 1 }} />
        <label style={{ display: "flex", alignItems: "center", gap: 6, textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>
          <span style={{ color: theme.textSecondary }}>전체 길이:</span>
          <input
            type="number"
            min={15}
            max={600}
            value={total}
            onChange={(e) => {
              const v = parseInt(e.target.value) || 90;
              updateProps((d) => { d.durationInFrames = Math.max(15, Math.min(600, v)); });
            }}
            style={{
              width: 60,
              background: theme.inputBg,
              border: `1px solid ${theme.inputBorder}`,
              borderRadius: 4,
              color: theme.text,
              padding: "2px 6px",
              fontSize: 11,
            }}
          />
          <span style={{ color: theme.textTertiary }}>프레임 ({(total / 30).toFixed(1)}s)</span>
        </label>
      </div>

      <div ref={tracksRef} style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", position: "relative" }}>
        <div
          onClick={handleRulerClick}
          style={{
            display: "flex",
            height: RULER_HEIGHT,
            background: theme.bg,
            borderBottom: `1px solid ${theme.border}`,
            cursor: "pointer",
            position: "sticky",
            top: 0,
            zIndex: 2,
          }}
        >
          <div style={{ width: LABEL_WIDTH, borderRight: `1px solid ${theme.border}` }} />
          <div style={{ flex: 1, position: "relative" }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${i * 10}%`,
                  top: 4,
                  fontSize: 9,
                  color: theme.textTertiary,
                }}
              >
                {Math.round((i / 10) * total)}
              </div>
            ))}
          </div>
        </div>

        {tracks.map((track, idx) => {
          const selected = isSelected(track.selection);
          const effectiveEnd = track.endFrame === -1 ? total : track.endFrame;
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                height: TRACK_HEIGHT,
                borderBottom: `1px solid ${theme.borderSubtle}`,
                background: selected ? theme.selected : "transparent",
              }}
            >
              <div
                onClick={() => selectElement(track.selection)}
                style={{
                  width: LABEL_WIDTH,
                  padding: "0 8px",
                  fontSize: 11,
                  color: theme.text,
                  display: "flex",
                  alignItems: "center",
                  borderRight: `1px solid ${theme.border}`,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  borderLeft: selected ? `3px solid ${theme.selectedBorder}` : "3px solid transparent",
                }}
              >
                {track.label}
              </div>
              <div style={{ flex: 1, position: "relative" }}>
                <div
                  onMouseDown={(e) => {
                    selectElement(track.selection);
                    startBarDrag(idx, "move", e);
                  }}
                  style={{
                    position: "absolute",
                    top: 4,
                    bottom: 4,
                    left: `${(track.startFrame / total) * 100}%`,
                    width: `${((effectiveEnd - track.startFrame) / total) * 100}%`,
                    background: track.color,
                    opacity: selected ? 0.9 : 0.5,
                    borderRadius: 3,
                    cursor: "grab",
                    border: selected ? `1px solid ${theme.selectedBorder}` : "1px solid transparent",
                  }}
                >
                  <div
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      selectElement(track.selection);
                      startBarDrag(idx, "resizeStart", e);
                    }}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: HANDLE_WIDTH,
                      cursor: "ew-resize",
                      background: "rgba(255, 255, 255, 0.4)",
                    }}
                  />
                  <div
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      selectElement(track.selection);
                      startBarDrag(idx, "resizeEnd", e);
                    }}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      bottom: 0,
                      width: HANDLE_WIDTH,
                      cursor: "ew-resize",
                      background: "rgba(255, 255, 255, 0.4)",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `calc(${LABEL_WIDTH}px + (100% - ${LABEL_WIDTH}px) * ${playheadPercent / 100})`,
            width: 2,
            background: theme.danger,
            pointerEvents: "none",
            zIndex: 3,
          }}
        />
      </div>
    </div>
  );
};
