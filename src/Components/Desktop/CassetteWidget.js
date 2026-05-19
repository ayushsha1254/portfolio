import { useRef } from "react";
import { motion, useDragControls, useMotionValue } from "framer-motion";

export default function CassetteWidget({ playing, setPlayStatus }) {
  const dragControls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const isDragging = useRef(false);

  const handleClick = () => {
    if (!isDragging.current) setPlayStatus?.((p) => !p);
  };

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onDragStart={() => { isDragging.current = true; }}
      onDragEnd={() => { setTimeout(() => { isDragging.current = false; }, 80); }}
      onClick={handleClick}
      animate={{
        filter: playing
          ? "drop-shadow(0 0 18px rgba(255,59,48,0.22)) drop-shadow(0 0 6px rgba(255,59,48,0.12))"
          : "drop-shadow(0 0 0px rgba(255,59,48,0))",
      }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      style={{
        x,
        y,
        position: "absolute",
        left: "50%",
        top: "46%",
        transform: "translate(-50%, -50%)",
        zIndex: 2,
        userSelect: "none",
        cursor: "pointer",
      }}
      onPointerDown={(e) => dragControls.start(e)}
      title={playing ? "click to pause" : "click to play"}
    >
      <svg
        width="168"
        height="102"
        viewBox="0 0 112 68"
        fill="none"
        style={{ display: "block", overflow: "visible" }}
      >
        {/* Body */}
        <rect x="1" y="4" width="110" height="60" rx="6"
          fill="var(--bg-elevated)"
          stroke="var(--border-subtle)"
          strokeWidth="1.2"
        />

        {/* Tape window */}
        <rect x="10" y="12" width="92" height="30" rx="3"
          fill="#050505"
          stroke="var(--border-hairline)"
          strokeWidth="0.8"
        />

        {/* Left reel housing */}
        <circle cx="35" cy="27" r="11"
          fill="#080808"
          stroke="var(--border-hairline)"
          strokeWidth="0.8"
        />
        {/* Left reel spin ring */}
        <motion.circle
          cx="35" cy="27" r="9"
          fill="none"
          stroke="var(--border-subtle)"
          strokeWidth="1.2"
          strokeDasharray="4.5 3"
          animate={playing ? { rotate: 360 } : { rotate: 0 }}
          transition={
            playing
              ? { duration: 2.4, repeat: Infinity, ease: "linear" }
              : { duration: 0.6, ease: "easeOut" }
          }
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
        {/* Left reel hub */}
        <circle cx="35" cy="27" r="4"
          fill="var(--bg-surface)"
          stroke="var(--border-default)"
          strokeWidth="0.8"
        />

        {/* Right reel housing */}
        <circle cx="77" cy="27" r="11"
          fill="#080808"
          stroke="var(--border-hairline)"
          strokeWidth="0.8"
        />
        {/* Right reel spin ring */}
        <motion.circle
          cx="77" cy="27" r="9"
          fill="none"
          stroke="var(--border-subtle)"
          strokeWidth="1.2"
          strokeDasharray="4.5 3"
          animate={playing ? { rotate: -360 } : { rotate: 0 }}
          transition={
            playing
              ? { duration: 3.1, repeat: Infinity, ease: "linear" }
              : { duration: 0.6, ease: "easeOut" }
          }
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
        {/* Right reel hub */}
        <circle cx="77" cy="27" r="4"
          fill="var(--bg-surface)"
          stroke="var(--border-default)"
          strokeWidth="0.8"
        />

        {/* Tape path between reels */}
        <path
          d="M 46 27 Q 56 20 66 27"
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="1.2"
        />

        {/* Top guide hole */}
        <rect x="49" y="4" width="14" height="7" rx="1.5"
          fill="#020202"
          stroke="var(--border-hairline)"
          strokeWidth="0.5"
        />

        {/* Label strip */}
        <rect x="7" y="45" width="98" height="13" rx="2"
          fill="var(--bg-surface)"
          stroke="var(--border-hairline)"
          strokeWidth="0.7"
        />
        <text
          x="56" y="53.5"
          fontFamily="var(--font-data)"
          fontSize="5.5"
          fill="rgba(255,255,255,0.20)"
          textAnchor="middle"
          letterSpacing="2"
        >
          NOCTURNE STUDIO
        </text>

        {/* Playing indicator dot */}
        {playing && (
          <circle cx="102" cy="12" r="3"
            fill="var(--accent-red)"
            opacity="0.80"
          />
        )}

        {/* Idle indicator */}
        {!playing && (
          <circle cx="102" cy="12" r="3"
            fill="rgba(255,255,255,0.10)"
          />
        )}
      </svg>
    </motion.div>
  );
}
