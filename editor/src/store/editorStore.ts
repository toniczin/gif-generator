import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { CardPromoProps } from "@composition/schema";

export type ElementSelection =
  | { type: "text"; index: number }
  | { type: "badge" }
  | { type: "object"; index: number }
  | { type: "background" };

interface EditorState {
  props: CardPromoProps;
  selectedElement: ElementSelection | null;
  undoStack: CardPromoProps[];
  redoStack: CardPromoProps[];

  setProps: (props: CardPromoProps) => void;
  updateProps: (updater: (draft: CardPromoProps) => void) => void;
  selectElement: (sel: ElementSelection | null) => void;
  addTextElement: () => void;
  removeTextElement: (index: number) => void;
  addObject: () => void;
  removeObject: (index: number) => void;
  undo: () => void;
  redo: () => void;
}

const DEFAULT_TEXT_ELEMENT = {
  text: "텍스트",
  top: 50,
  left: 50,
  fontSize: 40,
  fontWeight: 900,
  rotation: 0,
  letterSpacing: 3,
  color: "#ffffff",
  gradient: { enabled: false, angle: 180, color1: "#ffffff", color2: "#c8a0e8" },
  effect: {
    strokeColor: "#4a2070",
    strokeWidth: 4,
    shadowColor: "#1a0a30",
    shadowOffset: 5,
    glowColor: "rgba(160, 120, 255, 0.4)",
    glowSize: 20,
  },
  bg: {
    enabled: false,
    color: "rgba(74, 32, 112, 0.7)",
    paddingX: 12,
    paddingY: 4,
    borderRadius: 6,
  },
  animType: "fadeUp" as const,
  animDelay: 0,
  endFrame: -1,
};

const DEFAULT_OBJECT = {
  file: "Object.png",
  top: 50,
  left: 50,
  size: 80,
  floatSpeed: 3,
  floatRange: 10,
  opacity: 1,
  delay: 0,
  endFrame: -1,
  rotation: 0,
  zIndex: 1,
  blendMode: "normal" as const,
};

const INITIAL_PROPS: CardPromoProps = {
  background: {
    imageBlendMode: "normal",
    color: "#0d0a1a",
    gradient: {
      enabled: true,
      angle: 160,
      color1: "#1a1040",
      stop1: 0,
      color2: "#0d0a1a",
      stop2: 40,
      color3: "#060412",
      stop3: 100,
    },
    image: "",
  },
  fontFamily: "MangoByeolbyeol",
  textElements: [
    { ...DEFAULT_TEXT_ELEMENT, text: "강남 선릉역", top: 32, fontSize: 28, color: "#c8b0e8" },
    {
      ...DEFAULT_TEXT_ELEMENT,
      text: "힐링뷰",
      top: 48,
      fontSize: 70,
      color: "#c8a0e8",
      gradient: { enabled: true, angle: 180, color1: "#ff93d4", color2: "#a70064" },
      effect: { ...DEFAULT_TEXT_ELEMENT.effect, strokeWidth: 5, shadowOffset: 6, glowSize: 25 },
      animType: "scaleIn",
      animDelay: 6,
    },
    {
      ...DEFAULT_TEXT_ELEMENT,
      text: "테라피",
      top: 62,
      fontSize: 70,
      color: "#c8a0e8",
      gradient: { enabled: true, angle: 180, color1: "#ff93d4", color2: "#a70064" },
      effect: { ...DEFAULT_TEXT_ELEMENT.effect, strokeWidth: 5, shadowOffset: 6, glowSize: 25 },
      animType: "scaleIn",
      animDelay: 8,
    },
    {
      ...DEFAULT_TEXT_ELEMENT,
      text: "전원 한국인 관리사",
      top: 78,
      fontSize: 20,
      fontWeight: 400,
      letterSpacing: 5,
      color: "#b8a8d0",
      effect: { ...DEFAULT_TEXT_ELEMENT.effect, strokeWidth: 0, shadowOffset: 0, glowSize: 0 },
      animDelay: 16,
    },
  ],
  badge: {
    enabled: true,
    text: "HOT",
    bgColor: "#ff4444",
    textColor: "#ffffff",
    fontSize: 16,
    top: 5,
    left: 8,
    paddingX: 14,
    paddingY: 6,
    borderRadius: 6,
    animType: "bounce",
    animDelay: 20,
    endFrame: -1,
  },
  decoration: {
    objects: [
      { ...DEFAULT_OBJECT, top: 2, left: 78, size: 110 },
      { ...DEFAULT_OBJECT, file: "Object1.png", top: 55, left: 80, size: 95, opacity: 0.8, delay: 5 },
      { ...DEFAULT_OBJECT, top: 65, left: 3, size: 70, floatSpeed: 4, floatRange: 12, opacity: 0.7, delay: 10 },
      { ...DEFAULT_OBJECT, top: 3, left: 5, size: 60, opacity: 0.9, delay: 3 },
    ],
    sparkleCount: 10,
    sparkleColor: "#ffffff",
  },
  durationInFrames: 90,
};

export const useEditorStore = create<EditorState>()(
  immer((set) => ({
    props: INITIAL_PROPS,
    selectedElement: null,
    undoStack: [],
    redoStack: [],

    setProps: (props) =>
      set((state) => {
        state.props = props;
      }),

    updateProps: (updater) =>
      set((state) => {
        state.undoStack.push(JSON.parse(JSON.stringify(state.props)));
        if (state.undoStack.length > 50) state.undoStack.shift();
        state.redoStack = [];
        updater(state.props);
      }),

    selectElement: (sel) =>
      set((state) => {
        state.selectedElement = sel;
      }),

    addTextElement: () =>
      set((state) => {
        state.undoStack.push(JSON.parse(JSON.stringify(state.props)));
        state.redoStack = [];
        state.props.textElements.push({ ...DEFAULT_TEXT_ELEMENT });
        state.selectedElement = {
          type: "text",
          index: state.props.textElements.length - 1,
        };
      }),

    removeTextElement: (index) =>
      set((state) => {
        state.undoStack.push(JSON.parse(JSON.stringify(state.props)));
        state.redoStack = [];
        state.props.textElements.splice(index, 1);
        state.selectedElement = null;
      }),

    addObject: () =>
      set((state) => {
        state.undoStack.push(JSON.parse(JSON.stringify(state.props)));
        state.redoStack = [];
        state.props.decoration.objects.push({ ...DEFAULT_OBJECT });
        state.selectedElement = {
          type: "object",
          index: state.props.decoration.objects.length - 1,
        };
      }),

    removeObject: (index) =>
      set((state) => {
        state.undoStack.push(JSON.parse(JSON.stringify(state.props)));
        state.redoStack = [];
        state.props.decoration.objects.splice(index, 1);
        state.selectedElement = null;
      }),

    undo: () =>
      set((state) => {
        const prev = state.undoStack.pop();
        if (prev) {
          state.redoStack.push(JSON.parse(JSON.stringify(state.props)));
          state.props = prev;
        }
      }),

    redo: () =>
      set((state) => {
        const next = state.redoStack.pop();
        if (next) {
          state.undoStack.push(JSON.parse(JSON.stringify(state.props)));
          state.props = next;
        }
      }),
  }))
);
