import React from "react";
import mainData from "../../Data/main.json";

const resume = mainData?.resume ?? {};

const SECTION_LABEL = {
  fontFamily: "var(--font-data)", fontSize: 9,
  color: "var(--accent-red)", letterSpacing: "0.12em",
  marginBottom: 10,
};

const ENTRY_TITLE = {
  fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 500,
  color: "var(--text-primary)", marginBottom: 2,
};

const ENTRY_META = {
  fontFamily: "var(--font-data)", fontSize: 9,
  color: "var(--text-muted)", letterSpacing: "0.06em",
  marginBottom: 4,
};

const ENTRY_DESC = {
  fontFamily: "var(--font-ui)", fontSize: 11, lineHeight: 1.6,
  color: "var(--text-secondary)", margin: 0,
};

const DIVIDER = {
  height: 1, background: "var(--border-hairline)",
  margin: "20px 0",
};

export default function ResumeApp() {
  const pdfUrl = resume.thisresume;

  return (
    <div style={{ padding: "16px 16px 80px" }}>
      {/* Download button */}
      {pdfUrl && (
        <a
          href={pdfUrl}
          download
          target="_blank"
          rel="noreferrer"
          style={{
            display: "block", width: "100%", boxSizing: "border-box",
            textAlign: "center",
            fontFamily: "var(--font-data)", fontSize: 9, letterSpacing: "0.12em",
            color: "var(--text-secondary)",
            border: "1px solid var(--border-default)",
            padding: "12px", borderRadius: 4,
            textDecoration: "none", marginBottom: 24,
          }}
        >
          DOWNLOAD PDF ↓
        </a>
      )}

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontFamily: "var(--font-display)", fontSize: 18,
          color: "var(--text-primary)", letterSpacing: "-0.01em", marginBottom: 4,
        }}>
          {resume.name}
        </div>
        <div style={{
          fontFamily: "var(--font-data)", fontSize: 9,
          color: "var(--text-muted)", letterSpacing: "0.08em",
        }}>
          {resume.subheading}
        </div>
      </div>

      <div style={DIVIDER} />

      {/* Experience */}
      {resume.experience?.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={SECTION_LABEL}>EXPERIENCE</div>
          {resume.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={ENTRY_TITLE}>{exp.position}</div>
              <div style={ENTRY_META}>{exp.name} · {exp.duration}</div>
              <p style={ENTRY_DESC}>{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      <div style={DIVIDER} />

      {/* Education */}
      {resume.education?.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={SECTION_LABEL}>EDUCATION</div>
          {resume.education.map((edu, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={ENTRY_TITLE}>{edu.degree || edu.school}</div>
              <div style={ENTRY_META}>{edu.school || edu.location} · {edu.duration}</div>
              {edu.description && <p style={ENTRY_DESC}>{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      <div style={DIVIDER} />

      {/* Awards */}
      {resume.awards?.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={SECTION_LABEL}>AWARDS</div>
          {resume.awards.map((award, i) => (
            <div key={i} style={{
              fontFamily: "var(--font-ui)", fontSize: 12,
              color: "var(--text-secondary)", lineHeight: 1.5,
              borderLeft: "2px solid var(--accent-amber)",
              paddingLeft: 10, marginBottom: 8,
            }}>
              {award}
            </div>
          ))}
        </div>
      )}

      <div style={DIVIDER} />

      {/* Skills */}
      {resume.skills?.length > 0 && (
        <div>
          <div style={SECTION_LABEL}>SKILLS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {resume.skills.map((skill, i) => (
              <span key={i} style={{
                fontFamily: "var(--font-data)", fontSize: 9,
                color: "var(--text-secondary)", letterSpacing: "0.05em",
                border: "1px solid var(--border-hairline)",
                padding: "3px 8px", borderRadius: 3,
              }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
