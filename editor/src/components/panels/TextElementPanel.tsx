import React from "react";
import { useEditorStore } from "../../store/editorStore";
import { theme } from "../../theme";
import { ColorPicker } from "../controls/ColorPicker";
import { SliderControl } from "../controls/SliderControl";
import { SelectControl } from "../controls/SelectControl";
import { GradientEditor } from "../controls/GradientEditor";
import { TextInput } from "../controls/TextInput";

interface Props {
  index: number;
}

const sectionStyle: React.CSSProperties = {
  fontSize: 11,
  color: theme.textTertiary,
  margin: "12px 0 4px",
  borderTop: `1px solid ${theme.borderSubtle}`,
  paddingTop: 8,
  textTransform: "uppercase",
  letterSpacing: 0.5,
  fontWeight: 600,
};

export const TextElementPanel: React.FC<Props> = ({ index }) => {
  const el = useEditorStore((s) => s.props.textElements[index]);
  const updateProps = useEditorStore((s) => s.updateProps);

  if (!el) return null;

  const update = (field: string, value: unknown) => {
    updateProps((d) => {
      (d.textElements[index] as Record<string, unknown>)[field] = value;
    });
  };

  return (
    <div>
      <TextInput label="text" value={el.text} onChange={(v) => update("text", v)} />

      <SliderControl label="top (%)" value={el.top} min={-20} max={120} onChange={(v) => update("top", v)} />
      <SliderControl label="left (%)" value={el.left} min={-20} max={120} onChange={(v) => update("left", v)} />
      <SliderControl label="fontSize" value={el.fontSize} min={10} max={200} onChange={(v) => update("fontSize", v)} />
      <SliderControl label="fontWeight" value={el.fontWeight} min={100} max={900} step={100} onChange={(v) => update("fontWeight", v)} />
      <SliderControl label="rotation" value={el.rotation} min={-180} max={180} onChange={(v) => update("rotation", v)} />
      <SliderControl label="letterSpacing" value={el.letterSpacing} min={-10} max={20} onChange={(v) => update("letterSpacing", v)} />

      <ColorPicker label="color" value={el.color} onChange={(v) => update("color", v)} />

      <GradientEditor
        type="two"
        value={el.gradient}
        onChange={(v) => update("gradient", v)}
      />

      <div style={sectionStyle}>effect</div>
      <ColorPicker label="strokeColor" value={el.effect.strokeColor} onChange={(v) => updateProps((d) => { d.textElements[index].effect.strokeColor = v; })} />
      <SliderControl label="strokeWidth" value={el.effect.strokeWidth} min={0} max={15} onChange={(v) => updateProps((d) => { d.textElements[index].effect.strokeWidth = v; })} />
      <ColorPicker label="shadowColor" value={el.effect.shadowColor} onChange={(v) => updateProps((d) => { d.textElements[index].effect.shadowColor = v; })} />
      <SliderControl label="shadowOffset" value={el.effect.shadowOffset} min={0} max={20} onChange={(v) => updateProps((d) => { d.textElements[index].effect.shadowOffset = v; })} />
      <ColorPicker label="glowColor" value={el.effect.glowColor} onChange={(v) => updateProps((d) => { d.textElements[index].effect.glowColor = v; })} />
      <SliderControl label="glowSize" value={el.effect.glowSize} min={0} max={100} onChange={(v) => updateProps((d) => { d.textElements[index].effect.glowSize = v; })} />

      <div style={sectionStyle}>bg bar</div>
      <label style={{ fontSize: 11, color: theme.textSecondary, display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
        <input type="checkbox" checked={el.bg.enabled} onChange={(e) => updateProps((d) => { d.textElements[index].bg.enabled = e.target.checked; })} />
        enabled
      </label>
      {el.bg.enabled && (
        <>
          <ColorPicker label="bgColor" value={el.bg.color} onChange={(v) => updateProps((d) => { d.textElements[index].bg.color = v; })} />
          <SliderControl label="paddingX" value={el.bg.paddingX} min={0} max={40} onChange={(v) => updateProps((d) => { d.textElements[index].bg.paddingX = v; })} />
          <SliderControl label="paddingY" value={el.bg.paddingY} min={0} max={20} onChange={(v) => updateProps((d) => { d.textElements[index].bg.paddingY = v; })} />
          <SliderControl label="borderRadius" value={el.bg.borderRadius} min={0} max={30} onChange={(v) => updateProps((d) => { d.textElements[index].bg.borderRadius = v; })} />
        </>
      )}

      <div style={sectionStyle}>animation</div>
      <SelectControl
        label="type"
        value={el.animType}
        options={[
          "none",
          "fadeIn",
          "fadeUp",
          "fadeDown",
          "fadeLeft",
          "fadeRight",
          "scaleIn",
          "scaleOut",
          "popIn",
          "rotateIn",
          "blurIn",
        ]}
        onChange={(v) => update("animType", v)}
      />
      <SliderControl label="delay (frames)" value={el.animDelay} min={0} max={60} onChange={(v) => update("animDelay", v)} />
    </div>
  );
};
