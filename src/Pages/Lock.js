import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const DAYS   = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

const SKIP_KEYS = new Set([
  "Meta","Control","Alt","Shift","CapsLock","Tab",
  "F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12",
]);

export default function Lock({ lock, setLock }) {
  const [hhmm, setHhmm] = useState("");
  const [ss,   setSs]   = useState("");
  const [date, setDate] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const unlockingRef = useRef(false);

  // ── Clock ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      const n = new Date();
      const h = n.getHours().toString().padStart(2,"0");
      const m = n.getMinutes().toString().padStart(2,"0");
      const s = n.getSeconds().toString().padStart(2,"0");
      setHhmm(`${h}:${m}`);
      setSs(s);
      setDate(`${DAYS[n.getDay()]} · ${n.getDate()} ${MONTHS[n.getMonth()]} ${n.getFullYear()}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ── Unlock ─────────────────────────────────────────────────────────────────
  const unlock = () => {
    if (unlockingRef.current) return;
    unlockingRef.current = true;
    setUnlocking(true);
    localStorage.setItem("lastlogin", new Date().getTime());
  };

  useEffect(() => {
    const handler = (e) => {
      if (SKIP_KEYS.has(e.key)) return;
      unlock();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={unlocking ? { y: "-100vh", opacity: 0 } : { opacity: 1, y: 0 }}
      transition={unlocking
        ? { duration: 0.52, ease: [0.4, 0, 1, 1] }
        : { duration: 0.5, ease: "easeOut" }
      }
      onAnimationComplete={() => { if (unlocking) setLock(false); }}
      onClick={unlock}
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg-void)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "default",
        userSelect: "none",
        overflow: "hidden",
      }}
    >
      {/* Atmospheric radial glow */}
      <div aria-hidden="true" style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse 75% 55% at 50% 42%, rgba(122,92,255,0.08) 0%, transparent 68%)",
        pointerEvents: "none",
      }} />

      {/* Red corner accent — bottom left */}
      <div aria-hidden="true" style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse 55% 40% at -4% 105%, rgba(255,59,48,0.10) 0%, transparent 55%)",
        pointerEvents: "none",
      }} />

      {/* Grain */}
      <svg aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.028, pointerEvents: "none" }}>
        <filter id="lock-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#lock-grain)" />
      </svg>

      {/* Scanlines */}
      <div aria-hidden="true" style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
        pointerEvents: "none",
      }} />

      {/* Content block */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        marginTop: "-48px",
      }}>

        {/* System label */}
        <div style={{
          fontFamily: "var(--font-data)",
          fontSize: "9px",
          color: "var(--accent-red)",
          letterSpacing: "0.22em",
          marginBottom: "52px",
          opacity: 0.72,
        }}>
          NOCTURNE_OS
        </div>

        {/* HH:MM */}
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(60px, 9.5vw, 92px)",
          fontWeight: 400,
          color: "rgba(255,255,255,0.92)",
          letterSpacing: "-0.025em",
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}>
          {hhmm}
        </div>

        {/* SS */}
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(18px, 2.8vw, 30px)",
          fontWeight: 400,
          color: "rgba(255,255,255,0.22)",
          letterSpacing: "0.04em",
          lineHeight: 1,
          marginTop: "8px",
          fontVariantNumeric: "tabular-nums",
        }}>
          {ss}
        </div>

        {/* Date */}
        <div style={{
          fontFamily: "var(--font-data)",
          fontSize: "12px",
          color: "rgba(255,255,255,0.26)",
          letterSpacing: "0.10em",
          marginTop: "22px",
        }}>
          {date}
        </div>

        {/* Divider */}
        <div style={{
          width: "128px",
          height: "1px",
          background: "rgba(255,255,255,0.07)",
          margin: "30px auto",
        }} />

        {/* Press any key */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          fontFamily: "var(--font-data)",
          fontSize: "10px",
          color: "rgba(255,255,255,0.18)",
          letterSpacing: "0.16em",
        }}>
          PRESS ANY KEY
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
            style={{ color: "rgba(255,255,255,0.38)" }}
          >
            ·
          </motion.span>
        </div>
      </div>

      {/* Version tag — bottom */}
      <div style={{
        position: "absolute",
        bottom: "20px",
        fontFamily: "var(--font-data)",
        fontSize: "9px",
        color: "rgba(255,255,255,0.10)",
        letterSpacing: "0.10em",
      }}>
        v0.2.0 · nocturne
      </div>
    </motion.div>
  );
}
