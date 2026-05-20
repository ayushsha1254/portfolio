import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import data from "../Data/main.json";

const r = data?.resume ?? {};
const certs = data?.explorer?.certifications ?? [];

// ── Helpers ────────────────────────────────────────────────────────────────────
function Section({ label, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      style={{ marginBottom: "48px" }}
    >
      <div style={{
        display: "flex", alignItems: "center", gap: "12px",
        marginBottom: "20px",
      }}>
        <span style={{
          fontFamily: "var(--font-data)",
          fontSize: "9px",
          color: "var(--accent-red)",
          letterSpacing: "0.22em",
        }}>
          {label}
        </span>
        <div style={{ flex: 1, height: "1px", background: "var(--border-hairline)" }} />
      </div>
      {children}
    </motion.section>
  );
}

function Entry({ title, sub, meta, description }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr auto",
      gap: "2px 16px",
      marginBottom: "24px",
      paddingBottom: "24px",
      borderBottom: "1px solid var(--border-hairline)",
    }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "14px", color: "var(--text-primary)", fontWeight: 500 }}>
        {title}
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)", textAlign: "right", whiteSpace: "nowrap" }}>
        {meta}
      </div>
      {sub && (
        <div style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--accent-purple)", letterSpacing: "0.06em", gridColumn: "1" }}>
          {sub}
        </div>
      )}
      {description && (
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: "13px",
          color: "var(--text-secondary)", lineHeight: "1.65",
          marginTop: "8px", gridColumn: "1 / -1",
        }}>
          {description}
        </div>
      )}
    </div>
  );
}

function SkillChip({ label }) {
  return (
    <span style={{
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      color: "var(--text-secondary)",
      background: "var(--bg-overlay)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "3px",
      padding: "3px 10px",
      display: "inline-block",
    }}>
      {label}
    </span>
  );
}

// ── Download ───────────────────────────────────────────────────────────────────
async function downloadResume() {
  try {
    const res  = await fetch(r.thisresume);
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "Ayush-Sharma-Resume.pdf";
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  } catch {
    window.open(r.thisresume, "_blank");
  }
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function Resume({ windowed = false }) {
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);

  // Esc → back (only in route mode)
  useEffect(() => {
    if (windowed) return;
    const h = (e) => { if (e.key === "Escape") navigate("/"); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [navigate, windowed]);

  const handleDownload = async () => {
    setDownloading(true);
    await downloadResume();
    setTimeout(() => setDownloading(false), 1200);
  };

  return (
    <div style={{
      position: windowed ? "relative" : "fixed",
      inset: windowed ? "auto" : 0,
      width: "100%", height: "100%",
      background: windowed ? "var(--bg-elevated)" : "var(--bg-base)",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
    }}>

      {/* ── Top bar (route mode only) ── */}
      {!windowed && (
      <div style={{
        height: "36px", flexShrink: 0,
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-hairline)",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)" }}>nocturne://</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-secondary)" }}>resume</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)" }}>/</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-primary)" }}>ayush-sharma</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <motion.button
            onClick={handleDownload}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            style={{
              fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.08em",
              color: downloading ? "var(--accent-green)" : "var(--text-secondary)",
              background: "transparent",
              border: `1px solid ${downloading ? "var(--accent-green)" : "var(--border-subtle)"}`,
              borderRadius: "3px", padding: "4px 12px", cursor: "pointer",
              transition: "color 0.2s, border-color 0.2s",
            }}
          >
            {downloading ? "DOWNLOADING_" : "↓ DOWNLOAD_"}
          </motion.button>
          <motion.button
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
            style={{
              fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)",
              background: "transparent", border: "1px solid var(--border-hairline)",
              borderRadius: "3px", padding: "4px 12px", cursor: "pointer",
            }}
          >
            ← BACK_
          </motion.button>
        </div>
      </div>
      )}

      {/* ── Scrollable content ── */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "48px 0 80px",
      }}>
        <div style={{ width: "min(760px, 90vw)", margin: "0 auto" }}>

          {/* Windowed mode download strip */}
          {windowed && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "24px" }}>
              <motion.button
                onClick={handleDownload}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{
                  fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.08em",
                  color: downloading ? "var(--accent-green)" : "var(--text-secondary)",
                  background: "transparent",
                  border: `1px solid ${downloading ? "var(--accent-green)" : "var(--border-subtle)"}`,
                  borderRadius: "3px", padding: "4px 14px", cursor: "pointer",
                  transition: "color 0.2s, border-color 0.2s",
                }}
              >
                {downloading ? "DOWNLOADING_" : "↓ DOWNLOAD_"}
              </motion.button>
            </div>
          )}

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            style={{ marginBottom: "48px" }}
          >
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 5vw, 52px)",
              color: "var(--text-primary)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "8px",
            }}>
              {r.name}
            </div>
            <div style={{
              fontFamily: "var(--font-data)",
              fontSize: "11px",
              color: "var(--accent-purple)",
              letterSpacing: "0.14em",
              marginBottom: "20px",
            }}>
              {r.subheading?.toUpperCase()}
            </div>

            {/* Contact strip */}
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px 20px",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--text-secondary)",
              marginBottom: "24px",
            }}>
              {r.email    && <a href={`mailto:${r.email}`}    style={{ color: "inherit", textDecoration: "none" }}>✉ {r.email}</a>}
              {r.phone    && <span>✆ {r.phone}</span>}
              {r.location && <span>⌖ {r.location}</span>}
              {r.github   && <a href={r.github}   target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}>↗ {r.github.replace("https://","")}</a>}
              {r.linkedin && <a href={r.linkedin} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}>↗ {r.linkedin.replace("https://","")}</a>}
            </div>

            <div style={{ height: "1px", background: "var(--border-subtle)" }} />
          </motion.div>

          {/* About */}
          {r.description && (
            <Section label="ABOUT">
              <p style={{
                fontFamily: "var(--font-ui)",
                fontSize: "14px",
                color: "var(--text-secondary)",
                lineHeight: "1.7",
                margin: 0,
              }}>
                {r.description}
              </p>
            </Section>
          )}

          {/* Experience */}
          {r.experience?.length > 0 && (
            <Section label="EXPERIENCE">
              {r.experience.map((exp, i) => (
                <Entry
                  key={i}
                  title={exp.name}
                  sub={exp.position}
                  meta={exp.duration}
                  description={exp.description}
                />
              ))}
            </Section>
          )}

          {/* Education */}
          {r.education?.length > 0 && (
            <Section label="EDUCATION">
              {r.education.map((ed, i) => (
                <Entry
                  key={i}
                  title={ed.school || ed.name}
                  sub={ed.degree}
                  meta={ed.duration}
                  description={ed.description}
                />
              ))}
            </Section>
          )}

          {/* Skills */}
          {r.skills?.length > 0 && (
            <Section label="SKILLS">
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {r.skills.map((s, i) => <SkillChip key={i} label={s.trim()} />)}
              </div>
            </Section>
          )}

          {/* Certifications */}
          {certs.length > 0 && (
            <Section label="CERTIFICATIONS">
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {certs.map((c, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    fontFamily: "var(--font-ui)", fontSize: "13px", color: "var(--text-secondary)",
                    borderBottom: "1px solid var(--border-hairline)", paddingBottom: "10px",
                  }}>
                    <span style={{ color: "var(--accent-green)", fontSize: "10px" }}>✓</span>
                    {c.name}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Awards */}
          {r.awards?.length > 0 && (
            <Section label="AWARDS">
              {r.awards.map((a, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  fontFamily: "var(--font-ui)", fontSize: "13px", color: "var(--text-secondary)",
                  marginBottom: "10px",
                }}>
                  <span style={{ color: "var(--accent-amber)", fontSize: "12px" }}>◆</span>
                  {a}
                </div>
              ))}
            </Section>
          )}

          {/* Languages + Soft Skills */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 48px" }}>
            {r.languages?.length > 0 && (
              <Section label="LANGUAGES">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {r.languages.map((l, i) => <SkillChip key={i} label={l} />)}
                </div>
              </Section>
            )}
            {r.softskills?.length > 0 && (
              <Section label="INTERESTS">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {r.softskills.map((s, i) => <SkillChip key={i} label={s} />)}
                </div>
              </Section>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
