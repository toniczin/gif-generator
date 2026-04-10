import React from "react";
import { useEditorStore } from "../../store/editorStore";
import { SliderControl } from "../controls/SliderControl";
import { SelectControl } from "../controls/SelectControl";
import availableImages from "@composition/images.json";

const BLEND_MODES = [
  "normal", "multiply", "screen", "overlay", "darken", "lighten",
  "color-dodge", "color-burn", "hard-light", "soft-light",
  "difference", "exclusion", "hue", "saturation", "color", "luminosity",
];

interface Props {
  index: number;
}

export const ObjectPanel: React.FC<Props> = ({ index }) => {
  const obj = useEditorStore((s) => s.props.decoration.objects[index]);
  const updateProps = useEditorStore((s) => s.updateProps);

  if (!obj) return null;

  return (
    <div>
      <SelectControl
        label="file"
        value={obj.file}
        options={availableImages}
        onChange={(v) => updateProps((d) => { d.decoration.objects[index].file = v; })}
      />

      <SliderControl label="top (%)" value={obj.top} min={-50} max={150} onChange={(v) => updateProps((d) => { d.decoration.objects[index].top = v; })} />
      <SliderControl label="left (%)" value={obj.left} min={-50} max={150} onChange={(v) => updateProps((d) => { d.decoration.objects[index].left = v; })} />
      <SliderControl label="size (px)" value={obj.size} min={10} max={500} onChange={(v) => updateProps((d) => { d.decoration.objects[index].size = v; })} />
      <SliderControl label="opacity" value={obj.opacity} min={0} max={1} step={0.05} onChange={(v) => updateProps((d) => { d.decoration.objects[index].opacity = v; })} />
      <SliderControl label="rotation" value={obj.rotation} min={-180} max={180} onChange={(v) => updateProps((d) => { d.decoration.objects[index].rotation = v; })} />
      <SliderControl label="floatSpeed" value={obj.floatSpeed} min={0} max={10} step={0.1} onChange={(v) => updateProps((d) => { d.decoration.objects[index].floatSpeed = v; })} />
      <SliderControl label="floatRange" value={obj.floatRange} min={0} max={50} onChange={(v) => updateProps((d) => { d.decoration.objects[index].floatRange = v; })} />
      <SliderControl label="delay (frames)" value={obj.delay} min={0} max={60} onChange={(v) => updateProps((d) => { d.decoration.objects[index].delay = v; })} />
      <SliderControl label="zIndex" value={obj.zIndex} min={0} max={10} onChange={(v) => updateProps((d) => { d.decoration.objects[index].zIndex = v; })} />
      <SelectControl label="blendMode" value={obj.blendMode} options={BLEND_MODES} onChange={(v) => updateProps((d) => { d.decoration.objects[index].blendMode = v as typeof obj.blendMode; })} />
    </div>
  );
};
