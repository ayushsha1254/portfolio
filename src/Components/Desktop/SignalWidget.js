import { useState, useEffect } from "react";

const SEGS = 7;

const ITEMS = [
  { label: "audio",  live: true,  base: 0.78 },
  { label: "signal", live: true,  base: 0.62 },
  { label: "kernel", live: false, base: 0.28 },
  { label: "env",    live: false, base: 0.14 },
];

function BarRow({ label, value, live }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "8px",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-data)",
          fontSize: "9.5px",
          color: "rgba(255,255,255,0.30)",
          letterSpacing: "0.04em",
          width: "42px",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", gap: "2px" }}>
        {Array.from({ length: SEGS }, (_, i) => (
          <div
            key={i}
            style={{
              width: "5px",
              height: "9px",
              background:
                i < value
                  ? live
                    ? "rgba(62,255,139,0.52)"
                    : "rgba(255,255,255,0.22)"
                  : "rgba(255,255,255,0.06)",
              transition: "background 350ms ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function SignalWidget() {
  const [levels, setLevels] = useState(() =>
    ITEMS.map((item) => Math.round(item.base * SEGS))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setLevels(
        ITEMS.map((item) => {
          if (!item.live) return Math.round(item.base * SEGS);
          const v = item.base * SEGS + (Math.random() - 0.5) * 2.8;
          return Math.max(1, Math.min(SEGS, Math.round(v)));
        })
      );
    }, 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        right: "28px",
        top: "72px",
        width: "196px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-hairline)",
        borderRadius: "4px",
        padding: "10px 14px 12px",
        zIndex: "var(--z-dock)",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-data)",
          fontSize: "9px",
          color: "rgba(255,255,255,0.22)",
          letterSpacing: "0.12em",
          paddingBottom: "8px",
          borderBottom: "1px solid var(--border-hairline)",
          marginBottom: "10px",
        }}
      >
        SYS.STATUS
      </div>

      {ITEMS.map(({ label, live }, i) => (
        <BarRow key={label} label={label} value={levels[i]} live={live} />
      ))}
    </div>
  );
}
