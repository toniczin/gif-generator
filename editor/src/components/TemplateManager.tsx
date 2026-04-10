import React, { useRef } from "react";
import { useEditorStore } from "../store/editorStore";
import { saveTemplate, loadTemplate } from "../lib/templateIO";
import { theme } from "../theme";

const btnStyle: React.CSSProperties = {
  padding: "6px 12px",
  fontSize: 11,
  background: theme.buttonBg,
  color: theme.text,
  border: `1px solid ${theme.border}`,
  borderRadius: 4,
  cursor: "pointer",
};

export const TemplateManager: React.FC = () => {
  const { props, setProps, undo, redo } = useEditorStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const name = prompt("template name", "card-template");
    if (name) saveTemplate(props, name);
  };

  const handleLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const loaded = await loadTemplate(file);
      setProps(loaded);
    } catch (err) {
      alert(`Load error: ${(err as Error).message}`);
    }
    e.target.value = "";
  };

  return (
    <div style={{ display: "flex", gap: 4, padding: "6px 8px", background: theme.panel, borderBottom: `1px solid ${theme.border}` }}>
      <button style={btnStyle} onClick={handleSave}>Save JSON</button>
      <button style={btnStyle} onClick={() => fileRef.current?.click()}>Load JSON</button>
      <input ref={fileRef} type="file" accept=".json" onChange={handleLoad} style={{ display: "none" }} />
      <div style={{ flex: 1 }} />
      <button style={btnStyle} onClick={undo}>Undo</button>
      <button style={btnStyle} onClick={redo}>Redo</button>
    </div>
  );
};
