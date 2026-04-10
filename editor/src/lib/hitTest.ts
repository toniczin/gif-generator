import type { CardPromoProps } from "@composition/schema";
import type { ElementSelection } from "../store/editorStore";

const COMP_WIDTH = 500;
const COMP_HEIGHT = 400;

function isInTextBounds(
  click: { left: number; top: number },
  el: CardPromoProps["textElements"][number],
): boolean {
  const estWidthPx = el.text.length * el.fontSize * 0.6;
  const estHeightPx = el.fontSize * 1.3;
  const halfW = (estWidthPx / COMP_WIDTH) * 100 / 2;
  const halfH = (estHeightPx / COMP_HEIGHT) * 100 / 2;

  return (
    click.left >= el.left - halfW &&
    click.left <= el.left + halfW &&
    click.top >= el.top - halfH &&
    click.top <= el.top + halfH
  );
}

function isInBadgeBounds(
  click: { left: number; top: number },
  badge: CardPromoProps["badge"],
): boolean {
  const estW = (badge.text.length * badge.fontSize * 0.7 + badge.paddingX * 2) / COMP_WIDTH * 100;
  const estH = (badge.fontSize * 1.3 + badge.paddingY * 2) / COMP_HEIGHT * 100;

  return (
    click.left >= badge.left &&
    click.left <= badge.left + estW &&
    click.top >= badge.top &&
    click.top <= badge.top + estH
  );
}

function isInObjectBounds(
  click: { left: number; top: number },
  obj: CardPromoProps["decoration"]["objects"][number],
): boolean {
  const halfW = (obj.size / COMP_WIDTH) * 100 / 2;
  const halfH = (obj.size / COMP_HEIGHT) * 100 / 2;

  return (
    click.left >= obj.left - halfW &&
    click.left <= obj.left + halfW &&
    click.top >= obj.top - halfH &&
    click.top <= obj.top + halfH
  );
}

export function hitTest(
  click: { left: number; top: number },
  props: CardPromoProps,
): ElementSelection | null {
  if (props.badge.enabled && isInBadgeBounds(click, props.badge)) {
    return { type: "badge" };
  }

  for (let i = props.textElements.length - 1; i >= 0; i--) {
    if (isInTextBounds(click, props.textElements[i])) {
      return { type: "text", index: i };
    }
  }

  const objects = props.decoration.objects;
  for (let i = objects.length - 1; i >= 0; i--) {
    if (isInObjectBounds(click, objects[i])) {
      return { type: "object", index: i };
    }
  }

  return { type: "background" };
}
