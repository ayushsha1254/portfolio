import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const SHORTCUTS = [
  { keys: ["Alt", "E"],  action: "Archive"        },
  { keys: ["Alt", "L"],  action: "Lock screen"    },
  { keys: ["Alt", "T"],  action: "Terminal"       },
  { keys: ["?"],         action: "This panel"     },
  { keys: ["Esc"],       action: "Close window"   },
  { keys: ["↑", "↓"],   action: "Terminal history"},
];

function Kbd({ children }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-mono)",
      fontSize: "10px",
      color: "var(--text-secondary)",
      background: "var(--bg-overlay)",
      border: "1px solid var(--border-default)",
      borderRadius: "3px",
      padding: "2px 7px",
      minWidth: "22px",
      lineHeight: "16px",
    }}>
      {children}
    </span>
  );
}

export default function ShortcutDrawer({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: "calc(var(--z-overlay) - 1)",
              background: "rgba(0,0,0,0.35)",
            }}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 36, mass: 0.8 }}
            style={{
              position: "fixed",
              bottom: 0,
              left: "50%",
              x: "-50%",
              width: "min(560px, 90vw)",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              borderBottom: "none",
              borderRadius: "8px 8px 0 0",
              padding: "20px 24px 32px",
              zIndex: "var(--z-overlay)",
              boxShadow: "0 -12px 48px rgba(0,0,0,0.6)",
            }}
          >
            {/* Handle */}
            <div style={{
              width: "32px",
              height: "3px",
              background: "var(--border-default)",
              borderRadius: "2px",
              margin: "0 auto 20px",
            }} />

            {/* Header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}>
              <span style={{
                fontFamily: "var(--font-data)",
                fontSize: "10px",
                color: "var(--accent-red)",
                letterSpacing: "0.18em",
              }}>
                KEYBOARD_SHORTCUTS
              </span>
              <button
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  padding: "2px 6px",
                }}
              >
                ESC
              </button>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "var(--border-hairline)", marginBottom: "16px" }} />

            {/* Shortcuts grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px 24px",
            }}>
              {SHORTCUTS.map(({ keys, action }) => (
                <div
                  key={action}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    borderBottom: "1px solid var(--border-hairline)",
                  }}
                >
                  <span style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                  }}>
                    {action}
                  </span>
                  <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                    {keys.map((k, i) => (
                      <React.Fragment key={k}>
                        <Kbd>{k}</Kbd>
                        {i < keys.length - 1 && (
                          <span style={{ color: "var(--text-muted)", fontSize: "10px" }}>+</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
