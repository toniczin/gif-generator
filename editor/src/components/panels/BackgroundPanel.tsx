import React from "react";
import { useEditorStore } from "../../store/editorStore";
import { theme } from "../../theme";
import { ColorPicker } from "../controls/ColorPicker";
import { SliderControl } from "../controls/SliderControl";
import { GradientEditor } from "../controls/GradientEditor";
import { SelectControl } from "../controls/SelectControl";
import availableFonts from "@composition/fonts.json";
import availableImages from "@composition/images.json";

const BLEND_MODES = [
  "normal", "multiply", "screen", "overlay", "darken", "lighten",
  "color-dodge", "color-burn", "hard-light", "soft-light",
  "difference", "exclusion", "hue", "saturation", "color", "luminosity",
];

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

export const BackgroundPanel: React.FC = () => {
  const bg = useEditorStore((s) => s.props.background);
  const decoration = useEditorStore((s) => s.props.decoration);
  const fontFamily = useEditorStore((s) => s.props.fontFamily);
  const updateProps = useEditorStore((s) => s.updateProps);

  return (
    <div>
      <ColorPicker label="color" value={bg.color} onChange={(v) => updateProps((d) => { d.background.color = v; })} />

      <GradientEditor
        type="three"
        value={bg.gradient}
        onChange={(v) => updateProps((d) => { d.background.gradient = v; })}
      />

      <SelectControl
        label="image"
        value={bg.image}
        options={["", ...availableImages]}
        onChange={(v) => updateProps((d) => { d.background.image = v; })}
      />

      <SelectControl label="image blendMode" value={bg.imageBlendMode} options={BLEND_MODES} onChange={(v) => updateProps((d) => { d.background.imageBlendMode = v as typeof bg.imageBlendMode; })} />

      <div style={sectionStyle}>decoration</div>
      <SliderControl label="sparkleCount" value={decoration.sparkleCount} min={0} max={30} onChange={(v) => updateProps((d) => { d.decoration.sparkleCount = v; })} />
      <ColorPicker label="sparkleColor" value={decoration.sparkleColor} onChange={(v) => updateProps((d) => { d.decoration.sparkleColor = v; })} />

      <div style={sectionStyle}>font</div>
      <SelectControl
        label="fontFamily"
        value={fontFamily}
        options={availableFonts}
        onChange={(v) => updateProps((d) => { d.fontFamily = v; })}
      />
      <div style={{ fontSize: 10, color: theme.textTertiary, marginTop: 4, lineHeight: 1.4 }}>
        폰트/이미지 추가: public/fonts/ 또는<br />
        public/backgrounds/ 에 파일 넣고<br />
        에디터 재시작
      </div>
    </div>
  );
};
