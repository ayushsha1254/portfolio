import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Social channels ────────────────────────────────────────────────────────────
const CHANNELS = [
  { id: "github",    label: "github",    href: "https://github.com/ayushsha1254",                           handle: "ayushsha1254"        },
  { id: "linkedin",  label: "linkedin",  href: "https://www.linkedin.com/in/ayushconnect/",                 handle: "ayushconnect"        },
  { id: "instagram", label: "instagram", href: "https://www.instagram.com/ayush12.dng/",                    handle: "ayush12.dng"         },
  { id: "spotify",   label: "spotify",   href: "https://open.spotify.com/user/b92x1gxf5wagtlq70cxeol1yr",  handle: "b92x1gxf5wagtlq70cx" },
  { id: "youtube",   label: "youtube",   href: "https://www.youtube.com/channel/UCwewDSpA4jXaIs4fqXHAYQA",  handle: "ayushsharma"         },
  { id: "dribbble",  label: "dribbble",  href: "https://dribbble.com/ayush12_dng",                          handle: "ayush12_dng"         },
  { id: "behance",   label: "behance",   href: "https://www.behance.net/ayushsharma40",                      handle: "ayushsharma40"       },
  { id: "mail",      label: "mail",      href: "mailto:ayush.sharma@finmo.net",                              handle: "ayush.sharma@finmo"  },
];

// ── Boot lines ─────────────────────────────────────────────────────────────────
const BOOT_LINES = [
  { text: "nocturne@signal ∼ $ compose --new-transmission", color: "var(--accent-green)", delay: 0 },
  { text: "", delay: 60 },
  { text: "[INIT] opening secure channel...", color: "var(--text-secondary)", delay: 120 },
  { text: "[READY] transmission protocol v2.4 active", color: "var(--accent-green)", delay: 200 },
];

const STYLE = `
@keyframes cursor-blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
.sig-cursor { display:inline-block; width:7px; height:13px; background:var(--accent-green); margin-left:2px; vertical-align:middle; animation:cursor-blink 1s step-end infinite; }
@keyframes sig-pulse { 0%{box-shadow:0 0 0 0 rgba(62,255,139,0.45)} 70%{box-shadow:0 0 0 14px rgba(62,255,139,0)} 100%{box-shadow:0 0 0 0 rgba(62,255,139,0)} }
.sig-transmit-pulse { animation: sig-pulse 0.6s ease-out; }
`;

// ── BootLine ───────────────────────────────────────────────────────────────────
function BootLine({ text, color, show }) {
  if (!show) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "12px",
        color: color || "var(--text-secondary)",
        lineHeight: "1.6",
        whiteSpace: "pre",
        minHeight: "1.6em",
      }}
    >
      {text}
    </motion.div>
  );
}

// ── TermInput ──────────────────────────────────────────────────────────────────
function TermInput({ label, value, onChange, multiline, disabled, autoFocus }) {
  const sharedStyle = {
    fontFamily: "var(--font-mono)",
    fontSize: "13px",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid var(--border-subtle)",
    color: "var(--text-primary)",
    outline: "none",
    padding: "4px 0 6px",
    width: "100%",
    resize: "none",
    transition: "border-color 0.15s",
    caretColor: "var(--accent-green)",
  };

  return (
    <div style={{ display: "flex", alignItems: multiline ? "flex-start" : "center", gap: "10px", marginBottom: "14px" }}>
      <span style={{
        fontFamily: "var(--font-mono)",
        fontSize: "12px",
        color: "var(--accent-green)",
        opacity: 0.8,
        whiteSpace: "nowrap",
        paddingTop: multiline ? "6px" : "4px",
        userSelect: "none",
      }}>
        {">"} {label}
      </span>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          autoFocus={autoFocus}
          style={{ ...sharedStyle, lineHeight: "1.6" }}
          onFocus={e => { e.target.style.borderBottomColor = "var(--accent-green)"; }}
          onBlur={e => { e.target.style.borderBottomColor = "var(--border-subtle)"; }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          autoFocus={autoFocus}
          style={sharedStyle}
          onFocus={e => { e.target.style.borderBottomColor = "var(--accent-green)"; }}
          onBlur={e => { e.target.style.borderBottomColor = "var(--border-subtle)"; }}
        />
      )}
    </div>
  );
}

// ── ChannelChip ────────────────────────────────────────────────────────────────
function ChannelChip({ ch }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={ch.href}
      target={ch.id === "mail" ? "_self" : "_blank"}
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        color: hov ? "var(--text-primary)" : "var(--text-secondary)",
        textDecoration: "none",
        border: `1px solid ${hov ? "var(--border-strong)" : "var(--border-subtle)"}`,
        borderRadius: "3px",
        padding: "3px 9px 3px 7px",
        transition: "color 0.13s, border-color 0.13s, background 0.13s",
        background: hov ? "var(--bg-overlay)" : "transparent",
        letterSpacing: "0.03em",
      }}
    >
      <span style={{ color: "var(--accent-green)", fontSize: "10px", lineHeight: 1 }}>↗</span>
      {ch.label}
    </a>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function Signal() {
  const [bootStep, setBootStep]   = useState(0);
  const [ready, setReady]         = useState(false);
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [subject, setSubject]     = useState("");
  const [message, setMessage]     = useState("");
  const [status, setStatus]       = useState(null); // null | "sending" | "ok" | "err"
  const [outputLines, setOutput]  = useState([]);
  const transmitRef               = useRef(null);
  const scrollRef                 = useRef(null);

  const resetErr = () => { if (status === "err") { setStatus(null); setOutput([]); } };

  // Boot sequence
  useEffect(() => {
    let i = 0;
    const step = () => {
      if (i >= BOOT_LINES.length) { setReady(true); return; }
      const line = BOOT_LINES[i];
      setTimeout(() => { setBootStep(s => s + 1); i++; step(); }, line.delay || 200);
    };
    step();
  }, []);

  // Scroll to bottom on new output
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [outputLines, bootStep]);

  const pushLine = (text, color) =>
    setOutput(prev => [...prev, { text, color, id: Date.now() + Math.random() }]);

  const handleTransmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      pushLine("[ERR] missing required fields: SENDER_NAME, SENDER_ADDR, PAYLOAD", "var(--accent-red)");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      pushLine("[ERR] invalid SENDER_ADDR format", "var(--accent-red)");
      return;
    }

    setStatus("sending");
    setOutput([]);
    pushLine("[TX] encrypting payload...", "var(--text-secondary)");
    pushLine(`[TX] routing to nocturne relay → ${email}`, "var(--text-secondary)");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          name, email,
          subject: subject || "nocturne transmission",
          message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        pushLine("[ACK] transmission received. response within 24h.", "var(--accent-green)");
        setStatus("ok");
        transmitRef.current?.classList.add("sig-transmit-pulse");
        setTimeout(() => transmitRef.current?.classList.remove("sig-transmit-pulse"), 700);
        setName(""); setEmail(""); setSubject(""); setMessage("");
      } else {
        throw new Error(data.message || "rejected");
      }
    } catch (err) {
      pushLine(`[ERR] ${err.message || "relay unreachable"}. try direct channel: mail`, "var(--accent-red)");
      setStatus("err");
    }
  };

  const disabled = status === "sending" || status === "ok";

  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "var(--bg-elevated)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      <style>{STYLE}</style>

      {/* Scroll area */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {/* Boot lines */}
        {BOOT_LINES.map((line, idx) => (
          <BootLine key={idx} {...line} show={bootStep > idx} />
        ))}

        {/* Separator */}
        {ready && (
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ height: "1px", background: "var(--border-subtle)", margin: "16px 0" }}
          />
        )}

        {/* Form */}
        <AnimatePresence>
          {ready && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, delay: 0.1 }}
            >
              <TermInput label="SENDER_NAME" value={name}    onChange={v => { resetErr(); setName(v); }}    disabled={disabled} autoFocus />
              <TermInput label="SENDER_ADDR" value={email}   onChange={v => { resetErr(); setEmail(v); }}   disabled={disabled} />
              <TermInput label="SUBJECT    " value={subject} onChange={v => { resetErr(); setSubject(v); }} disabled={disabled} />
              <TermInput label="PAYLOAD    " value={message} onChange={v => { resetErr(); setMessage(v); }} disabled={disabled} multiline />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Output lines */}
        {outputLines.map(line => (
          <motion.div
            key={line.id}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              color: line.color || "var(--text-secondary)",
              lineHeight: "1.7",
              marginTop: "2px",
            }}
          >
            {line.text}
          </motion.div>
        ))}

        {/* Cursor when idle */}
        {ready && status === null && (
          <div style={{ marginTop: "4px", height: "16px" }}>
            <span className="sig-cursor" />
          </div>
        )}
      </div>

      {/* Bottom bar — channels + transmit */}
      {ready && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.2 }}
          style={{
            borderTop: "1px solid var(--border-subtle)",
            padding: "12px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
            background: "var(--bg-surface)",
          }}
        >
          {/* Channel chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {CHANNELS.map(ch => <ChannelChip key={ch.id} ch={ch} />)}
          </div>

          {/* Transmit button */}
          <motion.button
            ref={transmitRef}
            onClick={handleTransmit}
            disabled={disabled}
            whileHover={disabled ? {} : { scale: 1.03 }}
            whileTap={disabled ? {} : { scale: 0.97 }}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              letterSpacing: "0.1em",
              color: status === "ok" ? "var(--accent-green)" : status === "err" ? "var(--accent-red)" : "var(--text-primary)",
              background: "transparent",
              border: `1px solid ${status === "ok" ? "var(--accent-green)" : status === "err" ? "var(--accent-red)" : "var(--border-strong)"}`,
              borderRadius: "3px",
              padding: "6px 18px",
              cursor: disabled ? "default" : "pointer",
              opacity: status === "sending" ? 0.6 : 1,
              transition: "color 0.2s, border-color 0.2s",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {status === "sending" ? "TRANSMITTING_" : status === "ok" ? "TRANSMITTED_" : "TRANSMIT_"}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
