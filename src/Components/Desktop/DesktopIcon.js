import { useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

export default function DesktopIcon({ icon, label, active, onDoubleClick, left, top }) {
  const [hovered, setHovered] = useState(false);
  const isDragging = useRef(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  return (
    <motion.div
      drag
      dragMomentum={false}
      style={{
        x,
        y,
        position: "absolute",
        left,
        top,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "5px",
        width: "68px",
        cursor: "default",
        userSelect: "none",
        zIndex: 2,
      }}
      onDragStart={() => { isDragging.current = true; }}
      onDragEnd={() => { setTimeout(() => { isDragging.current = false; }, 80); }}
      onDoubleClick={() => { if (!isDragging.current) onDoubleClick?.(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{ y: hovered ? -2 : 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {/* Icon glyph */}
      <div
        style={{
          width: "44px",
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: hovered ? "var(--text-primary)" : "rgba(255,255,255,0.58)",
          filter: hovered
            ? "drop-shadow(0 0 14px rgba(255,255,255,0.22))"
            : active
            ? "drop-shadow(0 0 8px rgba(255,59,48,0.35))"
            : "none",
          transition: "color 180ms, filter 180ms",
        }}
      >
        {icon}
      </div>

      {/* Label */}
      <span
        style={{
          fontFamily: "var(--font-data)",
          fontSize: "9.5px",
          color: hovered ? "var(--text-primary)" : "rgba(255,255,255,0.45)",
          letterSpacing: "0.05em",
          textAlign: "center",
          lineHeight: "1.25",
          transition: "color 180ms",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>

      {/* Open indicator */}
      {active && (
        <div
          style={{
            width: "3px",
            height: "3px",
            borderRadius: "50%",
            background: "var(--accent-red)",
            marginTop: "1px",
          }}
        />
      )}
    </motion.div>
  );
}
