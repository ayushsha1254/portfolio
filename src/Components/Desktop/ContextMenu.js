import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS = [
  { label: "NOCTURNE_OS  0.9.1", type: "header" },
  { type: "sep" },
  { label: "initialize terminal", key: "terminal" },
  { label: "access void.archive", key: "void" },
  { type: "sep" },
  { label: "● all systems nominal", type: "status" },
];

export default function ContextMenu({ x, y, open, onClose, onAction }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const cx = typeof window !== "undefined" ? Math.min(x, window.innerWidth - 210) : x;
  const cy = typeof window !== "undefined" ? Math.min(y, window.innerHeight - 190) : y;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.1 } }}
          transition={{ type: "spring", stiffness: 550, damping: 36, mass: 0.6 }}
          style={{
            position: "fixed",
            left: cx,
            top: cy,
            width: "196px",
            background: "var(--bg-overlay)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "4px",
            padding: "4px 0",
            zIndex: "var(--z-overlay)",
            fontFamily: "var(--font-data)",
            fontSize: "11px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          {ITEMS.map((item, i) => {
            if (item.type === "sep") {
              return (
                <div key={i} style={{ height: "1px", background: "var(--border-hairline)", margin: "3px 0" }} />
              );
            }
            if (item.type === "header") {
              return (
                <div key={i} style={{
                  padding: "5px 12px 4px",
                  color: "var(--text-muted)",
                  letterSpacing: "0.07em",
                  fontSize: "9.5px",
                }}>
                  {item.label}
                </div>
              );
            }
            if (item.type === "status") {
              return (
                <div key={i} style={{
                  padding: "5px 12px 6px",
                  color: "rgba(62,255,139,0.45)",
                  fontSize: "9.5px",
                  letterSpacing: "0.04em",
                }}>
                  {item.label}
                </div>
              );
            }
            return (
              <div
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => { onAction?.(item.key); onClose(); }}
                style={{
                  padding: "6px 12px",
                  color: hovered === i ? "var(--text-primary)" : "var(--text-secondary)",
                  background: hovered === i ? "rgba(255,255,255,0.05)" : "transparent",
                  cursor: "default",
                  transition: "background 80ms, color 80ms",
                  letterSpacing: "0.03em",
                }}
              >
                {item.label}
              </div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
