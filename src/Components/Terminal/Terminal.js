import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  toggleTerminal,
  toggleReadme,
  toggleVoid,
  toggleBlackbox,
  toggleDoom,
  setFocusedWindow,
  setExplorer,
} from "../../Utility/state/action";
import { useActivity } from "../../Utility/ActivityContext";
import { BOOT_LINES, KONAMI_LINES, processCommand } from "./commands";

const PROMPT   = "nocturne@system ∼ $";
const BOOT_KEY = "nocturne_terminal_booted";
const HIST_KEY = "nocturne_cmd_history";

// Konami sequence
const KONAMI_SEQ = [
  "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
  "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight",
  "b","a",
];

// ─── Output line renderer ────────────────────────────────────────────────────

function HackProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPct(p => {
      if (p >= 100) { clearInterval(id); return 100; }
      return p + 3;
    }), 35);
    return () => clearInterval(id);
  }, []);
  const filled = Math.floor(pct / 5);
  return (
    <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", lineHeight: 1.7, color: "rgba(245,166,35,0.85)" }}>
      [{("█".repeat(filled) + "░".repeat(20 - filled))}] {pct}%
    </div>
  );
}

function OutputLine({ line, showCursor }) {
  if (line.type === "blank") return <div style={{ height: "5px" }} />;

  if (line.type === "hack_progress") return <HackProgress />;

  if (line.type === "neofetch") {
    return (
      <div style={{ display: "flex", fontFamily: "var(--font-mono)", fontSize: "12px", lineHeight: 1.7 }}>
        <span style={{ color: "rgba(122,92,255,0.75)", minWidth: "116px", whiteSpace: "pre", flexShrink: 0 }}>{line.left}</span>
        <span style={{ color: "rgba(255,255,255,0.62)" }}>{line.right}</span>
      </div>
    );
  }

  const COLOR = {
    stdout:  "rgba(255,255,255,0.72)",
    success: "rgba(62,255,139,0.88)",
    error:   "rgba(255,59,48,0.88)",
    meta:    "rgba(245,166,35,0.82)",
    muted:   "rgba(255,255,255,0.28)",
    prompt:  "rgba(255,255,255,0.42)",
  };

  return (
    <div style={{
      fontFamily: "var(--font-mono)",
      fontSize: "12px",
      lineHeight: 1.7,
      color: COLOR[line.type] ?? COLOR.stdout,
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    }}>
      {line.text}
      {showCursor && (
        <span style={{
          display: "inline-block",
          width: "7px",
          height: "13px",
          background: "rgba(62,255,139,0.65)",
          marginLeft: "1px",
          verticalAlign: "text-bottom",
          animation: "nocturne-blink 1s step-end infinite",
        }} />
      )}
    </div>
  );
}

// ─── Main terminal ───────────────────────────────────────────────────────────

export default function Terminal() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const state     = useSelector(s => s);
  const { logEvent, sessionStart } = useActivity();

  const [output, setOutput]   = useState([]);
  const [input, setInput]     = useState("");
  const [histIdx, setHistIdx] = useState(-1);
  const [streaming, setStreaming] = useState(false);  // true while queue is draining

  const outputRef  = useRef(null);
  const inputRef   = useRef(null);
  const bootedRef  = useRef(false);

  // ── Typewriter queue ──────────────────────────────────────────────────────
  const printQueue  = useRef([]);
  const isRunning   = useRef(false);

  const driveQueue = useCallback(() => {
    if (printQueue.current.length === 0) {
      isRunning.current = false;
      setStreaming(false);
      return;
    }
    const line = printQueue.current.shift();
    setOutput(prev => [...prev, line]);
    // Blank/instant lines drain faster; text lines get 38ms gap
    const delay = (!line.text || line.type === "blank") ? 10 : 38;
    setTimeout(driveQueue, delay);
  }, []);

  const append = useCallback((lines, instant = false) => {
    const tagged = lines.map((l, i) => ({
      ...l,
      id: l.id || `${Date.now()}-${i}-${Math.random()}`,
    }));
    if (instant) {
      setOutput(prev => [...prev, ...tagged]);
      return;
    }
    printQueue.current.push(...tagged);
    if (!isRunning.current) {
      isRunning.current = true;
      setStreaming(true);
      driveQueue();
    }
  }, [driveQueue]);

  // ── Command history helpers ───────────────────────────────────────────────
  const getHistory = () => {
    try { return JSON.parse(sessionStorage.getItem(HIST_KEY) || "[]"); }
    catch { return []; }
  };

  const pushHistory = (cmd) => {
    if (!cmd.trim()) return;
    const next = [cmd, ...getHistory().filter(c => c !== cmd)].slice(0, 60);
    sessionStorage.setItem(HIST_KEY, JSON.stringify(next));
  };

  // ── Boot sequence ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;

    const firstBoot = !sessionStorage.getItem(BOOT_KEY);
    if (firstBoot) {
      sessionStorage.setItem(BOOT_KEY, "1");
      BOOT_LINES.forEach(({ text, type, delay }) => {
        setTimeout(() => {
          setOutput(prev => [
            ...prev,
            { text, type, id: `boot-${delay}-${type}-${Math.random()}` },
          ]);
        }, delay);
      });
    } else {
      setOutput([
        { text: "NOCTURNE_OS v0.2.0  —  session resumed", type: "meta",  id: "r1" },
        { text: "",                                        type: "blank", id: "r2" },
      ]);
    }
  }, []);

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [output]);

  // ── Focus ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, []);

  // ── Context passed to commands ────────────────────────────────────────────
  const ctx = {
    sessionStart,
    close:        () => dispatch(toggleTerminal()),
    openReadme:   () => { if (!state.readme)   { dispatch(setFocusedWindow("readme"));   dispatch(toggleReadme());   } },
    openVoid:     () => { if (!state.void)     { dispatch(setFocusedWindow("void"));     dispatch(toggleVoid());     } },
    openBlackbox: () => { if (!state.blackbox) { dispatch(setFocusedWindow("blackbox")); dispatch(toggleBlackbox()); } },
    openExplorer: () => dispatch(setExplorer(true)),
    openDoom:     () => { dispatch(setFocusedWindow("doom")); dispatch(toggleDoom()); },
    goToStudio:   () => navigate("/music"),
    togglePlay:   () => document.getElementById("music-play")?.click(),
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    const raw = input.trim();
    // Prompt echo is instant — no queue delay
    append([{ text: `${PROMPT} ${raw}`, type: "prompt" }], true);
    setInput("");
    setHistIdx(-1);
    pushHistory(raw);

    const result = processCommand(raw, ctx);
    if (result.clear) { setOutput([]); printQueue.current = []; isRunning.current = false; setStreaming(false); return; }
    append(result.lines || []);
    if (raw) logEvent(`terminal: ${raw}`);
  };

  // ── History navigation, tab complete, Konami ──────────────────────────────
  const konamiBuffer = useRef([]);

  const handleKeyDown = (e) => {
    const history = getHistory();

    // Konami code tracking
    const key = e.key;
    konamiBuffer.current = [...konamiBuffer.current, key].slice(-KONAMI_SEQ.length);
    if (JSON.stringify(konamiBuffer.current) === JSON.stringify(KONAMI_SEQ)) {
      konamiBuffer.current = [];
      append(KONAMI_LINES, true);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setInput(history[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? "" : (history[next] ?? ""));
    } else if (e.key === "Tab") {
      e.preventDefault();
      const CMDS = [
        "whoami","help","ls","ls -la","cat readme.txt","cat blackbox//",
        "cd","clear","version","neofetch","ping","echo","contact","open",
        "play","hack","coffee","matrix","sudo rm -rf /","exit",
      ];
      const match = CMDS.find(c => c.startsWith(input) && c !== input);
      if (match) setInput(match);
    } else if (e.key === "c" && e.ctrlKey) {
      e.preventDefault();
      append([{ text: `${PROMPT} ${input}^C`, type: "muted" }], true);
      setInput("");
      setHistIdx(-1);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setOutput([]);
      printQueue.current = [];
      isRunning.current = false;
      setStreaming(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg-elevated)" }}>

      {/* Blinking cursor keyframe — injected once */}
      <style>{`
        @keyframes nocturne-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>

      {/* Output */}
      <div
        ref={outputRef}
        onClick={() => inputRef.current?.focus()}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px 22px 6px",
          cursor: "text",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {output.map((line, idx) => (
          <OutputLine
            key={line.id}
            line={line}
            // Show streaming cursor only on the last output line while queue is draining
            showCursor={streaming && idx === output.length - 1}
          />
        ))}
      </div>

      {/* Input line */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 22px 14px",
          borderTop: "1px solid var(--border-hairline)",
          gap: "10px",
          flexShrink: 0,
        }}
      >
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          color: "rgba(62,255,139,0.78)",
          whiteSpace: "nowrap",
          flexShrink: 0,
          letterSpacing: "0.01em",
        }}>
          {PROMPT}
        </span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => { setInput(e.target.value); setHistIdx(-1); }}
          onKeyDown={handleKeyDown}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            color: "rgba(255,255,255,0.88)",
            caretColor: "var(--accent-green)",
            letterSpacing: "0.01em",
          }}
        />
      </form>
    </div>
  );
}
