import { useState, useEffect } from "react";
import { motion, useDragControls, useMotionValue } from "framer-motion";
import { useResize, RESIZE_HANDLES } from "../../Utility/useResize";

const STORAGE_KEY = "nocturne_notes";
const DEFAULT_TEXT = "fix signal latency\ncompile arena build\ncheck void.archive";

const INIT_W = 220;
const INIT_H = 220;

export default function NoteWidget() {
  const dragControls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const { size, onHandleDown } = useResize(INIT_W, INIT_H, x, y);
  const [text, setText] = useState(
    () => localStorage.getItem(STORAGE_KEY) ?? DEFAULT_TEXT
  );
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, text);
  }, [text]);

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      style={{
        x,
        y,
        position: "fixed",
        left: "216px",
        top: "54px",
        width: size.w,
        zIndex: "var(--z-widget)",
        userSelect: "none",
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
      }}
    >
      {/* Chrome */}
      <div
        style={{
          height: size.h,
          display: "flex",
          flexDirection: "column",
          background: "var(--bg-surface)",
          border: `1px solid ${focused ? "var(--border-default)" : "var(--border-subtle)"}`,
          borderRadius: "4px",
          overflow: "hidden",
          transition: "border-color 150ms",
        }}
      >
        {/* Drag handle — header */}
        <div
          onPointerDown={(e) => dragControls.start(e)}
          style={{
            padding: "6px 10px 5px",
            background: "var(--bg-elevated)",
            borderBottom: "1px solid var(--border-hairline)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "grab",
            flexShrink: 0,
          }}
        >
          <span style={{
            fontFamily: "var(--font-data)",
            fontSize: "9px",
            color: "rgba(255,255,255,0.22)",
            letterSpacing: "0.10em",
          }}>
            NOTES //
          </span>
          <span style={{
            fontFamily: "var(--font-data)",
            fontSize: "8px",
            color: "rgba(255,255,255,0.12)",
            letterSpacing: "0.06em",
          }}>
            sys.local
          </span>
        </div>

        {/* Editable body — fills remaining height */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onPointerDown={(e) => e.stopPropagation()}
          spellCheck={false}
          style={{
            flex: 1,
            minHeight: 0,
            display: "block",
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            resize: "none",
            fontFamily: "var(--font-data)",
            fontSize: "9.5px",
            color: focused ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.55)",
            lineHeight: "1.8",
            letterSpacing: "0.03em",
            padding: "8px 10px 9px",
            caretColor: "var(--accent-green)",
            boxSizing: "border-box",
            transition: "color 150ms",
          }}
        />
      </div>

      {/* Resize handles */}
      {RESIZE_HANDLES.map((h, i) => (
        <div
          key={i}
          onPointerDown={(e) => onHandleDown(e, h.dirs)}
          style={{ position: "absolute", zIndex: 10, ...h.css }}
        />
      ))}
    </motion.div>
  );
}
