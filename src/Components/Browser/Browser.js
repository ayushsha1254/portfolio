import { useState, useRef, useEffect, useCallback } from "react";

const BOOKMARKS = [
  { label: "wikipedia",  url: "https://en.wikipedia.org/wiki/Special:Random",         icon: "W" },
  { label: "openstreet", url: "https://www.openstreetmap.org/#map=4/20.59/78.96",     icon: "◎" },
  { label: "archive",    url: "https://archive.org",                                   icon: "▣" },
  { label: "signal",     url: "https://signal.link",                                   icon: "◈" },
  { label: "hacker news",url: "https://news.ycombinator.com",                          icon: "Y" },
];

const HOME_URL = "https://en.wikipedia.org/wiki/Special:Random";

function normalizeUrl(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^localhost/i.test(trimmed)) return `http://${trimmed}`;
  if (/\.\w{2,}/.test(trimmed)) return `https://${trimmed}`;
  return `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(trimmed)}`;
}

// ─── Status screens ──────────────────────────────────────────────────────────

function BlockedScreen({ url, onExternal }) {
  const host = (() => { try { return new URL(url).hostname; } catch { return url; } })();
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "var(--bg-elevated)",
      fontFamily: "var(--font-mono)",
      userSelect: "none",
      gap: "0",
    }}>
      <div style={{ fontSize: "10px", color: "rgba(255,59,48,0.55)", letterSpacing: "0.15em", marginBottom: "18px" }}>
        ACCESS BLOCKED
      </div>
      <div style={{
        width: "320px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "4px",
        padding: "18px 20px",
      }}>
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: "14px" }}>
          <span style={{ color: "rgba(255,59,48,0.75)" }}>{host}</span> declined embedding.
        </div>
        <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.28)", lineHeight: 1.9, marginBottom: "16px" }}>
          <div>X-Frame-Options  SAMEORIGIN / DENY</div>
          <div>Policy           frame-ancestors 'none'</div>
        </div>
        <div
          onClick={onExternal}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 14px",
            background: "transparent",
            border: "1px solid var(--border-default)",
            borderRadius: "3px",
            cursor: "pointer",
            fontSize: "10px",
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "0.08em",
            transition: "border-color 150ms, color 150ms",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.30)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-default)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
        >
          <span>↗</span> OPEN EXTERNAL
        </div>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "var(--bg-elevated)", gap: "12px",
    }}>
      <LoadingPulse />
      <div style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "rgba(255,255,255,0.22)", letterSpacing: "0.12em" }}>
        CONNECTING
      </div>
    </div>
  );
}

function LoadingPulse() {
  return (
    <div style={{ display: "flex", gap: "5px" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: "5px", height: "5px", borderRadius: "50%",
          background: "rgba(10,132,255,0.6)",
          animation: `nocturne-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

// ─── Main browser ─────────────────────────────────────────────────────────────

export default function Browser() {
  const iframeRef  = useRef(null);
  const inputRef   = useRef(null);

  const [inputVal,  setInputVal]  = useState(HOME_URL);
  const [liveUrl,   setLiveUrl]   = useState(HOME_URL);
  const [status,    setStatus]    = useState("loading");  // loading | loaded | blocked
  const [history,   setHistory]   = useState([HOME_URL]);
  const [histIdx,   setHistIdx]   = useState(0);
  const [inputFocus, setInputFocus] = useState(false);

  const canBack    = histIdx > 0;
  const canForward = histIdx < history.length - 1;

  // ── Navigate ──────────────────────────────────────────────────────────────

  const navigateTo = useCallback((raw) => {
    const url = normalizeUrl(raw);
    if (!url) return;
    setInputVal(url);
    setLiveUrl(url);
    setStatus("loading");

    setHistory(prev => {
      const trimmed = prev.slice(0, histIdx + 1);
      const next = [...trimmed, url];
      setHistIdx(next.length - 1);
      return next;
    });
  }, [histIdx]);

  const goBack = () => {
    if (!canBack) return;
    const idx = histIdx - 1;
    setHistIdx(idx);
    const url = history[idx];
    setInputVal(url);
    setLiveUrl(url);
    setStatus("loading");
  };

  const goForward = () => {
    if (!canForward) return;
    const idx = histIdx + 1;
    setHistIdx(idx);
    const url = history[idx];
    setInputVal(url);
    setLiveUrl(url);
    setStatus("loading");
  };

  const refresh = () => {
    setStatus("loading");
    const url = liveUrl;
    setLiveUrl("");
    setTimeout(() => setLiveUrl(url), 30);
  };

  // ── Iframe load detection ─────────────────────────────────────────────────

  const handleLoad = useCallback(() => {
    try {
      const href = iframeRef.current?.contentWindow?.location?.href;
      if (href && href !== "about:blank") {
        // Same-origin frame loaded (rare) — readable href
        setStatus("loaded");
        setInputVal(href);
      } else {
        // about:blank → X-Frame-Options blocked the page
        setStatus("blocked");
      }
    } catch {
      // SecurityError → cross-origin load succeeded (normal)
      setStatus("loaded");
    }
  }, []);

  // Timeout fallback — if still loading after 14s, mark blocked
  useEffect(() => {
    if (status !== "loading") return;
    const t = setTimeout(() => setStatus("blocked"), 14000);
    return () => clearTimeout(t);
  }, [liveUrl, status]);

  // ── Submit address bar ────────────────────────────────────────────────────

  const handleSubmit = (e) => {
    e.preventDefault();
    navigateTo(inputVal);
    inputRef.current?.blur();
  };

  // ── Keyboard shortcut: Ctrl/Cmd+L to focus address bar ───────────────────

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "l") {
        e.preventDefault();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg-elevated)" }}>

      {/* ── Nav bar ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "7px 12px",
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-hairline)",
        flexShrink: 0,
      }}>
        {/* Back */}
        <NavBtn onClick={goBack} disabled={!canBack} title="Back">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="7,2 3,5.5 7,9" />
          </svg>
        </NavBtn>

        {/* Forward */}
        <NavBtn onClick={goForward} disabled={!canForward} title="Forward">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4,2 8,5.5 4,9" />
          </svg>
        </NavBtn>

        {/* Refresh */}
        <NavBtn onClick={refresh} title="Refresh">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5.5a4 4 0 11-1.1-2.7" />
            <polyline points="9,1 9,4 6,4" />
          </svg>
        </NavBtn>

        {/* Address bar */}
        <form onSubmit={handleSubmit} style={{ flex: 1, margin: "0 4px" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            background: inputFocus ? "var(--bg-elevated)" : "rgba(0,0,0,0.30)",
            border: `1px solid ${inputFocus ? "rgba(10,132,255,0.45)" : "var(--border-hairline)"}`,
            borderRadius: "4px",
            padding: "0 10px",
            height: "26px",
            gap: "6px",
            transition: "border-color 150ms, background 150ms",
          }}>
            {/* Status indicator */}
            <div style={{
              width: "5px", height: "5px", borderRadius: "50%", flexShrink: 0,
              background: status === "loaded"  ? "rgba(62,255,139,0.7)"
                        : status === "blocked" ? "rgba(255,59,48,0.7)"
                        : "rgba(245,166,35,0.6)",
              transition: "background 300ms",
            }} />
            <input
              ref={inputRef}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onFocus={() => { setInputFocus(true); inputRef.current?.select(); }}
              onBlur={() => setInputFocus(false)}
              autoComplete="off"
              spellCheck={false}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontFamily: "var(--font-data)",
                fontSize: "10px",
                color: "rgba(255,255,255,0.72)",
                letterSpacing: "0.02em",
              }}
            />
          </div>
        </form>

        {/* Open external */}
        <NavBtn onClick={() => window.open(liveUrl, "_blank")} title="Open in new tab">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 2H2a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V6" />
            <polyline points="8,1 10,1 10,3" />
            <line x1="5.5" y1="5.5" x2="10" y2="1" />
          </svg>
        </NavBtn>
      </div>

      {/* ── Bookmarks bar ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "2px",
        padding: "4px 12px",
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-hairline)",
        flexShrink: 0,
        overflowX: "auto",
        scrollbarWidth: "none",
      }}>
        {BOOKMARKS.map(bm => (
          <button
            key={bm.label}
            onClick={() => navigateTo(bm.url)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "3px 9px",
              background: liveUrl === bm.url ? "rgba(255,255,255,0.06)" : "transparent",
              border: "1px solid transparent",
              borderRadius: "3px",
              cursor: "pointer",
              fontFamily: "var(--font-data)",
              fontSize: "9px",
              color: liveUrl === bm.url ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.35)",
              letterSpacing: "0.06em",
              whiteSpace: "nowrap",
              transition: "color 150ms, background 150ms",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.65)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
            onMouseLeave={e => {
              e.currentTarget.style.color = liveUrl === bm.url ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.35)";
              e.currentTarget.style.background = liveUrl === bm.url ? "rgba(255,255,255,0.06)" : "transparent";
            }}
          >
            <span style={{ fontSize: "9px", opacity: 0.6 }}>{bm.icon}</span>
            {bm.label}
          </button>
        ))}
      </div>

      {/* ── Content area ── */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {status === "loading" && (
          <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
            <LoadingScreen />
          </div>
        )}
        {status === "blocked" && (
          <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", flexDirection: "column" }}>
            <BlockedScreen url={liveUrl} onExternal={() => window.open(liveUrl, "_blank")} />
          </div>
        )}
        {liveUrl && (
          <iframe
            ref={iframeRef}
            key={liveUrl}
            src={liveUrl}
            onLoad={handleLoad}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
              opacity: status === "loaded" ? 1 : 0,
              transition: "opacity 200ms",
            }}
            title="NOCTURNE Browser"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        )}
      </div>

      {/* Pulse keyframe */}
      <style>{`
        @keyframes nocturne-pulse {
          0%, 100% { opacity: 0.25; transform: scale(0.8); }
          50%       { opacity: 1;    transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

function NavBtn({ children, onClick, disabled, title }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "24px",
        height: "24px",
        background: "transparent",
        border: "none",
        borderRadius: "3px",
        cursor: disabled ? "default" : "pointer",
        color: disabled ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.45)",
        padding: 0,
        transition: "color 150ms, background 150ms",
        flexShrink: 0,
      }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.color = "rgba(255,255,255,0.82)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; } }}
      onMouseLeave={e => { e.currentTarget.style.color = disabled ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.45)"; e.currentTarget.style.background = "transparent"; }}
    >
      {children}
    </button>
  );
}
