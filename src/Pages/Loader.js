import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINES = [
  { tag: "[boot]", text: "initializing kernel..."  },
  { tag: "[boot]", text: "mounting archive.sys"    },
  { tag: "[boot]", text: "loading signal stack"    },
  { tag: "[boot]", text: "audio daemon — standby"  },
  { tag: "[boot]", text: "nocturne core — ready"   },
  { tag: "[boot]", text: "environment: production" },
];

const LINE_DELAYS = [250, 470, 690, 910, 1130, 1350];

export default function Loader({ onDone }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showBar,      setShowBar]      = useState(false);
  const [showReady,    setShowReady]    = useState(false);
  const [exiting,      setExiting]      = useState(false);

  useEffect(() => {
    const t = [];
    LINE_DELAYS.forEach((d, i) =>
      t.push(setTimeout(() => setVisibleLines(i + 1), d))
    );
    t.push(setTimeout(() => setShowBar(true),   1620));
    t.push(setTimeout(() => setShowReady(true), 2950));
    t.push(setTimeout(() => setExiting(true),   3700));
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={exiting ? { opacity: 0 } : { opacity: 1 }}
      transition={exiting
        ? { duration: 0.45, ease: "easeIn" }
        : { duration: 0.35, ease: "easeOut" }
      }
      onAnimationComplete={() => { if (exiting && onDone) onDone(); }}
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg-void)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "var(--z-boot)",
        overflow: "hidden",
      }}
    >
      {/* Red top bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "2px", background: "var(--accent-red)", opacity: 0.72,
      }} />

      {/* Scanlines */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)",
        pointerEvents: "none",
      }} />

      {/* Grain */}
      <svg aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.025, pointerEvents: "none" }}>
        <filter id="boot-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.70" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#boot-grain)" />
      </svg>

      {/* Ambient glow */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(122,92,255,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ width: "min(480px, 80vw)", fontFamily: "var(--font-data)" }}
      >
        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ fontSize: "17px", color: "var(--accent-red)", letterSpacing: "0.15em", marginBottom: "5px" }}>
            NOCTURNE_OS
          </div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.20)", letterSpacing: "0.08em", marginBottom: "20px" }}>
            v0.2.0 — boot sequence
          </div>
          <div style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />
        </div>

        {/* Boot lines */}
        <div style={{ marginBottom: "28px", display: "flex", flexDirection: "column", gap: "9px", minHeight: `${LINES.length * 21}px` }}>
          {LINES.map((line, i) =>
            i < visibleLines ? (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", lineHeight: 1 }}
              >
                <span style={{ color: "rgba(62,255,139,0.60)", flexShrink: 0, minWidth: "44px" }}>{line.tag}</span>
                <span style={{ color: "rgba(255,255,255,0.48)", flex: 1 }}>{line.text}</span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.12, duration: 0.15 }}
                  style={{ color: "rgba(62,255,139,0.50)", flexShrink: 0, fontSize: "11px" }}
                >
                  ✓
                </motion.span>
              </motion.div>
            ) : (
              <div key={i} style={{ height: "12px" }} />
            )
          )}
        </div>

        {/* Progress bar */}
        <AnimatePresence>
          {showBar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              style={{ marginBottom: "22px" }}
            >
              <div style={{ height: "2px", background: "rgba(255,255,255,0.06)", borderRadius: "1px", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.3, ease: "linear" }}
                  style={{ height: "100%", background: "var(--accent-green)", borderRadius: "1px" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SYSTEM READY */}
        <AnimatePresence>
          {showReady && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.55, 1] }}
              transition={{ duration: 0.5, times: [0, 0.25, 0.6, 1] }}
              style={{ fontSize: "12px", color: "rgba(62,255,139,0.82)", letterSpacing: "0.16em" }}
            >
              SYSTEM READY
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer */}
      <div style={{
        position: "absolute", bottom: "20px",
        fontFamily: "var(--font-data)", fontSize: "9px",
        color: "rgba(255,255,255,0.08)", letterSpacing: "0.10em",
      }}>
        nocturne · ayush sharma
      </div>
    </motion.div>
  );
}
