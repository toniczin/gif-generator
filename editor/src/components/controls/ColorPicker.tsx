import React, { useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { theme } from "../../theme";

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

export const ColorPicker: React.FC<Props> = ({ label, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const hex = value.startsWith("#") ? value : "#ffffff";

  return (
    <div style={{ marginBottom: 8, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 11, color: theme.textSecondary, flex: 1 }}>{label}</span>
        <div
          onClick={() => setOpen(!open)}
          style={{
            width: 24,
            height: 24,
            borderRadius: 4,
            background: value,
            border: `2px solid ${theme.inputBorder}`,
            cursor: "pointer",
            flexShrink: 0,
          }}
        />
        <HexColorInput
          color={hex}
          onChange={onChange}
          prefixed
          style={{
            width: 80,
            background: theme.inputBg,
            border: `1px solid ${theme.inputBorder}`,
            borderRadius: 4,
            color: theme.text,
            padding: "2px 6px",
            fontSize: 11,
          }}
        />
      </div>
      {open && (
        <div style={{ position: "absolute", right: 0, top: 32, zIndex: 100 }}>
          <div
            style={{ position: "fixed", inset: 0 }}
            onClick={() => setOpen(false)}
          />
          <div style={{ position: "relative", zIndex: 101 }}>
            <HexColorPicker color={hex} onChange={onChange} />
          </div>
        </div>
      )}
    </div>
  );
};
