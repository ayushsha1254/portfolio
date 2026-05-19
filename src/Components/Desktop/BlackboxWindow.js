import { useState, useEffect } from "react";

// Binary payload encodes "lost signal..." — an easter egg for curious eyes
const LINES = [
  { text: "BLACKBOX // TRANSMISSION LOG",          delay: 200,  c: "primary"   },
  { text: "─────────────────────────────────────",  delay: 350,  c: "muted"     },
  { text: "",                                       delay: 500,  c: "primary"   },
  { text: "FRAGMENT_ID   0x7F3A91BC",              delay: 650,  c: "secondary" },
  { text: "ORIGIN        [REDACTED]",              delay: 800,  c: "secondary" },
  { text: "TIMESTAMP     2025.██.██ ██:██",        delay: 950,  c: "secondary" },
  { text: "INTEGRITY     PARTIAL — 34%",           delay: 1100, c: "warn"      },
  { text: "",                                       delay: 1280, c: "primary"   },
  { text: "─────────────────────────────────────",  delay: 1400, c: "muted"     },
  { text: "",                                       delay: 1550, c: "primary"   },
  { text: "01101100 01101111 01110011 01110100",    delay: 1680, c: "corrupt"   },
  { text: "00100000 01110011 01101001 01100111",    delay: 1830, c: "corrupt"   },
  { text: "01101110 01100001 01101100 00101110",    delay: 1980, c: "corrupt"   },
  { text: "00101110 00101110",                      delay: 2130, c: "corrupt"   },
  { text: "",                                       delay: 2300, c: "primary"   },
  { text: "─────────────────────────────────────",  delay: 2420, c: "muted"     },
  { text: "",                                       delay: 2570, c: "primary"   },
  { text: "decode_attempt    FAIL",                delay: 2700, c: "secondary" },
  { text: "checksum          ████████████",        delay: 2850, c: "secondary" },
  { text: "clearance         INSUFFICIENT",        delay: 3000, c: "secondary" },
  { text: "",                                       delay: 3180, c: "primary"   },
  { text: "> access denied. signal degraded.",     delay: 3300, c: "warn"      },
];

const COLOR = {
  primary:   "var(--text-primary)",
  secondary: "var(--text-secondary)",
  muted:     "var(--text-muted)",
  corrupt:   "rgba(255,59,48,0.42)",
  warn:      "rgba(245,166,35,0.70)",
};

export default function BlackboxWindow({ open }) {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (!open) { setRevealed(0); return; }
    const timers = LINES.map((line, i) =>
      setTimeout(() => setRevealed(i + 1), line.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [open]);

  return (
    <div
      style={{
        padding: "18px 22px 22px",
        fontFamily: "var(--font-data)",
        fontSize: "11px",
        lineHeight: "1.75",
        letterSpacing: "0.025em",
        minHeight: "300px",
      }}
    >
      {LINES.slice(0, revealed).map((line, i) => (
        <div
          key={i}
          style={{
            color: COLOR[line.c],
            minHeight: line.text === "" ? "0.85em" : "auto",
            whiteSpace: "pre",
          }}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
}
