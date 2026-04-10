import React from "react";
import { ColorPicker } from "./ColorPicker";
import { SliderControl } from "./SliderControl";
import { theme } from "../../theme";

interface TwoColorGradient {
  enabled: boolean;
  angle: number;
  color1: string;
  color2: string;
}

interface ThreeColorGradient {
  enabled: boolean;
  angle: number;
  color1: string;
  stop1: number;
  color2: string;
  stop2: number;
  color3: string;
  stop3: number;
}

type Props =
  | { type: "two"; value: TwoColorGradient; onChange: (v: TwoColorGradient) => void }
  | { type: "three"; value: ThreeColorGradient; onChange: (v: ThreeColorGradient) => void };

export const GradientEditor: React.FC<Props> = (props) => {
  const { value } = props;

  const preview =
    props.type === "two"
      ? `linear-gradient(${value.angle}deg, ${value.color1}, ${value.color2})`
      : `linear-gradient(${value.angle}deg, ${(value as ThreeColorGradient).color1} ${(value as ThreeColorGradient).stop1}%, ${(value as ThreeColorGradient).color2} ${(value as ThreeColorGradient).stop2}%, ${(value as ThreeColorGradient).color3} ${(value as ThreeColorGradient).stop3}%)`;

  return (
    <div style={{ marginBottom: 8, padding: 8, background: theme.bg, borderRadius: 6, border: `1px solid ${theme.border}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <label style={{ fontSize: 11, color: theme.textSecondary }}>
          <input
            type="checkbox"
            checked={value.enabled}
            onChange={(e) => {
              if (props.type === "two") {
                props.onChange({ ...props.value, enabled: e.target.checked });
              } else {
                props.onChange({ ...props.value, enabled: e.target.checked } as ThreeColorGradient);
              }
            }}
            style={{ marginRight: 4 }}
          />
          Gradient
        </label>
        <div style={{ flex: 1, height: 16, borderRadius: 4, background: value.enabled ? preview : theme.inputBorder }} />
      </div>
      {value.enabled && (
        <>
          <SliderControl label="angle" value={value.angle} min={0} max={360} onChange={(v) => {
            if (props.type === "two") props.onChange({ ...props.value, angle: v });
            else props.onChange({ ...props.value, angle: v } as ThreeColorGradient);
          }} />
          <ColorPicker label="color1" value={value.color1} onChange={(v) => {
            if (props.type === "two") props.onChange({ ...props.value, color1: v });
            else props.onChange({ ...props.value, color1: v } as ThreeColorGradient);
          }} />
          <ColorPicker label="color2" value={value.color2} onChange={(v) => {
            if (props.type === "two") props.onChange({ ...props.value, color2: v });
            else props.onChange({ ...props.value, color2: v } as ThreeColorGradient);
          }} />
          {props.type === "three" && (
            <>
              <ColorPicker label="color3" value={(value as ThreeColorGradient).color3} onChange={(v) => {
                props.onChange({ ...props.value, color3: v } as ThreeColorGradient);
              }} />
              <SliderControl label="stop1" value={(value as ThreeColorGradient).stop1} min={0} max={100} onChange={(v) => {
                props.onChange({ ...props.value, stop1: v } as ThreeColorGradient);
              }} />
              <SliderControl label="stop2" value={(value as ThreeColorGradient).stop2} min={0} max={100} onChange={(v) => {
                props.onChange({ ...props.value, stop2: v } as ThreeColorGradient);
              }} />
              <SliderControl label="stop3" value={(value as ThreeColorGradient).stop3} min={0} max={100} onChange={(v) => {
                props.onChange({ ...props.value, stop3: v } as ThreeColorGradient);
              }} />
            </>
          )}
        </>
      )}
    </div>
  );
};
