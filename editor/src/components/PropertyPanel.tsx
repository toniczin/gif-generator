import React from "react";
import { useEditorStore } from "../store/editorStore";
import { theme } from "../theme";
import { TextElementPanel } from "./panels/TextElementPanel";
import { BadgePanel } from "./panels/BadgePanel";
import { ObjectPanel } from "./panels/ObjectPanel";
import { BackgroundPanel } from "./panels/BackgroundPanel";

const panelStyle: React.CSSProperties = {
  width: 300,
  background: theme.panel,
  borderLeft: `1px solid ${theme.border}`,
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

export const PropertyPanel: React.FC = () => {
  const { selectedElement } = useEditorStore();

  const getTitle = () => {
    if (!selectedElement) return "Properties";
    switch (selectedElement.type) {
      case "text": return `Text #${selectedElement.index + 1}`;
      case "badge": return "Badge";
      case "object": return `Object #${selectedElement.index + 1}`;
      case "background": return "Background";
    }
  };

  const renderPanel = () => {
    if (!selectedElement) {
      return <div style={{ padding: 16, fontSize: 13, color: theme.textTertiary, textAlign: "center" }}>select an element</div>;
    }
    switch (selectedElement.type) {
      case "text": return <TextElementPanel index={selectedElement.index} />;
      case "badge": return <BadgePanel />;
      case "object": return <ObjectPanel index={selectedElement.index} />;
      case "background": return <BackgroundPanel />;
    }
  };

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>{getTitle()}</div>
      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
        {renderPanel()}
      </div>
    </div>
  );
};
