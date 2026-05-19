import { useState } from "react";

export default function WindowControls({ onClose, onMinimize, onFullscreen, isFullscreen }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ display: "flex", gap: "6px", alignItems: "center" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Close — red */}
      <div
        onClick={onClose}
        title="Close"
        style={{
          width: "10px", height: "10px", borderRadius: "50%",
          background: hovered ? "#FF3B30" : "rgba(255,255,255,0.12)",
          cursor: "pointer",
          transition: "background 150ms",
          flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {hovered && (
          <svg width="5" height="5" viewBox="0 0 5 5" fill="none">
            <path d="M1 1L4 4M4 1L1 4" stroke="rgba(0,0,0,0.55)" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        )}
      </div>

      {/* Minimize — amber */}
      <div
        onClick={onMinimize}
        title="Minimize"
        style={{
          width: "10px", height: "10px", borderRadius: "50%",
          background: hovered ? "#F5A623" : "rgba(255,255,255,0.12)",
          cursor: "pointer",
          transition: "background 150ms",
          flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {hovered && (
          <svg width="6" height="2" viewBox="0 0 6 2" fill="none">
            <line x1="0.5" y1="1" x2="5.5" y2="1" stroke="rgba(0,0,0,0.55)" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        )}
      </div>

      {/* Fullscreen — green */}
      <div
        onClick={onFullscreen}
        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        style={{
          width: "10px", height: "10px", borderRadius: "50%",
          background: hovered ? "#3EFF8B" : "rgba(255,255,255,0.12)",
          cursor: "pointer",
          transition: "background 150ms",
          flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {hovered && (
          isFullscreen ? (
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
              <path d="M2 1L1 1L1 2M4 1L5 1L5 2M4 5L5 5L5 4M2 5L1 5L1 4" stroke="rgba(0,0,0,0.55)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
              <path d="M1 2.5L1 1L2.5 1M3.5 1L5 1L5 2.5M5 3.5L5 5L3.5 5M2.5 5L1 5L1 3.5" stroke="rgba(0,0,0,0.55)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )
        )}
      </div>
    </div>
  );
}
