import { useState } from "react";

const BTN_BASE = {
  width: "10px", height: "10px", borderRadius: "50%",
  cursor: "pointer", transition: "background 150ms",
  flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
  border: "none", padding: 0, outline: "none",
};

export default function WindowControls({ onClose, onMinimize, onFullscreen, isFullscreen }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ display: "flex", gap: "6px", alignItems: "center" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={onClose}
        aria-label="Close window"
        style={{ ...BTN_BASE, background: hovered ? "#FF3B30" : "rgba(255,255,255,0.12)" }}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        {hovered && (
          <svg width="5" height="5" viewBox="0 0 5 5" fill="none" aria-hidden="true">
            <path d="M1 1L4 4M4 1L1 4" stroke="rgba(0,0,0,0.55)" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      <button
        onClick={onMinimize}
        aria-label="Minimize window"
        style={{ ...BTN_BASE, background: hovered ? "#F5A623" : "rgba(255,255,255,0.12)" }}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        {hovered && (
          <svg width="6" height="2" viewBox="0 0 6 2" fill="none" aria-hidden="true">
            <line x1="0.5" y1="1" x2="5.5" y2="1" stroke="rgba(0,0,0,0.55)" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      <button
        onClick={onFullscreen}
        aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        style={{ ...BTN_BASE, background: hovered ? "#3EFF8B" : "rgba(255,255,255,0.12)" }}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        {hovered && (
          isFullscreen ? (
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none" aria-hidden="true">
              <path d="M2 1L1 1L1 2M4 1L5 1L5 2M4 5L5 5L5 4M2 5L1 5L1 4" stroke="rgba(0,0,0,0.55)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none" aria-hidden="true">
              <path d="M1 2.5L1 1L2.5 1M3.5 1L5 1L5 2.5M5 3.5L5 5L3.5 5M2.5 5L1 5L1 3.5" stroke="rgba(0,0,0,0.55)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )
        )}
      </button>
    </div>
  );
}
