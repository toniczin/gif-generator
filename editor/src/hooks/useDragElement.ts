import { useCallback, useRef } from "react";
import { useEditorStore, type ElementSelection } from "../store/editorStore";

interface DragState {
  selection: ElementSelection;
  startLeft: number;
  startTop: number;
  elemLeft: number;
  elemTop: number;
}

export function useDragElement() {
  const dragRef = useRef<DragState | null>(null);
  const updateProps = useEditorStore((s) => s.updateProps);
  const props = useEditorStore((s) => s.props);

  const startDrag = useCallback(
    (
      selection: ElementSelection,
      clickPercent: { left: number; top: number },
    ) => {
      let elemLeft = 0;
      let elemTop = 0;

      if (selection.type === "text") {
        const el = props.textElements[selection.index];
        elemLeft = el.left;
        elemTop = el.top;
      } else if (selection.type === "badge") {
        elemLeft = props.badge.left;
        elemTop = props.badge.top;
      } else if (selection.type === "object") {
        const obj = props.decoration.objects[selection.index];
        elemLeft = obj.left;
        elemTop = obj.top;
      } else {
        return;
      }

      dragRef.current = {
        selection,
        startLeft: clickPercent.left,
        startTop: clickPercent.top,
        elemLeft,
        elemTop,
      };
    },
    [props],
  );

  const moveDrag = useCallback(
    (currentPercent: { left: number; top: number }) => {
      const drag = dragRef.current;
      if (!drag) return;

      const deltaLeft = currentPercent.left - drag.startLeft;
      const deltaTop = currentPercent.top - drag.startTop;
      const newLeft = Math.round((drag.elemLeft + deltaLeft) * 10) / 10;
      const newTop = Math.round((drag.elemTop + deltaTop) * 10) / 10;

      updateProps((draft) => {
        if (drag.selection.type === "text") {
          draft.textElements[drag.selection.index].left = newLeft;
          draft.textElements[drag.selection.index].top = newTop;
        } else if (drag.selection.type === "badge") {
          draft.badge.left = newLeft;
          draft.badge.top = newTop;
        } else if (drag.selection.type === "object") {
          draft.decoration.objects[drag.selection.index].left = newLeft;
          draft.decoration.objects[drag.selection.index].top = newTop;
        }
      });
    },
    [updateProps],
  );

  const endDrag = useCallback(() => {
    dragRef.current = null;
  }, []);

  const isDragging = () => dragRef.current !== null;

  return { startDrag, moveDrag, endDrag, isDragging };
}
