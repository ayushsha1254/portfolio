const STATS = [
  { label: "YRS EXP",  value: "4+",  accent: "rgba(122,92,255,0.80)"  },
  { label: "PROJECTS", value: "11",  accent: "rgba(62,255,139,0.80)"  },
  { label: "SKILLS",   value: "19",  accent: "rgba(255,59,48,0.80)"   },
  { label: "AWARD",    value: "SIH", accent: "rgba(245,166,35,0.80)"  },
];

const STACK = ["React", "Node", "AWS", "FL Studio"];

export default function ProfileStat() {
  return (
    <div
      style={{
        position: "fixed",
        left: "28px",
        top: "520px",
        width: "188px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "6px",
        overflow: "hidden",
        zIndex: "var(--z-widget)",
        userSelect: "none",
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
      }}
    >
      {/* Header */}
      <div style={{
        padding: "8px 12px 7px",
        display: "flex",
        alignItems: "center",
        gap: "7px",
        borderBottom: "1px solid var(--border-hairline)",
      }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <rect x="1" y="1" width="3.5" height="3.5" rx="0.8" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
          <rect x="5.5" y="1" width="3.5" height="3.5" rx="0.8" stroke="rgba(255,59,48,0.55)" strokeWidth="1"/>
          <rect x="1" y="5.5" width="3.5" height="3.5" rx="0.8" stroke="rgba(62,255,139,0.45)" strokeWidth="1"/>
          <rect x="5.5" y="5.5" width="3.5" height="3.5" rx="0.8" stroke="rgba(122,92,255,0.45)" strokeWidth="1"/>
        </svg>
        <span style={{
          fontFamily: "var(--font-data)",
          fontSize: "9px",
          color: "rgba(255,255,255,0.22)",
          letterSpacing: "0.14em",
        }}>
          PROFILE.STAT
        </span>
      </div>

      {/* 2×2 stat grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1px",
        background: "var(--border-hairline)",
        margin: "10px 12px 0",
        borderRadius: "4px",
        overflow: "hidden",
        border: "1px solid var(--border-hairline)",
      }}>
        {STATS.map(({ label, value, accent }) => (
          <div key={label} style={{
            background: "var(--bg-elevated)",
            padding: "9px 10px 8px",
            display: "flex",
            flexDirection: "column",
            gap: "3px",
          }}>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: "18px",
              fontWeight: 400,
              color: accent,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}>
              {value}
            </div>
            <div style={{
              fontFamily: "var(--font-data)",
              fontSize: "7.5px",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.10em",
            }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Stack strip */}
      <div style={{ padding: "10px 12px 11px" }}>
        <div style={{
          fontFamily: "var(--font-data)",
          fontSize: "8px",
          color: "rgba(255,255,255,0.16)",
          letterSpacing: "0.12em",
          marginBottom: "7px",
        }}>
          CORE STACK
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {STACK.map((tech) => (
            <span key={tech} style={{
              fontFamily: "var(--font-data)",
              fontSize: "8.5px",
              color: "rgba(255,255,255,0.45)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "3px",
              padding: "2px 6px",
              letterSpacing: "0.04em",
            }}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
