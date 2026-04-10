import React from "react";
import { theme } from "../../theme";

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}

export const SliderControl: React.FC<Props> = ({ label, value, min, max, step = 1, onChange }) => {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: theme.textSecondary, marginBottom: 2 }}>
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: theme.accent }}
      />
    </div>
  );
};
