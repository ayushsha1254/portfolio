import React, {
  useState, useEffect, useRef, useMemo, forwardRef,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePalette } from "react-palette";
import localSongs from "../Data/music.json";

// ── keyframes injected once ───────────────────────────────────────────────────
const STYLE = `
@keyframes vinyl-spin { to { transform: rotate(360deg); } }
@keyframes bar-pulse {
  0%, 100% { transform: scaleY(1); }
  50%       { transform: scaleY(0.35); }
}
@keyframes tonearm-drop { from { transform: rotate(-52deg); } }
`;

// ── vinyl groove rings (CSS background layers) ────────────────────────────────
const GROOVES = Array.from({ length: 15 }, (_, i) => {
  const r = 21 + i * 2.1;
  const a = Math.max(0.004, 0.048 - i * 0.003).toFixed(4);
  return `radial-gradient(circle at 50% 50%,transparent ${r}%,rgba(255,255,255,${a}) ${r + 0.3}%,rgba(255,255,255,${a}) ${r + 0.7}%,transparent ${r + 1}%)`;
}).join(",");

// ── helpers ───────────────────────────────────────────────────────────────────
const fmt = (s) => (!s || isNaN(s)) ? "0:00" : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function hexToRgb(hex) {
  if (!hex || hex.length < 7) return "122,92,255";
  return [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map((x) => parseInt(x, 16)).join(",");
}

function seedBars(key) {
  const s = (key || "nocturne").split("").reduce((a, c, i) => a + c.charCodeAt(0) * (i + 1), 0);
  return Array.from({ length: 32 }, (_, i) => 2 + ((s * (i + 1) * 11 + i * 23) % 11));
}

// ── SVG icons ─────────────────────────────────────────────────────────────────
const IconPrev = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <rect x="2" y="2.5" width="2" height="11" rx="1" />
    <path d="M13 3L6 8l7 5V3z" />
  </svg>
);
const IconNext = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <rect x="12" y="2.5" width="2" height="11" rx="1" />
    <path d="M3 3l7 5-7 5V3z" />
  </svg>
);
const IconPlay = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7L8 5z" />
  </svg>
);
const IconPause = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);
const IconShuffle = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 3 21 3 21 8" />
    <line x1="4" y1="20" x2="21" y2="3" />
    <polyline points="21 16 21 21 16 21" />
    <line x1="15" y1="15" x2="21" y2="21" />
    <line x1="4" y1="4" x2="9" y2="9" />
  </svg>
);

// ── sub-components ─────────────────────────────────────────────────────────────

function AlbumRow({ label, art, count, active, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "7px 14px", cursor: "pointer",
        borderLeft: `2px solid ${active ? "var(--accent-purple)" : "transparent"}`,
        background: active ? "rgba(122,92,255,0.07)" : hover ? "rgba(255,255,255,0.025)" : "transparent",
        transition: "all 150ms",
      }}
    >
      <div style={{
        width: 26, height: 26, borderRadius: 3, overflow: "hidden",
        flexShrink: 0, border: "1px solid rgba(255,255,255,0.07)", background: "var(--bg-overlay)",
      }}>
        {art && <img src={art} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "var(--font-data)", fontSize: 10,
          color: active ? "var(--text-primary)" : "var(--text-secondary)",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>{label}</div>
        <div style={{ fontFamily: "var(--font-data)", fontSize: 8, color: "var(--text-muted)", marginTop: 1 }}>
          {count} TRACKS
        </div>
      </div>
      {active && (
        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent-purple)", flexShrink: 0 }} />
      )}
    </div>
  );
}

function TrackRow({ index, track, active, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: 9,
        padding: "6px 12px", cursor: "pointer",
        borderLeft: `2px solid ${active ? "var(--accent-purple)" : "transparent"}`,
        background: active
          ? "rgba(122,92,255,0.06)"
          : hover ? "rgba(255,255,255,0.02)" : "transparent",
        transition: "all 150ms",
      }}
    >
      <span style={{
        fontFamily: "var(--font-data)", fontSize: 9, color: "var(--text-muted)",
        width: 18, textAlign: "right", flexShrink: 0,
      }}>
        {active ? "▶" : String(index + 1).padStart(2, "0")}
      </span>
      <div style={{
        width: 26, height: 26, borderRadius: 3, overflow: "hidden",
        flexShrink: 0, border: "1px solid rgba(255,255,255,0.07)",
      }}>
        {track.art && <img src={track.art} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "var(--font-body)", fontSize: 11,
          color: active ? "var(--text-primary)" : "var(--text-secondary)",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          fontWeight: active ? 500 : 400,
        }}>{track.name}</div>
        <div style={{ fontFamily: "var(--font-data)", fontSize: 9, color: "var(--text-muted)", marginTop: 1 }}>
          {track.artist}
        </div>
      </div>
      <span style={{ fontFamily: "var(--font-data)", fontSize: 9, color: "var(--text-muted)", flexShrink: 0 }}>
        {track.year}
      </span>
    </div>
  );
}

function ProgressScrubber({ progress, duration, onSeek }) {
  const ref = useRef(null);
  const [hov, setHov] = useState(false);
  const pct = (duration && duration > 0) ? Math.min(100, (progress / duration) * 100) : 0;

  const handleClick = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(ratio * 100);
  };

  return (
    <div style={{ width: "100%" }}>
      <div
        ref={ref}
        onClick={handleClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          position: "relative", width: "100%",
          height: hov ? 5 : 3,
          background: "var(--border-hairline)",
          borderRadius: 3, cursor: "pointer",
          transition: "height 120ms ease",
        }}
      >
        <div style={{
          width: `${pct}%`, height: "100%",
          background: "var(--accent-purple)", borderRadius: 3,
          transition: "width 1s linear",
        }} />
        <div style={{
          position: "absolute", top: "50%", left: `${pct}%`,
          transform: "translate(-50%, -50%)",
          width: hov ? 11 : 8, height: hov ? 11 : 8,
          borderRadius: "50%", background: "var(--accent-purple)",
          boxShadow: "0 0 8px rgba(122,92,255,0.9)",
          transition: "width 120ms, height 120ms",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
        <span style={{ fontFamily: "var(--font-data)", fontSize: 9, color: "var(--text-muted)" }}>{fmt(progress)}</span>
        <span style={{ fontFamily: "var(--font-data)", fontSize: 9, color: "var(--text-muted)" }}>{fmt(duration)}</span>
      </div>
    </div>
  );
}

function VolumeControl({ value, onChange }) {
  const ref = useRef(null);
  const handleClick = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onChange(Math.round(pct * 100));
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
      <span style={{ fontFamily: "var(--font-data)", fontSize: 9, color: "var(--text-muted)", flexShrink: 0, letterSpacing: "0.08em" }}>
        VOL
      </span>
      <div
        ref={ref}
        onClick={handleClick}
        style={{
          flex: 1, height: 3, background: "var(--border-hairline)",
          borderRadius: 2, cursor: "pointer", position: "relative",
        }}
      >
        <div style={{ width: `${value}%`, height: "100%", background: "rgba(255,255,255,0.22)", borderRadius: 2 }} />
      </div>
      <span style={{ fontFamily: "var(--font-data)", fontSize: 9, color: "var(--text-muted)", width: 26, textAlign: "right", flexShrink: 0 }}>
        {value}%
      </span>
    </div>
  );
}

function Visualizer({ track, playing, color }) {
  const bars = useMemo(() => seedBars(track?.name || ""), [track?.name]);
  const rgb = useMemo(() => hexToRgb(color), [color]);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "1.5px", height: 38, width: "100%" }}>
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: playing ? `${h * 3 + 5}px` : "2px",
            background: `rgba(${rgb}, ${playing ? 0.6 : 0.15})`,
            borderRadius: "1.5px 1.5px 0 0",
            transformOrigin: "bottom",
            animation: playing ? `bar-pulse ${0.7 + (i % 8) * 0.18}s ease-in-out infinite` : "none",
            animationDelay: `${(i % 10) * 65}ms`,
            transition: "height 350ms ease, background 600ms ease",
          }}
        />
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
const Music = forwardRef(function Music(props, ref) {
  const { windowed = false } = props;
  const navigate = useNavigate();
  const { id } = useParams();

  const allSongs = useMemo(() => {
    if (Array.isArray(props.songs) && props.songs.length) return props.songs;
    if (props.songs?.data && Array.isArray(props.songs.data)) return props.songs.data;
    return localSongs;
  }, [props.songs]);

  const albums = useMemo(() => {
    const map = {};
    allSongs.forEach((s) => {
      if (!map[s.album]) map[s.album] = { name: s.album, tracks: [], art: s.album_art || s.art };
      map[s.album].tracks.push(s);
    });
    return Object.values(map);
  }, [allSongs]);

  const [activeAlbum, setActiveAlbum] = useState(null);
  const [volume, setVolume] = useState(50);
  const [shuffle, setShuffle] = useState(false);

  const { data: palette } = usePalette(props.nowPlaying?.art || "");
  const ambientColor = palette?.vibrant || palette?.muted || "#7a5cff";
  const ambientRgb = useMemo(() => hexToRgb(ambientColor), [ambientColor]);

  // Volume sync with howler
  useEffect(() => {
    if (ref?.current) ref.current.volume(volume / 100);
  }, [volume]);

  // URL param deep-link
  useEffect(() => {
    if (id && allSongs.length) {
      const song = allSongs.find((s) => s.id == id);
      if (song) { props.setNowPlaying(song); props.setPlaying(true); }
    }
  }, [id, allSongs]);

  const displaySongs = activeAlbum ? allSongs.filter((s) => s.album === activeAlbum) : allSongs;
  const currentIndex = allSongs.findIndex((s) => s.src === props.nowPlaying?.src);

  const handlePrev = () => {
    if (!allSongs.length) return;
    const idx = currentIndex > 0 ? currentIndex - 1 : allSongs.length - 1;
    props.setNowPlaying(allSongs[idx]);
    props.setPlaying(true);
  };

  const handleNext = () => {
    if (!allSongs.length) return;
    if (shuffle) {
      let idx;
      do { idx = Math.floor(Math.random() * allSongs.length); } while (idx === currentIndex && allSongs.length > 1);
      props.setNowPlaying(allSongs[idx]);
    } else {
      props.setNowPlaying(allSongs[(currentIndex + 1) % allSongs.length]);
    }
    props.setPlaying(true);
  };

  const handlePlayPause = () => {
    if (!props.nowPlaying && allSongs.length) {
      props.setNowPlaying(allSongs[0]);
      props.setPlaying(true);
    } else {
      props.setPlaying(!props.playing);
    }
  };

  return (
    <>
      <style>{STYLE}</style>
      <div style={{
        width: windowed ? "100%" : "100vw",
        height: windowed ? "100%" : "100vh",
        overflow: "hidden",
        background: windowed ? "var(--bg-elevated)" : "var(--bg-base)",
        display: "flex", flexDirection: "column",
        color: "var(--text-primary)", fontFamily: "var(--font-body)",
        position: "relative",
      }}>

        {/* Ambient palette glow — shifts per track */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          background: `radial-gradient(ellipse 70% 50% at 50% 0%, rgba(${ambientRgb},0.13) 0%, transparent 65%)`,
          transition: "background 1.2s ease",
        }} />

        {/* ── Top bar — full-page only ── */}
        {!windowed && <div style={{
          height: 40, display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 16px",
          background: "var(--bg-surface)", borderBottom: "1px solid var(--border-hairline)",
          flexShrink: 0, zIndex: 2, position: "relative",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "var(--font-data)", fontSize: 11, color: "var(--text-primary)", letterSpacing: "0.06em" }}>
              STUDIO.JACK
            </span>
            <div style={{ width: 1, height: 12, background: "var(--border-hairline)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{
                width: 5, height: 5, borderRadius: "50%",
                background: props.playing ? "var(--accent-green)" : "var(--text-muted)",
                boxShadow: props.playing ? "0 0 6px rgba(62,255,139,0.8)" : "none",
                transition: "all 300ms",
              }} />
              <span style={{ fontFamily: "var(--font-data)", fontSize: 9, color: props.playing ? "var(--accent-green)" : "var(--text-muted)", letterSpacing: "0.08em" }}>
                {props.playing ? "PLAYING" : props.nowPlaying ? "PAUSED" : "IDLE"}
              </span>
            </div>
          </div>

          <div style={{ fontFamily: "var(--font-data)", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.05em" }}>
            {props.nowPlaying?.name ? props.nowPlaying.name.toUpperCase() : "NO TRACK"}
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => navigate("/")}
              style={{
                width: 20, height: 20, borderRadius: 4, cursor: "pointer",
                background: "var(--bg-overlay)", border: "1px solid var(--border-hairline)",
                color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12,
              }}
            >−</button>
            <button
              onClick={() => { ref.current?.stop(); props.setPlaying(false); props.setProgress(0); navigate("/"); }}
              style={{
                width: 20, height: 20, borderRadius: 4, cursor: "pointer",
                background: "rgba(255,59,48,0.12)", border: "1px solid rgba(255,59,48,0.28)",
                color: "var(--accent-red)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
              }}
            >×</button>
          </div>
        </div>}

        {/* ── Main 3-panel layout ── */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative", zIndex: 1 }}>

          {/* LEFT — Library */}
          <div style={{
            width: "26%", display: "flex", flexDirection: "column",
            borderRight: "1px solid var(--border-hairline)", overflow: "hidden",
          }}>
            <div style={{ fontFamily: "var(--font-data)", fontSize: 8, color: "var(--text-muted)", letterSpacing: "0.16em", padding: "10px 14px 6px", borderBottom: "1px solid var(--border-hairline)", flexShrink: 0 }}>
              LIBRARY
            </div>
            <div style={{ padding: "6px 0" }}>
              <AlbumRow
                label="ALL TRACKS"
                art={allSongs[0]?.art}
                count={allSongs.length}
                active={activeAlbum === null}
                onClick={() => setActiveAlbum(null)}
              />
              {albums.map((a) => (
                <AlbumRow
                  key={a.name}
                  label={a.name.toUpperCase()}
                  art={a.art}
                  count={a.tracks.length}
                  active={activeAlbum === a.name}
                  onClick={() => setActiveAlbum(activeAlbum === a.name ? null : a.name)}
                />
              ))}
            </div>

            {/* Now playing album art */}
            <div style={{ marginTop: "auto", padding: "14px", borderTop: "1px solid var(--border-hairline)" }}>
              <div style={{
                width: "100%", aspectRatio: "1", borderRadius: 5, overflow: "hidden",
                border: "1px solid var(--border-hairline)",
                boxShadow: `0 0 30px rgba(${ambientRgb},0.22), 0 8px 24px rgba(0,0,0,0.6)`,
                transition: "box-shadow 1s ease",
              }}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={props.nowPlaying?.art || "placeholder"}
                    src={props.nowPlaying?.art || ""}
                    alt=""
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.4 }}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </AnimatePresence>
              </div>
              {props.nowPlaying && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontFamily: "var(--font-data)", fontSize: 10, color: "var(--text-secondary)" }}>
                    {props.nowPlaying.artist}
                  </div>
                  <div style={{ fontFamily: "var(--font-data)", fontSize: 9, color: "var(--text-muted)", marginTop: 2 }}>
                    {props.nowPlaying.album.toUpperCase()} · {props.nowPlaying.year}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CENTER — Vinyl console */}
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "24px 40px", gap: 18, overflow: "hidden",
          }}>

            {/* Vinyl disc */}
            <AnimatePresence mode="wait">
              <motion.div
                key={props.nowPlaying?.src || "empty"}
                initial={{ y: -22, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 22, opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                style={{ position: "relative", flexShrink: 0 }}
              >
                {/* Tonearm */}
                <div style={{
                  position: "absolute", top: -10, right: -18,
                  width: 2, height: 115,
                  background: "linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(255,255,255,0.1))",
                  transformOrigin: "top center",
                  transform: props.playing ? "rotate(-30deg)" : "rotate(-52deg)",
                  transition: "transform 0.65s cubic-bezier(0.4,0,0.2,1)",
                  borderRadius: "2px 2px 0 0", zIndex: 2,
                }}>
                  <div style={{
                    position: "absolute", bottom: -2, left: "50%",
                    transform: "translateX(-50%)",
                    width: 10, height: 10, borderRadius: "50%",
                    background: "rgba(255,255,255,0.35)",
                    boxShadow: "0 0 4px rgba(255,255,255,0.2)",
                  }} />
                </div>

                {/* Disc */}
                <div style={{
                  width: 288, height: 288, borderRadius: "50%",
                  background: `${GROOVES},radial-gradient(circle at 50% 50%,#1e1e1e 0%,#0c0c0c 100%)`,
                  boxShadow: `
                    0 0 0 1px rgba(255,255,255,0.05),
                    0 0 80px rgba(${ambientRgb},0.38),
                    0 28px 56px rgba(0,0,0,0.85)
                  `,
                  animation: "vinyl-spin 4s linear infinite",
                  animationPlayState: props.playing ? "running" : "paused",
                  position: "relative",
                  transition: "box-shadow 1.2s ease",
                }}>
                  {/* Outer shine ring */}
                  <div style={{
                    position: "absolute", inset: 0, borderRadius: "50%",
                    background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.04) 0%, transparent 60%)",
                    pointerEvents: "none",
                  }} />

                  {/* Album art label */}
                  <div style={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%,-50%)",
                    width: "36%", height: "36%", borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid rgba(255,255,255,0.07)",
                    boxShadow: "0 0 0 5px rgba(0,0,0,0.55)",
                  }}>
                    {props.nowPlaying?.art ? (
                      <img src={props.nowPlaying.art} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: "var(--bg-overlay)" }} />
                    )}
                  </div>

                  {/* Center hole */}
                  <div style={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%,-50%)",
                    width: 9, height: 9, borderRadius: "50%",
                    background: "#050505", zIndex: 2,
                    border: "1px solid rgba(255,255,255,0.09)",
                  }} />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Track info */}
            <AnimatePresence mode="wait">
              <motion.div
                key={props.nowPlaying?.name || "empty"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
                style={{ textAlign: "center", width: "100%", maxWidth: 380 }}
              >
                <div style={{
                  fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 500,
                  color: "var(--text-primary)", letterSpacing: "-0.025em",
                  marginBottom: 5, lineHeight: 1.2,
                }}>
                  {props.nowPlaying?.name || "NO TRACK SELECTED"}
                </div>
                <div style={{
                  fontFamily: "var(--font-data)", fontSize: 11,
                  color: "var(--text-secondary)", letterSpacing: "0.06em",
                }}>
                  {props.nowPlaying
                    ? `${props.nowPlaying.artist.toUpperCase()}  ·  ${props.nowPlaying.year}`
                    : "SELECT A TRACK TO BEGIN"}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress scrubber */}
            <div style={{ width: "100%", maxWidth: 380 }}>
              <ProgressScrubber
                progress={props.progress}
                duration={props.duration}
                onSeek={(pct) => props.setSeek(pct)}
              />
            </div>

            {/* Transport controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <button
                onClick={handlePrev}
                style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "var(--bg-overlay)", border: "1px solid var(--border-subtle)",
                  color: "var(--text-secondary)", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 150ms",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.borderColor = "var(--border-default)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border-subtle)"; }}
              >
                <IconPrev />
              </button>

              <motion.button
                onClick={handlePlayPause}
                whileTap={{ scale: 0.9 }}
                style={{
                  width: 54, height: 54, borderRadius: "50%", cursor: "pointer",
                  background: props.playing ? "var(--accent-purple)" : "var(--bg-elevated)",
                  border: `1.5px solid ${props.playing ? "var(--accent-purple)" : "var(--border-default)"}`,
                  color: props.playing ? "#fff" : "var(--text-primary)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: props.playing ? "0 0 24px rgba(122,92,255,0.55)" : "none",
                  transition: "background 200ms, border-color 200ms, box-shadow 300ms",
                }}
              >
                {props.playing ? <IconPause /> : <IconPlay />}
              </motion.button>

              <button
                onClick={handleNext}
                style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "var(--bg-overlay)", border: "1px solid var(--border-subtle)",
                  color: "var(--text-secondary)", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 150ms",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.borderColor = "var(--border-default)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border-subtle)"; }}
              >
                <IconNext />
              </button>

              <motion.button
                onClick={() => setShuffle((s) => !s)}
                whileTap={{ scale: 0.88 }}
                style={{
                  width: 30, height: 30, borderRadius: "50%", cursor: "pointer",
                  background: shuffle ? "rgba(122,92,255,0.18)" : "transparent",
                  border: `1px solid ${shuffle ? "var(--accent-purple)" : "var(--border-hairline)"}`,
                  color: shuffle ? "var(--accent-purple)" : "var(--text-muted)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 180ms",
                }}
              >
                <IconShuffle />
              </motion.button>
            </div>

            {/* Volume */}
            <div style={{ width: "100%", maxWidth: 380 }}>
              <VolumeControl value={volume} onChange={(v) => setVolume(v)} />
            </div>

            {/* Visualizer */}
            <div style={{ width: "100%", maxWidth: 380 }}>
              <Visualizer track={props.nowPlaying} playing={props.playing} color={ambientColor} />
            </div>

          </div>

          {/* RIGHT — Queue */}
          <div style={{
            width: "26%", overflow: "auto", scrollbarWidth: "none",
            borderLeft: "1px solid var(--border-hairline)",
          }}>
            <div style={{
              fontFamily: "var(--font-data)", fontSize: 8, color: "var(--text-muted)",
              letterSpacing: "0.16em", padding: "10px 12px 6px",
              borderBottom: "1px solid var(--border-hairline)",
              position: "sticky", top: 0, background: "var(--bg-base)", zIndex: 1,
            }}>
              QUEUE — {displaySongs.length} TRACKS
            </div>
            <div style={{ padding: "4px 0" }}>
              {displaySongs.map((track, i) => (
                <TrackRow
                  key={track.src}
                  index={allSongs.indexOf(track)}
                  track={track}
                  active={track.src === props.nowPlaying?.src}
                  onClick={() => { props.setNowPlaying(track); props.setPlaying(true); }}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
});

export default Music;
