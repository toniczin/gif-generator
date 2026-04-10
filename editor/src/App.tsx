import React, { useEffect, useRef } from "react";
import type { PlayerRef } from "@remotion/player";
import { LayerPanel } from "./components/LayerPanel";
import { EditorCanvas } from "./components/EditorCanvas";
import { PropertyPanel } from "./components/PropertyPanel";
import { TemplateManager } from "./components/TemplateManager";
import { Timeline } from "./components/Timeline";
import { useEditorStore } from "./store/editorStore";

export const App: React.FC = () => {
  const { undo, redo, selectedElement, selectElement, removeTextElement, removeObject } = useEditorStore();
  const playerRef = useRef<PlayerRef>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        selectElement(null);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "SELECT") return;
        if (selectedElement?.type === "text") {
          removeTextElement(selectedElement.index);
        } else if (selectedElement?.type === "object") {
          removeObject(selectedElement.index);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo, selectedElement, selectElement, removeTextElement, removeObject]);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh" }}>
      <TemplateManager />
      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
        <LayerPanel />
        <EditorCanvas playerRef={playerRef} />
        <PropertyPanel />
      </div>
      <Timeline playerRef={playerRef} />
    </div>
  );
};
