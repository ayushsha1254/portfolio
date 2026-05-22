import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import mainData from "../../Data/main.json";

const social = mainData?.explorer?.social ?? {};

const SOCIAL_LABELS = {
  github:    "GITHUB",
  linkedin:  "LINKEDIN",
  instagram: "INSTAGRAM",
  dribbble:  "DRIBBBLE",
  behance:   "BEHANCE",
  spotify:   "SPOTIFY",
  youtube:   "YOUTUBE",
  whatsapp:  "WHATSAPP",
};

const INPUT_STYLE = {
  width: "100%",
  background: "none",
  border: "none",
  borderBottom: "1px solid var(--border-default)",
  padding: "8px 0 8px 20px",
  fontFamily: "var(--font-data)",
  fontSize: 12,
  color: "var(--text-primary)",
  outline: "none",
  boxSizing: "border-box",
};

const FIELD_LABEL_STYLE = {
  fontFamily: "var(--font-data)",
  fontSize: 9,
  color: "var(--accent-green)",
  letterSpacing: "0.12em",
  marginBottom: 6,
  display: "flex",
  alignItems: "center",
  gap: 6,
};

export default function SignalApp() {
  const [form, setForm]     = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [extraPad, setExtraPad] = useState(0);
  const formRef = useRef(null);

  // Keyboard avoidance via visualViewport
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const handler = () => {
      const keyboardHeight = window.innerHeight - vv.height - vv.offsetTop;
      setExtraPad(keyboardHeight > 100 ? keyboardHeight : 0);
    };
    vv.addEventListener("resize", handler);
    vv.addEventListener("scroll", handler);
    return () => { vv.removeEventListener("resize", handler); vv.removeEventListener("scroll", handler); };
  }, []);

  const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          name: form.name,
          email: form.email,
          message: form.message,
          subject: `NOCTURNE_OS signal from ${form.name}`,
        }),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <div style={{
      padding: "16px 16px",
      paddingBottom: `calc(80px + ${extraPad}px + env(safe-area-inset-bottom))`,
    }}>
      {/* Terminal-style form */}
      <form ref={formRef} onSubmit={handleSubmit}>
        {/* Name */}
        <div style={{ marginBottom: 20 }}>
          <div style={FIELD_LABEL_STYLE}>
            <span style={{ color: "var(--text-muted)" }}>&gt;</span>
            <span>NAME</span>
          </div>
          <input
            type="text"
            placeholder="ayush sharma"
            value={form.name}
            onChange={handleChange("name")}
            style={{ ...INPUT_STYLE }}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: 20 }}>
          <div style={FIELD_LABEL_STYLE}>
            <span style={{ color: "var(--text-muted)" }}>&gt;</span>
            <span>EMAIL</span>
          </div>
          <input
            type="email"
            placeholder="you@domain.com"
            value={form.email}
            onChange={handleChange("email")}
            style={{ ...INPUT_STYLE }}
          />
        </div>

        {/* Message */}
        <div style={{ marginBottom: 24 }}>
          <div style={FIELD_LABEL_STYLE}>
            <span style={{ color: "var(--text-muted)" }}>&gt;</span>
            <span>MESSAGE</span>
          </div>
          <textarea
            placeholder="your signal..."
            value={form.message}
            onChange={handleChange("message")}
            rows={4}
            style={{
              ...INPUT_STYLE,
              resize: "none",
              lineHeight: 1.6,
              paddingLeft: 20,
            }}
          />
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={status === "sending" || status === "sent"}
          whileTap={{ scale: 0.97 }}
          style={{
            width: "100%",
            background: status === "sent"
              ? "rgba(62,255,139,0.08)"
              : "none",
            border: `1px solid ${
              status === "error" ? "var(--accent-red)"
              : status === "sent" ? "var(--accent-green)"
              : "var(--border-default)"
            }`,
            padding: "12px",
            fontFamily: "var(--font-data)", fontSize: 10,
            letterSpacing: "0.12em",
            color: status === "sent"
              ? "var(--accent-green)"
              : status === "error"
              ? "var(--accent-red)"
              : "var(--text-secondary)",
            cursor: status === "sending" ? "wait" : "pointer",
            borderRadius: 4,
          }}
        >
          {status === "sending" ? "TRANSMITTING_" : status === "sent" ? "SIGNAL_SENT ✓" : status === "error" ? "TRANSMISSION_FAILED" : "TRANSMIT_"}
        </motion.button>
      </form>

      {/* Social links */}
      <div style={{ marginTop: 32 }}>
        <div style={{
          fontFamily: "var(--font-data)", fontSize: 8,
          color: "var(--text-muted)", letterSpacing: "0.14em",
          marginBottom: 12,
        }}>
          LINKS
        </div>
        {Object.entries(social)
          .filter(([_, url]) => url)
          .map(([key, url]) => (
            <a key={key} href={url} target="_blank" rel="noreferrer" style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "9px 0",
              borderBottom: "1px solid var(--border-hairline)",
              fontFamily: "var(--font-data)", fontSize: 10,
              color: "var(--text-secondary)", letterSpacing: "0.08em",
              textDecoration: "none",
            }}>
              <span>{SOCIAL_LABELS[key] || key.toUpperCase()}</span>
              <span style={{ color: "var(--text-muted)" }}>↗</span>
            </a>
          ))}
      </div>
    </div>
  );
}
