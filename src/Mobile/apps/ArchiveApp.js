import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import mainData from "../../Data/main.json";

const { about, skills, projects, certifications } = mainData.explorer;

const CAT_COLOR = {
  Frontend:      "var(--accent-purple)",
  Backend:       "var(--accent-green)",
  Programming:   "var(--accent-green)",
  Cloud:         "var(--accent-blue)",
  VCS:           "var(--accent-amber)",
  Utility:       "var(--accent-amber)",
  Design:        "var(--accent-red)",
  "Soft Skills": "var(--text-secondary)",
};

// ── ABOUT tab ────────────────────────────────────────────────────────────────
function AboutTab() {
  const topSkills = skills.slice(0, 8);
  return (
    <div style={{ padding: "16px 16px 80px" }}>
      <p style={{
        fontFamily: "var(--font-ui)", fontSize: 13, lineHeight: 1.7,
        color: "var(--text-secondary)", margin: 0, marginBottom: 20,
      }}>
        {about.about}
      </p>
      <div style={{
        display: "flex", gap: 16, marginBottom: 20,
        fontFamily: "var(--font-data)",
      }}>
        {[
          { label: "ROLE",   value: "Developer" },
          { label: "LOC",    value: "Chennai" },
          { label: "EXP",    value: "4+ yrs" },
        ].map(({ label, value }) => (
          <div key={label}>
            <div style={{ fontSize: 7, color: "var(--text-muted)", letterSpacing: "0.12em" }}>{label}</div>
            <div style={{ fontSize: 11, color: "var(--text-primary)", fontWeight: 500, marginTop: 2 }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {topSkills.map(skill => {
          const cat = skill.category[0];
          const col = CAT_COLOR[cat] || "var(--text-secondary)";
          return (
            <span key={skill.name} style={{
              fontFamily: "var(--font-data)", fontSize: 9,
              color: col, padding: "3px 8px",
              border: `1px solid ${col}44`,
              background: `${col}0d`,
              borderRadius: 3, letterSpacing: "0.05em",
            }}>
              {skill.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ── SKILLS tab ────────────────────────────────────────────────────────────────
function SkillsTab() {
  const byCategory = skills.reduce((acc, s) => {
    const cat = s.category[0] || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div style={{ padding: "16px 16px 80px" }}>
      {Object.entries(byCategory).map(([cat, items]) => {
        const col = CAT_COLOR[cat] || "var(--text-secondary)";
        return (
          <div key={cat} style={{ marginBottom: 20 }}>
            <div style={{
              fontFamily: "var(--font-data)", fontSize: 8,
              color: "var(--text-muted)", letterSpacing: "0.14em",
              marginBottom: 8,
            }}>
              {cat.toUpperCase()}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {items.map(skill => (
                <span key={skill.name} style={{
                  fontFamily: "var(--font-data)", fontSize: 9,
                  color: col, padding: "4px 9px",
                  border: `1px solid ${col}44`,
                  background: `${col}0d`,
                  borderRadius: 3, letterSpacing: "0.05em",
                }}>
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── PROJECTS tab ─────────────────────────────────────────────────────────────
function ProjectsTab() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={{ padding: "16px 16px 80px" }}>
      {projects.map((p, i) => (
        <div key={p.name} style={{ marginBottom: 8 }}>
          <motion.button
            onClick={() => setExpanded(expanded === i ? null : i)}
            style={{
              width: "100%", background: "var(--bg-elevated)",
              border: "1px solid var(--border-hairline)",
              borderLeft: `2px solid ${p.color || "var(--border-default)"}`,
              borderRadius: "0 4px 4px 0",
              padding: "10px 12px",
              display: "flex", alignItems: "center",
              gap: 10, cursor: "pointer",
              textAlign: "left",
            }}
            whileTap={{ opacity: 0.8 }}
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
                color: "var(--text-muted)", marginTop: 3,
                letterSpacing: "0.06em",
              }}>
                {(p.stack || []).slice(0, 4).join(" · ")}
              </div>
            </div>
            <span style={{
              fontFamily: "var(--font-data)", fontSize: 10,
              color: "var(--text-muted)",
              transform: expanded === i ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
              display: "inline-block",
            }}>›</span>
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
                    color: "var(--text-secondary)", margin: "0 0 12px",
                  }}>
                    {p.description}
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    {p.github && (
                      <a href={p.github} target="_blank" rel="noreferrer" style={{
                        fontFamily: "var(--font-data)", fontSize: 8,
                        color: "var(--text-secondary)", letterSpacing: "0.08em",
                        border: "1px solid var(--border-default)",
                        padding: "5px 10px", borderRadius: 3,
                        textDecoration: "none",
                      }}>
                        GITHUB ↗
                      </a>
                    )}
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noreferrer" style={{
                        fontFamily: "var(--font-data)", fontSize: 8,
                        color: "var(--text-secondary)", letterSpacing: "0.08em",
                        border: "1px solid var(--border-default)",
                        padding: "5px 10px", borderRadius: 3,
                        textDecoration: "none",
                      }}>
                        LIVE ↗
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

// ── CERTS tab ─────────────────────────────────────────────────────────────────
function CertsTab() {
  const [selectedCert, setSelectedCert] = useState(null);

  return (
    <div style={{ padding: "16px 16px 80px" }}>
      {certifications.map((cert, i) => (
        <motion.button
          key={i}
          onClick={() => setSelectedCert(cert)}
          whileTap={{ opacity: 0.8 }}
          style={{
            width: "100%", background: "var(--bg-elevated)",
            border: "1px solid var(--border-hairline)",
            borderRadius: 4, padding: "12px 14px",
            display: "flex", flexDirection: "column", alignItems: "flex-start",
            cursor: "pointer", marginBottom: 8, textAlign: "left",
          }}
        >
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 12,
            color: "var(--text-primary)", marginBottom: 4,
          }}>
            {cert.name}
          </div>
          <div style={{
            fontFamily: "var(--font-data)", fontSize: 8,
            color: "var(--text-muted)", letterSpacing: "0.06em",
          }}>
            {cert.issuer?.name} · {cert.date}
          </div>
        </motion.button>
      ))}

      {/* Cert detail bottom sheet */}
      <AnimatePresence>
        {selectedCert && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
              style={{
                position: "fixed", inset: 0,
                background: "rgba(0,0,0,0.6)", zIndex: 40,
              }}
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              style={{
                position: "fixed", left: 0, right: 0, bottom: 0,
                background: "var(--bg-surface)",
                borderRadius: "14px 14px 0 0",
                padding: "20px 20px",
                paddingBottom: "calc(24px + env(safe-area-inset-bottom))",
                zIndex: 41,
              }}
            >
              <div style={{
                width: 22, height: 3, background: "var(--border-default)",
                borderRadius: 2, margin: "0 auto 16px",
              }} />
              <div style={{
                fontFamily: "var(--font-ui)", fontSize: 14,
                color: "var(--text-primary)", marginBottom: 8, lineHeight: 1.4,
              }}>
                {selectedCert.name}
              </div>
              <div style={{
                fontFamily: "var(--font-data)", fontSize: 9,
                color: "var(--text-muted)", letterSpacing: "0.08em", marginBottom: 16,
              }}>
                {selectedCert.issuer?.name} · {selectedCert.date}
              </div>
              {selectedCert.link && (
                <a href={selectedCert.link} target="_blank" rel="noreferrer" style={{
                  display: "inline-block",
                  fontFamily: "var(--font-data)", fontSize: 9,
                  color: "var(--accent-purple)", letterSpacing: "0.08em",
                  border: "1px solid rgba(122,92,255,0.3)",
                  padding: "7px 14px", borderRadius: 3,
                  textDecoration: "none",
                }}>
                  VIEW CERTIFICATE ↗
                </a>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── SIH tab ───────────────────────────────────────────────────────────────────
function SIHTab() {
  const award = mainData.resume?.awards?.[0] || "Winner — Smart India Hackathon 2022";
  return (
    <div style={{ padding: "16px 16px 80px" }}>
      <div style={{
        width: "100%", height: 140,
        background: "linear-gradient(135deg, rgba(245,166,35,0.12) 0%, rgba(255,59,48,0.08) 100%)",
        border: "1px solid rgba(245,166,35,0.2)",
        borderRadius: 8,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 16,
      }}>
        <span style={{
          fontFamily: "var(--font-display)", fontSize: 20,
          color: "var(--accent-amber)", letterSpacing: "-0.01em",
        }}>
          SIH 2022
        </span>
      </div>

      <div style={{
        borderLeft: "2px solid var(--accent-amber)",
        padding: "12px 14px",
        background: "rgba(245,166,35,0.06)",
        borderRadius: "0 6px 6px 0",
        marginBottom: 16,
      }}>
        <div style={{
          fontFamily: "var(--font-data)", fontSize: 8,
          color: "var(--accent-amber)", letterSpacing: "0.12em", marginBottom: 6,
        }}>
          AWARD
        </div>
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 13,
          color: "var(--text-primary)", lineHeight: 1.5,
        }}>
          {award}
        </div>
      </div>

      <div style={{
        fontFamily: "var(--font-ui)", fontSize: 12, lineHeight: 1.6,
        color: "var(--text-secondary)",
      }}>
        Government of India national-level hackathon for students. Competed against
        thousands of teams across India. Category: Software.
      </div>
    </div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function ArchiveApp({ tab }) {
  switch (tab) {
    case "ABOUT":    return <AboutTab />;
    case "SKILLS":   return <SkillsTab />;
    case "PROJECTS": return <ProjectsTab />;
    case "CERTS":    return <CertsTab />;
    case "SIH":      return <SIHTab />;
    default:         return <AboutTab />;
  }
}
