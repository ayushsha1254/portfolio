import { useState, useEffect, useRef } from "react";

const CHANNELS = [
  { pos: 0.06, label: "archive.sys",  color: "rgba(122,92,255,0.85)" },
  { pos: 0.21, label: "terminal://",  color: "rgba(62,255,139,0.85)"  },
  { pos: 0.39, label: "studio.jack",  color: "rgba(122,92,255,0.85)" },
  { pos: 0.56, label: "signal.link",  color: "rgba(245,166,35,0.85)"  },
  { pos: 0.74, label: "void.archive", color: "rgba(255,59,48,0.85)"   },
  { pos: 0.90, label: "blackbox//",   color: "rgba(255,59,48,0.60)"   },
];

const FREQ_LABELS = ["88", "92", "96", "100", "104", "108"];

export default function FrequencyScanner() {
  const [scanPos, setScanPos] = useState(0);
  const [hoveredChannel, setHoveredChannel] = useState(null);
  const lastTimeRef = useRef(null);
  const rafRef = useRef(null);
  const posRef = useRef(0);

  useEffect(() => {
    const animate = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = time - lastTimeRef.current;
      lastTimeRef.current = time;

      posRef.current += dt * 0.000140; // ~7s full sweep
      if (posRef.current > 1) posRef.current = 0;

      setScanPos(posRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const nearChannel = CHANNELS.find((c) => Math.abs(c.pos - scanPos) < 0.032);
  const freqMHz = (88 + scanPos * 20).toFixed(1);

  return (
    <div
      style={{
        position: "fixed",
        top: "18%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "320px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-hairline)",
        borderRadius: "4px",
        padding: "10px 14px 10px",
        zIndex: "var(--z-dock)",
        userSelect: "none",
        pointerEvents: "all",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "9px",
          paddingBottom: "7px",
          borderBottom: "1px solid var(--border-hairline)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-data)",
            fontSize: "9px",
            color: "rgba(255,255,255,0.22)",
            letterSpacing: "0.12em",
          }}
        >
          SIGNAL.SCANNER
        </span>
        <span
          style={{
            fontFamily: "var(--font-data)",
            fontSize: "9px",
            letterSpacing: "0.08em",
            color: nearChannel ? nearChannel.color : "rgba(255,255,255,0.28)",
            transition: "color 180ms",
          }}
        >
          {nearChannel ? nearChannel.label : `${freqMHz} MHz`}
        </span>
      </div>

      {/* Scanner track */}
      <div
        style={{
          position: "relative",
          height: "34px",
          background: "rgba(0,0,0,0.45)",
          borderRadius: "2px",
          border: "1px solid var(--border-hairline)",
          overflow: "hidden",
        }}
      >
        {/* Background grid */}
        {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((p) => (
          <div
            key={p}
            style={{
              position: "absolute",
              left: `${p * 100}%`,
              top: 0,
              bottom: 0,
              width: "1px",
              background: "rgba(255,255,255,0.03)",
              pointerEvents: "none",
            }}
          />
        ))}

        {/* Channel blips */}
        {CHANNELS.map((ch) => {
          const isHovered = hoveredChannel === ch.label;
          const isNear = Math.abs(ch.pos - scanPos) < 0.032;
          return (
            <div
              key={ch.label}
              onMouseEnter={() => setHoveredChannel(ch.label)}
              onMouseLeave={() => setHoveredChannel(null)}
              style={{
                position: "absolute",
                left: `${ch.pos * 100}%`,
                top: "3px",
                bottom: "3px",
                width: "2px",
                transform: "translateX(-50%)",
                background: ch.color,
                opacity: isNear ? 1 : isHovered ? 0.65 : 0.30,
                transition: "opacity 200ms",
                cursor: "default",
                boxShadow: isNear ? `0 0 6px ${ch.color}` : "none",
              }}
            />
          );
        })}

        {/* Scan cursor */}
        <div
          style={{
            position: "absolute",
            left: `${scanPos * 100}%`,
            top: 0,
            bottom: 0,
            width: "1px",
            transform: "translateX(-50%)",
            background: nearChannel
              ? nearChannel.color
              : "rgba(255,255,255,0.55)",
            boxShadow: nearChannel
              ? `0 0 10px ${nearChannel.color}`
              : "0 0 5px rgba(255,255,255,0.30)",
            transition: "background 150ms, box-shadow 150ms",
            pointerEvents: "none",
          }}
        />

        {/* Cursor glow bloom */}
        <div
          style={{
            position: "absolute",
            left: `${scanPos * 100}%`,
            top: 0,
            bottom: 0,
            width: "32px",
            transform: "translateX(-50%)",
            background: nearChannel
              ? `linear-gradient(to right, transparent, ${nearChannel.color.replace(/[\d.]+\)$/, "0.07)")}, transparent)`
              : "linear-gradient(to right, transparent, rgba(255,255,255,0.04), transparent)",
            pointerEvents: "none",
            transition: "background 150ms",
          }}
        />
      </div>

      {/* Frequency axis labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "4px",
          paddingLeft: "1px",
          paddingRight: "1px",
        }}
      >
        {FREQ_LABELS.map((f) => (
          <span
            key={f}
            style={{
              fontFamily: "var(--font-data)",
              fontSize: "8px",
              color: "rgba(255,255,255,0.14)",
              letterSpacing: "0.04em",
            }}
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}
