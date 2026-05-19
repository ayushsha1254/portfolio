import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const BAR_COUNT = 14;
const REST_HEIGHTS = [0.10, 0.16, 0.11, 0.20, 0.13, 0.22, 0.10, 0.18, 0.12, 0.22, 0.14, 0.20, 0.11, 0.10];

export default function NowPlayingWidget({ playing, nowPlaying }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const heightsRef = useRef([...REST_HEIGHTS]);
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const BAR_W = 4;
    const GAP = 3;
    const MAX_H = 26;
    const totalW = BAR_COUNT * (BAR_W + GAP) - GAP;
    const startX = Math.floor((canvas.width - totalW) / 2);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = Date.now() / 1000;

      heightsRef.current = heightsRef.current.map((h, i) => {
        const target = playing
          ? Math.max(0.07, (
              Math.sin(t * 2.1 + i * 1.05) * 0.30 +
              Math.sin(t * 3.7 + i * 0.65) * 0.20 +
              0.50
            ))
          : REST_HEIGHTS[i];
        const speed = playing ? 0.16 : 0.05;
        return h + (target - h) * speed;
      });

      heightsRef.current.forEach((h, i) => {
        const barH = Math.max(2, h * MAX_H);
        const x = startX + i * (BAR_W + GAP);
        const y = (canvas.height - barH) / 2;
        ctx.fillStyle = `rgba(122,92,255,${playing ? 0.62 : 0.20})`;
        ctx.fillRect(x, y, BAR_W, barH);
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  const trackName = nowPlaying?.name || "no signal";
  const display = trackName.length > 26 ? trackName.slice(0, 26) + "…" : trackName;

  return (
    <div
      onClick={() => navigate("/music")}
      style={{
        position: "fixed",
        right: "28px",
        bottom: "62px",
        width: "220px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-hairline)",
        borderRadius: "4px",
        padding: "11px 14px 10px",
        cursor: "pointer",
        zIndex: "var(--z-dock)",
        opacity: playing ? 1 : 0.50,
        transition: "opacity 600ms ease",
        userSelect: "none",
      }}
    >
      {/* Waveform bars */}
      <canvas
        ref={canvasRef}
        width={192}
        height={28}
        style={{ display: "block", marginBottom: "8px" }}
      />
      {/* Track name */}
      <div
        style={{
          fontFamily: "var(--font-data)",
          fontSize: "10.5px",
          color: playing ? "var(--text-secondary)" : "rgba(255,255,255,0.28)",
          letterSpacing: "0.04em",
          lineHeight: "1.4",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          transition: "color 400ms",
        }}
      >
        {display}
      </div>
      {/* Hardware metadata */}
      <div
        style={{
          fontFamily: "var(--font-data)",
          fontSize: "9px",
          color: "rgba(255,255,255,0.20)",
          letterSpacing: "0.07em",
          marginTop: "4px",
        }}
      >
        48kHz  ·  buf 64  ·  studio.jack
      </div>
    </div>
  );
}
