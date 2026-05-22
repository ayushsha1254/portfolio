import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Apps imported after each task completes — stubs for now
import ArchiveApp from "./apps/ArchiveApp";
import StudioApp  from "./apps/StudioApp";
import ArenaApp   from "./apps/ArenaApp";
// import SignalApp  from "./apps/SignalApp";
// import ResumeApp  from "./apps/ResumeApp";

const APP_META = {
  archive: { label: "ARCHIVE", color: "#8A8A8A", tabs: ["ABOUT","SKILLS","PROJECTS","CERTS","SIH"] },
  studio:  { label: "STUDIO",  color: "#7A5CFF", tabs: ["PLAYER","TRACKS"] },
  arena:   { label: "ARENA",   color: "#FF3B30", tabs: ["FEATURED","ALL"] },
  signal:  { label: "SIGNAL",  color: "#F5A623", tabs: null },
  resume:  { label: "RESUME",  color: "#8A8A8A", tabs: null },
};

function AppStub({ app, tab }) {
  return (
    <div style={{
      padding: 24,
      fontFamily: "var(--font-data)", fontSize: 10,
      color: "var(--text-muted)", letterSpacing: "0.1em",
    }}>
      {app.toUpperCase()}
      {tab && <span style={{ marginLeft: 8, color: "var(--border-default)" }}>/ {tab}</span>}
      <div style={{ marginTop: 8, fontSize: 9, color: "var(--border-subtle)" }}>COMING SOON</div>
    </div>
  );
}

const shellVariants = {
  initial: { x: "100vw" },
  animate: { x: 0, transition: { duration: 0.28, ease: [0.0, 0.0, 0.2, 1] } },
  exit:    { x: "100vw", transition: { duration: 0.22, ease: [0.4, 0.0, 1.0, 1.0] } },
};

export default function AppShell({ app, onBack, ...musicProps }) {
  const meta = APP_META[app];
  const [activeTab, setActiveTab] = useState(meta.tabs ? meta.tabs[0] : null);

  const handleDragEnd = (_, info) => {
    if (info.offset.x > window.innerWidth * 0.3) onBack();
  };

  const renderApp = () => {
    if (app === "archive") return <ArchiveApp tab={activeTab} />;
    if (app === "studio")  return <StudioApp  tab={activeTab} {...musicProps} />;
    if (app === "arena")   return <ArenaApp   tab={activeTab} />;
    // if (app === "signal")  return <SignalApp />;
    // if (app === "resume")  return <ResumeApp />;
    return <AppStub app={app} tab={activeTab} />;
  };

  return (
    <motion.div
      variants={shellVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      drag="x"
      dragConstraints={{ left: 0 }}
      dragElastic={0.08}
      onDragEnd={handleDragEnd}
      style={{
        position: "fixed", inset: 0,
        background: "var(--bg-base)",
        display: "flex", flexDirection: "column",
        zIndex: 20,
        touchAction: "pan-y",
      }}
    >
      {/* Top nav bar */}
      <div style={{
        height: 44, flexShrink: 0,
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-hairline)",
        display: "flex", alignItems: "center",
        padding: "0 16px", gap: 8,
      }}>
        <button
          onClick={onBack}
          aria-label="Go back"
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--accent-red)", fontSize: 15,
            padding: "4px 8px 4px 0", lineHeight: 1,
          }}
        >
          ←
        </button>
        <span style={{
          flex: 1, textAlign: "center",
          fontFamily: "var(--font-data)", fontSize: 10,
          color: "var(--text-muted)", letterSpacing: "0.08em",
        }}>
          {meta.label}
        </span>
        <div style={{ width: 32 }} />
      </div>

      {/* Accent bar */}
      <div style={{ height: 2, background: meta.color, flexShrink: 0 }} />

      {/* Content area with scroll fade */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <div style={{ height: "100%", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab || app}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {renderApp()}
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Scroll fade overlay */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: 44, pointerEvents: "none",
          background: "linear-gradient(transparent, var(--bg-elevated))",
        }} />
      </div>

      {/* Tab bar (only for apps with tabs) */}
      {meta.tabs && (
        <div style={{
          height: `calc(52px + env(safe-area-inset-bottom))`,
          paddingBottom: "env(safe-area-inset-bottom)",
          background: "var(--bg-surface)",
          borderTop: "1px solid var(--border-hairline)",
          display: "flex", flexShrink: 0,
          position: "relative",
        }}>
          {meta.tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1, height: 52,
                background: "none", border: "none", cursor: "pointer",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                borderTop: activeTab === tab
                  ? `1.5px solid ${meta.color}`
                  : "1.5px solid transparent",
                paddingTop: 4,
              }}
            >
              <span style={{
                fontFamily: "var(--font-data)", fontSize: 7,
                color: activeTab === tab ? "var(--text-primary)" : "var(--text-muted)",
                letterSpacing: "0.10em", textTransform: "uppercase",
              }}>
                {tab}
              </span>
            </button>
          ))}
          {/* Home indicator inside safe-area zone */}
          <div style={{
            position: "absolute",
            bottom: "calc(env(safe-area-inset-bottom, 8px) * 0.4)",
            left: "50%", transform: "translateX(-50%)",
            width: 36, height: 3,
            background: "rgba(255,255,255,0.15)", borderRadius: 2,
          }} />
        </div>
      )}
    </motion.div>
  );
}
