import { useState, useEffect, useRef } from "react";

const LINES = [
  { text: "VOID.ARCHIVE ── ACCESS RECORD", delay: 200,  c: "primary"   },
  { text: "──────────────────────────────────────", delay: 340,  c: "muted"     },
  { text: "",                                                          delay: 500,  c: "primary"   },
  { text: "RECORD 0x0001  [CORRUPTED]",                                delay: 700,  c: "secondary" },
  { text: "RECORD 0x0002  ...sharma/[REDACTED]/transmission",          delay: 930,  c: "secondary" },
  { text: "RECORD 0x0003  ██████████████████████████",
                                                                       delay: 1180, c: "corrupt"   },
  { text: "RECORD 0x0004  standing by. signal confirmed.",             delay: 1420, c: "secondary" },
  { text: "",                                                          delay: 1620, c: "primary"   },
  { text: "──────────────────────────────────────", delay: 1760, c: "muted"     },
  { text: "LAST MODIFIED   unknown",                                   delay: 1900, c: "secondary" },
  { text: "INTEGRITY       FAIL  ·  checksum mismatch",           delay: 2050, c: "warn"      },
  { text: "CLASSIFICATION  ░░░░░░░░░",
                                                                       delay: 2200, c: "flicker"   },
];

const COLOR = {
  primary:   "var(--text-primary)",
  secondary: "var(--text-secondary)",
  muted:     "var(--text-muted)",
  corrupt:   "rgba(255,255,255,0.15)",
  warn:      "rgba(245,166,35,0.7)",
  flicker:   "var(--text-muted)",
};

// Flicker characters for the classification line
const FLICKER_SETS = [
  "░░░░░░░░░",
  "▒░░▒░░▒░░",
  "░▒▓░▒░░▒░",
  "░░░░░░░░░",
  "▓░░░▒░▓░░",
];

export default function VoidWindow({ open }) {
  const [revealed, setRevealed] = useState(0);
  const [flickerIdx, setFlickerIdx] = useState(0);
  const done = revealed >= LINES.length;

  useEffect(() => {
    if (!open) { setRevealed(0); return; }
    const timers = LINES.map((line, i) =>
      setTimeout(() => setRevealed(i + 1), line.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [open]);

  // Subtle flicker on classification line every ~4s
  useEffect(() => {
    if (!done) return;
    const tick = () => setFlickerIdx((v) => (v + 1) % FLICKER_SETS.length);
    const id = setInterval(tick, 3800 + Math.random() * 600);
    return () => clearInterval(id);
  }, [done]);

  return (
    <div
      style={{
        padding: "18px 22px 22px",
        fontFamily: "var(--font-data)",
        fontSize: "11px",
        lineHeight: "1.75",
        letterSpacing: "0.025em",
        minHeight: "260px",
      }}
    >
      {LINES.slice(0, revealed).map((line, i) => {
        const isFlicker = line.c === "flicker";
        const text = isFlicker && done
          ? `CLASSIFICATION  ${FLICKER_SETS[flickerIdx]}`
          : line.text;

        return (
          <div
            key={i}
            style={{
              color: COLOR[line.c],
              minHeight: line.text === "" ? "0.85em" : "auto",
              whiteSpace: "pre",
              opacity: isFlicker ? 0.55 : 1,
              transition: isFlicker ? "opacity 200ms" : "none",
            }}
          >
            {text}
          </div>
        );
      })}
    </div>
  );
}
