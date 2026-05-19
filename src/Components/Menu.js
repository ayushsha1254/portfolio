import React from "react";
import useContextMenu from "./useContextMenu";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toggleExplorer } from "../Utility/state/action";

const ITEM_STYLE = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "7px 10px",
  borderRadius: "5px",
  cursor: "pointer",
  fontFamily: "var(--font-body)",
  fontSize: "12px",
  color: "var(--text-secondary)",
  letterSpacing: "0.01em",
  transition: "background 100ms, color 100ms",
};

function MenuItem({ icon, label, onClick, danger }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...ITEM_STYLE,
        background: hover ? "var(--bg-surface)" : "transparent",
        color: danger
          ? hover ? "var(--accent-red)" : "rgba(255,59,48,0.7)"
          : hover ? "var(--text-primary)" : "var(--text-secondary)",
      }}
    >
      <span style={{ opacity: 0.7, display: "flex", alignItems: "center" }}>{icon}</span>
      {label}
    </div>
  );
}

const Menu = ({ setLock }) => {
  const { anchorPoint, show } = useContextMenu();
  const dispatch = useDispatch();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -4 }}
          transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.8, duration: 0.15 }}
          style={{
            position: "fixed",
            top: anchorPoint.y,
            left: anchorPoint.x,
            zIndex: "var(--z-overlay)",
            background: "var(--bg-overlay)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "8px",
            padding: "6px",
            width: "200px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-data)",
              fontSize: "9px",
              color: "var(--text-muted)",
              letterSpacing: "0.14em",
              padding: "4px 10px 8px",
              textTransform: "uppercase",
            }}
          >
            NOCTURNE_OS
          </div>

          <MenuItem
            icon={<ArchiveIcon />}
            label="Open Archive"
            onClick={() => dispatch(toggleExplorer())}
          />

          <div
            style={{
              height: "1px",
              background: "var(--border-hairline)",
              margin: "4px 0",
            }}
          />

          {setLock && (
            <MenuItem
              icon={<LockIcon />}
              label="Lock System"
              danger
              onClick={() => {
                localStorage.removeItem("lastlogin");
                setLock(true);
              }}
            />
          )}

          <div
            style={{
              fontFamily: "var(--font-data)",
              fontSize: "9px",
              color: "var(--text-muted)",
              letterSpacing: "0.1em",
              padding: "8px 10px 2px",
              textTransform: "uppercase",
            }}
          >
            Portfolio by Ayush Sharma
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Menu;

function ArchiveIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="10" height="3" rx="0.8" />
      <rect x="2" y="7" width="10" height="5" rx="0.8" />
      <line x1="5" y1="3.5" x2="9" y2="3.5" />
      <line x1="5" y1="9.5" x2="9" y2="9.5" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="6" width="9" height="6.5" rx="1" />
      <path d="M4.5 6V4.5a2.5 2.5 0 015 0V6" />
    </svg>
  );
}
