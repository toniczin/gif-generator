import React from "react";
import { useEditorStore } from "../../store/editorStore";
import { theme } from "../../theme";
import { ColorPicker } from "../controls/ColorPicker";
import { SliderControl } from "../controls/SliderControl";
import { SelectControl } from "../controls/SelectControl";
import { TextInput } from "../controls/TextInput";

export const BadgePanel: React.FC = () => {
  const badge = useEditorStore((s) => s.props.badge);
  const updateProps = useEditorStore((s) => s.updateProps);

  return (
    <div>
      <label style={{ fontSize: 11, color: theme.textSecondary, display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
        <input type="checkbox" checked={badge.enabled} onChange={(e) => updateProps((d) => { d.badge.enabled = e.target.checked; })} />
        enabled
      </label>

      <TextInput label="text" value={badge.text} onChange={(v) => updateProps((d) => { d.badge.text = v; })} />

      <ColorPicker label="bgColor" value={badge.bgColor} onChange={(v) => updateProps((d) => { d.badge.bgColor = v; })} />
      <ColorPicker label="textColor" value={badge.textColor} onChange={(v) => updateProps((d) => { d.badge.textColor = v; })} />
      <SliderControl label="fontSize" value={badge.fontSize} min={8} max={40} onChange={(v) => updateProps((d) => { d.badge.fontSize = v; })} />
      <SliderControl label="top (%)" value={badge.top} min={-10} max={110} onChange={(v) => updateProps((d) => { d.badge.top = v; })} />
      <SliderControl label="left (%)" value={badge.left} min={-10} max={110} onChange={(v) => updateProps((d) => { d.badge.left = v; })} />
      <SliderControl label="paddingX" value={badge.paddingX} min={2} max={30} onChange={(v) => updateProps((d) => { d.badge.paddingX = v; })} />
      <SliderControl label="paddingY" value={badge.paddingY} min={1} max={15} onChange={(v) => updateProps((d) => { d.badge.paddingY = v; })} />
      <SliderControl label="borderRadius" value={badge.borderRadius} min={0} max={20} onChange={(v) => updateProps((d) => { d.badge.borderRadius = v; })} />
      <SelectControl
        label="animation"
        value={badge.animType}
        options={["none", "bounce", "pulse", "scaleIn", "popIn", "rotateIn", "shake"]}
        onChange={(v) => updateProps((d) => { d.badge.animType = v as typeof badge.animType; })}
      />
      <SliderControl label="delay (frames)" value={badge.animDelay} min={0} max={60} onChange={(v) => updateProps((d) => { d.badge.animDelay = v; })} />
    </div>
  );
};
