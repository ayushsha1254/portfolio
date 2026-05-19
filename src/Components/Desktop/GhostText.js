import { motion } from "framer-motion";

export default function GhostText({ ghostX, ghostY }) {
  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "absolute",
        bottom: "64px",
        left: "48px",
        pointerEvents: "none",
        fontFamily: "var(--font-data)",
        fontSize: "11px",
        lineHeight: "1.9",
        color: "var(--text-secondary)",
        opacity: 0.09,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
        zIndex: 2,
        x: ghostX,
        y: ghostY,
      }}
    >
      <div>nocturne@system ∼ $</div>
      <div>[  OK  ] studio.jack · 48kHz · buf 64</div>
      <div>[INFO  ] archive.worker · 6 projects indexed</div>
      <div>[INFO  ] finmo · srm · nocturne-os · ready</div>
    </motion.div>
  );
}
