import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const LINES = [
  { text: "> NOCTURNE_OS v2.0.0",                       color: "var(--text-muted)" },
  { text: "> resolving path...",                         color: "var(--text-muted)" },
  { text: "> ERROR_404: PATH_NOT_FOUND",                 color: "var(--accent-red)" },
  { text: "> the requested route does not exist.",       color: "var(--text-secondary)" },
  { text: "",                                             color: "transparent" },
  { text: "> available routes: /  /music  /particles",   color: "var(--text-muted)" },
];

export default function NotFound() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (count >= LINES.length) { setReady(true); return; }
    const t = setTimeout(() => setCount(c => c + 1), 110);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "var(--bg-void)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-mono)",
    }}>
      <div style={{ maxWidth: "520px", width: "100%", padding: "48px 32px" }}>
        {LINES.slice(0, count).map((line, i) => (
          <div key={i} style={{
            fontSize: "12px",
            color: line.color,
            marginBottom: "5px",
            letterSpacing: "0.03em",
            lineHeight: 1.5,
          }}>
            {line.text || " "}
          </div>
        ))}

        {ready && (
          <div style={{ marginTop: "28px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              role="button"
              tabIndex={0}
              onClick={() => navigate("/")}
              onKeyDown={e => e.key === "Enter" && navigate("/")}
              style={{
                fontSize: "12px",
                color: "var(--accent-green)",
                cursor: "pointer",
                letterSpacing: "0.04em",
              }}
            >
              $ cd /
            </span>
            <span style={{
              display: "inline-block",
              width: "8px", height: "14px",
              background: "var(--accent-green)",
              verticalAlign: "text-bottom",
              animation: "nocturne-cursor-blink 1s step-end infinite",
            }} />
          </div>
        )}
      </div>
    </div>
  );
}
