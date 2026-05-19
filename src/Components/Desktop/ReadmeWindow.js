import { useState, useEffect } from "react";

// Line reveals with per-line delay (ms), color: primary | secondary | muted | green
const LINES = [
  { text: "NOCTURNE_OS v0.9.1 — SYSTEM MANIFEST", delay: 450,  c: "primary"   },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", delay: 600,  c: "muted"     },
  { text: "",                                                             delay: 820,  c: "primary"   },
  { text: "This machine belongs to Ayush Sharma.",                        delay: 970,  c: "secondary" },
  { text: "Developer. Musician. Systems thinker.",                        delay: 1110, c: "secondary" },
  { text: "",                                                             delay: 1310, c: "primary"   },
  { text: "━━ MODULES ━━━━━━━━━━━━━━━━━━━━━━━━━━", delay: 1450, c: "muted"     },
  { text: "",                                                             delay: 1600, c: "primary"   },
  { text: "  archive.sys    →  portfolio / projects / about",        delay: 1720, c: "secondary" },
  { text: "  terminal://    →  console access / commands",           delay: 1870, c: "secondary" },
  { text: "  studio.jack    →  music / audio / waveforms",          delay: 2020, c: "secondary" },
  { text: "  arena.projects →  case studies (coming online)",        delay: 2170, c: "secondary" },
  { text: "  signal.link    →  contact / transmission",              delay: 2320, c: "secondary" },
  { text: "",                                                             delay: 2520, c: "primary"   },
  { text: "━━ ENVIRONMENT ━━━━━━━━━━━━━━━━━━━━━", delay: 2650, c: "muted"     },
  { text: "",                                                             delay: 2800, c: "primary"   },
  { text: "  OS:       NOCTURNE_OS 0.9.1",                               delay: 2900, c: "secondary" },
  { text: "  Build:    2025.05 / production",                            delay: 3030, c: "secondary" },
  { text: "  Audio:    jack running @ 48kHz",                            delay: 3160, c: "secondary" },
  { text: "  Status:   all systems nominal",                             delay: 3290, c: "secondary" },
  { text: "",                                                             delay: 3490, c: "primary"   },
  { text: "━━ HINTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", delay: 3610, c: "muted"     },
  { text: "",                                                             delay: 3760, c: "primary"   },
  { text: "  [ try the terminal ]",                                      delay: 3870, c: "green"     },
  { text: "  [ double-click any icon ]",                                 delay: 4030, c: "green"     },
  { text: "  [ watch the environment react ]",                           delay: 4190, c: "green"     },
  { text: "  [ there are things hidden here ]",                          delay: 4350, c: "green"     },
  { text: "",                                                             delay: 4540, c: "primary"   },
  { text: "────────────────────────────────────", delay: 4650, c: "muted"     },
];

const COLOR = {
  primary:   "var(--text-primary)",
  secondary: "var(--text-secondary)",
  muted:     "var(--text-muted)",
  green:     "rgba(62,255,139,0.55)",
};

export default function ReadmeWindow({ open }) {
  const [revealed, setRevealed] = useState(0);
  const [cursorBlink, setCursorBlink] = useState(true);
  const done = revealed >= LINES.length;

  // Reset + run reveal each time window opens
  useEffect(() => {
    if (!open) {
      setRevealed(0);
      return;
    }
    const timers = LINES.map((line, i) =>
      setTimeout(() => setRevealed(i + 1), line.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [open]);

  // Cursor blink after reveal complete
  useEffect(() => {
    if (!done) return;
    const interval = setInterval(() => setCursorBlink((v) => !v), 550);
    return () => clearInterval(interval);
  }, [done]);

  return (
    <div
      style={{
        padding: "20px 24px 24px",
        fontFamily: "var(--font-data)",
        fontSize: "11px",
        lineHeight: "1.75",
        letterSpacing: "0.025em",
        minHeight: "360px",
        overflowY: "hidden",
      }}
    >
      {LINES.slice(0, revealed).map((line, i) => {
        const isLast = i === revealed - 1;
        return (
          <div
            key={i}
            style={{
              color: COLOR[line.c],
              minHeight: line.text === "" ? "0.85em" : "auto",
              whiteSpace: "pre",
            }}
          >
            {line.text}
            {/* Cursor on last revealed line */}
            {isLast && (
              <span
                style={{
                  display: "inline-block",
                  width: "6px",
                  height: "11px",
                  background: done ? "var(--text-secondary)" : "var(--text-muted)",
                  marginLeft: "2px",
                  verticalAlign: "text-bottom",
                  opacity: done ? (cursorBlink ? 0.7 : 0) : 0.35,
                  transition: done ? "opacity 80ms" : "none",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
