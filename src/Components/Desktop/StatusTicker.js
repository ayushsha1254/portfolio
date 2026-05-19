import { useState, useEffect, useRef } from "react";

const INDICATORS = [
  { label: "audio",  value: "jack 48kHz",  live: true  },
  { label: "signal", value: "nominal",     live: true  },
  { label: "kernel", value: "0.9.1",       live: false },
  { label: "env",    value: "production",  live: false },
];

function formatUptime(s) {
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
}

export default function StatusTicker() {
  const startRef = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: "36px",
        left: 0,
        right: 0,
        height: "24px",
        background: "rgba(9,9,9,0.88)",
        borderBottom: "1px solid var(--border-hairline)",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        justifyContent: "space-between",
        zIndex: "var(--z-dock)",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {/* Status indicators */}
      <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
        {INDICATORS.map(({ label, value, live }) => (
          <div
            key={label}
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            <div
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: live ? "var(--accent-green)" : "rgba(255,255,255,0.16)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-data)",
                fontSize: "9px",
                color: "rgba(255,255,255,0.28)",
                letterSpacing: "0.06em",
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontFamily: "var(--font-data)",
                fontSize: "9px",
                color: "rgba(255,255,255,0.42)",
                letterSpacing: "0.04em",
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Uptime */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span
          style={{
            fontFamily: "var(--font-data)",
            fontSize: "9px",
            color: "rgba(255,255,255,0.18)",
            letterSpacing: "0.08em",
          }}
        >
          uptime
        </span>
        <span
          style={{
            fontFamily: "var(--font-data)",
            fontSize: "9px",
            color: "rgba(255,255,255,0.38)",
            letterSpacing: "0.05em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatUptime(elapsed)}
        </span>
      </div>
    </div>
  );
}
