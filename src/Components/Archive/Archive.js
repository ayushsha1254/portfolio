import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import mainData from "../../Data/main.json";

import sihMain  from "../../Assets/sih/main.svg";
import sihEA    from "../../Assets/sih/envisionalpha.svg";
import sihTeam  from "../../Assets/sih/team.svg";
import sihMedia1 from "../../Assets/sih/media1.svg";
import sihMedia2 from "../../Assets/sih/media2.svg";
import sihCert  from "../../Assets/sih/cert.png";
import sihAyush from "../../Assets/sih/ayush.svg";
import sihDivyanshu from "../../Assets/sih/divyanshu.svg";
import sihAbhishek  from "../../Assets/sih/abhishek.svg";
import sihShrishti  from "../../Assets/sih/shrishti.svg";
import sihChull     from "../../Assets/sih/chull.svg";

const exp    = mainData.explorer;
const resume = mainData.resume;

// ── Design tokens (local shortcuts) ─────────────────────────────────────────
const DISPLAY = { fontFamily: "var(--font-display)" };
const MONO    = { fontFamily: "var(--font-mono)" };
const DATA    = { fontFamily: "var(--font-data)" };
const BODY    = { fontFamily: "var(--font-body)" };
const LABEL   = { fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-muted)", letterSpacing: "0.16em", textTransform: "uppercase" };
const META    = { fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-muted)" };
const scroll  = { overflowY: "auto", scrollbarWidth: "none" };

// ── Category colors ──────────────────────────────────────────────────────────
const CAT_COLOR = {
  Programming:   "#7A5CFF",
  Frontend:      "#0A84FF",
  Backend:       "#3EFF8B",
  Cloud:         "#F5A623",
  VCS:           "#8A8A8A",
  Utility:       "#8A8A8A",
  Design:        "#FF3B30",
  "Soft Skills": "#F5A623",
};

const SKILL_GROUPS = exp.skills.reduce((acc, s) => {
  const cat = s.category?.[0] || "Other";
  (acc[cat] = acc[cat] || []).push(s);
  return acc;
}, {});

const STACK_LABEL = {
  js: "JS", javascript: "JS", react: "React", node: "Node",
  tailwind: "Tailwind", aws: "AWS", s3: "S3", express: "Express",
  dynamodb: "DynamoDB", threejs: "Three.js", python: "Python",
  mysql: "MySQL", mongodb: "MongoDB", typescript: "TS", css: "CSS",
  html: "HTML", bootstrap: "Bootstrap", heroku: "Heroku",
  django: "Django", cpp: "C++", nextjs: "Next.js", figma: "Figma",
};

// ── Tree structure ───────────────────────────────────────────────────────────
const TREE = [
  { id: "system", label: "system/", children: [
    { id: "about",      label: "about.md"      },
    { id: "skills",     label: "skills.json"   },
    { id: "experience", label: "experience.md" },
  ]},
  { id: "work", label: "work/", children: [
    { id: "projects",   label: "projects/"     },
    { id: "certs",      label: "certs.md"      },
    { id: "sih",        label: "sih.exe"       },
  ]},
  { id: "reach", label: "reach/", children: [
    { id: "contact",    label: "contact.md"    },
    { id: "social",     label: "social.md"     },
  ]},
];

const FOLDER_OF   = TREE.reduce((a, g) => { g.children.forEach(c => { a[c.id] = g.id; }); return a; }, {});
const ITEM_LABEL  = { about: "about.md", skills: "skills.json", experience: "experience.md", projects: "projects/", certs: "certs.md", sih: "sih.exe", contact: "contact.md", social: "social.md" };

// ── Helpers ──────────────────────────────────────────────────────────────────
function useCountUp(target, duration = 900) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let raf;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(ease * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return count;
}

// Pre-compute bar heights per platform (deterministic)
function seedBars(key) {
  const s = key.charCodeAt(0) * 13 + key.charCodeAt(key.length - 1) * 7;
  return Array.from({ length: 18 }, (_, i) => 3 + ((s * (i + 1) * 17 + i * 31) % 9));
}

// ── ABOUT panel — PERSONNEL_FILE ─────────────────────────────────────────────
function AboutPanel() {
  const yrs  = useCountUp(4);
  const proj = useCountUp(11);
  const sk   = useCountUp(19);

  const STATS = [
    { value: yrs,  suffix: "+", label: "YRS EXP",  color: "#7A5CFF" },
    { value: proj, suffix: "",  label: "PROJECTS",  color: "#3EFF8B" },
    { value: sk,   suffix: "",  label: "SKILLS",    color: "#FF3B30" },
    { value: null, suffix: "",  label: "SIH AWARD", color: "#F5A623", static: "SIH" },
  ];

  return (
    <div style={{ padding: "24px 26px" }}>
      {/* Scanline sweep */}
      <div style={{ position: "relative", overflow: "hidden", marginBottom: 22 }}>
        <motion.div
          aria-hidden
          initial={{ y: 0, opacity: 0.6 }}
          animate={{ y: "100%", opacity: 0 }}
          transition={{ duration: 1.8, ease: "linear", delay: 0.1 }}
          style={{
            position: "absolute", left: 0, right: 0, top: 0,
            height: "3px",
            background: "linear-gradient(90deg, transparent, rgba(62,255,139,0.4), transparent)",
            zIndex: 2, pointerEvents: "none",
          }}
        />

        {/* Name + status */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
          <div style={{ ...DISPLAY, fontSize: "26px", color: "var(--text-primary)", fontWeight: 500, letterSpacing: "-0.02em" }}>
            {resume.name}
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "3px 9px",
            background: "rgba(62,255,139,0.08)",
            border: "1px solid rgba(62,255,139,0.22)",
            borderRadius: 2,
          }}>
            <motion.div
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: 5, height: 5, borderRadius: "50%", background: "#3EFF8B" }}
            />
            <span style={{ ...DATA, fontSize: "9px", color: "#3EFF8B", letterSpacing: "0.12em" }}>AVAILABLE</span>
          </div>
        </div>

        <div style={{ ...DATA, fontSize: "10px", color: "var(--accent-purple)", letterSpacing: "0.16em" }}>
          {resume.subheading?.toUpperCase()}
        </div>
      </div>

      {/* Stat counters */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 24 }}>
        {STATS.map(({ value, suffix, label, color, static: s }) => (
          <div key={label} style={{
            padding: "11px 12px",
            background: "var(--bg-surface)",
            border: `1px solid ${color}22`,
            borderRadius: 3,
            borderTop: `2px solid ${color}`,
          }}>
            <div style={{ ...MONO, fontSize: "22px", color, lineHeight: 1, marginBottom: 4 }}>
              {s ?? `${value}${suffix}`}
            </div>
            <div style={{ ...LABEL }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Bio */}
      <div style={{
        ...BODY, fontSize: "12.5px", color: "var(--text-secondary)",
        lineHeight: 1.8, marginBottom: 22,
        padding: "14px 16px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-hairline)",
        borderLeft: "2px solid var(--accent-purple)",
        borderRadius: "0 3px 3px 0",
      }}>
        {resume.description}
      </div>

      {/* Identity table */}
      <div style={{ ...DATA, fontSize: "9px", color: "var(--text-muted)", letterSpacing: "0.16em", marginBottom: 10 }}>
        IDENTITY
      </div>
      <div style={{
        border: "1px solid var(--border-hairline)",
        borderRadius: 3, overflow: "hidden",
      }}>
        {[
          ["LOCATION", resume.location,  null],
          ["EMAIL",    resume.email,    `mailto:${resume.email}`],
          ["GITHUB",   resume.github?.replace("https://", ""),   resume.github],
          ["LINKEDIN", resume.linkedin?.replace("https://",""),  resume.linkedin],
        ].map(([key, val, href], i, arr) => val ? (
          <div key={key} style={{
            display: "flex", alignItems: "center",
            padding: "9px 14px",
            borderBottom: i < arr.length - 1 ? "1px solid var(--border-hairline)" : "none",
            gap: 20,
          }}>
            <span style={{ ...LABEL, minWidth: 72 }}>{key}</span>
            <span style={{ ...DATA, fontSize: "9px", color: "rgba(255,255,255,0.18)", marginRight: 4 }}>│</span>
            {href ? (
              <a href={href} target="_blank" rel="noreferrer" style={{
                ...DATA, fontSize: "11px", color: "var(--text-secondary)",
                textDecoration: "none", transition: "color 120ms",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--accent-purple)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; }}>
                {val}
              </a>
            ) : (
              <span style={{ ...DATA, fontSize: "11px", color: "var(--text-secondary)" }}>{val}</span>
            )}
          </div>
        ) : null)}
      </div>
    </div>
  );
}

// ── SKILLS panel — SIGNAL_MATRIX ─────────────────────────────────────────────
function SkillTile({ skill, catColor }) {
  const [imgErr, setImgErr] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "11px 8px 9px",
        width: 80, flexShrink: 0,
        background: hovered ? "var(--bg-overlay)" : "var(--bg-surface)",
        border: `1px solid ${hovered ? catColor + "66" : "var(--border-hairline)"}`,
        borderRadius: 4,
        cursor: "default",
        transition: "border-color 150ms, background 150ms",
      }}
    >
      {/* Logo */}
      <div style={{ width: 28, height: 28, marginBottom: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {!imgErr && skill.img ? (
          <img
            src={skill.img}
            alt={skill.name}
            onError={() => setImgErr(true)}
            style={{ width: 26, height: 26, objectFit: "contain" }}
          />
        ) : (
          <div style={{
            width: 26, height: 26, borderRadius: 4,
            background: catColor + "18",
            border: `1px solid ${catColor}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
            ...MONO, fontSize: "12px", fontWeight: 600, color: catColor,
          }}>
            {skill.name[0]}
          </div>
        )}
      </div>

      {/* Name */}
      <div style={{
        ...DATA, fontSize: "9px", color: hovered ? "var(--text-primary)" : "var(--text-secondary)",
        textAlign: "center", lineHeight: 1.2, marginBottom: 7,
        maxWidth: 68, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        transition: "color 150ms",
      }}>
        {skill.name}
      </div>

      {/* Signal bars */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
        {[4, 6, 8].map((h, i) => (
          <div key={i} style={{
            width: 4, height: hovered ? h + 2 : h,
            background: catColor,
            opacity: hovered ? 0.9 : 0.35,
            borderRadius: 1,
            transition: `height 150ms ${i * 30}ms ease, opacity 150ms`,
          }} />
        ))}
      </div>
    </div>
  );
}

function SkillsPanel() {
  return (
    <div style={{ padding: "22px 26px" }}>
      {Object.entries(SKILL_GROUPS).map(([cat, skills]) => (
        <div key={cat} style={{ marginBottom: 22 }}>
          {/* Bus channel label */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
            paddingBottom: 6,
            borderBottom: `1px solid ${CAT_COLOR[cat] || "#8A8A8A"}22`,
          }}>
            <div style={{ width: 8, height: 1, background: CAT_COLOR[cat] || "#8A8A8A", opacity: 0.7 }} />
            <span style={{ ...LABEL, color: CAT_COLOR[cat] || "#8A8A8A" }}>{cat}</span>
            <span style={{ ...DATA, fontSize: "9px", color: "var(--text-muted)" }}>({skills.length})</span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {skills.map(s => (
              <SkillTile key={s.name} skill={s} catColor={CAT_COLOR[cat] || "#8A8A8A"} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── EXPERIENCE panel — PROCESS_LOG ───────────────────────────────────────────
const EXP_COLORS = ["#3EFF8B", "#7A5CFF", "#F5A623", "#0A84FF", "#FF3B30"];

function ExperiencePanel() {
  const [expanded, setExpanded] = useState(0);

  return (
    <div style={{ padding: "22px 26px" }}>
      <div style={{ ...DATA, fontSize: "9px", color: "var(--text-muted)", letterSpacing: "0.16em", marginBottom: 20 }}>
        PROCESS LOG — {resume.experience?.length || 0} ENTRIES
      </div>

      <div style={{ position: "relative", paddingLeft: 28 }}>
        {/* Vertical rail */}
        <div style={{
          position: "absolute", left: 6, top: 6, bottom: 0,
          width: 1, background: "var(--border-subtle)",
        }} />

        {(resume.experience || []).map((e, i) => {
          const color = EXP_COLORS[i] || "#8A8A8A";
          const isCurrent = e.duration?.includes("Present");
          const isOpen = expanded === i;

          return (
            <div key={i} style={{ marginBottom: 6, position: "relative" }}>
              {/* Commit node */}
              <div style={{
                position: "absolute", left: -28, top: 5,
                width: 12, height: 12, borderRadius: "50%",
                background: isCurrent ? color : "var(--bg-elevated)",
                border: `2px solid ${color}`,
                zIndex: 1,
              }}>
                {isCurrent && (
                  <motion.div
                    animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      position: "absolute", inset: -4, borderRadius: "50%",
                      background: color, opacity: 0.3,
                    }}
                  />
                )}
              </div>

              {/* Entry card */}
              <div
                onClick={() => setExpanded(isOpen ? -1 : i)}
                style={{
                  padding: "10px 14px",
                  background: isOpen ? "rgba(255,255,255,0.03)" : "var(--bg-surface)",
                  border: `1px solid ${isOpen ? color + "44" : "var(--border-hairline)"}`,
                  borderRadius: 3,
                  cursor: "pointer",
                  transition: "background 120ms, border-color 120ms",
                }}
              >
                {/* Commit line */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{ ...DATA, fontSize: "9px", color: color, letterSpacing: "0.08em", opacity: 0.6 }}>
                    {String(i + 1).padStart(4, "0")}
                  </span>
                  <span style={{ ...MONO, fontSize: "12px", color: "var(--text-primary)" }}>
                    {e.position}
                  </span>
                  {isCurrent && (
                    <span style={{
                      ...DATA, fontSize: "8px", color: "#3EFF8B",
                      padding: "1px 5px",
                      border: "1px solid rgba(62,255,139,0.3)",
                      borderRadius: 2, marginLeft: "auto",
                    }}>
                      ACTIVE
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 14 }}>
                  <span style={{ ...DATA, fontSize: "10px", color }}>@ {e.name}</span>
                  <span style={{ ...DATA, fontSize: "10px", color: "var(--text-muted)" }}>{e.duration}</span>
                </div>

                {/* Commit body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.16 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{
                        ...BODY, fontSize: "12px", color: "var(--text-secondary)",
                        lineHeight: 1.72, marginTop: 10,
                        paddingTop: 10,
                        borderTop: `1px solid ${color}22`,
                      }}>
                        {e.description}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── PROJECTS panel — SYSTEM_MONITOR ──────────────────────────────────────────
function getStatus(p) {
  if (p.link && p.link !== "https://www.google.com") return "DEPLOYED";
  if (p.timeline?.end?.includes("Present")) return "RUNNING";
  return "ARCHIVED";
}
const STATUS_COLOR = { DEPLOYED: "#3EFF8B", RUNNING: "#0A84FF", ARCHIVED: "#F5A623" };
const MAX_STACK    = Math.max(...exp.projects.map(p => p.stack?.length || 0));

function ProjectsPanel() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div>
      {/* Table header */}
      <div style={{
        display: "grid", gridTemplateColumns: "42px 1fr 90px 64px 1fr",
        padding: "7px 20px", gap: 10,
        borderBottom: "1px solid var(--border-default)",
        background: "var(--bg-surface)",
      }}>
        {["PID","NAME","STATUS","CPU","STACK"].map(h => (
          <span key={h} style={{ ...LABEL }}>{h}</span>
        ))}
      </div>

      {exp.projects.map((p, i) => {
        const status = getStatus(p);
        const sColor = STATUS_COLOR[status];
        const cpu    = Math.max(14, Math.round(((p.stack?.length || 1) / MAX_STACK) * 100));
        const isOpen = expanded === i;

        return (
          <div key={i}>
            <div
              onClick={() => setExpanded(isOpen ? null : i)}
              style={{
                display: "grid", gridTemplateColumns: "42px 1fr 90px 64px 1fr",
                padding: "8px 20px", gap: 10,
                borderBottom: "1px solid var(--border-hairline)",
                cursor: "pointer", alignItems: "center",
                background: isOpen ? "rgba(255,255,255,0.03)" : "transparent",
                transition: "background 100ms",
              }}
              onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
              onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ ...DATA, fontSize: "10px", color: "var(--text-muted)" }}>
                {String(i + 1).padStart(3, "0")}
              </span>
              <span style={{ ...MONO, fontSize: "11px", color: p.color || "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {p.name}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: sColor, flexShrink: 0 }} />
                <span style={{ ...DATA, fontSize: "8px", color: sColor, letterSpacing: "0.06em" }}>{status}</span>
              </div>
              <div style={{ position: "relative", height: 3, background: "var(--bg-overlay)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0,
                  width: `${cpu}%`, background: p.color || "var(--accent-purple)",
                  opacity: 0.65, borderRadius: 2,
                }} />
              </div>
              <div style={{ display: "flex", gap: 3, alignItems: "center", overflow: "hidden" }}>
                {(p.stack || []).slice(0, 3).map(s => (
                  <span key={s} style={{
                    ...DATA, fontSize: "8px", color: "var(--text-muted)",
                    padding: "1px 4px", background: "var(--bg-surface)",
                    border: "1px solid var(--border-hairline)", borderRadius: 2, flexShrink: 0,
                  }}>
                    {STACK_LABEL[s] || s}
                  </span>
                ))}
              </div>
            </div>

            {/* Expanded process details */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{
                    margin: "0 20px 0 62px",
                    padding: "14px 16px",
                    borderBottom: "1px solid var(--border-hairline)",
                    borderLeft: `2px solid ${p.color || "var(--accent-purple)"}`,
                    background: "rgba(255,255,255,0.015)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ ...DATA, fontSize: "9px", color: p.color || "var(--text-muted)", letterSpacing: "0.08em" }}>
                        PROCESS/{String(i + 1).padStart(3, "0")}
                      </span>
                      {p.tagline && (
                        <span style={{ ...META }}>— {p.tagline}</span>
                      )}
                      {p.timeline && (
                        <span style={{ ...META, marginLeft: "auto" }}>
                          {p.timeline.start?.slice(0, 7)} → {p.timeline.end?.slice(0, 7)}
                        </span>
                      )}
                    </div>

                    <div style={{ ...BODY, fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.74, marginBottom: 12 }}>
                      {p.description}
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
                      {(p.stack || []).map(s => (
                        <span key={s} style={{
                          ...DATA, fontSize: "9px", color: "var(--text-secondary)",
                          padding: "2px 6px", background: "var(--bg-elevated)",
                          border: "1px solid var(--border-subtle)", borderRadius: 2,
                        }}>
                          {STACK_LABEL[s] || s}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      {p.link && p.link !== "https://www.google.com" && (
                        <a href={p.link} target="_blank" rel="noreferrer" style={{
                          ...DATA, fontSize: "10px", color: "var(--accent-purple)", textDecoration: "none",
                          padding: "3px 8px", border: "1px solid rgba(122,92,255,0.3)", borderRadius: 2,
                        }}>↗ live</a>
                      )}
                      {p.github && (
                        <a href={p.github} target="_blank" rel="noreferrer" style={{
                          ...DATA, fontSize: "10px", color: "var(--text-muted)", textDecoration: "none",
                          padding: "3px 8px", border: "1px solid var(--border-hairline)", borderRadius: 2,
                        }}>↗ github</a>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ── CERTS panel — VAULT_KEYS ─────────────────────────────────────────────────
const VAULT_COLORS = ["#7A5CFF", "#0A84FF", "#3EFF8B", "#F5A623", "#FF3B30"];

function CertsPanel() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <div style={{ padding: "22px 26px" }}>
      <style>{`
        @keyframes vault-shimmer {
          0%   { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(250%)  skewX(-20deg); }
        }
        .vault-card:hover .vault-shimmer { animation: vault-shimmer 0.65s ease forwards; }
      `}</style>

      <div style={{ ...LABEL, marginBottom: 16 }}>VAULT.KEYS — {exp.certifications.length} ENTRIES</div>

      {exp.certifications.map((c, i) => {
        const color = VAULT_COLORS[i % VAULT_COLORS.length];
        return (
          <a
            key={i}
            href={c.link}
            target="_blank"
            rel="noreferrer"
            className="vault-card"
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "16px 18px", marginBottom: 12,
              background: "var(--bg-surface)",
              border: `1px solid ${hoveredIdx === i ? color + "55" : color + "22"}`,
              borderRadius: 4, textDecoration: "none",
              position: "relative", overflow: "hidden",
              transition: "border-color 200ms",
            }}
          >
            {/* Shimmer sweep */}
            <div className="vault-shimmer" style={{
              position: "absolute", top: 0, left: 0, bottom: 0, width: "40%",
              background: `linear-gradient(90deg, transparent, ${color}14, transparent)`,
              pointerEvents: "none",
            }} />

            {/* Seal monogram */}
            <div style={{
              width: 52, height: 52, borderRadius: 4, flexShrink: 0,
              background: `${color}10`,
              border: `2px solid ${color}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ ...DISPLAY, fontSize: "22px", fontWeight: 700, color, lineHeight: 1 }}>
                {c.issuer?.name?.[0] || "?"}
              </span>
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                ...MONO, fontSize: "12px", color: "var(--text-primary)",
                marginBottom: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {c.name}
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ ...DATA, fontSize: "11px", color }}>{c.issuer?.name}</span>
                <span style={{ ...META }}>{c.date}</span>
              </div>
            </div>

            {/* Verified badge */}
            <div style={{
              display: "flex", alignItems: "center", gap: 4, flexShrink: 0,
              padding: "4px 9px",
              background: "rgba(62,255,139,0.07)",
              border: "1px solid rgba(62,255,139,0.22)",
              borderRadius: 2,
            }}>
              <span style={{ ...DATA, fontSize: "9px", color: "#3EFF8B", letterSpacing: "0.08em" }}>
                VERIFIED ✓
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );
}

// ── CONTACT panel — SIGNAL_LINK ──────────────────────────────────────────────
function ContactPanel() {
  const [copied, setCopied] = useState(null);
  const copy = (val, key) => {
    navigator.clipboard?.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const CONFIG = [
    { key: "ENDPOINT", val: resume.email,    href: `mailto:${resume.email}`,  glyph: "✉" },
    { key: "GATEWAY",  val: resume.linkedin?.replace("https://",""), href: resume.linkedin, glyph: "⬡" },
    { key: "REPO",     val: resume.github?.replace("https://",""),   href: resume.github,   glyph: "◈" },
    { key: "NODE",     val: resume.location,  href: null, glyph: "◎" },
  ].filter(r => r.val);

  return (
    <div style={{ padding: "22px 26px", maxWidth: 520 }}>
      {/* Interface header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, marginBottom: 20,
        padding: "10px 14px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-hairline)",
        borderRadius: 4,
      }}>
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ width: 7, height: 7, borderRadius: "50%", background: "#3EFF8B", boxShadow: "0 0 8px #3EFF8B66" }}
        />
        <span style={{ ...DATA, fontSize: "10px", color: "var(--text-secondary)", letterSpacing: "0.08em" }}>
          INTERFACE: contact_0
        </span>
        <span style={{ ...DATA, fontSize: "10px", color: "#3EFF8B", marginLeft: "auto", letterSpacing: "0.08em" }}>
          STATUS: ONLINE
        </span>
      </div>

      {/* Config rows */}
      {CONFIG.map(({ key, val, href, glyph }) => (
        <div key={key} style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "10px 14px", marginBottom: 6,
          background: "var(--bg-surface)",
          border: "1px solid var(--border-hairline)",
          borderRadius: 3,
        }}>
          <span style={{ ...MONO, fontSize: "13px", color: "var(--text-muted)", width: 18, textAlign: "center", flexShrink: 0 }}>
            {glyph}
          </span>
          <span style={{ ...LABEL, minWidth: 78 }}>{key}</span>
          <span style={{ ...DATA, fontSize: "9px", color: "rgba(255,255,255,0.14)" }}>│</span>
          {href ? (
            <a href={href} target="_blank" rel="noreferrer" style={{
              ...DATA, fontSize: "11px", color: "var(--text-secondary)", flex: 1,
              textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              transition: "color 120ms",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--accent-purple)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; }}>
              {val}
            </a>
          ) : (
            <span style={{ ...DATA, fontSize: "11px", color: "var(--text-secondary)", flex: 1 }}>{val}</span>
          )}
          <button onClick={() => copy(val, key)} style={{
            ...DATA, fontSize: "9px", letterSpacing: "0.08em",
            color: copied === key ? "#3EFF8B" : "var(--text-muted)",
            background: "none", border: "none", cursor: "pointer",
            padding: "2px 6px", flexShrink: 0,
            transition: "color 150ms",
          }}>
            {copied === key ? "COPIED" : "COPY"}
          </button>
        </div>
      ))}

      {/* CTA */}
      <a href={`mailto:${resume.email}`} style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        marginTop: 18, padding: "11px 20px",
        background: "rgba(122,92,255,0.08)",
        border: "1px solid rgba(122,92,255,0.25)",
        borderRadius: 4,
        ...DATA, fontSize: "11px", color: "var(--accent-purple)",
        letterSpacing: "0.12em", textDecoration: "none",
        transition: "background 150ms, border-color 150ms",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "rgba(122,92,255,0.15)";
        e.currentTarget.style.borderColor = "rgba(122,92,255,0.45)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "rgba(122,92,255,0.08)";
        e.currentTarget.style.borderColor = "rgba(122,92,255,0.25)";
      }}>
        OPEN CHANNEL →
      </a>
    </div>
  );
}

// ── SOCIAL panel — FREQUENCY_BANDS ───────────────────────────────────────────
const SOCIAL_LINKS = [
  { key: "GITHUB",    url: exp.social.github,    handle: exp.social.github?.split("github.com/")[1],         color: "#F0F0F0" },
  { key: "LINKEDIN",  url: exp.social.linkedin,  handle: exp.social.linkedin?.split("linkedin.com/in/")[1]?.replace("/",""), color: "#0A84FF" },
  { key: "DRIBBBLE",  url: exp.social.dribbble,  handle: exp.social.dribbble?.split("dribbble.com/")[1],     color: "#FF3B30" },
  { key: "BEHANCE",   url: exp.social.behance,   handle: exp.social.behance?.split("behance.net/")[1],       color: "#0A84FF" },
  { key: "INSTAGRAM", url: exp.social.instagram, handle: exp.social.instagram?.split("instagram.com/")[1]?.replace("/",""), color: "#F5A623" },
  { key: "YOUTUBE",   url: exp.social.youtube,   handle: "Channel",                                          color: "#FF3B30" },
  { key: "SPOTIFY",   url: exp.social.spotify,   handle: "Listening",                                        color: "#3EFF8B" },
].filter(l => l.url);

function SocialPanel() {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ padding: "22px 26px" }}>
      <div style={{ ...LABEL, marginBottom: 16 }}>SIGNAL.FREQ — {SOCIAL_LINKS.length} CHANNELS</div>

      {SOCIAL_LINKS.map(({ key, url, handle, color }) => {
        const bars = seedBars(key);
        const isHot = hovered === key;

        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => setHovered(key)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: "flex", alignItems: "center",
              padding: "10px 14px", marginBottom: 6,
              background: isHot ? `${color}08` : "var(--bg-surface)",
              border: `1px solid ${isHot ? color + "44" : "var(--border-hairline)"}`,
              borderRadius: 3, textDecoration: "none",
              gap: 16, transition: "border-color 150ms, background 150ms",
            }}
          >
            {/* Platform name */}
            <span style={{
              ...MONO, fontSize: "11px", color: isHot ? color : "var(--text-secondary)",
              minWidth: 88, letterSpacing: "0.06em",
              transition: "color 150ms",
            }}>
              {key}
            </span>

            {/* Frequency bars */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, flex: 1 }}>
              {bars.map((h, bi) => (
                <div key={bi} style={{
                  width: 3, height: isHot ? h + 3 : h,
                  background: color,
                  opacity: isHot ? 0.75 : 0.18,
                  borderRadius: 1,
                  transition: `height ${80 + bi * 12}ms ease, opacity 200ms`,
                }} />
              ))}
            </div>

            {/* Handle */}
            <span style={{ ...DATA, fontSize: "10px", color: isHot ? "var(--text-secondary)" : "var(--text-muted)", transition: "color 150ms" }}>
              {handle}
            </span>
          </a>
        );
      })}
    </div>
  );
}

// ── SIH panel ────────────────────────────────────────────────────────────────
const SIH_TEAM = [
  { name: "Ayush Sharma",      img: sihAyush     },
  { name: "Divyanshu Kaushik", img: sihDivyanshu },
  { name: "Abhishek Dubey",    img: sihAbhishek  },
  { name: "Shrishti Gupta",    img: sihShrishti  },
  { name: "Sahaj Ghatiya",     img: sihChull     },
];

function SIHPanel() {
  return (
    <div style={{ padding: "22px 26px", overflowY: "auto" }}>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        style={{ marginBottom: "28px" }}
      >
        <div style={{ ...DATA, fontSize: "9px", color: "var(--accent-amber)", letterSpacing: "0.22em", marginBottom: "6px" }}>
          WINNER — SMART INDIA HACKATHON 2022 · SOFTWARE EDITION
        </div>
        <div style={{ ...DISPLAY, fontSize: "22px", color: "var(--text-primary)", fontWeight: 500, letterSpacing: "-0.02em", marginBottom: "4px" }}>
          Team Envision Alpha
        </div>
        <div style={{ ...BODY, fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          Ministry of Education · AICTE Problem Statement · 36-hour sprint
        </div>
      </motion.div>

      {/* Main image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{
          borderRadius: "4px",
          overflow: "hidden",
          border: "1px solid var(--border-subtle)",
          marginBottom: "28px",
          background: "var(--bg-surface)",
        }}
      >
        <img src={sihMain} alt="SIH" style={{ width: "100%", display: "block" }} />
      </motion.div>

      {/* Problem statement */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ ...LABEL, marginBottom: "10px" }}>PROBLEM_STATEMENT</div>
        <div style={{
          borderLeft: "2px solid var(--accent-amber)",
          paddingLeft: "14px",
          ...BODY, fontSize: "12px",
          color: "var(--text-secondary)",
          lineHeight: "1.7",
        }}>
          Currently in AICTE, Event/Activity Management happens manually — booking of meeting rooms,
          communication via email/SMS, canteen arrangements, social media updates, and report generation.
          This manual process causes delays. The goal was to build a unified portal to automate all
          AICTE event workflows and increase operational efficiency.
        </div>
      </div>

      {/* Solution */}
      <div style={{ marginBottom: "28px", display: "flex", alignItems: "flex-start", gap: "18px" }}>
        <img src={sihEA} alt="Envision Alpha" style={{ width: "72px", flexShrink: 0, opacity: 0.88 }} />
        <div>
          <div style={{ ...LABEL, marginBottom: "8px" }}>OUR_SOLUTION</div>
          <div style={{ ...BODY, fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.65" }}>
            Built a full-stack AICTE Event Management Portal — room booking, mass communication,
            canteen automation, social media scheduler, and real-time reporting — all in one platform.
            Stack: React, Node.js, MongoDB, AWS.
          </div>
        </div>
      </div>

      {/* Team */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ ...LABEL, marginBottom: "14px" }}>TEAM_MEMBERS</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          {SIH_TEAM.map((m) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                width: "80px",
              }}
            >
              <div style={{
                width: "56px", height: "56px", borderRadius: "50%",
                background: "var(--bg-overlay)",
                border: "1px solid var(--border-subtle)",
                overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <img src={m.img} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <span style={{ ...DATA, fontSize: "9px", color: "var(--text-secondary)", textAlign: "center", lineHeight: 1.3 }}>
                {m.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Media */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ ...LABEL, marginBottom: "10px" }}>MEDIA_COVERAGE</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {[sihMedia1, sihMedia2].map((src, i) => (
            <div key={i} style={{
              borderRadius: "3px", overflow: "hidden",
              border: "1px solid var(--border-subtle)",
              background: "var(--bg-surface)",
            }}>
              <img src={src} alt={`media-${i}`} style={{ width: "100%", display: "block" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Certificate */}
      <div>
        <div style={{ ...LABEL, marginBottom: "10px" }}>CERTIFICATE</div>
        <div style={{
          borderRadius: "4px", overflow: "hidden",
          border: "1px solid var(--border-subtle)",
          background: "var(--bg-surface)",
        }}>
          <img src={sihCert} alt="SIH Certificate" style={{ width: "100%", display: "block" }} />
        </div>
      </div>

    </div>
  );
}

// ── Panel map ────────────────────────────────────────────────────────────────
const PANELS = {
  about: AboutPanel, skills: SkillsPanel, experience: ExperiencePanel,
  projects: ProjectsPanel, certs: CertsPanel, sih: SIHPanel,
  contact: ContactPanel, social: SocialPanel,
};

// ── Main Archive ─────────────────────────────────────────────────────────────
export default function Archive() {
  const [active, setActive]     = useState("about");
  const [openFolders, setOpenF] = useState({ system: true, work: true, reach: true });

  const Panel      = PANELS[active] || AboutPanel;
  const folderPath = FOLDER_OF[active] || "";
  const breadcrumb = `nocturne://archive/${folderPath}/${ITEM_LABEL[active] || active}`;

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>

      {/* ── Left sidebar ── */}
      <div style={{
        width: 188, minWidth: 188,
        borderRight: "1px solid var(--border-hairline)",
        background: "var(--bg-surface)",
        display: "flex", flexDirection: "column",
        overflowY: "auto", scrollbarWidth: "none",
      }}>
        <div style={{
          padding: "11px 14px 9px",
          borderBottom: "1px solid var(--border-hairline)",
          ...DATA, fontSize: "9px", color: "var(--text-muted)", letterSpacing: "0.18em",
          flexShrink: 0,
        }}>
          ARCHIVE.SYS
        </div>

        <div style={{ flex: 1, paddingTop: 6 }}>
          {TREE.map(group => (
            <div key={group.id}>
              <div
                onClick={() => setOpenF(o => ({ ...o, [group.id]: !o[group.id] }))}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 14px", cursor: "pointer", userSelect: "none" }}
              >
                <span style={{
                  ...DATA, fontSize: "8px", color: "rgba(255,255,255,0.20)",
                  display: "inline-block", transition: "transform 140ms",
                  transform: openFolders[group.id] ? "rotate(90deg)" : "none",
                }}>▶</span>
                <span style={{ ...DATA, fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.05em" }}>
                  {group.label}
                </span>
              </div>

              <AnimatePresence initial={false}>
                {openFolders[group.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.14 }}
                    style={{ overflow: "hidden" }}
                  >
                    {group.children.map(item => {
                      const isActive = active === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setActive(item.id)}
                          style={{
                            padding: "5px 14px 5px 28px", cursor: "pointer", userSelect: "none",
                            background: isActive ? "rgba(122,92,255,0.08)" : "transparent",
                            borderLeft: isActive ? "2px solid var(--accent-purple)" : "2px solid transparent",
                            transition: "background 100ms",
                          }}
                        >
                          <span style={{
                            ...DATA, fontSize: "11px", letterSpacing: "0.02em",
                            color: isActive ? "var(--accent-purple)" : "var(--text-secondary)",
                          }}>
                            {item.label}
                          </span>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Breadcrumb */}
        <div style={{
          padding: "7px 20px",
          borderBottom: "1px solid var(--border-hairline)",
          ...DATA, fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.04em",
          flexShrink: 0,
        }}>
          {breadcrumb}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.14 }}
            >
              <Panel />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
