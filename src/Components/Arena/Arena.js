import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import data from "../../Data/main.json";

const projects = data.explorer?.projects || [];

// ── helpers ───────────────────────────────────────────────────────────────────
function hexToRgb(hex) {
  if (!hex || hex.length < 7) return "122,92,255";
  return [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map((x) => parseInt(x, 16)).join(",");
}

function getStatus(p) {
  if (!p.link) return "ARCHIVED";
  return "LIVE";
}

function getYears(p) {
  const s = p.timeline?.start?.slice(0, 4);
  const e = p.timeline?.end?.slice(0, 4);
  if (!s) return "";
  return s === e ? s : `${s} – ${e}`;
}

const STATUS_COLOR = {
  LIVE:     "var(--accent-green)",
  WIP:      "var(--accent-amber)",
  ARCHIVED: "var(--text-muted)",
};

// ── StackChip ─────────────────────────────────────────────────────────────────
function StackChip({ tech, accent }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 7px",
      background: accent ? `rgba(${accent},0.08)` : "rgba(255,255,255,0.04)",
      border: `1px solid ${accent ? `rgba(${accent},0.18)` : "rgba(255,255,255,0.07)"}`,
      borderRadius: 2,
      fontFamily: "var(--font-data)",
      fontSize: 9,
      color: "var(--text-muted)",
      letterSpacing: "0.05em",
      whiteSpace: "nowrap",
    }}>
      {tech}
    </span>
  );
}

// ── ProjectCard ───────────────────────────────────────────────────────────────
function ProjectCard({ project, selected, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const rgb  = hexToRgb(project.color);
  const status = getStatus(project);
  const years  = getYears(project);
  const shown  = project.stack?.slice(0, 3) ?? [];
  const extra  = (project.stack?.length ?? 0) - shown.length;
  const isSelected = selected?.name === project.name;

  return (
    <motion.div
      layoutId={`arena-${project.name}`}
      onClick={() => onSelect(project)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      style={{
        position: "relative",
        height: 152,
        borderRadius: 5,
        overflow: "hidden",
        cursor: "pointer",
        border: `1px solid ${hovered ? `rgba(${rgb},0.38)` : "rgba(255,255,255,0.06)"}`,
        background: "var(--bg-surface)",
        boxShadow: hovered
          ? `0 0 28px rgba(${rgb},0.2), 0 8px 24px rgba(0,0,0,0.5)`
          : "0 2px 10px rgba(0,0,0,0.35)",
        visibility: isSelected ? "hidden" : "visible",
        transition: "box-shadow 250ms, border-color 250ms",
      }}
    >
      {/* Gallery background */}
      {project.gallery?.[0] && (
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${project.gallery[0]})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          opacity: hovered ? 0.2 : 0.07,
          filter: "blur(0.5px)",
          transition: "opacity 300ms",
        }} />
      )}

      {/* Ambient tint from project color */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 80% 60% at 50% 120%, rgba(${rgb},0.08) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Top accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 2,
        background: project.color || "var(--accent-purple)",
        opacity: hovered ? 1 : 0.55,
        transition: "opacity 250ms",
      }} />

      {/* Content */}
      <div style={{
        position: "relative",
        padding: "14px 14px 11px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}>
        <div>
          <div style={{
            fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 500,
            color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 3,
            lineHeight: 1.2,
          }}>
            {project.name}
          </div>
          <div style={{
            fontFamily: "var(--font-data)", fontSize: 10,
            color: "var(--text-secondary)", letterSpacing: "0.02em",
          }}>
            {project.tagline}
          </div>
        </div>

        <div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
            {shown.map((t) => <StackChip key={t} tech={t} />)}
            {extra > 0 && (
              <span style={{ fontFamily: "var(--font-data)", fontSize: 9, color: "var(--text-muted)", alignSelf: "center" }}>
                +{extra}
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{
                width: 5, height: 5, borderRadius: "50%",
                background: STATUS_COLOR[status],
                boxShadow: status === "LIVE" ? "0 0 4px rgba(62,255,139,0.6)" : "none",
              }} />
              <span style={{ fontFamily: "var(--font-data)", fontSize: 9, color: STATUS_COLOR[status], letterSpacing: "0.08em" }}>
                {status}
              </span>
            </div>
            <span style={{ fontFamily: "var(--font-data)", fontSize: 9, color: "var(--text-muted)" }}>
              {years}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── ProjectDetail ─────────────────────────────────────────────────────────────
function ProjectDetail({ project, onClose }) {
  const rgb    = hexToRgb(project.color);
  const status = getStatus(project);
  const years  = getYears(project);

  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.14 }}
      onClick={onClose}
      style={{
        position: "absolute", inset: 0,
        background: "rgba(5,5,5,0.72)",
        backdropFilter: "blur(2px)",
        zIndex: 10,
        padding: 14,
        display: "flex",
        boxSizing: "border-box",
      }}
    >
      <motion.div
        layoutId={`arena-${project.name}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          flex: 1,
          borderRadius: 6,
          background: "var(--bg-elevated)",
          border: `1px solid rgba(${rgb},0.28)`,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: `0 0 0 1px rgba(${rgb},0.12), 0 0 60px rgba(${rgb},0.18), 0 28px 56px rgba(0,0,0,0.85)`,
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div style={{ height: 2, background: project.color, flexShrink: 0 }} />

        {/* Breadcrumb bar */}
        <div style={{
          height: 36, display: "flex", alignItems: "center",
          padding: "0 14px", gap: 6,
          borderBottom: "1px solid var(--border-hairline)",
          background: "var(--bg-surface)", flexShrink: 0,
        }}>
          <button
            onClick={onClose}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-muted)", fontFamily: "var(--font-data)",
              fontSize: 9, letterSpacing: "0.08em", padding: 0,
              transition: "color 150ms",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6.5 2L3.5 5l3 3" />
            </svg>
            ARENA
          </button>
          <span style={{ fontFamily: "var(--font-data)", fontSize: 9, color: "var(--border-default)" }}>/</span>
          <span style={{ fontFamily: "var(--font-data)", fontSize: 9, color: "var(--text-secondary)", letterSpacing: "0.05em" }}>
            {project.name.toUpperCase()}
          </span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{
              width: 5, height: 5, borderRadius: "50%",
              background: STATUS_COLOR[status],
              boxShadow: status === "LIVE" ? "0 0 5px rgba(62,255,139,0.7)" : "none",
            }} />
            <span style={{ fontFamily: "var(--font-data)", fontSize: 9, color: STATUS_COLOR[status], letterSpacing: "0.08em" }}>
              {status}
            </span>
            {years && (
              <span style={{ fontFamily: "var(--font-data)", fontSize: 9, color: "var(--text-muted)", marginLeft: 6 }}>
                {years}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>

          {/* Gallery strip */}
          {project.gallery?.length > 0 && (
            <div style={{ padding: "14px 14px 0" }}>
              <div style={{
                display: "flex", gap: 8, overflowX: "auto",
                scrollbarWidth: "none", paddingBottom: 2,
              }}>
                {project.gallery.map((img, i) => (
                  <div key={i} style={{
                    width: 230, height: 138, borderRadius: 4,
                    overflow: "hidden", flexShrink: 0,
                    border: "1px solid rgba(255,255,255,0.06)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                  }}>
                    <img
                      src={img}
                      alt={`${project.name} screenshot ${i + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info block */}
          <div style={{ padding: "18px 20px 24px" }}>

            {/* Title + tagline */}
            <div style={{ marginBottom: 12 }}>
              <div style={{
                fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 500,
                color: "var(--text-primary)", letterSpacing: "-0.03em",
                lineHeight: 1.15, marginBottom: 4,
              }}>
                {project.name}
              </div>
              <div style={{
                fontFamily: "var(--font-data)", fontSize: 11,
                color: "var(--text-secondary)", letterSpacing: "0.03em",
              }}>
                {project.tagline}
              </div>
            </div>

            {/* Divider tinted to project color */}
            <div style={{ height: 1, background: `rgba(${rgb},0.2)`, marginBottom: 14 }} />

            {/* Description */}
            {project.description && (
              <p style={{
                fontFamily: "var(--font-body)", fontSize: 12,
                color: "var(--text-secondary)", lineHeight: 1.8,
                margin: "0 0 18px 0",
                borderLeft: `2px solid rgba(${rgb},0.38)`,
                paddingLeft: 12,
              }}>
                {project.description}
              </p>
            )}

            {/* Stack */}
            {project.stack?.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{
                  fontFamily: "var(--font-data)", fontSize: 8,
                  color: "var(--text-muted)", letterSpacing: "0.16em",
                  marginBottom: 8,
                }}>
                  STACK
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {project.stack.map((t) => <StackChip key={t} tech={t} accent={rgb} />)}
                </div>
              </div>
            )}

            {/* Links */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "7px 16px",
                    border: `1px solid rgba(${rgb},0.35)`,
                    borderRadius: 3,
                    background: `rgba(${rgb},0.07)`,
                    fontFamily: "var(--font-data)", fontSize: 10,
                    color: project.color,
                    letterSpacing: "0.06em",
                    textDecoration: "none",
                    transition: "all 150ms",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = `rgba(${rgb},0.14)`; e.currentTarget.style.borderColor = `rgba(${rgb},0.55)`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = `rgba(${rgb},0.07)`; e.currentTarget.style.borderColor = `rgba(${rgb},0.35)`; }}
                >
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 2h3v3M10 2L5 7" /><path d="M5 3H2v7h7V7" />
                  </svg>
                  LIVE SITE
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "7px 16px",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: 3, background: "transparent",
                    fontFamily: "var(--font-data)", fontSize: 10,
                    color: "var(--text-secondary)",
                    letterSpacing: "0.06em",
                    textDecoration: "none",
                    transition: "all 150ms",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-default)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                >
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  GITHUB
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Arena() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{
      width: "100%", height: "100%",
      background: "var(--bg-elevated)",
      display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden",
    }}>

      {/* Header */}
      <div style={{
        height: 36, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px",
        borderBottom: "1px solid var(--border-hairline)",
        background: "var(--bg-surface)",
        flexShrink: 0,
      }}>
        <span style={{ fontFamily: "var(--font-data)", fontSize: 8, color: "var(--text-muted)", letterSpacing: "0.16em" }}>
          ARENA.PROJECTS
        </span>
        <span style={{ fontFamily: "var(--font-data)", fontSize: 8, color: "var(--text-muted)", opacity: 0.5 }}>
          {projects.length} ENTRIES
        </span>
      </div>

      {/* Grid */}
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {projects.map((p) => (
            <ProjectCard
              key={p.name}
              project={p}
              selected={selected}
              onSelect={setSelected}
            />
          ))}
        </div>
      </div>

      {/* Detail overlay */}
      <AnimatePresence>
        {selected && (
          <ProjectDetail
            project={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
