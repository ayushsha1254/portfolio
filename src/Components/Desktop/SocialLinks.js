import { useState } from "react";

const SOCIALS = [
  {
    id: "github",
    label: "github",
    sub: "ayushsha1254",
    url: "https://github.com/ayushsha1254",
    accent: "rgba(255,255,255,0.82)",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
      </svg>
    ),
  },
  {
    id: "linkedin",
    label: "linkedin",
    sub: "ayushconnect",
    url: "https://www.linkedin.com/in/ayushconnect/",
    accent: "rgba(10,102,194,0.90)",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    id: "dribbble",
    label: "dribbble",
    sub: "ayush12_dng",
    url: "https://dribbble.com/ayush12_dng",
    accent: "rgba(234,76,137,0.85)",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.952-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.017-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4.006-.816zm-11.62-2.073c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.18zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z"/>
      </svg>
    ),
  },
  {
    id: "behance",
    label: "behance",
    sub: "ayushsharma40",
    url: "https://www.behance.net/ayushsharma40",
    accent: "rgba(0,87,255,0.85)",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029H23.7zM15.866 13h5.369c-.133-1.414-.727-2.019-2.668-2.019-1.969 0-2.519.761-2.701 2.019zM8 11.079c2.391.33 4 1.48 4 4.014C12 18.333 9.447 19 7.5 19H0V5h7.5c1.946 0 4.5.699 4.5 3.793 0 1.967-.957 2.938-4 3.286zm-5.5 4.921h4c1.656 0 2.5-.711 2.5-2s-.844-2-2.5-2h-4v4zm0-7h3.5c1.148 0 2.5-.5 2.5-1.75S8.148 5.5 7 5.5H2.5v3.5z"/>
      </svg>
    ),
  },
];

export default function SocialLinks() {
  const [hovered, setHovered] = useState(null);

  return (
    <div
      style={{
        position: "fixed",
        left: "28px",
        top: "300px",
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
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(62,255,139,0.55)" }} />
        <span style={{
          fontFamily: "var(--font-data)",
          fontSize: "9px",
          color: "rgba(255,255,255,0.22)",
          letterSpacing: "0.14em",
        }}>
          CONNECT
        </span>
        <div style={{ flex: 1 }} />
        <span style={{
          fontFamily: "var(--font-data)",
          fontSize: "8px",
          color: "rgba(62,255,139,0.40)",
          letterSpacing: "0.08em",
        }}>
          ONLINE
        </span>
      </div>

      {/* Social rows */}
      <div style={{ padding: "6px 0 6px" }}>
        {SOCIALS.map(({ id, label, sub, url, accent, icon }) => {
          const isHov = hovered === id;
          return (
            <a
              key={id}
              href={url}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "7px 12px",
                textDecoration: "none",
                background: isHov ? "rgba(255,255,255,0.04)" : "transparent",
                transition: "background 120ms",
                cursor: "pointer",
              }}
            >
              {/* Platform icon */}
              <div style={{
                width: "26px",
                height: "26px",
                borderRadius: "5px",
                background: isHov ? "rgba(255,255,255,0.07)" : "var(--bg-elevated)",
                border: `1px solid ${isHov ? accent : "var(--border-hairline)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: isHov ? accent : "rgba(255,255,255,0.35)",
                transition: "border-color 150ms, color 150ms",
              }}>
                {icon}
              </div>

              {/* Labels */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: "var(--font-data)",
                  fontSize: "10px",
                  color: isHov ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.55)",
                  letterSpacing: "0.04em",
                  transition: "color 150ms",
                }}>
                  {label}
                </div>
                <div style={{
                  fontFamily: "var(--font-data)",
                  fontSize: "8.5px",
                  color: isHov ? accent : "rgba(255,255,255,0.22)",
                  letterSpacing: "0.02em",
                  marginTop: "1px",
                  transition: "color 150ms",
                }}>
                  {sub}
                </div>
              </div>

              {/* Arrow */}
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" style={{ flexShrink: 0, opacity: isHov ? 0.65 : 0.18, transition: "opacity 150ms" }}>
                <path d="M1.5 7.5L7.5 1.5M7.5 1.5H2.5M7.5 1.5V6.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          );
        })}
      </div>
    </div>
  );
}
