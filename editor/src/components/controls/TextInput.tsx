import React from "react";
import { theme } from "../../theme";

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export const TextInput: React.FC<Props> = ({ label, value, onChange, placeholder }) => {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 11, color: theme.textSecondary, marginBottom: 2 }}>{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          background: theme.inputBg,
          border: `1px solid ${theme.inputBorder}`,
          borderRadius: 4,
          color: theme.text,
          padding: "4px 6px",
          fontSize: 13,
          boxSizing: "border-box",
        }}
      />
    </div>
  );
};
