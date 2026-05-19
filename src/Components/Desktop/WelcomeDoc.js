import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const PHOTO = "https://aaruush22-bucket.s3.ap-south-1.amazonaws.com/temp/profile-image-76dbc7bf.webp";

const BIO = [
  "Builds interfaces that move and systems that ship. Full-stack developer and visual engineer at Finmo — writing real-time payment infrastructure by day, crafting OS-grade UI experiments by night.",
  "B.Tech CSE, SRM Institute of Science and Technology, 2024. SIH '22 winner. Core developer and organiser at Team Envision, Aaruush.",
  "When the compiler idles: FL Studio is open and the DAW clock is running.",
];

const SKILLS = [
  { cat: "CODE",     tags: ["C++", "Python", "C", "JavaScript"] },
  { cat: "FRONTEND", tags: ["React", "HTML5", "CSS3", "Tailwind", "Bootstrap"] },
  { cat: "BACKEND",  tags: ["Node.js", "Express", "MySQL", "GraphQL"] },
  { cat: "CLOUD",    tags: ["AWS", "S3", "Docker"] },
  { cat: "DESIGN",   tags: ["Figma", "Photoshop", "Illustrator", "Lightroom"] },
  { cat: "AUDIO",    tags: ["FL Studio", "Adobe Audition"] },
];

const EXPERIENCE = [
  { role: "Full Stack Developer",  org: "Finmo",                  period: "2022 – Present",   current: true },
  { role: "Organiser / Developer", org: "Team Envision, Aaruush", period: "08/2021 – Present"              },
  { role: "UI Designer",           org: "Qalara",                 period: "02/2022 – 07/2022"              },
  { role: "Product Designer",      org: "BN Productions",         period: "10/2021 – 05/2022"              },
  { role: "UI/UX Designer",        org: "Krane Apps",             period: "10/2021 – 05/2022"              },
];

const EDUCATION = [
  { degree: "B.Tech, Computer Science",  school: "SRM Institute of Science and Technology", period: "2020 – 2024", note: "CGPA 8.40" },
  { degree: "Senior Secondary, PCM",     school: "Central Academy, Alwar",                  period: "2018 – 2020"                     },
];

const TERM_LINES = [
  { key: "profile",  val: "loading ayush_sharma…", delay: 0    },
  { key: "role",     val: "full_stack_developer",  delay: 180  },
  { key: "org",      val: "finmo",                 delay: 340  },
  { key: "stack",    val: "react · node · aws",    delay: 500  },
  { key: "skills",   val: "19 entries",            delay: 660  },
  { key: "projects", val: "11 indexed",            delay: 820  },
  { key: "certs",    val: "2 confirmed",           delay: 980  },
  { key: "awards",   val: "sih_22 — winner",       delay: 1140 },
  { key: "status",   val: "● online",              delay: 1300, green: true },
];

const SOCIALS = [
  { label: "github",   url: "https://github.com/ayushsha1254"            },
  { label: "linkedin", url: "https://www.linkedin.com/in/ayushconnect/"  },
  { label: "dribbble", url: "https://dribbble.com/ayush12_dng"           },
  { label: "behance",  url: "https://www.behance.net/ayushsharma40"      },
];

function SectionHead({ title }) {
  return (
    <div style={{ marginTop: "26px", marginBottom: "13px" }}>
      <div style={{ fontFamily: "var(--font-data)", fontSize: "8.5px", color: "var(--accent-red)", letterSpacing: "0.18em", marginBottom: "6px" }}>
        {title}
      </div>
      <div style={{ height: "1px", background: "rgba(255,59,48,0.15)" }} />
    </div>
  );
}

// Pure content component — rendered inside <Window> in Globe.js
export default function WelcomeDoc() {
  const [visibleLines, setVisibleLines] = useState(0);

  // Starts on mount (Window handles open/close via AnimatePresence)
  useEffect(() => {
    const timers = TERM_LINES.map((_, i) =>
      setTimeout(() => setVisibleLines(i + 1), TERM_LINES[i].delay + 300)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

      {/* ── Fake editor toolbar ── */}
      <div style={{
        height: "27px",
        background: "var(--bg-elevated)",
        borderBottom: "1px solid var(--border-hairline)",
        display: "flex",
        alignItems: "center",
        padding: "0 14px",
        flexShrink: 0,
        userSelect: "none",
      }}>
        {["File", "Edit", "View", "Insert", "Format"].map((item) => (
          <span key={item} style={{
            fontFamily: "var(--font-data)", fontSize: "10px",
            color: "rgba(255,255,255,0.24)", letterSpacing: "0.04em",
            padding: "0 8px", cursor: "default",
          }}>
            {item}
          </span>
        ))}
        <div style={{ width: "1px", height: "11px", background: "var(--border-hairline)", margin: "0 8px" }} />
        {[
          { label: "B", weight: 600, fs: "normal",  deco: "none"      },
          { label: "I", weight: 400, fs: "italic",  deco: "none"      },
          { label: "U", weight: 400, fs: "normal",  deco: "underline" },
        ].map(({ label, weight, fs, deco }) => (
          <span key={label} style={{
            fontFamily: "var(--font-mono)", fontSize: "11px",
            fontWeight: weight, fontStyle: fs, textDecoration: deco,
            color: "rgba(255,255,255,0.20)", padding: "0 6px", cursor: "default",
          }}>
            {label}
          </span>
        ))}
        <div style={{ width: "1px", height: "11px", background: "var(--border-hairline)", margin: "0 8px" }} />
        <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "rgba(255,255,255,0.16)", cursor: "default" }}>100%</span>
        <div style={{ flex: 1 }} />
        <span style={{
          fontFamily: "var(--font-data)", fontSize: "8.5px",
          color: "rgba(62,255,139,0.45)", letterSpacing: "0.10em",
          border: "1px solid rgba(62,255,139,0.15)", borderRadius: "2px", padding: "1px 6px",
        }}>
          READ ONLY
        </span>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

        {/* Left: Document panel */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px 36px", scrollbarWidth: "none" }}>

          {/* Header */}
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
            <img
              src={PHOTO}
              alt="Ayush Sharma"
              style={{ width: "80px", height: "80px", borderRadius: "4px", objectFit: "cover", border: "1px solid var(--border-subtle)", flexShrink: 0 }}
            />
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "22px", fontWeight: 400, color: "rgba(255,255,255,0.94)", letterSpacing: "-0.015em", lineHeight: 1.1 }}>
                Ayush Sharma
              </div>
              <div style={{ fontFamily: "var(--font-data)", fontSize: "11px", color: "var(--accent-red)", letterSpacing: "0.08em", marginTop: "7px" }}>
                Full Stack Developer · Finmo
              </div>
              <div style={{ fontFamily: "var(--font-data)", fontSize: "9.5px", color: "rgba(255,255,255,0.32)", letterSpacing: "0.06em", marginTop: "3px" }}>
                Chennai, Tamil Nadu · India
              </div>
              <div style={{ display: "flex", gap: "5px", marginTop: "10px", flexWrap: "wrap" }}>
                {["SIH '22 Winner", "B.Tech CSE", "SRM 2024"].map((tag) => (
                  <span key={tag} style={{
                    fontFamily: "var(--font-data)", fontSize: "8px",
                    color: "rgba(255,255,255,0.36)", border: "1px solid var(--border-subtle)",
                    borderRadius: "2px", padding: "2px 6px", letterSpacing: "0.06em",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <SectionHead title="ABOUT" />
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {BIO.map((para, i) => (
              <p key={i} style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: "11.5px", lineHeight: 1.78, color: "rgba(255,255,255,0.60)", letterSpacing: "0.01em" }}>
                {para}
              </p>
            ))}
          </div>

          <SectionHead title="SKILLS" />
          <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
            {SKILLS.map(({ cat, tags }) => (
              <div key={cat} style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "8px", color: "rgba(255,255,255,0.20)", letterSpacing: "0.12em", minWidth: "54px", flexShrink: 0 }}>
                  {cat}
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {tags.map((tag) => (
                    <span key={tag} style={{
                      fontFamily: "var(--font-data)", fontSize: "9px",
                      color: "rgba(255,255,255,0.65)", border: "1px solid var(--border-subtle)",
                      borderRadius: "2px", padding: "2px 7px", letterSpacing: "0.03em",
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <SectionHead title="EXPERIENCE" />
          <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
            {EXPERIENCE.map((exp) => (
              <div key={`${exp.org}-${exp.role}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: exp.current ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.68)", display: "flex", alignItems: "center", gap: "8px" }}>
                    {exp.role}
                    {exp.current && (
                      <span style={{ fontFamily: "var(--font-data)", fontSize: "7.5px", color: "rgba(62,255,139,0.65)", border: "1px solid rgba(62,255,139,0.18)", borderRadius: "2px", padding: "1px 5px", letterSpacing: "0.10em" }}>
                        CURRENT
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: "var(--font-data)", fontSize: "9.5px", color: "rgba(255,255,255,0.32)", marginTop: "2px", letterSpacing: "0.04em" }}>
                    {exp.org}
                  </div>
                </div>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "rgba(255,255,255,0.20)", flexShrink: 0, marginLeft: "12px" }}>
                  {exp.period}
                </span>
              </div>
            ))}
          </div>

          <SectionHead title="EDUCATION" />
          <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
            {EDUCATION.map((edu) => (
              <div key={edu.school} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "rgba(255,255,255,0.75)", display: "flex", alignItems: "center", gap: "8px" }}>
                    {edu.degree}
                    {edu.note && <span style={{ fontFamily: "var(--font-data)", fontSize: "8px", color: "rgba(255,255,255,0.26)", letterSpacing: "0.06em" }}>{edu.note}</span>}
                  </div>
                  <div style={{ fontFamily: "var(--font-data)", fontSize: "9.5px", color: "rgba(255,255,255,0.30)", marginTop: "2px", letterSpacing: "0.04em" }}>
                    {edu.school}
                  </div>
                </div>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "rgba(255,255,255,0.20)", flexShrink: 0, marginLeft: "12px" }}>
                  {edu.period}
                </span>
              </div>
            ))}
          </div>

          <SectionHead title="AWARDS" />
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "var(--font-mono)", fontSize: "11px", color: "rgba(255,255,255,0.70)", marginBottom: "8px" }}>
            <span style={{ fontFamily: "var(--font-data)", fontSize: "8px", color: "rgba(245,166,35,0.75)", border: "1px solid rgba(245,166,35,0.20)", borderRadius: "2px", padding: "2px 5px", letterSpacing: "0.08em", flexShrink: 0 }}>
              WINNER
            </span>
            Smart India Hackathon 2022 — Software Edition
          </div>

        </div>

        {/* Right: Terminal panel */}
        <div style={{ width: "210px", flexShrink: 0, borderLeft: "1px solid var(--border-hairline)", background: "var(--bg-void)", display: "flex", flexDirection: "column", overflow: "hidden" }}>

          <div style={{ padding: "9px 14px 8px", borderBottom: "1px solid var(--border-hairline)", fontFamily: "var(--font-data)", fontSize: "8.5px", color: "rgba(255,255,255,0.16)", letterSpacing: "0.16em", userSelect: "none" }}>
            TERMINAL
          </div>

          <div style={{ flex: 1, padding: "12px 14px 10px", overflowY: "auto", scrollbarWidth: "none" }}>
            {TERM_LINES.slice(0, visibleLines).map((line) => (
              <div key={line.key} style={{ display: "flex", gap: "8px", marginBottom: "9px", fontFamily: "var(--font-data)", fontSize: "9.5px", lineHeight: 1.3 }}>
                <span style={{ color: "rgba(255,255,255,0.20)", minWidth: "54px", flexShrink: 0, letterSpacing: "0.04em" }}>
                  {line.key}
                </span>
                <span style={{ color: line.green ? "rgba(62,255,139,0.80)" : "rgba(255,255,255,0.60)", letterSpacing: "0.02em" }}>
                  {line.val}
                </span>
              </div>
            ))}
            {visibleLines < TERM_LINES.length && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
                style={{ fontFamily: "var(--font-data)", fontSize: "9.5px", color: "rgba(255,255,255,0.28)" }}
              >
                _
              </motion.span>
            )}
          </div>

          <div style={{ borderTop: "1px solid var(--border-hairline)", padding: "10px 14px 14px", flexShrink: 0, userSelect: "none" }}>
            <div style={{ fontFamily: "var(--font-data)", fontSize: "8.5px", color: "rgba(255,255,255,0.14)", letterSpacing: "0.16em", marginBottom: "9px" }}>
              CONNECT
            </div>
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer"
                style={{ display: "block", fontFamily: "var(--font-data)", fontSize: "9.5px", color: "rgba(255,255,255,0.36)", letterSpacing: "0.05em", marginBottom: "6px", textDecoration: "none", transition: "color 140ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.80)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.36)")}
              >
                › {s.label}
              </a>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
