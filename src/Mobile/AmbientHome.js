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

  const layer = {
    filter: dimmed ? "blur(6px)" : "none",
    opacity: dimmed ? 0.45 : 1,
    transition: "filter 0.25s, opacity 0.25s",
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "var(--bg-void)",
        display: "flex", flexDirection: "column",
        alignItems: "center",
        ...layer,
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Clock block centered at ~40% height */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        marginTop: "38vh",
      }}>
        <div style={{
          fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 400,
          color: "var(--text-primary)", letterSpacing: "-0.02em",
          lineHeight: 1,
        }}>
          {time}
        </div>

        <div style={{
          fontFamily: "var(--font-data)", fontSize: 11,
          color: "var(--text-muted)", letterSpacing: "0.12em",
          marginTop: 8,
        }}>
          {date}
        </div>

        {/* Now-playing pill */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 480, damping: 32 }}
          onClick={onOpenStudio}
          style={{
            marginTop: 12,
            display: "flex", alignItems: "center", gap: 8,
            height: 40, padding: "0 12px",
            border: "1px solid rgba(122,92,255,0.3)",
            borderRadius: 20,
            cursor: "pointer",
            background: "rgba(122,92,255,0.06)",
          }}
        >
          {nowPlaying ? (
            <>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "var(--bg-elevated)",
                backgroundImage: `url(${nowPlaying.art || nowPlaying.album_art})`,
                backgroundSize: "cover", backgroundPosition: "center",
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "var(--font-data)", fontSize: 9,
                color: "var(--text-secondary)", letterSpacing: "0.06em",
                maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {nowPlaying.name}
              </span>
              <span style={{
                fontFamily: "var(--font-data)", fontSize: 9,
                color: playing ? "rgba(122,92,255,0.8)" : "var(--text-muted)",
              }}>
                {playing ? "▶" : "⏸"}
              </span>
            </>
          ) : (
            <span style={{
              fontFamily: "var(--font-data)", fontSize: 9,
              color: "var(--text-muted)", letterSpacing: "0.08em",
            }}>
              NO SIGNAL
            </span>
          )}
        </motion.div>

        {/* Vitals 2x2 grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 8, marginTop: 16, width: 200,
        }}>
          {[
            { label: "ARCHIVE", value: `${SECTIONS_COUNT} sect.` },
            { label: "ARENA",   value: `${PROJECTS_COUNT} proj.` },
            { label: "SIGNAL",  value: "● ready" },
            { label: "UPTIME",  value: uptime },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-hairline)",
              borderRadius: 8, padding: "8px 10px",
            }}>
              <div style={{
                fontFamily: "var(--font-data)", fontSize: 7,
                color: "var(--text-muted)", letterSpacing: "0.12em",
                marginBottom: 3,
              }}>
                {label}
              </div>
              <div style={{
                fontFamily: "var(--font-data)", fontSize: 9,
                color: "var(--text-secondary)",
              }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Swipe handle area (bottom 64px) */}
      <div
        onClick={onOpenLauncher}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: 64,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <span style={{
          fontFamily: "var(--font-data)", fontSize: 8,
          color: "var(--text-muted)", letterSpacing: "0.14em",
        }}>
          ↑ LAUNCH
        </span>
      </div>
    </div>
  );
}
