import { useState, useEffect, useRef } from "react";

const TARGET = "> ayush — archive — online";
const NOISE = ["0", "1", "░", "▒", "0", "1", "0", "1"];

function randomChar(isSpace) {
  if (isSpace) return " ";
  return NOISE[Math.floor(Math.random() * NOISE.length)];
}

function makeScrambled() {
  return TARGET.split("").map((c) => randomChar(c === " ")).join("");
}

export default function SignalDecoder() {
  const [phase, setPhase] = useState("idle");
  const [display, setDisplay] = useState(makeScrambled);
  const idleRef = useRef(null);
  const decodeRef = useRef(null);
  const resetRef = useRef(null);

  // Ambient scramble when idle
  useEffect(() => {
    if (phase !== "idle") return;
    idleRef.current = setInterval(() => setDisplay(makeScrambled()), 750);
    return () => clearInterval(idleRef.current);
  }, [phase]);

  const startDecode = () => {
    if (phase !== "idle") return;
    clearInterval(idleRef.current);
    setPhase("decoding");

    let pos = 0;
    const revealed = makeScrambled().split("");

    const step = () => {
      revealed[pos] = TARGET[pos];
      for (let i = pos + 1; i < TARGET.length; i++) {
        revealed[i] = randomChar(TARGET[i] === " ");
      }
      setDisplay(revealed.join(""));
      pos++;

      if (pos >= TARGET.length) {
        setDisplay(TARGET);
        setPhase("resolved");
        resetRef.current = setTimeout(() => {
          setPhase("idle");
          setDisplay(makeScrambled());
        }, 3500);
        return;
      }
      decodeRef.current = setTimeout(step, 22 + Math.random() * 18);
    };

    decodeRef.current = setTimeout(step, 280);
  };

  useEffect(() => () => {
    clearInterval(idleRef.current);
    clearTimeout(decodeRef.current);
    clearTimeout(resetRef.current);
  }, []);

  const resolved = phase === "resolved";
  const decoding = phase === "decoding";

  return (
    <div
      onMouseEnter={startDecode}
      style={{
        position: "fixed",
        left: "28px",
        top: "424px",
        width: "232px",
        background: "var(--bg-surface)",
        border: `1px solid ${resolved ? "rgba(62,255,139,0.35)" : "var(--border-subtle)"}`,
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
        borderRadius: "4px",
        padding: "11px 14px 12px",
        zIndex: "var(--z-windows)",
        cursor: "default",
        userSelect: "none",
        transition: "border-color 500ms ease",
      }}
    >
      {/* Header row */}
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
          SIGNAL.DECODER
        </span>
        <span
          style={{
            fontFamily: "var(--font-data)",
            fontSize: "9px",
            letterSpacing: "0.08em",
            color: resolved
              ? "rgba(62,255,139,0.65)"
              : decoding
              ? "rgba(245,166,35,0.65)"
              : "rgba(255,255,255,0.18)",
            transition: "color 300ms",
          }}
        >
          {resolved ? "RESOLVED" : decoding ? "DECODING…" : "IDLE"}
        </span>
      </div>

      {/* Decoded / scrambled output */}
      <div
        style={{
          fontFamily: "var(--font-data)",
          fontSize: "10.5px",
          lineHeight: 1.5,
          letterSpacing: "0.03em",
          color: resolved
            ? "rgba(62,255,139,0.88)"
            : "rgba(255,255,255,0.48)",
          transition: "color 450ms ease",
          whiteSpace: "pre",
          overflow: "hidden",
        }}
      >
        {display}
      </div>

      {/* Footer row */}
      <div
        style={{
          marginTop: "9px",
          paddingTop: "7px",
          borderTop: "1px solid var(--border-hairline)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-data)",
            fontSize: "9px",
            color: "rgba(255,255,255,0.16)",
            letterSpacing: "0.06em",
          }}
        >
          FRAGMENT 0x7F3A
        </span>
        <span
          style={{
            fontFamily: "var(--font-data)",
            fontSize: "9px",
            color: phase === "idle"
              ? "rgba(255,255,255,0.22)"
              : resolved
              ? "rgba(62,255,139,0.45)"
              : "rgba(245,166,35,0.50)",
            letterSpacing: "0.06em",
          }}
        >
          {phase === "idle" ? "○ hover to decode" : resolved ? "● confirmed" : "● active"}
        </span>
      </div>
    </div>
  );
}
