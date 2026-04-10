import React from "react";
import { theme } from "../../theme";

interface Props {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}

export const SelectControl: React.FC<Props> = ({ label, value, options, onChange }) => {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 11, color: theme.textSecondary, marginBottom: 2 }}>{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          background: theme.inputBg,
          border: `1px solid ${theme.inputBorder}`,
          borderRadius: 4,
          color: theme.text,
          padding: "4px 6px",
          fontSize: 12,
        }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt || "(none)"}</option>
        ))}
      </select>
    </div>
  );
};
