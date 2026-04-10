import React from "react";
import { useEditorStore } from "../store/editorStore";
import { theme } from "../theme";

const panelStyle: React.CSSProperties = {
  width: 220,
  background: theme.panel,
  borderRight: `1px solid ${theme.border}`,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const headerStyle: React.CSSProperties = {
  padding: "12px 16px",
  fontSize: 13,
  fontWeight: 700,
  color: theme.textSecondary,
  borderBottom: `1px solid ${theme.border}`,
  textTransform: "uppercase",
  letterSpacing: 1,
};

const itemStyle = (selected: boolean): React.CSSProperties => ({
  padding: "6px 12px",
  fontSize: 12,
  cursor: "pointer",
  background: selected ? theme.selected : "transparent",
  borderLeft: selected ? `3px solid ${theme.selectedBorder}` : "3px solid transparent",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  color: theme.text,
});

const btnStyle: React.CSSProperties = {
  padding: "6px 10px",
  fontSize: 11,
  background: theme.buttonBg,
  color: theme.text,
  border: `1px solid ${theme.border}`,
  borderRadius: 4,
  cursor: "pointer",
  flex: 1,
};

const deleteBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: theme.danger,
  cursor: "pointer",
  fontSize: 14,
  padding: "0 4px",
  lineHeight: 1,
};

export const LayerPanel: React.FC = () => {
  const { props, selectedElement, selectElement, addTextElement, removeTextElement, addObject, removeObject } = useEditorStore();

  const isSelected = (type: string, index?: number) => {
    if (!selectedElement) return false;
    if (selectedElement.type !== type) return false;
    if (index !== undefined && "index" in selectedElement) return selectedElement.index === index;
    return index === undefined;
  };

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>Layers</div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div
          style={itemStyle(isSelected("background"))}
          onClick={() => selectElement({ type: "background" })}
        >
          <span>BG</span>
        </div>

        <div style={{ padding: "8px 12px 4px", fontSize: 10, color: theme.textTertiary, textTransform: "uppercase" }}>Objects</div>
        {props.decoration.objects.map((obj, i) => (
          <div
            key={`obj-${i}`}
            style={itemStyle(isSelected("object", i))}
            onClick={() => selectElement({ type: "object", index: i })}
          >
            <span>{obj.file}</span>
            <button style={deleteBtnStyle} onClick={(e) => { e.stopPropagation(); removeObject(i); }}>x</button>
          </div>
        ))}

        <div style={{ padding: "8px 12px 4px", fontSize: 10, color: theme.textTertiary, textTransform: "uppercase" }}>Text</div>
        {props.textElements.map((el, i) => (
          <div
            key={`text-${i}`}
            style={itemStyle(isSelected("text", i))}
            onClick={() => selectElement({ type: "text", index: i })}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{el.text || "(empty)"}</span>
            <button style={deleteBtnStyle} onClick={(e) => { e.stopPropagation(); removeTextElement(i); }}>x</button>
          </div>
        ))}

        {props.badge.enabled && (
          <>
            <div style={{ padding: "8px 12px 4px", fontSize: 10, color: theme.textTertiary, textTransform: "uppercase" }}>Badge</div>
            <div
              style={itemStyle(isSelected("badge"))}
              onClick={() => selectElement({ type: "badge" })}
            >
              <span>{props.badge.text}</span>
            </div>
          </>
        )}
      </div>

      <div style={{ padding: 8, borderTop: `1px solid ${theme.border}`, display: "flex", gap: 4 }}>
        <button style={btnStyle} onClick={addTextElement}>+ Text</button>
        <button style={btnStyle} onClick={addObject}>+ Object</button>
      </div>
    </div>
  );
};
