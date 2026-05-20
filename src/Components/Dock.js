import React, { useRef, useLayoutEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleExplorer,
  toggleFinder,
  toggleTerminal,
  toggleBrowser,
  toggleStudio,
  toggleSignal,
  toggleResumeWin,
  setFocusedWindow,
  restoreWindow,
} from "../Utility/state/action";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import finderstyles from "./finder.module.css";
import { useActivity } from "../Utility/ActivityContext";

function TrayItem({ icon, label, active, onClick, id, mouseXPx }) {
  const ref = useRef(null);
  const centerXRef = useRef(9999); // large initial value → no lift before measurement
  const [isHovered, setIsHovered] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: "50%", y: "50%" });

  // Cache center X; update on resize
  useLayoutEffect(() => {
    const measure = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        centerXRef.current = rect.left + rect.width / 2;
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Cosine falloff over 120px radius, max 6px lift
  const dist = Math.abs(mouseXPx - centerXRef.current);
  const lift = dist < 120 ? Math.cos((dist / 120) * (Math.PI / 2)) * 6 : 0;

  const handleItemMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setGlowPos({
      x: `${((e.clientX - rect.left) / rect.width) * 100}%`,
      y: `${((e.clientY - rect.top) / rect.height) * 100}%`,
    });
  };

  return (
    <motion.div
      ref={ref}
      id={id}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleItemMouseMove}
      animate={{ y: -lift }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      role="button"
      aria-label={label}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "3px",
        cursor: "pointer",
        padding: "5px 18px",
      }}
    >
      {/* Glow knot — radial highlight that tracks cursor within item */}
      {isHovered && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle 32px at ${glowPos.x} ${glowPos.y}, rgba(255,255,255,0.07), transparent 70%)`,
            pointerEvents: "none",
            borderRadius: "4px",
          }}
        />
      )}

      {active && (
        <div style={{
          position: "absolute",
          top: 0,
          left: "30%",
          right: "30%",
          height: "1px",
          background: "var(--accent-red)",
        }} />
      )}

      <div style={{
        color: active ? "var(--accent-red)" : "var(--text-secondary)",
        transition: "color 150ms",
        display: "flex",
        alignItems: "center",
        position: "relative",
        zIndex: 1,
      }}>
        {icon}
      </div>
      <span style={{
        fontFamily: "var(--font-data)",
        fontSize: "9px",
        color: active ? "var(--text-secondary)" : "var(--text-muted)",
        letterSpacing: "0.1em",
        transition: "color 150ms",
        position: "relative",
        zIndex: 1,
      }}>
        {label}
      </span>
    </motion.div>
  );
}

const DIVIDER = (
  <div style={{
    width: "1px",
    height: "18px",
    background: "var(--border-subtle)",
    margin: "0 6px",
    alignSelf: "center",
  }} />
);

const TYPE_ACCENT = {
  terminal: "#3EFF8B",
  readme:   "#8A8A8A",
  void:     "#555555",
  signal:   "#F5A623",
  archive:  "#8A8A8A",
  studio:   "#7A5CFF",
  arena:    "#FF3B30",
};

function MinimizedBadge({ win, mouseXPx, onRestore }) {
  const ref = useRef(null);
  const centerXRef = useRef(9999);
  const [hovered, setHovered] = useState(false);

  useLayoutEffect(() => {
    const measure = () => {
      if (ref.current) {
        const r = ref.current.getBoundingClientRect();
        centerXRef.current = r.left + r.width / 2;
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const dist = Math.abs(mouseXPx - centerXRef.current);
  const lift = dist < 120 ? Math.cos((dist / 120) * (Math.PI / 2)) * 6 : 0;
  const accent = TYPE_ACCENT[win.type] || "#8A8A8A";

  return (
    <motion.div
      ref={ref}
      onClick={onRestore}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{ y: -lift }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "3px",
        cursor: "pointer",
        padding: "4px 10px",
      }}
    >
      {/* Mini window icon */}
      <div style={{
        width: "22px",
        height: "16px",
        borderRadius: "3px",
        background: "var(--bg-elevated)",
        border: `1px solid ${hovered ? accent : "rgba(255,255,255,0.14)"}`,
        position: "relative",
        overflow: "hidden",
        transition: "border-color 150ms",
        boxShadow: hovered ? `0 0 8px ${accent}44` : "none",
      }}>
        {/* Mini title bar */}
        <div style={{
          height: "4px",
          background: hovered ? accent : "rgba(255,255,255,0.10)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          transition: "background 150ms",
        }} />
        {/* Mini content */}
        <div style={{
          padding: "1px 2px",
          display: "flex",
          flexDirection: "column",
          gap: "1px",
        }}>
          {[0.4, 0.25, 0.35].map((op, i) => (
            <div key={i} style={{
              height: "1px",
              background: `rgba(255,255,255,${op})`,
              borderRadius: "1px",
            }} />
          ))}
        </div>
      </div>

      <span style={{
        fontFamily: "var(--font-data)",
        fontSize: "8px",
        color: hovered ? "var(--text-secondary)" : "var(--text-muted)",
        letterSpacing: "0.08em",
        transition: "color 150ms",
        maxWidth: "48px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}>
        {win.title}
      </span>
    </motion.div>
  );
}

function MinimizedStudioBadge({ win, nowPlaying, playing, mouseXPx, onRestore }) {
  const ref = useRef(null);
  const centerXRef = useRef(9999);
  const [hovered, setHovered] = useState(false);

  useLayoutEffect(() => {
    const measure = () => {
      if (ref.current) {
        const r = ref.current.getBoundingClientRect();
        centerXRef.current = r.left + r.width / 2;
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const dist = Math.abs(mouseXPx - centerXRef.current);
  const lift = dist < 120 ? Math.cos((dist / 120) * (Math.PI / 2)) * 6 : 0;

  const title = nowPlaying?.name
    ? (nowPlaying.name.length > 16 ? nowPlaying.name.slice(0, 16) + "…" : nowPlaying.name)
    : "studio.jack";

  const triggerPlay  = () => document.getElementById("music-play")?.click();
  const triggerPause = () => document.getElementById("music-pause")?.click();
  const triggerStop  = () => document.getElementById("music-stop")?.click();

  return (
    <motion.div
      ref={ref}
      animate={{ y: -lift }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 7,
        padding: "4px 10px", cursor: "default",
        background: hovered ? "rgba(122,92,255,0.08)" : "transparent",
        borderRadius: 4,
        border: `1px solid ${hovered ? "rgba(122,92,255,0.22)" : "transparent"}`,
        transition: "background 150ms, border-color 150ms",
      }}
    >
      {/* Album art circle — click restores window */}
      <div
        onClick={onRestore}
        style={{
          width: 20, height: 20, borderRadius: "50%", overflow: "hidden",
          border: "1px solid rgba(122,92,255,0.4)", flexShrink: 0,
          cursor: "pointer", boxShadow: playing ? "0 0 6px rgba(122,92,255,0.5)" : "none",
          transition: "box-shadow 300ms",
        }}
      >
        {nowPlaying?.art
          ? <img src={nowPlaying.art} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ width: "100%", height: "100%", background: "var(--bg-overlay)" }} />
        }
      </div>

      {/* Track title */}
      <span
        onClick={onRestore}
        style={{
          fontFamily: "var(--font-data)", fontSize: 9, color: "var(--text-secondary)",
          letterSpacing: "0.05em", whiteSpace: "nowrap", cursor: "pointer",
          maxWidth: 110,
        }}
      >
        {title}
      </span>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <button
          onClick={playing ? triggerPause : triggerPlay}
          title={playing ? "Pause" : "Play"}
          style={{
            width: 18, height: 18, borderRadius: 3, cursor: "pointer",
            background: "transparent", border: "1px solid var(--border-subtle)",
            color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 120ms",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-purple)"; e.currentTarget.style.color = "var(--accent-purple)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.color = "var(--text-muted)"; }}
        >
          {playing
            ? <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor"><rect x="1" y="1" width="2" height="6" rx="0.5"/><rect x="5" y="1" width="2" height="6" rx="0.5"/></svg>
            : <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor"><path d="M2 1.5l5 2.5-5 2.5V1.5z"/></svg>
          }
        </button>
        <button
          onClick={triggerStop}
          title="Stop"
          style={{
            width: 18, height: 18, borderRadius: 3, cursor: "pointer",
            background: "transparent", border: "1px solid var(--border-subtle)",
            color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 120ms",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-red)"; e.currentTarget.style.color = "var(--accent-red)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.color = "var(--text-muted)"; }}
        >
          <svg width="7" height="7" viewBox="0 0 7 7" fill="currentColor"><rect x="0.5" y="0.5" width="6" height="6" rx="0.5"/></svg>
        </button>
      </div>
    </motion.div>
  );
}

export default function Dock({ nowPlaying, playing, setPlayStatus, musicStop }) {
  const dispatch = useDispatch();
  const state = useSelector((s) => s);
  const minimizedWindows = useSelector((s) => s.minimizedWindows);
  const navigate = useNavigate();
  const { logEvent } = useActivity();

  const [mouseXPx, setMouseXPx] = useState(-1000);

  const handleDockMouseMove = useCallback((e) => {
    setMouseXPx(e.clientX);
  }, []);

  const handleDockMouseLeave = useCallback(() => {
    setMouseXPx(-1000);
  }, []);

  const handleExplorer = () => {
    if (state.finder) dispatch(toggleFinder());
    if (state.explorer) {
      logEvent("archive closed");
      const el = document.getElementById("explorer-exanded-main");
      if (el) {
        el.classList.remove("slide-in-bottom");
        el.classList.add("slide-out-bck-bottom");
        setTimeout(() => dispatch(toggleExplorer()), 500);
      } else {
        dispatch(toggleExplorer());
      }
    } else {
      logEvent("archive opened");
      dispatch(toggleExplorer());
    }
  };

  const handleTerminal = () => {
    if (state.terminal) {
      logEvent("console closed");
    } else {
      logEvent("console opened");
    }
    dispatch(toggleTerminal());
    if (state.finder) dispatch(toggleFinder());
    if (state.explorer) dispatch(toggleExplorer());
  };

  const handleFinder = () => {
    if (state.finder) {
      logEvent("browser closed");
      const el = document.querySelector("#finder");
      if (el) {
        el.classList.remove(finderstyles.modal);
        el.classList.add(finderstyles.modalClose);
        setTimeout(() => {
          dispatch(toggleFinder());
          el.classList.add(finderstyles.modal);
          el.classList.remove(finderstyles.modalClose);
        }, 400);
      } else {
        dispatch(toggleFinder());
      }
    } else {
      logEvent("browser opened");
      if (state.explorer) dispatch(toggleExplorer());
      dispatch(toggleFinder());
    }
  };

  const handleBrowser = () => {
    if (!state.browser) dispatch(setFocusedWindow("browser"));
    dispatch(toggleBrowser());
    logEvent(state.browser ? "browser closed" : "browser opened");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 }}
      onMouseMove={handleDockMouseMove}
      onMouseLeave={handleDockMouseLeave}
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "48px",
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-hairline)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0",
        zIndex: "var(--z-dock)",
      }}
    >
      <TrayItem
        id="explorerIcon"
        icon={<ArchiveIcon />}
        label="ARCHIVE"
        active={state.explorer}
        onClick={handleExplorer}
        mouseXPx={mouseXPx}
      />
      <TrayItem
        id="terminalIcon"
        icon={<ConsoleIcon />}
        label="CONSOLE"
        active={state.terminal}
        onClick={handleTerminal}
        mouseXPx={mouseXPx}
      />
      {DIVIDER}
      <TrayItem
        id="browserIcon"
        icon={<BrowserIcon />}
        label="BROWSER"
        active={state.browser}
        onClick={handleBrowser}
        mouseXPx={mouseXPx}
      />
      <TrayItem
        icon={<StudioIcon />}
        label="STUDIO"
        active={state.studio}
        onClick={() => {
          if (!state.studio) dispatch(setFocusedWindow("studio"));
          dispatch(toggleStudio());
        }}
        mouseXPx={mouseXPx}
      />
      <TrayItem
        icon={<SignalIcon />}
        label="SIGNAL"
        active={state.signal}
        onClick={() => {
          if (!state.signal) dispatch(setFocusedWindow("signal"));
          dispatch(toggleSignal());
        }}
        mouseXPx={mouseXPx}
      />
      <TrayItem
        icon={<ResumeIcon />}
        label="RESUME"
        active={state.resumeWin}
        onClick={() => {
          if (!state.resumeWin) dispatch(setFocusedWindow("resumeWin"));
          dispatch(toggleResumeWin());
        }}
        mouseXPx={mouseXPx}
      />

      {/* Minimized windows section */}
      {minimizedWindows.length > 0 && (
        <>
          {DIVIDER}
          {minimizedWindows.map((win) =>
            win.id === "studio" ? (
              <MinimizedStudioBadge
                key={win.id}
                win={win}
                nowPlaying={nowPlaying}
                playing={playing}
                mouseXPx={mouseXPx}
                onRestore={() => dispatch(restoreWindow(win.id))}
              />
            ) : (
              <MinimizedBadge
                key={win.id}
                win={win}
                mouseXPx={mouseXPx}
                onRestore={() => dispatch(restoreWindow(win.id))}
              />
            )
          )}
        </>
      )}
    </motion.div>
  );
}

function ArchiveIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="14" height="4" rx="1" />
      <rect x="2" y="8" width="14" height="8" rx="1" />
      <line x1="6" y1="4" x2="12" y2="4" />
      <line x1="6" y1="12" x2="12" y2="12" />
    </svg>
  );
}

function ConsoleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="14" height="12" rx="1.5" />
      <polyline points="5,7.5 8,10 5,12.5" />
      <line x1="10" y1="12.5" x2="14" y2="12.5" />
    </svg>
  );
}

function BrowserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="14" height="12" rx="1.5" />
      <line x1="2" y1="7.5" x2="16" y2="7.5" />
      <circle cx="5" cy="5.25" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="7.8" cy="5.25" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

function StudioIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <line x1="2"  y1="14" x2="2"  y2="16" />
      <line x1="5"  y1="10" x2="5"  y2="16" />
      <line x1="8"  y1="7"  x2="8"  y2="16" />
      <line x1="11" y1="11" x2="11" y2="16" />
      <line x1="14" y1="5"  x2="14" y2="16" />
      <line x1="17" y1="9"  x2="17" y2="16" />
    </svg>
  );
}

function SignalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 14c1.5-3 3.5-5 7-5s5.5 2 7 5" />
      <path d="M5 11c1-1.5 2.2-2.5 4-2.5s3 1 4 2.5" />
      <circle cx="9" cy="14.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ResumeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2h8l4 4v10a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" />
      <polyline points="12,2 12,6 16,6" />
      <line x1="6" y1="9.5"  x2="12" y2="9.5" />
      <line x1="6" y1="12.5" x2="10" y2="12.5" />
    </svg>
  );
}
