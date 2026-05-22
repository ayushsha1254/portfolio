import React, { useRef } from "react";
import { motion } from "framer-motion";

// ── PLAYER tab ────────────────────────────────────────────────────────────────
function PlayerTab({
  howlerRef, playing, setPlaying,
  nowPlaying, setNowPlaying,
  progress, setProgress,
  seek, setSeek,
  duration, setDuration,
  songs,
}) {
  const trackRef = useRef(null);

  const togglePlay = () => {
    if (!howlerRef.current) return;
    if (playing) {
      howlerRef.current.pause();
      setPlaying(false);
    } else {
      howlerRef.current.play();
      setPlaying(true);
    }
  };

  const skipNext = () => {
    if (!songs.length) return;
    const idx = songs.findIndex(s => s.src === nowPlaying?.src);
    const next = songs[(idx + 1) % songs.length];
    setNowPlaying(next);
    setProgress(0);
    setSeek(0);
  };

  const skipPrev = () => {
    if (!songs.length) return;
    const idx = songs.findIndex(s => s.src === nowPlaying?.src);
    const prev = songs[(idx - 1 + songs.length) % songs.length];
    setNowPlaying(prev);
    setProgress(0);
    setSeek(0);
  };

  const handleScrubberClick = (e) => {
    if (!trackRef.current || !duration) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const clamped = Math.max(0, Math.min(1, ratio));
    const newSeek = clamped * duration;
    setSeek(newSeek);
    setProgress(clamped * 100);
    if (howlerRef.current) howlerRef.current.seek(newSeek);
  };

  const fmtTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const art = nowPlaying?.art || nowPlaying?.album_art;

  return (
    <div style={{
      padding: "32px 24px 80px",
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      {/* Album art circle */}
      <div style={{
        width: 100, height: 100, borderRadius: "50%",
        background: "var(--bg-elevated)",
        backgroundImage: art ? `url(${art})` : "none",
        backgroundSize: "cover", backgroundPosition: "center",
        boxShadow: art
          ? "0 0 40px rgba(122,92,255,0.25), 0 0 80px rgba(122,92,255,0.1)"
          : "none",
        marginBottom: 20,
        flexShrink: 0,
      }} />

      {/* Track name */}
      <div style={{
        fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 400,
        color: "var(--text-primary)", textAlign: "center",
        marginBottom: 4, letterSpacing: "-0.01em",
      }}>
        {nowPlaying?.name || "NO TRACK SELECTED"}
      </div>

      {/* Artist */}
      <div style={{
        fontFamily: "var(--font-data)", fontSize: 10,
        color: "var(--text-muted)", letterSpacing: "0.08em",
        marginBottom: 24,
      }}>
        {nowPlaying?.artist || "—"}
      </div>

      {/* Progress scrubber */}
      <div style={{ width: "100%", marginBottom: 6 }}>
        <div
          ref={trackRef}
          onClick={handleScrubberClick}
          style={{
            width: "100%", height: 3,
            background: "var(--bg-elevated)",
            borderRadius: 2, cursor: "pointer", position: "relative",
          }}
        >
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0,
            width: `${progress || 0}%`,
            background: "var(--accent-purple)", borderRadius: 2,
          }} />
          <div style={{
            position: "absolute", top: "50%", transform: "translate(-50%, -50%)",
            left: `${progress || 0}%`,
            width: 12, height: 12, borderRadius: "50%",
            background: "var(--accent-purple)",
          }} />
        </div>
        <div style={{
          display: "flex", justifyContent: "space-between",
          marginTop: 6,
          fontFamily: "var(--font-data)", fontSize: 8, color: "var(--text-muted)",
        }}>
          <span>{fmtTime(seek || 0)}</span>
          <span>{fmtTime(duration || 0)}</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 32, marginBottom: 24, marginTop: 8,
      }}>
        <button onClick={skipPrev} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "var(--text-secondary)", fontSize: 22, padding: 8,
        }}>⏮</button>
        <button onClick={togglePlay} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "var(--accent-purple)", fontSize: 32, padding: 8,
          width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {playing ? "⏸" : "▶"}
        </button>
        <button onClick={skipNext} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "var(--text-secondary)", fontSize: 22, padding: 8,
        }}>⏭</button>
      </div>

      {/* Volume */}
      <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{
          fontFamily: "var(--font-data)", fontSize: 8,
          color: "var(--text-muted)", letterSpacing: "0.1em", flexShrink: 0,
        }}>VOL</span>
        <input
          type="range" min="0" max="1" step="0.01"
          defaultValue="0.5"
          onChange={(e) => { if (howlerRef.current) howlerRef.current.volume(+e.target.value); }}
          style={{
            flex: 1, accentColor: "var(--accent-purple)", cursor: "pointer",
            height: 3,
          }}
        />
      </div>
    </div>
  );
}

// ── TRACKS tab ────────────────────────────────────────────────────────────────
function TracksTab({ songs, nowPlaying, setNowPlaying, setPlaying, setProgress, setSeek }) {
  const playTrack = (track) => {
    setNowPlaying(track);
    setProgress(0);
    setSeek(0);
    setPlaying(true);
  };

  return (
    <div style={{ padding: "8px 0 80px" }}>
      {songs.map((track, i) => {
        const isActive = nowPlaying?.src === track.src;
        return (
          <motion.button
            key={track.src}
            onClick={() => playTrack(track)}
            whileTap={{ opacity: 0.7 }}
            style={{
              width: "100%", background: "none",
              border: "none",
              borderLeft: isActive ? "2px solid var(--accent-purple)" : "2px solid transparent",
              borderBottom: "1px solid var(--border-hairline)",
              padding: "12px 16px",
              display: "flex", alignItems: "center",
              gap: 12, cursor: "pointer", textAlign: "left",
            }}
          >
            <span style={{
              fontFamily: "var(--font-data)", fontSize: 9,
              color: "var(--text-muted)", width: 16, flexShrink: 0,
              letterSpacing: "0.06em",
            }}>
              {isActive ? "▶" : String(i + 1).padStart(2, "0")}
            </span>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{
                fontFamily: "var(--font-ui)", fontSize: 12,
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {track.name}
              </div>
              <div style={{
                fontFamily: "var(--font-data)", fontSize: 8,
                color: "var(--text-muted)", marginTop: 2, letterSpacing: "0.05em",
              }}>
                {track.artist}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function StudioApp({ tab, ...props }) {
  if (tab === "TRACKS") return <TracksTab {...props} />;
  return <PlayerTab {...props} />;
}
