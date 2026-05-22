import React from "react";
import { motion } from "framer-motion";

const SPRING = { type: "spring", stiffness: 400, damping: 34, mass: 0.8 };

const WORK_APPS = [
  { id: "archive", label: "ARCHIVE", color: "#8A8A8A", status: "5 sect." },
  { id: "arena",   label: "ARENA",   color: "#FF3B30", status: "11 proj." },
  { id: "resume",  label: "RESUME",  color: "#8A8A8A", status: "cv · pdf" },
];

const CONNECT_APPS = [
  { id: "studio", label: "STUDIO", color: "#7A5CFF", status: "music" },
  { id: "signal", label: "SIGNAL", color: "#F5A623", status: "● ready" },
];

function AppTile({ app, onLaunch }) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={() => onLaunch(app.id)}
      style={{
        background: "var(--bg-elevated)",
        border: `1px solid rgba(255,255,255,0.08)`,
        borderTop: `2px solid ${app.color}`,
        borderRadius: 5,
        padding: "12px 8px 10px",
        display: "flex", flexDirection: "column", alignItems: "center",
        cursor: "pointer", width: "100%",
        fontFamily: "var(--font-data)",
      }}
    >
      <span style={{ fontSize: 8, color: "var(--text-secondary)", letterSpacing: "0.08em" }}>
        {app.label}
      </span>
      <span style={{ fontSize: 7, color: "var(--text-muted)", letterSpacing: "0.06em", marginTop: 3 }}>
        {app.status}
      </span>
    </motion.button>
  );
}

export default function LauncherSheet({
  onClose, onLaunchApp,
  nowPlaying, playing, onPlayPause, onOpenStudio,
}) {
  const handleDragEnd = (_, info) => {
    if (info.offset.y > 80) onClose();
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={SPRING}
      drag="y"
      dragConstraints={{ top: 0 }}
      dragElastic={0.12}
      onDragEnd={handleDragEnd}
      style={{
        position: "fixed", left: 0, right: 0, bottom: 0,
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-subtle)",
        borderRadius: "16px 16px 0 0",
        zIndex: 15,
        display: "flex", flexDirection: "column",
        maxHeight: "80vh",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* Drag handle */}
      <div style={{
        display: "flex", justifyContent: "center", padding: "12px 0 8px",
        flexShrink: 0, cursor: "grab",
      }}>
        <div style={{
          width: 22, height: 3,
          background: "var(--border-default)", borderRadius: 2,
        }} />
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 16px" }}>
        {/* WORK group */}
        <div style={{
          fontFamily: "var(--font-data)", fontSize: 8,
          color: "var(--text-muted)", letterSpacing: "0.14em",
          marginBottom: 8, marginTop: 4,
        }}>
          WORK
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8,
          marginBottom: 16,
        }}>
          {WORK_APPS.map(app => (
            <AppTile key={app.id} app={app} onLaunch={onLaunchApp} />
          ))}
        </div>

        {/* CONNECT group */}
        <div style={{
          fontFamily: "var(--font-data)", fontSize: 8,
          color: "var(--text-muted)", letterSpacing: "0.14em",
          marginBottom: 8,
        }}>
          CONNECT
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
          marginBottom: 8,
        }}>
          {CONNECT_APPS.map(app => (
            <AppTile key={app.id} app={app} onLaunch={onLaunchApp} />
          ))}
        </div>
      </div>

      {/* Now-playing bar (pinned at bottom, only when nowPlaying is set) */}
      {nowPlaying && (
        <div
          style={{
            flexShrink: 0,
            borderTop: "1px solid rgba(122,92,255,0.2)",
            background: "var(--bg-elevated)",
            display: "flex", alignItems: "center",
            padding: "8px 16px",
            gap: 10, cursor: "pointer",
          }}
          onClick={onOpenStudio}
        >
          <div style={{
            width: 20, height: 20, borderRadius: "50%",
            background: "var(--bg-void)",
            backgroundImage: `url(${nowPlaying.art || nowPlaying.album_art})`,
            backgroundSize: "cover", backgroundPosition: "center",
            flexShrink: 0,
          }} />
          <span style={{
            flex: 1, fontFamily: "var(--font-data)", fontSize: 9,
            color: "var(--text-secondary)", overflow: "hidden",
            textOverflow: "ellipsis", whiteSpace: "nowrap",
            letterSpacing: "0.05em",
          }}>
            {nowPlaying.name}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onPlayPause(); }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "var(--font-data)", fontSize: 14,
              color: "rgba(122,92,255,0.8)", padding: "4px 6px",
            }}
          >
            {playing ? "⏸" : "▶"}
          </button>
        </div>
      )}
    </motion.div>
  );
}
