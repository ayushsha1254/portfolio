import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import mainData from "../Data/main.json";

const DAYS   = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

function formatUptime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

const PROJECTS_COUNT = mainData?.explorer?.projects?.length ?? 0;
const SECTIONS_COUNT = Object.keys(mainData?.explorer ?? {}).length;

const VITALS = [
  { label: "ARCHIVE", key: "archive", color: "var(--accent-purple)" },
  { label: "ARENA",   key: "arena",   color: "var(--accent-red)" },
  { label: "SIGNAL",  key: "signal",  color: "var(--accent-green)" },
  { label: "UPTIME",  key: "uptime",  color: "var(--accent-amber)" },
];

export default function AmbientHome({
  nowPlaying, playing, dimmed,
  onOpenStudio, onOpenLauncher,
}) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [uptime, setUptime] = useState("0s");
  const startRef = useRef(Date.now());
  const touchStartY = useRef(null);

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      const h = n.getHours().toString().padStart(2, "0");
      const m = n.getMinutes().toString().padStart(2, "0");
      setTime(`${h}:${m}`);
      setDate(`${DAYS[n.getDay()]} · ${n.getDate()} ${MONTHS[n.getMonth()]} ${n.getFullYear()}`);
      setUptime(formatUptime(Date.now() - startRef.current));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartY.current === null) return;
    const delta = touchStartY.current - e.changedTouches[0].clientY;
    if (delta > 50) onOpenLauncher();
    touchStartY.current = null;
  };

  const vitalValues = {
    archive: `${SECTIONS_COUNT} sect.`,
    arena:   `${PROJECTS_COUNT} proj.`,
    signal:  "● READY",
    uptime,
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "var(--bg-void)",
        display: "flex", flexDirection: "column",
        alignItems: "center",
        filter: dimmed ? "blur(6px)" : "none",
        opacity: dimmed ? 0.45 : 1,
        transition: "filter 0.25s, opacity 0.25s",
        overflow: "hidden",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Ambient radial glow */}
      <div style={{
        position: "absolute", top: "5%", left: "50%",
        transform: "translateX(-50%)",
        width: 320, height: 320, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(122,92,255,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* ── TOP ZONE: system id + clock + date ── */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        paddingTop: "18vh", width: "100%",
      }}>
        <div style={{
          fontFamily: "var(--font-data)", fontSize: 8,
          color: "var(--text-muted)", letterSpacing: "0.28em",
          marginBottom: 20,
        }}>
          NOCTURNE_OS
        </div>

        <div style={{
          fontFamily: "var(--font-display)", fontSize: 76, fontWeight: 200,
          color: "var(--text-primary)", letterSpacing: "-0.04em",
          lineHeight: 1,
        }}>
          {time}
        </div>

        <div style={{
          fontFamily: "var(--font-data)", fontSize: 11,
          color: "var(--text-secondary)", letterSpacing: "0.14em",
          marginTop: 10,
        }}>
          {date}
        </div>
      </div>

      {/* ── MIDDLE ZONE: now-playing + vitals ── */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        marginTop: "auto",
        paddingBottom: 80,
        width: "100%", paddingLeft: 24, paddingRight: 24,
        boxSizing: "border-box",
      }}>
        {/* Now-playing pill */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 480, damping: 32 }}
          onClick={onOpenStudio}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            height: 40, padding: "0 14px",
            border: "1px solid rgba(122,92,255,0.25)",
            borderRadius: 20, cursor: "pointer",
            background: "rgba(122,92,255,0.05)",
            marginBottom: 16, maxWidth: 260,
          }}
        >
          {nowPlaying ? (
            <>
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                background: "var(--bg-elevated)",
                backgroundImage: `url(${nowPlaying.art || nowPlaying.album_art})`,
                backgroundSize: "cover", backgroundPosition: "center",
                flexShrink: 0, border: "1px solid rgba(122,92,255,0.2)",
              }} />
              <span style={{
                fontFamily: "var(--font-data)", fontSize: 9,
                color: "var(--text-secondary)", letterSpacing: "0.06em",
                maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis",
                whiteSpace: "nowrap", flex: 1,
              }}>
                {nowPlaying.name}
              </span>
              <span style={{
                fontFamily: "var(--font-data)", fontSize: 9,
                color: playing ? "var(--accent-purple)" : "var(--text-muted)",
              }}>
                {playing ? "▶" : "▐▐"}
              </span>
            </>
          ) : (
            <span style={{
              fontFamily: "var(--font-data)", fontSize: 9,
              color: "var(--text-muted)", letterSpacing: "0.10em",
            }}>
              NO SIGNAL
            </span>
          )}
        </motion.div>

        {/* Vitals 2×2 grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 8, width: "100%",
        }}>
          {VITALS.map(({ label, key, color }) => (
            <div key={label} style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-hairline)",
              borderTop: `1.5px solid ${color}`,
              borderRadius: "0 0 6px 6px",
              padding: "10px 12px",
            }}>
              <div style={{
                fontFamily: "var(--font-data)", fontSize: 7,
                color: "var(--text-muted)", letterSpacing: "0.14em",
                marginBottom: 4,
              }}>
                {label}
              </div>
              <div style={{
                fontFamily: "var(--font-data)", fontSize: 11,
                color, letterSpacing: "0.04em",
              }}>
                {vitalValues[key]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM: swipe handle ─────────────── */}
      <div
        onClick={onOpenLauncher}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: 64,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 5, cursor: "pointer",
        }}
      >
        <div style={{
          width: 28, height: 2,
          background: "var(--border-default)", borderRadius: 2,
        }} />
        <span style={{
          fontFamily: "var(--font-data)", fontSize: 7,
          color: "var(--text-muted)", letterSpacing: "0.18em",
        }}>
          LAUNCH
        </span>
      </div>
    </div>
  );
}
