import { useState, useEffect, useRef } from "react";

const POOL = [
  { text: "[daemon] archive.sys — ok",      warn: false },
  { text: "[net]    signal — 48ms",         warn: false },
  { text: "[audio]  jack @ 48kHz",          warn: false },
  { text: "[sys]    kernel 0.9.1",          warn: false },
  { text: "[warn]   void: integrity ?",     warn: true  },
  { text: "[net]    gap 00:04:12",          warn: false },
  { text: "[daemon] studio.jack loaded",    warn: false },
  { text: "[sys]    env: dark / prod",      warn: false },
  { text: "[warn]   signal_lost — updated", warn: true  },
  { text: "[audio]  48000 Hz / buf 64",     warn: false },
  { text: "[daemon] arena — pending",       warn: false },
  { text: "[sys]    memory nominal",        warn: false },
  { text: "[warn]   0x0003 mismatch",       warn: true  },
  { text: "[net]    uplink — 12ms",         warn: false },
  { text: "[daemon] 4821 entries",          warn: false },
  { text: "[net]    blackbox// silent",     warn: true  },
  { text: "[audio]  buffer: 64 frames",     warn: false },
  { text: "[sys]    cinematic mode",        warn: false },
  { text: "[daemon] archive — idle",        warn: false },
  { text: "[net]    ping 0x00 timeout",     warn: true  },
];

const MAX = 6;

export default function SysLog() {
  const [lines, setLines] = useState(() =>
    POOL.slice(0, 3).map((e, i) => ({ ...e, id: i }))
  );
  const idxRef = useRef(3);
  const timerRef = useRef(null);

  useEffect(() => {
    const tick = () => {
      setLines((prev) => {
        const e = POOL[idxRef.current % POOL.length];
        idxRef.current++;
        return [...prev, { ...e, id: Date.now() }].slice(-MAX);
      });
      timerRef.current = setTimeout(tick, 3000 + Math.random() * 5000);
    };
    timerRef.current = setTimeout(tick, 2500 + Math.random() * 2500);
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        left: "28px",
        top: "272px",
        width: "180px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "4px",
        overflow: "hidden",
        zIndex: "var(--z-dock)",
        pointerEvents: "none",
        userSelect: "none",
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          padding: "6px 10px 5px",
          fontFamily: "var(--font-data)",
          fontSize: "9px",
          color: "rgba(255,255,255,0.22)",
          letterSpacing: "0.12em",
          borderBottom: "1px solid var(--border-hairline)",
        }}
      >
        SYS.LOG
      </div>
      <div style={{ padding: "7px 10px 8px" }}>
        {lines.map((line) => (
          <div
            key={line.id}
            style={{
              fontFamily: "var(--font-data)",
              fontSize: "9px",
              lineHeight: "1.85",
              letterSpacing: "0.02em",
              color: line.warn ? "rgba(245,166,35,0.85)" : "rgba(255,255,255,0.48)",
              whiteSpace: "pre",
            }}
          >
            {line.text}
          </div>
        ))}
      </div>
    </div>
  );
}
