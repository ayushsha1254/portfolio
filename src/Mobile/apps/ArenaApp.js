import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import mainData from "../../Data/main.json";

const projects = mainData.explorer.projects;

function ProjectLinks({ project }) {
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
      {project.github && (
        <a href={project.github} target="_blank" rel="noreferrer" style={{
          fontFamily: "var(--font-data)", fontSize: 8, color: "var(--text-secondary)",
          border: "1px solid var(--border-default)", padding: "5px 10px",
          borderRadius: 3, textDecoration: "none", letterSpacing: "0.08em",
        }}>GITHUB ↗</a>
      )}
      {project.link && (
        <a href={project.link} target="_blank" rel="noreferrer" style={{
          fontFamily: "var(--font-data)", fontSize: 8, color: "var(--text-secondary)",
          border: "1px solid var(--border-default)", padding: "5px 10px",
          borderRadius: 3, textDecoration: "none", letterSpacing: "0.08em",
        }}>LIVE ↗</a>
      )}
    </div>
  );
}

// ── FEATURED tab ──────────────────────────────────────────────────────────────
function FeaturedTab() {
  const featured = projects[0];
  return (
    <div style={{ padding: "16px 16px 80px" }}>
      <div style={{
        width: "100%",
        background: `linear-gradient(135deg, ${featured.color || "#FF3B30"}18 0%, transparent 60%)`,
        border: `1px solid ${featured.color || "#FF3B30"}28`,
        borderTop: `3px solid ${featured.color || "#FF3B30"}`,
        borderRadius: 8, padding: "20px 16px",
        marginBottom: 16,
      }}>
        <div style={{
          fontFamily: "var(--font-display)", fontSize: 20,
          color: "var(--text-primary)", marginBottom: 6,
          letterSpacing: "-0.02em",
        }}>
          {featured.name}
        </div>
        <div style={{
          fontFamily: "var(--font-data)", fontSize: 8,
          color: "var(--text-muted)", letterSpacing: "0.08em", marginBottom: 12,
        }}>
          {featured.tagline}
        </div>
        <p style={{
          fontFamily: "var(--font-ui)", fontSize: 12, lineHeight: 1.6,
          color: "var(--text-secondary)", margin: "0 0 12px",
        }}>
          {featured.description}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 4 }}>
          {(featured.stack || []).map(tag => (
            <span key={tag} style={{
              fontFamily: "var(--font-data)", fontSize: 8,
              color: "var(--text-muted)", letterSpacing: "0.05em",
              border: "1px solid var(--border-hairline)", borderRadius: 2,
              padding: "2px 6px",
            }}>{tag}</span>
          ))}
        </div>
        <ProjectLinks project={featured} />
      </div>
    </div>
  );
}

// ── ALL tab ───────────────────────────────────────────────────────────────────
function AllTab() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={{ padding: "16px 16px 80px" }}>
      {projects.map((p, i) => (
        <div key={p.name} style={{ marginBottom: 8 }}>
          <motion.button
            onClick={() => setExpanded(expanded === i ? null : i)}
            whileTap={{ opacity: 0.8 }}
            style={{
              width: "100%",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-hairline)",
              borderLeft: `2px solid ${p.color || "var(--border-default)"}`,
              borderRadius: "0 4px 4px 0",
              padding: "10px 12px",
              display: "flex", alignItems: "center",
              gap: 10, cursor: "pointer", textAlign: "left",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: "var(--font-display)", fontSize: 13,
                color: "var(--text-primary)", fontWeight: 500,
              }}>
                {p.name}
              </div>
              <div style={{
                fontFamily: "var(--font-data)", fontSize: 8,
                color: "var(--text-muted)", marginTop: 3, letterSpacing: "0.06em",
              }}>
                {(p.stack || []).slice(0, 4).join(" · ")}
              </div>
            </div>
            <span style={{
              fontFamily: "var(--font-data)", fontSize: 12,
              color: "var(--text-muted)",
            }}>↗</span>
          </motion.button>

          <AnimatePresence>
            {expanded === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: "hidden" }}
              >
                <div style={{
                  background: "var(--bg-elevated)",
                  borderLeft: `2px solid ${p.color || "var(--border-default)"}`,
                  borderBottom: "1px solid var(--border-hairline)",
                  borderRight: "1px solid var(--border-hairline)",
                  padding: "10px 12px 12px",
                }}>
                  <p style={{
                    fontFamily: "var(--font-ui)", fontSize: 11, lineHeight: 1.6,
                    color: "var(--text-secondary)", margin: "0 0 10px",
                  }}>
                    {p.description}
                  </p>
                  <ProjectLinks project={p} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default function ArenaApp({ tab }) {
  if (tab === "ALL") return <AllTab />;
  return <FeaturedTab />;
}
