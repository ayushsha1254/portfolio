import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Notification pool — sys + sms mixed ──────────────────────────────────────

const NOTIF_POOL = [
  { kind: "sys",  text: "[daemon] archive.sys — integrity ok",   type: "ok"   },
  { kind: "sms",  from: "kai",        msg: "yo did you push the build"             },
  { kind: "sys",  text: "[net]    latency spike: 142ms",          type: "warn" },
  { kind: "sms",  from: "mira",       msg: "why is void.archive offline lol"       },
  { kind: "sys",  text: "[audio]  jack @ 48kHz — nominal",        type: "ok"   },
  { kind: "sms",  from: "echo",       msg: "nice work on nocturne"                 },
  { kind: "sys",  text: "[warn]   arena.projects — build idle",   type: "warn" },
  { kind: "sms",  from: "dev_null",   msg: "archive is up, check logs"             },
  { kind: "sys",  text: "[daemon] signal fragment received",       type: "ok"   },
  { kind: "sms",  from: "unknown",    msg: "██████ ████ ███"                       },
  { kind: "sys",  text: "[net]    blackbox// — silent ping",       type: "warn" },
  { kind: "sms",  from: "kai",        msg: "studio session tonight?"               },
  { kind: "sys",  text: "[sys]    cinematic mode — active",        type: "ok"   },
  { kind: "sms",  from: "mira",       msg: "can you review the arena build?"       },
  { kind: "sys",  text: "[audio]  buffer underrun — recovered",    type: "warn" },
  { kind: "sms",  from: "sys_bot",    msg: "your deploy just went live"            },
  { kind: "sys",  text: "[warn]   0x0003 — checksum mismatch",    type: "warn" },
  { kind: "sms",  from: "echo",       msg: "blackbox// is acting weird again"      },
  { kind: "sys",  text: "[net]    uplink confirmed: 12ms",         type: "ok"   },
  { kind: "sms",  from: "dev_null",   msg: "running diagnostics now"               },
  { kind: "sys",  text: "[daemon] nocturne core — stable",         type: "ok"   },
  { kind: "sms",  from: "kai",        msg: "what's the terminal password"          },
  { kind: "sys",  text: "[warn]   studio.jack — idle timeout",    type: "warn" },
  { kind: "sms",  from: "unknown",    msg: "signal_lost — updated"                 },
];

const MAX_NOTIFS = 10;

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  return `${Math.floor(s / 3600)}h`;
}

// ── Toast content ─────────────────────────────────────────────────────────────

function ToastBody({ n }) {
  if (n.kind === "sms") {
    return (
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
          <div style={{
            width: "16px", height: "16px", borderRadius: "50%",
            background: "rgba(122,92,255,0.22)",
            border: "1px solid rgba(122,92,255,0.40)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{ fontFamily: "var(--font-data)", fontSize: "7px", color: "rgba(122,92,255,0.90)", letterSpacing: 0 }}>
              {n.from[0].toUpperCase()}
            </span>
          </div>
          <span style={{ fontFamily: "var(--font-data)", fontSize: "9.5px", color: "rgba(122,92,255,0.90)", letterSpacing: "0.04em" }}>
            {n.from}
          </span>
        </div>
        <div style={{ fontFamily: "var(--font-data)", fontSize: "9.5px", color: "rgba(255,255,255,0.55)", letterSpacing: "0.02em", lineHeight: 1.45, paddingLeft: "22px" }}>
          {n.msg}
        </div>
      </div>
    );
  }
  return (
    <span style={{
      fontFamily: "var(--font-data)",
      fontSize: "9.5px",
      color: n.type === "warn" ? "rgba(245,166,35,0.82)" : "rgba(255,255,255,0.58)",
      letterSpacing: "0.02em",
      lineHeight: 1.55,
      whiteSpace: "pre",
      overflow: "hidden",
      textOverflow: "ellipsis",
      flex: 1,
      minWidth: 0,
    }}>
      {n.text}
    </span>
  );
}

// ── Panel entry ───────────────────────────────────────────────────────────────

function PanelEntry({ n }) {
  const borderColor = n.kind === "sms"
    ? "rgba(122,92,255,0.45)"
    : n.type === "warn" ? "rgba(245,166,35,0.50)" : "rgba(62,255,139,0.35)";

  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: "10px",
      padding: "9px 14px",
      borderBottom: "1px solid var(--border-hairline)",
      borderLeft: `2px solid ${borderColor}`,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {n.kind === "sms" ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px" }}>
              <div style={{
                width: "14px", height: "14px", borderRadius: "50%",
                background: "rgba(122,92,255,0.18)",
                border: "1px solid rgba(122,92,255,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "6.5px", color: "rgba(122,92,255,0.88)" }}>
                  {n.from[0].toUpperCase()}
                </span>
              </div>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "9.5px", color: "rgba(122,92,255,0.85)", letterSpacing: "0.04em" }}>
                {n.from}
              </span>
            </div>
            <div style={{ fontFamily: "var(--font-data)", fontSize: "9.5px", color: "rgba(255,255,255,0.50)", letterSpacing: "0.02em", lineHeight: 1.5, paddingLeft: "19px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {n.msg}
            </div>
          </>
        ) : (
          <div style={{
            fontFamily: "var(--font-data)",
            fontSize: "9.5px",
            color: n.type === "warn" ? "rgba(245,166,35,0.78)" : "rgba(255,255,255,0.55)",
            letterSpacing: "0.02em",
            lineHeight: 1.55,
            whiteSpace: "pre",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {n.text}
          </div>
        )}
      </div>
      <span style={{
        fontFamily: "var(--font-data)",
        fontSize: "9px",
        color: "rgba(255,255,255,0.18)",
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
        flexShrink: 0,
        paddingTop: "2px",
      }}>
        {timeAgo(n.ts)}
      </span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MenuBar({ setLock, onShortcuts }) {
  const [notifications, setNotifs]  = useState([]);
  const [toasts, setToasts]         = useState([]);
  const [unread, setUnread]         = useState(0);
  const [open, setOpen]             = useState(false);
  const [shake, setShake]           = useState(false);

  const poolIdxRef = useRef(0);
  const bellRef    = useRef(null);
  const panelRef   = useRef(null);

  // ── Notification generator ────────────────────────────────────────────────
  useEffect(() => {
    let timeout;
    const fire = () => {
      const entry = NOTIF_POOL[poolIdxRef.current % NOTIF_POOL.length];
      poolIdxRef.current++;
      const notif = { id: Date.now(), ts: Date.now(), ...entry };
      setNotifs(prev => [notif, ...prev].slice(0, MAX_NOTIFS));
      setToasts(prev => [notif, ...prev].slice(0, 5));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== notif.id)), 4500);
      setUnread(u => u + 1);
      setShake(true);
      setTimeout(() => setShake(false), 650);
      timeout = setTimeout(fire, 60000);
    };
    timeout = setTimeout(fire, 60000);
    return () => clearTimeout(timeout);
  }, []);

  // ── Outside-click ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!bellRef.current?.contains(e.target) && !panelRef.current?.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleBell = () => { setOpen(o => !o); setUnread(0); };
  const handleLock = () => {
    if (setLock) { localStorage.removeItem("lastlogin"); setLock(true); }
  };

  return (
    <>
      {/* ── Bar ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0,
        height: "36px",
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-hairline)",
        display: "flex", alignItems: "center",
        padding: "0 16px",
        justifyContent: "space-between",
        zIndex: "var(--z-dock)",
      }}>
        <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", letterSpacing: "0.12em", color: "var(--accent-red)", fontWeight: 400 }}>
          NOCTURNE_OS
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          {/* Online */}
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(62,255,139,0.55)", display: "inline-block" }} />
            <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "rgba(255,255,255,0.22)", letterSpacing: "0.09em" }}>online</span>
          </div>
          {/* Help / shortcuts */}
          {onShortcuts && (
            <div onClick={onShortcuts} style={{ cursor: "pointer", display: "flex", alignItems: "center" }} title="Keyboard shortcuts (?)">
              <ShortcutsIcon />
            </div>
          )}
          {/* Bell */}
          <div ref={bellRef} onClick={handleBell} style={{ cursor: "pointer", position: "relative", display: "flex", alignItems: "center" }}>
            <motion.div
              animate={shake ? { rotate: [0, -14, 14, -9, 9, -4, 0] } : { rotate: 0 }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              style={{ display: "flex", alignItems: "center" }}
            >
              <BellIcon active={open} />
            </motion.div>
            <AnimatePresence>
              {unread > 0 && (
                <motion.div key="badge" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 600, damping: 25 }}
                  style={{ position: "absolute", top: "-3px", right: "-4px", minWidth: "7px", height: "7px", borderRadius: "50%", background: "var(--accent-red)", pointerEvents: "none" }}
                />
              )}
            </AnimatePresence>
          </div>
          {/* Lock */}
          <div onClick={handleLock} style={{ cursor: "pointer", display: "flex", alignItems: "center" }} title="Lock system">
            <LockIcon />
          </div>
        </div>
      </div>

      {/* ── On-screen toasts ── */}
      <div style={{ position: "fixed", top: "44px", right: "16px", zIndex: "var(--z-alert)", display: "flex", flexDirection: "column", gap: "6px", pointerEvents: "none" }}>
        <AnimatePresence initial={false}>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 48, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 48, scale: 0.97, transition: { duration: 0.22, ease: "easeIn" } }}
              transition={{ type: "spring", stiffness: 480, damping: 34, mass: 0.8 }}
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              style={{
                width: "288px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
                borderLeft: `2px solid ${
                  toast.kind === "sms" ? "rgba(122,92,255,0.55)"
                  : toast.type === "warn" ? "rgba(245,166,35,0.55)"
                  : "rgba(62,255,139,0.45)"
                }`,
                borderRadius: "5px",
                padding: "10px 14px 10px 12px",
                pointerEvents: "all",
                cursor: "pointer",
                boxShadow: "0 2px 0 rgba(255,255,255,0.04) inset, 0 10px 36px rgba(0,0,0,0.65)",
                display: "flex",
                alignItems: toast.kind === "sms" ? "flex-start" : "center",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <ToastBody n={toast} />
              <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "rgba(255,255,255,0.18)", letterSpacing: "0.04em", flexShrink: 0, paddingTop: toast.kind === "sms" ? "2px" : 0 }}>
                now
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Notification panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            key="notif-panel"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.14 } }}
            transition={{ type: "spring", stiffness: 500, damping: 36, mass: 0.7 }}
            style={{
              position: "fixed", top: "40px", right: "16px",
              width: "288px",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "5px",
              zIndex: "var(--z-overlay)",
              overflow: "hidden",
              boxShadow: "0 2px 0 rgba(255,255,255,0.04) inset, 0 12px 48px rgba(0,0,0,0.75)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 14px 8px", borderBottom: "1px solid var(--border-hairline)" }}>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "rgba(255,255,255,0.22)", letterSpacing: "0.14em" }}>SIGNALS</span>
              {notifications.length > 0 && (
                <span
                  onClick={() => { setNotifs([]); setUnread(0); }}
                  style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "rgba(255,255,255,0.20)", letterSpacing: "0.08em", cursor: "pointer", transition: "color 150ms" }}
                  onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.20)"}
                >
                  CLEAR
                </span>
              )}
            </div>

            {notifications.length === 0 ? (
              <div style={{ padding: "28px 14px", fontFamily: "var(--font-data)", fontSize: "10px", color: "rgba(255,255,255,0.14)", textAlign: "center", letterSpacing: "0.10em" }}>
                NO SIGNALS
              </div>
            ) : (
              <div style={{ maxHeight: "340px", overflowY: "auto", scrollbarWidth: "none" }}>
                <AnimatePresence initial={false}>
                  {notifications.map(n => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.18 }}
                    >
                      <PanelEntry n={n} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function BellIcon({ active }) {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
      stroke={active ? "rgba(255,255,255,0.55)" : "var(--text-muted)"}
      strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: "stroke 150ms" }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.stroke = "var(--text-secondary)"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.stroke = "var(--text-muted)"; }}
    >
      <path d="M6.5 1.5a3.5 3.5 0 00-3.5 3.5v2.5l-1 1.5h9l-1-1.5V5a3.5 3.5 0 00-3.5-3.5z" />
      <path d="M5.2 9.5a1.3 1.3 0 002.6 0" />
    </svg>
  );
}

function ShortcutsIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
      stroke="var(--text-muted)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: "stroke 150ms" }}
      onMouseEnter={e => e.currentTarget.style.stroke = "var(--text-secondary)"}
      onMouseLeave={e => e.currentTarget.style.stroke = "var(--text-muted)"}
    >
      <path d="M5 4.5a1.5 1.5 0 112.2 1.3C6.6 6.3 6.5 6.8 6.5 7.2" />
      <circle cx="6.5" cy="9.5" r="0.6" fill="var(--text-muted)" stroke="none" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
      stroke="var(--text-muted)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: "stroke 150ms" }}
      onMouseEnter={e => e.currentTarget.style.stroke = "var(--text-secondary)"}
      onMouseLeave={e => e.currentTarget.style.stroke = "var(--text-muted)"}
    >
      <rect x="2" y="6" width="9" height="6" rx="1" />
      <path d="M4 6V4a2.5 2.5 0 015 0v2" />
    </svg>
  );
}
