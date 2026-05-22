# NOCTURNE_OS Mobile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full NOCTURNE_OS mobile experience for ≤1000px viewports — cinematic boot/lock, ambient clock home, swipe-up grouped launcher, full-screen apps with tab navigation (Archive/Studio/Arena/Signal/Resume).

**Architecture:** New `src/Mobile/` directory — all mobile code isolated from desktop. `MobileOS.js` replaces the current plaintext mobile gate in `App.js`. ReactHowler stays a singleton in `App.js`; music props (`howlerRef`, `playing`, `setPlaying`, `nowPlaying`, `setNowPlaying`, `progress`, `setProgress`, `seek`, `setSeek`, `songs`, `duration`, `setDuration`) are passed down to `MobileOS` and forwarded to `StudioApp`. No Redux on mobile — local `useState` only. Shared session keys (`nocturne_booted`, `lastlogin`) work identically to desktop.

**Tech Stack:** React 18, Framer Motion 11, CSS custom properties from `src/styles/tokens.css`, portfolio data at `src/Data/main.json` (under `explorer` key — NOT top-level), music data at `src/Data/music.json` (array of `{name,src,art,artist,album,album_art,year}`).

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/App.js` | Modify lines 171–183 + 206 | Replace mobile gate + always render ReactHowler |
| `src/Mobile/MobileOS.js` | Create | Boot/lock/home state machine, root layout |
| `src/Mobile/AmbientHome.js` | Create | Clock, date, now-playing pill, vitals grid, swipe-up handle |
| `src/Mobile/LauncherSheet.js` | Create | Swipe-up bottom sheet with app grid + now-playing bar |
| `src/Mobile/AppShell.js` | Create | Full-screen wrapper: nav bar, accent bar, tab bar, enter/exit animations |
| `src/Mobile/apps/ArchiveApp.js` | Create | 5 tabs: ABOUT · SKILLS · PROJECTS · CERTS · SIH |
| `src/Mobile/apps/StudioApp.js` | Create | 2 tabs: PLAYER · TRACKS — controls howlerRef directly |
| `src/Mobile/apps/ArenaApp.js` | Create | 2 tabs: FEATURED · ALL |
| `src/Mobile/apps/SignalApp.js` | Create | Contact form, keyboard avoidance, social links |
| `src/Mobile/apps/ResumeApp.js` | Create | Download button + scrollable resume sections |
| `src/index.css` | Modify | Add landscape rotation prompt styles |

**Data access cheat-sheet** (verified against actual files):
- Bio/about: `mainData.explorer.about.about` (string)
- Education: `mainData.explorer.about.education` (array of `{name,degree,year}`)
- Skills: `mainData.explorer.skills` (array of `{name,category[],color}`) — 19 items
- Skill categories: `Programming | Frontend | VCS | Cloud | Utility | Backend | Soft Skills | Design`
- Projects: `mainData.explorer.projects` (array of `{name,tagline,description,stack[],link,github,color,timeline}`) — 11 items
- Certs: `mainData.explorer.certifications` (array of `{name,date,image,link,issuer:{name,image}}`) — 2 items
- Social: `mainData.explorer.social` (`{whatsapp,instagram,linkedin,spotify,github,youtube,dribbble,behance}`)
- Resume: `mainData.resume` (`{name,subheading,email,phone,website,github,linkedin,location,description,skills,education,softskills,experience,awards,languages}`)
- Resume experience: `{name,position,duration,description}` per item
- Resume awards: array of plain strings
- Music: `musicData` array of `{name,src,art,artist,album,album_art,year}`

**App accent colors** (from `TYPE_ACCENT` in `Dock.js`):
```js
const APP_COLOR = {
  archive: "#8A8A8A",
  studio:  "#7A5CFF",
  arena:   "#FF3B30",
  signal:  "#F5A623",
  resume:  "#8A8A8A",
};
```

---

## Task 1: App.js Integration + MobileOS.js (M1 shell start)

**Files:**
- Modify: `src/App.js:171–183` (replace mobile gate) and `src/App.js:206` (move ReactHowler)
- Create: `src/Mobile/MobileOS.js`

- [ ] **Step 1: Create `src/Mobile/MobileOS.js`**

```jsx
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Lock from "../Pages/Lock";
import Loader from "../Pages/Loader";
import Grain from "../Components/Grain";
import AmbientHome from "./AmbientHome";
import LauncherSheet from "./LauncherSheet";
import AppShell from "./AppShell";

export default function MobileOS({
  howlerRef,
  playing, setPlaying,
  nowPlaying, setNowPlaying,
  progress, setProgress,
  seek, setSeek,
  songs, duration, setDuration,
}) {
  const [booted,       setBooted]       = useState(() => !!sessionStorage.getItem("nocturne_booted"));
  const [locked,       setLocked]       = useState(() => !localStorage.getItem("lastlogin"));
  const [activeApp,    setActiveApp]    = useState(null);
  const [launcherOpen, setLauncherOpen] = useState(false);

  if (!booted) {
    return (
      <>
        <Grain />
        <Loader onDone={() => {
          sessionStorage.setItem("nocturne_booted", "1");
          setBooted(true);
        }} />
      </>
    );
  }

  if (locked) {
    return (
      <>
        <Grain />
        <Lock lock={true} setLock={() => setLocked(false)} />
      </>
    );
  }

  const musicProps = {
    howlerRef, playing, setPlaying,
    nowPlaying, setNowPlaying,
    progress, setProgress,
    seek, setSeek,
    songs, duration, setDuration,
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg-void)", overflow: "hidden" }}>
      <Grain />

      <AmbientHome
        nowPlaying={nowPlaying}
        playing={playing}
        dimmed={launcherOpen || !!activeApp}
        onOpenStudio={() => setActiveApp("studio")}
        onOpenLauncher={() => setLauncherOpen(true)}
      />

      <AnimatePresence>
        {launcherOpen && (
          <LauncherSheet
            key="launcher"
            onClose={() => setLauncherOpen(false)}
            onLaunchApp={(app) => { setActiveApp(app); setLauncherOpen(false); }}
            nowPlaying={nowPlaying}
            playing={playing}
            onPlayPause={() => setPlaying(p => !p)}
            onOpenStudio={() => { setActiveApp("studio"); setLauncherOpen(false); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeApp && (
          <AppShell
            key={activeApp}
            app={activeApp}
            onBack={() => setActiveApp(null)}
            {...musicProps}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Modify `src/App.js` — replace mobile gate and move ReactHowler**

Find lines 171–183 (the mobile gate that returns a plaintext div) and replace:

```jsx
// BEFORE (lines 171-183):
if (mobile) return (
  <div style={{
    position: "fixed", inset: 0,
    background: "var(--bg-void)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "var(--font-mono)", fontSize: "12px",
    color: "var(--text-secondary)", textAlign: "center",
    padding: "24px",
  }}>
    NOCTURNE_OS requires a desktop viewport.
  </div>
);

// AFTER:
if (mobile) return (
  <>
    <ReactHowler
      ref={ref}
      playing={playing}
      onLoad={() => { setDuration(ref.current.duration()); ref.current.volume(0.5); }}
      loop
      src={nowPlaying?.src ?? "https://rs-bucket-s3.s3.ap-south-1.amazonaws.com/music/sos-rs.mp3"}
    />
    <MobileOS
      howlerRef={ref}
      playing={playing}       setPlaying={setPlaying}
      nowPlaying={nowPlaying} setNowPlaying={setNowPlaying}
      progress={progress}     setProgress={setProgress}
      seek={seek}             setSeek={setSeek}
      songs={songs}
      duration={duration}     setDuration={setDuration}
    />
  </>
);
```

Also add the import at the top of `src/App.js` (after existing imports):
```jsx
import MobileOS from "./Mobile/MobileOS";
```

- [ ] **Step 3: Smoke-test in browser**

Run `npm run dev`. Open DevTools → responsive mode → set width to 390px (iPhone 14).

Expected:
- Loader boot animation plays (~4 seconds)
- Lock screen appears
- Press any key or tap → lock dismisses
- You land on a blank `--bg-void` screen (AmbientHome not yet built — that's fine)
- No console errors

- [ ] **Step 4: Commit**

```bash
git add src/App.js src/Mobile/MobileOS.js
git commit -m "feat(mobile): M1 — MobileOS root + App.js integration"
```

---

## Task 2: AmbientHome.js (M1 ambient clock screen)

**Files:**
- Create: `src/Mobile/AmbientHome.js`

- [ ] **Step 1: Create `src/Mobile/AmbientHome.js`**

```jsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import mainData from "../Data/main.json";

const DAYS   = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

function formatUptime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

const PROJECTS_COUNT = mainData.explorer.projects.length;
const SECTIONS_COUNT = Object.keys(mainData.explorer).length; // 5

export default function AmbientHome({
  nowPlaying, playing, dimmed,
  onOpenStudio, onOpenLauncher,
}) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [uptime, setUptime] = useState("0s");
  const startRef = useRef(Date.now());
  const touchStartY = useRef(null);

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      const h = n.getHours().toString().padStart(2, "0");
      const m = n.getMinutes().toString().padStart(2, "0");
      setTime(`${h}:${m}`);
      setDate(`${DAYS[n.getDay()]} · ${n.getDate()} ${MONTHS[n.getMonth()]} ${n.getFullYear()}`);
      setUptime(formatUptime(Date.now() - startRef.current));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartY.current === null) return;
    const delta = touchStartY.current - e.changedTouches[0].clientY;
    if (delta > 50) onOpenLauncher();
    touchStartY.current = null;
  };

  const layer = {
    filter: dimmed ? "blur(6px)" : "none",
    opacity: dimmed ? 0.45 : 1,
    transition: "filter 0.25s, opacity 0.25s",
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "var(--bg-void)",
        display: "flex", flexDirection: "column",
        alignItems: "center",
        ...layer,
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Clock block (centered at ~40% height) ─────────────── */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        marginTop: "38vh",
      }}>
        <div style={{
          fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 400,
          color: "var(--text-primary)", letterSpacing: "-0.02em",
          lineHeight: 1,
        }}>
          {time}
        </div>

        <div style={{
          fontFamily: "var(--font-data)", fontSize: 11,
          color: "var(--text-muted)", letterSpacing: "0.12em",
          marginTop: 8,
        }}>
          {date}
        </div>

        {/* Now-playing pill */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 480, damping: 32 }}
          onClick={onOpenStudio}
          style={{
            marginTop: 12,
            display: "flex", alignItems: "center", gap: 8,
            height: 40, padding: "0 12px",
            border: "1px solid rgba(122,92,255,0.3)",
            borderRadius: 20,
            cursor: "pointer",
            background: "rgba(122,92,255,0.06)",
          }}
        >
          {nowPlaying ? (
            <>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "var(--bg-elevated)",
                backgroundImage: `url(${nowPlaying.art || nowPlaying.album_art})`,
                backgroundSize: "cover", backgroundPosition: "center",
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "var(--font-data)", fontSize: 9,
                color: "var(--text-secondary)", letterSpacing: "0.06em",
                maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {nowPlaying.name}
              </span>
              <span style={{
                fontFamily: "var(--font-data)", fontSize: 9,
                color: playing ? "rgba(122,92,255,0.8)" : "var(--text-muted)",
              }}>
                {playing ? "▶" : "⏸"}
              </span>
            </>
          ) : (
            <span style={{
              fontFamily: "var(--font-data)", fontSize: 9,
              color: "var(--text-muted)", letterSpacing: "0.08em",
            }}>
              NO SIGNAL
            </span>
          )}
        </motion.div>

        {/* Vitals grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 8, marginTop: 16, width: 200,
        }}>
          {[
            { label: "ARCHIVE", value: `${SECTIONS_COUNT} sect.` },
            { label: "ARENA",   value: `${PROJECTS_COUNT} proj.` },
            { label: "SIGNAL",  value: "● ready" },
            { label: "UPTIME",  value: uptime },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-hairline)",
              borderRadius: 8, padding: "8px 10px",
            }}>
              <div style={{
                fontFamily: "var(--font-data)", fontSize: 7,
                color: "var(--text-muted)", letterSpacing: "0.12em",
                marginBottom: 3,
              }}>
                {label}
              </div>
              <div style={{
                fontFamily: "var(--font-data)", fontSize: 9,
                color: "var(--text-secondary)",
              }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Swipe handle area (bottom 64px) ───────────────────── */}
      <div
        onClick={onOpenLauncher}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: 64,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <span style={{
          fontFamily: "var(--font-data)", fontSize: 8,
          color: "var(--text-muted)", letterSpacing: "0.14em",
        }}>
          ↑ LAUNCH
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

At 390px width, after boot + unlock:
- See large clock centered at roughly 40% of screen height
- Date below it in small mono text
- Now-playing pill below date (shows "NO SIGNAL" if no track loaded, or track name if one is playing)
- 2×2 vitals grid below pill
- "↑ LAUNCH" at the very bottom
- Tap "↑ LAUNCH" → nothing visible yet (LauncherSheet not built)
- No errors in console

- [ ] **Step 3: Commit**

```bash
git add src/Mobile/AmbientHome.js
git commit -m "feat(mobile): M1 — AmbientHome ambient clock screen"
```

---

## Task 3: LauncherSheet.js (M1 app launcher)

**Files:**
- Create: `src/Mobile/LauncherSheet.js`

- [ ] **Step 1: Create `src/Mobile/LauncherSheet.js`**

```jsx
import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPRING = { type: "spring", stiffness: 400, damping: 34, mass: 0.8 };

const WORK_APPS = [
  { id: "archive", label: "ARCHIVE", color: "#8A8A8A", status: "5 sect." },
  { id: "arena",   label: "ARENA",   color: "#FF3B30", status: "11 proj." },
  { id: "resume",  label: "RESUME",  color: "#8A8A8A", status: "cv · pdf" },
];

const CONNECT_APPS = [
  { id: "studio", label: "STUDIO", color: "#7A5CFF", status: "music" },
  { id: "signal", label: "SIGNAL", color: "#F5A623", status: "● ready" },
];

function AppTile({ app, onLaunch }) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={() => onLaunch(app.id)}
      style={{
        background: "var(--bg-elevated)",
        border: `1px solid rgba(255,255,255,0.08)`,
        borderTop: `2px solid ${app.color}`,
        borderRadius: 5,
        padding: "12px 8px 10px",
        display: "flex", flexDirection: "column", alignItems: "center",
        cursor: "pointer", width: "100%",
        fontFamily: "var(--font-data)",
      }}
    >
      <span style={{ fontSize: 8, color: "var(--text-secondary)", letterSpacing: "0.08em" }}>
        {app.label}
      </span>
      <span style={{ fontSize: 7, color: "var(--text-muted)", letterSpacing: "0.06em", marginTop: 3 }}>
        {app.status}
      </span>
    </motion.button>
  );
}

export default function LauncherSheet({
  onClose, onLaunchApp,
  nowPlaying, playing, onPlayPause, onOpenStudio,
}) {
  const dragStartY = useRef(0);

  const handleDragEnd = (_, info) => {
    if (info.offset.y > 80) onClose();
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={SPRING}
      drag="y"
      dragConstraints={{ top: 0 }}
      dragElastic={0.12}
      onDragEnd={handleDragEnd}
      style={{
        position: "fixed", left: 0, right: 0, bottom: 0,
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-subtle)",
        borderRadius: "16px 16px 0 0",
        zIndex: 15,
        display: "flex", flexDirection: "column",
        maxHeight: "80vh",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* Drag handle */}
      <div style={{
        display: "flex", justifyContent: "center", padding: "12px 0 8px",
        flexShrink: 0, cursor: "grab",
      }}>
        <div style={{
          width: 22, height: 3,
          background: "var(--border-default)", borderRadius: 2,
        }} />
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 16px" }}>
        {/* WORK group */}
        <div style={{
          fontFamily: "var(--font-data)", fontSize: 8,
          color: "var(--text-muted)", letterSpacing: "0.14em",
          marginBottom: 8, marginTop: 4,
        }}>
          WORK
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8,
          marginBottom: 16,
        }}>
          {WORK_APPS.map(app => (
            <AppTile key={app.id} app={app} onLaunch={onLaunchApp} />
          ))}
        </div>

        {/* CONNECT group */}
        <div style={{
          fontFamily: "var(--font-data)", fontSize: 8,
          color: "var(--text-muted)", letterSpacing: "0.14em",
          marginBottom: 8,
        }}>
          CONNECT
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
          marginBottom: 8,
        }}>
          {CONNECT_APPS.map(app => (
            <AppTile key={app.id} app={app} onLaunch={onLaunchApp} />
          ))}
        </div>
      </div>

      {/* Now-playing bar (pinned at bottom) */}
      {nowPlaying && (
        <div
          style={{
            flexShrink: 0,
            borderTop: "1px solid rgba(122,92,255,0.2)",
            background: "var(--bg-elevated)",
            display: "flex", alignItems: "center",
            padding: "8px 16px",
            gap: 10, cursor: "pointer",
          }}
          onClick={onOpenStudio}
        >
          <div style={{
            width: 20, height: 20, borderRadius: "50%",
            background: "var(--bg-void)",
            backgroundImage: `url(${nowPlaying.art || nowPlaying.album_art})`,
            backgroundSize: "cover", backgroundPosition: "center",
            flexShrink: 0,
          }} />
          <span style={{
            flex: 1, fontFamily: "var(--font-data)", fontSize: 9,
            color: "var(--text-secondary)", overflow: "hidden",
            textOverflow: "ellipsis", whiteSpace: "nowrap",
            letterSpacing: "0.05em",
          }}>
            {nowPlaying.name}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onPlayPause(); }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "var(--font-data)", fontSize: 14,
              color: "rgba(122,92,255,0.8)", padding: "4px 6px",
            }}
          >
            {playing ? "⏸" : "▶"}
          </button>
        </div>
      )}
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify in browser**

At 390px width, after boot + unlock:
- Tap "↑ LAUNCH" → LauncherSheet slides up from bottom (spring animation)
- Ambient clock visible behind at dimmed opacity with blur
- See WORK group: ARCHIVE · ARENA · RESUME tiles in 3-col grid
- See CONNECT group: STUDIO · SIGNAL tiles in 2-col grid
- Drag handle at top — drag down past 80px → sheet dismisses
- Tapping any tile closes sheet and sets activeApp (AppShell not yet built, so nothing more happens)
- If music is playing: now-playing bar visible at bottom of sheet with play/pause button

- [ ] **Step 3: Commit**

```bash
git add src/Mobile/LauncherSheet.js
git commit -m "feat(mobile): M1 — LauncherSheet swipe-up app launcher"
```

---

## Task 4: AppShell.js (M2 full-screen app wrapper)

**Files:**
- Create: `src/Mobile/AppShell.js`

This file is the app frame. It imports all five app components and renders the right one based on the `app` prop. For this task, write it with stub placeholders for each app — the real app components are wired in Tasks 5–9.

- [ ] **Step 1: Create `src/Mobile/AppShell.js`** with stubs

```jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Apps imported lazily — uncomment as each task completes
// import ArchiveApp from "./apps/ArchiveApp";
// import StudioApp  from "./apps/StudioApp";
// import ArenaApp   from "./apps/ArenaApp";
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
    // Swap stubs for real imports after each task:
    // if (app === "archive") return <ArchiveApp tab={activeTab} />;
    // if (app === "studio")  return <StudioApp  tab={activeTab} {...musicProps} />;
    // if (app === "arena")   return <ArenaApp   tab={activeTab} />;
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
            color: "var(--accent-red)", fontSize: 20,
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

      {/* Content area */}
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
        {/* Scroll fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: 44, pointerEvents: "none",
          background: "linear-gradient(transparent, var(--bg-elevated))",
        }} />
      </div>

      {/* Tab bar */}
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
```

- [ ] **Step 2: Verify in browser**

At 390px, open launcher → tap any tile:
- App slides in from right (0.28s, decelerate ease)
- Top nav: `←` in red on left, app name centered, 2px accent bar below
- Tab bar at bottom with all tabs (ARCHIVE shows 5, STUDIO shows 2, etc.)
- Tapping a tab cross-fades content (150ms)
- Tap `←` → app slides out to right (0.22s, accelerate ease)
- Swipe from left side → app dismisses on release past 30% width
- No console errors

- [ ] **Step 3: Commit**

```bash
git add src/Mobile/AppShell.js
git commit -m "feat(mobile): M2 — AppShell full-screen wrapper with nav/tabs/animations"
```

---

## Task 5: ArchiveApp.js (M2 — 5 tabs)

**Files:**
- Create: `src/Mobile/apps/ArchiveApp.js`
- Modify: `src/Mobile/AppShell.js` — uncomment ArchiveApp import

**Data used:** `mainData.explorer.{about, skills, projects, certifications}`, `mainData.resume.awards`

- [ ] **Step 1: Create `src/Mobile/apps/ArchiveApp.js`**

```jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import mainData from "../../Data/main.json";

const { about, skills, projects, certifications } = mainData.explorer;

const CAT_COLOR = {
  Frontend:    "var(--accent-purple)",
  Backend:     "var(--accent-green)",
  Programming: "var(--accent-green)",
  Cloud:       "var(--accent-blue)",
  VCS:         "var(--accent-amber)",
  Utility:     "var(--accent-amber)",
  Design:      "var(--accent-red)",
  "Soft Skills": "var(--text-secondary)",
};

// ── ABOUT tab ────────────────────────────────────────────────────────────────
function AboutTab() {
  const topSkills = skills.slice(0, 8);
  return (
    <div style={{ padding: "16px 16px 80px" }}>
      <p style={{
        fontFamily: "var(--font-ui)", fontSize: 13, lineHeight: 1.7,
        color: "var(--text-secondary)", margin: 0, marginBottom: 20,
      }}>
        {about.about}
      </p>
      <div style={{
        display: "flex", gap: 16, marginBottom: 20,
        fontFamily: "var(--font-data)",
      }}>
        {[
          { label: "ROLE",   value: "Developer" },
          { label: "LOC",    value: "Chennai" },
          { label: "EXP",    value: "4+ yrs" },
        ].map(({ label, value }) => (
          <div key={label}>
            <div style={{ fontSize: 7, color: "var(--text-muted)", letterSpacing: "0.12em" }}>{label}</div>
            <div style={{ fontSize: 11, color: "var(--text-primary)", fontWeight: 500, marginTop: 2 }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {topSkills.map(skill => {
          const cat = skill.category[0];
          const col = CAT_COLOR[cat] || "var(--text-secondary)";
          return (
            <span key={skill.name} style={{
              fontFamily: "var(--font-data)", fontSize: 9,
              color: col, padding: "3px 8px",
              border: `1px solid ${col}44`,
              background: `${col}0d`,
              borderRadius: 3, letterSpacing: "0.05em",
            }}>
              {skill.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ── SKILLS tab ────────────────────────────────────────────────────────────────
function SkillsTab() {
  const byCategory = skills.reduce((acc, s) => {
    const cat = s.category[0] || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div style={{ padding: "16px 16px 80px" }}>
      {Object.entries(byCategory).map(([cat, items]) => {
        const col = CAT_COLOR[cat] || "var(--text-secondary)";
        return (
          <div key={cat} style={{ marginBottom: 20 }}>
            <div style={{
              fontFamily: "var(--font-data)", fontSize: 8,
              color: "var(--text-muted)", letterSpacing: "0.14em",
              marginBottom: 8,
            }}>
              {cat.toUpperCase()}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {items.map(skill => (
                <span key={skill.name} style={{
                  fontFamily: "var(--font-data)", fontSize: 9,
                  color: col, padding: "4px 9px",
                  border: `1px solid ${col}44`,
                  background: `${col}0d`,
                  borderRadius: 3, letterSpacing: "0.05em",
                }}>
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── PROJECTS tab ─────────────────────────────────────────────────────────────
function ProjectsTab() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={{ padding: "16px 16px 80px" }}>
      {projects.map((p, i) => (
        <div key={p.name} style={{ marginBottom: 8 }}>
          <motion.button
            onClick={() => setExpanded(expanded === i ? null : i)}
            style={{
              width: "100%", background: "var(--bg-elevated)",
              border: "1px solid var(--border-hairline)",
              borderLeft: `2px solid ${p.color || "var(--border-default)"}`,
              borderRadius: "0 4px 4px 0",
              padding: "10px 12px",
              display: "flex", alignItems: "center",
              gap: 10, cursor: "pointer",
              textAlign: "left",
            }}
            whileTap={{ opacity: 0.8 }}
          >
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: "var(--font-display)", fontSize: 13,
                color: "var(--text-primary)", fontWeight: 500,
              }}>
                {p.name}
              </div>
              <div style={{
                fontFamily: "var(--font-data)", fontSize: 8,
                color: "var(--text-muted)", marginTop: 3,
                letterSpacing: "0.06em",
              }}>
                {(p.stack || []).slice(0, 4).join(" · ")}
              </div>
            </div>
            <span style={{
              fontFamily: "var(--font-data)", fontSize: 10,
              color: "var(--text-muted)",
              transform: expanded === i ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}>›</span>
          </motion.button>

          <AnimatePresence>
            {expanded === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: "hidden" }}
              >
                <div style={{
                  background: "var(--bg-elevated)",
                  borderLeft: `2px solid ${p.color || "var(--border-default)"}`,
                  borderBottom: "1px solid var(--border-hairline)",
                  borderRight: "1px solid var(--border-hairline)",
                  padding: "10px 12px 12px",
                }}>
                  <p style={{
                    fontFamily: "var(--font-ui)", fontSize: 11, lineHeight: 1.6,
                    color: "var(--text-secondary)", margin: "0 0 12px",
                  }}>
                    {p.description}
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    {p.github && (
                      <a href={p.github} target="_blank" rel="noreferrer" style={{
                        fontFamily: "var(--font-data)", fontSize: 8,
                        color: "var(--text-secondary)", letterSpacing: "0.08em",
                        border: "1px solid var(--border-default)",
                        padding: "5px 10px", borderRadius: 3,
                        textDecoration: "none",
                      }}>
                        GITHUB ↗
                      </a>
                    )}
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noreferrer" style={{
                        fontFamily: "var(--font-data)", fontSize: 8,
                        color: "var(--text-secondary)", letterSpacing: "0.08em",
                        border: "1px solid var(--border-default)",
                        padding: "5px 10px", borderRadius: 3,
                        textDecoration: "none",
                      }}>
                        LIVE ↗
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

// ── CERTS tab ─────────────────────────────────────────────────────────────────
function CertsTab() {
  const [selectedCert, setSelectedCert] = useState(null);

  return (
    <div style={{ padding: "16px 16px 80px" }}>
      {certifications.map((cert, i) => (
        <motion.button
          key={i}
          onClick={() => setSelectedCert(cert)}
          whileTap={{ opacity: 0.8 }}
          style={{
            width: "100%", background: "var(--bg-elevated)",
            border: "1px solid var(--border-hairline)",
            borderRadius: 4, padding: "12px 14px",
            display: "flex", flexDirection: "column", alignItems: "flex-start",
            cursor: "pointer", marginBottom: 8, textAlign: "left",
          }}
        >
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 12,
            color: "var(--text-primary)", marginBottom: 4,
          }}>
            {cert.name}
          </div>
          <div style={{
            fontFamily: "var(--font-data)", fontSize: 8,
            color: "var(--text-muted)", letterSpacing: "0.06em",
          }}>
            {cert.issuer?.name} · {cert.date}
          </div>
        </motion.button>
      ))}

      {/* Cert detail bottom sheet */}
      <AnimatePresence>
        {selectedCert && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
              style={{
                position: "fixed", inset: 0,
                background: "rgba(0,0,0,0.6)", zIndex: 40,
              }}
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              style={{
                position: "fixed", left: 0, right: 0, bottom: 0,
                background: "var(--bg-surface)",
                borderRadius: "14px 14px 0 0",
                padding: "20px 20px",
                paddingBottom: "calc(24px + env(safe-area-inset-bottom))",
                zIndex: 41,
              }}
            >
              <div style={{
                width: 22, height: 3, background: "var(--border-default)",
                borderRadius: 2, margin: "0 auto 16px",
              }} />
              <div style={{
                fontFamily: "var(--font-ui)", fontSize: 14,
                color: "var(--text-primary)", marginBottom: 8, lineHeight: 1.4,
              }}>
                {selectedCert.name}
              </div>
              <div style={{
                fontFamily: "var(--font-data)", fontSize: 9,
                color: "var(--text-muted)", letterSpacing: "0.08em", marginBottom: 16,
              }}>
                {selectedCert.issuer?.name} · {selectedCert.date}
              </div>
              {selectedCert.link && (
                <a href={selectedCert.link} target="_blank" rel="noreferrer" style={{
                  display: "inline-block",
                  fontFamily: "var(--font-data)", fontSize: 9,
                  color: "var(--accent-purple)", letterSpacing: "0.08em",
                  border: "1px solid rgba(122,92,255,0.3)",
                  padding: "7px 14px", borderRadius: 3,
                  textDecoration: "none",
                }}>
                  VIEW CERTIFICATE ↗
                </a>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── SIH tab ───────────────────────────────────────────────────────────────────
function SIHTab() {
  const award = mainData.resume?.awards?.[0] || "Winner — Smart India Hackathon 2022";
  return (
    <div style={{ padding: "16px 16px 80px" }}>
      <div style={{
        width: "100%", height: 140,
        background: "linear-gradient(135deg, rgba(245,166,35,0.12) 0%, rgba(255,59,48,0.08) 100%)",
        border: "1px solid rgba(245,166,35,0.2)",
        borderRadius: 8,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 16,
      }}>
        <span style={{
          fontFamily: "var(--font-display)", fontSize: 20,
          color: "var(--accent-amber)", letterSpacing: "-0.01em",
        }}>
          SIH 2022
        </span>
      </div>

      <div style={{
        borderLeft: "2px solid var(--accent-amber)",
        padding: "12px 14px",
        background: "rgba(245,166,35,0.06)",
        borderRadius: "0 6px 6px 0",
        marginBottom: 16,
      }}>
        <div style={{
          fontFamily: "var(--font-data)", fontSize: 8,
          color: "var(--accent-amber)", letterSpacing: "0.12em", marginBottom: 6,
        }}>
          AWARD
        </div>
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 13,
          color: "var(--text-primary)", lineHeight: 1.5,
        }}>
          {award}
        </div>
      </div>

      <div style={{
        fontFamily: "var(--font-ui)", fontSize: 12, lineHeight: 1.6,
        color: "var(--text-secondary)",
      }}>
        Government of India national-level hackathon for students. Competed against
        thousands of teams across India. Category: Software.
      </div>
    </div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function ArchiveApp({ tab }) {
  switch (tab) {
    case "ABOUT":    return <AboutTab />;
    case "SKILLS":   return <SkillsTab />;
    case "PROJECTS": return <ProjectsTab />;
    case "CERTS":    return <CertsTab />;
    case "SIH":      return <SIHTab />;
    default:         return <AboutTab />;
  }
}
```

- [ ] **Step 2: Wire ArchiveApp into AppShell**

Open `src/Mobile/AppShell.js`. Find the commented import lines and:

1. Add at top of imports:
```jsx
import ArchiveApp from "./apps/ArchiveApp";
```

2. In `renderApp()`, replace the stub with:
```jsx
const renderApp = () => {
  if (app === "archive") return <ArchiveApp tab={activeTab} />;
  return <AppStub app={app} tab={activeTab} />;
};
```

- [ ] **Step 3: Verify in browser**

Open ARCHIVE from launcher:
- ABOUT tab: bio paragraph, key stats row, 8 skill chips
- SKILLS tab: chips grouped by category (Frontend, Backend, etc.), category label above each group
- PROJECTS tab: 11 project rows, each with name and stack preview; tap to expand → description + GITHUB/LIVE links appear inline
- CERTS tab: 2 cert rows; tap any → bottom sheet slides up with cert name, issuer, date, VIEW CERTIFICATE link; tap backdrop → sheet closes
- SIH tab: amber hero card, award text, description paragraph

- [ ] **Step 4: Commit**

```bash
git add src/Mobile/apps/ArchiveApp.js src/Mobile/AppShell.js
git commit -m "feat(mobile): M2 — ArchiveApp 5-tab portfolio view"
```

---

## Task 6: StudioApp.js (M3 — music player)

**Files:**
- Create: `src/Mobile/apps/StudioApp.js`
- Modify: `src/Mobile/AppShell.js` — import StudioApp

**Data used:** `musicData` (passed via props), `howlerRef`, all music state props

- [ ] **Step 1: Create `src/Mobile/apps/StudioApp.js`**

```jsx
import React, { useRef, useCallback } from "react";
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
function TracksTab({ songs, nowPlaying, setNowPlaying, setPlaying, howlerRef, setProgress, setSeek }) {
  const playTrack = (track) => {
    setNowPlaying(track);
    setProgress(0);
    setSeek(0);
    setPlaying(true);
    // howlerRef src update happens via ReactHowler src prop in App.js (re-render)
  };

  const fmtDuration = (src) => "—"; // Duration loaded dynamically via Howler

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
```

- [ ] **Step 2: Wire StudioApp into AppShell**

In `src/Mobile/AppShell.js`:

1. Add import after existing imports:
```jsx
import StudioApp from "./apps/StudioApp";
```

2. In `renderApp()`:
```jsx
const renderApp = () => {
  if (app === "archive") return <ArchiveApp tab={activeTab} />;
  if (app === "studio")  return <StudioApp  tab={activeTab} {...musicProps} />;
  return <AppStub app={app} tab={activeTab} />;
};
```

Note: `musicProps` is the rest of the props after `app` and `onBack`. Destructure at the top of AppShell:
```jsx
export default function AppShell({ app, onBack, ...musicProps }) {
```
(This was already written in Task 4 — verify it's there.)

- [ ] **Step 3: Verify in browser**

Open STUDIO from launcher:
- PLAYER tab: album art circle, track name, artist, progress scrubber, ⏮ ▶ ⏭ controls, volume slider
- Tap ▶ → music starts playing (shared ReactHowler from App.js)
- TRACKS tab: list of 12 tracks; active track shows purple left border and ▶ indicator
- Tapping a track starts playing it
- Scrubber updates as track plays (driven by `progress` prop from App.js)

- [ ] **Step 4: Commit**

```bash
git add src/Mobile/apps/StudioApp.js src/Mobile/AppShell.js
git commit -m "feat(mobile): M3 — StudioApp music player + tracks"
```

---

## Task 7: ArenaApp.js (M3 — projects showcase)

**Files:**
- Create: `src/Mobile/apps/ArenaApp.js`
- Modify: `src/Mobile/AppShell.js` — import ArenaApp

**Data used:** `mainData.explorer.projects` (11 items)

- [ ] **Step 1: Create `src/Mobile/apps/ArenaApp.js`**

```jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import mainData from "../../Data/main.json";

const projects = mainData.explorer.projects;

function ProjectLinks({ project }) {
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
      {project.github && (
        <a href={project.github} target="_blank" rel="noreferrer" style={{
          fontFamily: "var(--font-data)", fontSize: 8, color: "var(--text-secondary)",
          border: "1px solid var(--border-default)", padding: "5px 10px",
          borderRadius: 3, textDecoration: "none", letterSpacing: "0.08em",
        }}>GITHUB ↗</a>
      )}
      {project.link && (
        <a href={project.link} target="_blank" rel="noreferrer" style={{
          fontFamily: "var(--font-data)", fontSize: 8, color: "var(--text-secondary)",
          border: "1px solid var(--border-default)", padding: "5px 10px",
          borderRadius: 3, textDecoration: "none", letterSpacing: "0.08em",
        }}>LIVE ↗</a>
      )}
    </div>
  );
}

// ── FEATURED tab ──────────────────────────────────────────────────────────────
function FeaturedTab() {
  const featured = projects[0];
  return (
    <div style={{ padding: "16px 16px 80px" }}>
      <div style={{
        width: "100%",
        background: `linear-gradient(135deg, ${featured.color || "#FF3B30"}18 0%, transparent 60%)`,
        border: `1px solid ${featured.color || "#FF3B30"}28`,
        borderTop: `3px solid ${featured.color || "#FF3B30"}`,
        borderRadius: 8, padding: "20px 16px",
        marginBottom: 16,
      }}>
        <div style={{
          fontFamily: "var(--font-display)", fontSize: 20,
          color: "var(--text-primary)", marginBottom: 6,
          letterSpacing: "-0.02em",
        }}>
          {featured.name}
        </div>
        <div style={{
          fontFamily: "var(--font-data)", fontSize: 8,
          color: "var(--text-muted)", letterSpacing: "0.08em", marginBottom: 12,
        }}>
          {featured.tagline}
        </div>
        <p style={{
          fontFamily: "var(--font-ui)", fontSize: 12, lineHeight: 1.6,
          color: "var(--text-secondary)", margin: "0 0 12px",
        }}>
          {featured.description}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 4 }}>
          {(featured.stack || []).map(tag => (
            <span key={tag} style={{
              fontFamily: "var(--font-data)", fontSize: 8,
              color: "var(--text-muted)", letterSpacing: "0.05em",
              border: "1px solid var(--border-hairline)", borderRadius: 2,
              padding: "2px 6px",
            }}>{tag}</span>
          ))}
        </div>
        <ProjectLinks project={featured} />
      </div>
    </div>
  );
}

// ── ALL tab ───────────────────────────────────────────────────────────────────
function AllTab() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={{ padding: "16px 16px 80px" }}>
      {projects.map((p, i) => (
        <div key={p.name} style={{ marginBottom: 8 }}>
          <motion.button
            onClick={() => setExpanded(expanded === i ? null : i)}
            whileTap={{ opacity: 0.8 }}
            style={{
              width: "100%",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-hairline)",
              borderLeft: `2px solid ${p.color || "var(--border-default)"}`,
              borderRadius: "0 4px 4px 0",
              padding: "10px 12px",
              display: "flex", alignItems: "center",
              gap: 10, cursor: "pointer", textAlign: "left",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: "var(--font-display)", fontSize: 13,
                color: "var(--text-primary)", fontWeight: 500,
              }}>
                {p.name}
              </div>
              <div style={{
                fontFamily: "var(--font-data)", fontSize: 8,
                color: "var(--text-muted)", marginTop: 3, letterSpacing: "0.06em",
              }}>
                {(p.stack || []).slice(0, 4).join(" · ")}
              </div>
            </div>
            <span style={{
              fontFamily: "var(--font-data)", fontSize: 12,
              color: "var(--text-muted)",
            }}>↗</span>
          </motion.button>

          <AnimatePresence>
            {expanded === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: "hidden" }}
              >
                <div style={{
                  background: "var(--bg-elevated)",
                  borderLeft: `2px solid ${p.color || "var(--border-default)"}`,
                  borderBottom: "1px solid var(--border-hairline)",
                  borderRight: "1px solid var(--border-hairline)",
                  padding: "10px 12px 12px",
                }}>
                  <p style={{
                    fontFamily: "var(--font-ui)", fontSize: 11, lineHeight: 1.6,
                    color: "var(--text-secondary)", margin: "0 0 10px",
                  }}>
                    {p.description}
                  </p>
                  <ProjectLinks project={p} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default function ArenaApp({ tab }) {
  if (tab === "ALL") return <AllTab />;
  return <FeaturedTab />;
}
```

- [ ] **Step 2: Wire ArenaApp into AppShell**

In `src/Mobile/AppShell.js`:

1. Add import:
```jsx
import ArenaApp from "./apps/ArenaApp";
```

2. In `renderApp()`:
```jsx
const renderApp = () => {
  if (app === "archive") return <ArchiveApp tab={activeTab} />;
  if (app === "studio")  return <StudioApp  tab={activeTab} {...musicProps} />;
  if (app === "arena")   return <ArenaApp   tab={activeTab} />;
  return <AppStub app={app} tab={activeTab} />;
};
```

- [ ] **Step 3: Verify in browser**

Open ARENA from launcher:
- FEATURED tab: first project (Aaruush) shown as full-width hero card with gradient bg, project name in large display type, description, stack tags, GITHUB/LIVE links
- ALL tab: 11 project rows as compact list; tap row → expands inline with description + links; tap again → collapses

- [ ] **Step 4: Commit**

```bash
git add src/Mobile/apps/ArenaApp.js src/Mobile/AppShell.js
git commit -m "feat(mobile): M3 — ArenaApp projects featured + all view"
```

---

## Task 8: SignalApp.js (M4 — contact form)

**Files:**
- Create: `src/Mobile/apps/SignalApp.js`
- Modify: `src/Mobile/AppShell.js` — import SignalApp

**Environment variable required:** `VITE_WEB3FORMS_KEY` in `.env` (same key as desktop Signal.js uses)

- [ ] **Step 1: Create `src/Mobile/apps/SignalApp.js`**

```jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import mainData from "../../Data/main.json";

const social = mainData.explorer.social;

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
```

- [ ] **Step 2: Wire SignalApp into AppShell**

In `src/Mobile/AppShell.js`:

1. Add import:
```jsx
import SignalApp from "./apps/SignalApp";
```

2. In `renderApp()`:
```jsx
const renderApp = () => {
  if (app === "archive") return <ArchiveApp tab={activeTab} />;
  if (app === "studio")  return <StudioApp  tab={activeTab} {...musicProps} />;
  if (app === "arena")   return <ArenaApp   tab={activeTab} />;
  if (app === "signal")  return <SignalApp />;
  return <AppStub app={app} tab={activeTab} />;
};
```

- [ ] **Step 3: Verify in browser**

Open SIGNAL from launcher:
- See three terminal-style fields: `> NAME`, `> EMAIL`, `> MESSAGE` with bottom-border-only inputs
- Fill all fields → tap TRANSMIT_ → status shows "TRANSMITTING_" then "SIGNAL_SENT ✓" (needs `VITE_WEB3FORMS_KEY` set in `.env`)
- If key not set, status shows "TRANSMISSION_FAILED"
- Social links section below form: 8 links in a list with ↗ arrows
- Focus a text field → keyboard rises → extra padding is added automatically (content doesn't get obscured)
- Dismiss keyboard → padding returns to normal

- [ ] **Step 4: Commit**

```bash
git add src/Mobile/apps/SignalApp.js src/Mobile/AppShell.js
git commit -m "feat(mobile): M4 — SignalApp contact form + keyboard avoidance"
```

---

## Task 9: ResumeApp.js + Landscape Prompt + Final Wiring (M4 polish)

**Files:**
- Create: `src/Mobile/apps/ResumeApp.js`
- Modify: `src/Mobile/AppShell.js` — import ResumeApp + final renderApp()
- Modify: `src/index.css` — landscape rotation prompt

**Data used:** `mainData.resume`

- [ ] **Step 1: Create `src/Mobile/apps/ResumeApp.js`**

```jsx
import React from "react";
import mainData from "../../Data/main.json";

const resume = mainData.resume;

const SECTION_LABEL = {
  fontFamily: "var(--font-data)", fontSize: 9,
  color: "var(--accent-red)", letterSpacing: "0.12em",
  marginBottom: 10,
};

const ENTRY_TITLE = {
  fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 500,
  color: "var(--text-primary)", marginBottom: 2,
};

const ENTRY_META = {
  fontFamily: "var(--font-data)", fontSize: 9,
  color: "var(--text-muted)", letterSpacing: "0.06em",
  marginBottom: 4,
};

const ENTRY_DESC = {
  fontFamily: "var(--font-ui)", fontSize: 11, lineHeight: 1.6,
  color: "var(--text-secondary)", margin: 0,
};

const DIVIDER = {
  height: 1, background: "var(--border-hairline)",
  margin: "20px 0",
};

export default function ResumeApp() {
  const pdfUrl = resume.thisresume;

  return (
    <div style={{ padding: "16px 16px 80px" }}>
      {/* Download button */}
      {pdfUrl && (
        <a
          href={pdfUrl}
          download
          target="_blank"
          rel="noreferrer"
          style={{
            display: "block", width: "100%", boxSizing: "border-box",
            textAlign: "center",
            fontFamily: "var(--font-data)", fontSize: 9, letterSpacing: "0.12em",
            color: "var(--text-secondary)",
            border: "1px solid var(--border-default)",
            padding: "12px", borderRadius: 4,
            textDecoration: "none", marginBottom: 24,
          }}
        >
          DOWNLOAD PDF ↓
        </a>
      )}

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontFamily: "var(--font-display)", fontSize: 18,
          color: "var(--text-primary)", letterSpacing: "-0.01em", marginBottom: 4,
        }}>
          {resume.name}
        </div>
        <div style={{
          fontFamily: "var(--font-data)", fontSize: 9,
          color: "var(--text-muted)", letterSpacing: "0.08em",
        }}>
          {resume.subheading}
        </div>
      </div>

      <div style={DIVIDER} />

      {/* Experience */}
      {resume.experience?.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={SECTION_LABEL}>EXPERIENCE</div>
          {resume.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={ENTRY_TITLE}>{exp.position}</div>
              <div style={ENTRY_META}>{exp.name} · {exp.duration}</div>
              <p style={ENTRY_DESC}>{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      <div style={DIVIDER} />

      {/* Education */}
      {resume.education?.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={SECTION_LABEL}>EDUCATION</div>
          {resume.education.map((edu, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={ENTRY_TITLE}>{edu.degree || edu.school}</div>
              <div style={ENTRY_META}>{edu.school || edu.location} · {edu.duration}</div>
              {edu.description && <p style={ENTRY_DESC}>{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      <div style={DIVIDER} />

      {/* Awards */}
      {resume.awards?.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={SECTION_LABEL}>AWARDS</div>
          {resume.awards.map((award, i) => (
            <div key={i} style={{
              fontFamily: "var(--font-ui)", fontSize: 12,
              color: "var(--text-secondary)", lineHeight: 1.5,
              borderLeft: "2px solid var(--accent-amber)",
              paddingLeft: 10, marginBottom: 8,
            }}>
              {award}
            </div>
          ))}
        </div>
      )}

      <div style={DIVIDER} />

      {/* Skills */}
      {resume.skills?.length > 0 && (
        <div>
          <div style={SECTION_LABEL}>SKILLS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {resume.skills.map((skill, i) => (
              <span key={i} style={{
                fontFamily: "var(--font-data)", fontSize: 9,
                color: "var(--text-secondary)", letterSpacing: "0.05em",
                border: "1px solid var(--border-hairline)",
                padding: "3px 8px", borderRadius: 3,
              }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Wire ResumeApp + finalize renderApp() in AppShell**

In `src/Mobile/AppShell.js`:

1. Add import:
```jsx
import ResumeApp from "./apps/ResumeApp";
```

2. Replace `renderApp()` with the final version (all 5 apps, no stubs):
```jsx
const renderApp = () => {
  if (app === "archive") return <ArchiveApp tab={activeTab} />;
  if (app === "studio")  return <StudioApp  tab={activeTab} {...musicProps} />;
  if (app === "arena")   return <ArenaApp   tab={activeTab} />;
  if (app === "signal")  return <SignalApp />;
  if (app === "resume")  return <ResumeApp />;
  return null;
};
```

3. Remove `AppStub` function — it's no longer needed.

4. Remove all stub-related commented-out code.

- [ ] **Step 3: Add landscape rotation prompt to `src/index.css`**

Open `src/index.css` and add at the end:

```css
/* ── Mobile landscape rotation prompt ─────────────────────────── */
@media screen and (max-width: 1000px) and (orientation: landscape) {
  #root::before {
    content: "ROTATE DEVICE";
    position: fixed;
    inset: 0;
    background: var(--bg-void);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-data);
    font-size: 11px;
    letter-spacing: 0.16em;
    color: var(--text-muted);
  }
}
```

Note: `::before` on `#root` works to overlay the entire app with a pure CSS solution — no JS, no extra component.

- [ ] **Step 4: Full end-to-end verification**

Run `npm run dev`. Open DevTools → responsive mode → set to iPhone 14 (390×844).

Walk through the complete user journey:

**Boot sequence:**
- First visit (clear sessionStorage): Loader boot animation plays, NOCTURNE_OS lines appear one by one, then fade out
- Subsequent visits (sessionStorage set): skip straight to Lock

**Lock screen:**
- See large clock, date, "PRESS ANY KEY" prompt
- Tap anywhere / press key → lock dismisses with animation
- Confirm `lastlogin` is now set in localStorage

**Ambient home:**
- Clock shows current time, date below
- Vitals grid: ARCHIVE (5 sect.), ARENA (11 proj.), SIGNAL (● ready), UPTIME (counting)
- Now-playing pill shows "NO SIGNAL" if no music loaded
- Tap "↑ LAUNCH" → LauncherSheet opens

**Launcher:**
- Ambient home visible behind with blur + opacity
- WORK tiles: ARCHIVE · ARENA · RESUME
- CONNECT tiles: STUDIO · SIGNAL
- Drag handle at top → drag down past 80px → sheet closes
- Tap any tile → sheet closes, app opens

**ARCHIVE:**
- ABOUT: bio + stats + skill chips
- SKILLS: categorized chips with accent colors
- PROJECTS: expandable rows with description + links
- CERTS: tap cert → bottom sheet with VIEW CERTIFICATE link
- SIH: amber hero, award text

**STUDIO (needs a nowPlaying track to exist — start one from TRACKS tab first):**
- TRACKS: list of 12 tracks, tap one → track starts playing
- Switch to PLAYER: album art, name, artist, scrubber, play/pause/skip, volume
- Swipe back to launcher → music continues playing

**ARENA:**
- FEATURED: hero card for first project
- ALL: 11 rows, expand/collapse inline

**SIGNAL:**
- Form with terminal-style inputs
- Focus input → keyboard rises, content pads up
- Submit → TRANSMIT_ button feedback

**RESUME:**
- DOWNLOAD PDF button at top
- Experience, Education, Awards, Skills sections

**Landscape rotation:**
- Rotate device (or use DevTools device rotation)
- "ROTATE DEVICE" prompt covers screen

**Swipe back gesture:**
- Inside any app, swipe from left edge toward right (past 30% of screen width) → app exits

- [ ] **Step 5: Commit**

```bash
git add src/Mobile/apps/ResumeApp.js src/Mobile/AppShell.js src/index.css
git commit -m "feat(mobile): M4 — ResumeApp + landscape prompt + final wiring"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|------------------|------|
| Cinematic boot (shared session key) | Task 1 (MobileOS reads sessionStorage) |
| Lock screen (shared lastlogin key) | Task 1 |
| Ambient home: clock, date, pill, vitals, swipe | Task 2 |
| LauncherSheet: spring animation, drag dismiss | Task 3 |
| LauncherSheet: WORK/CONNECT groups | Task 3 |
| LauncherSheet: now-playing bar | Task 3 |
| AppShell: push-in animation 0.28s | Task 4 |
| AppShell: exit animation 0.22s | Task 4 |
| AppShell: swipe-right-to-back | Task 4 |
| AppShell: top nav + accent bar + tab bar | Task 4 |
| AppShell: scroll fade | Task 4 |
| AppShell: tab cross-fade 150ms | Task 4 |
| AppShell: home indicator inside safe area | Task 4 |
| ArchiveApp: 5 tabs with real data | Task 5 |
| ArchiveApp: PROJECTS expandable inline | Task 5 |
| ArchiveApp: CERTS bottom sheet | Task 5 |
| StudioApp: direct howlerRef control | Task 6 |
| StudioApp: progress scrubber | Task 6 |
| StudioApp: TRACKS list with active indicator | Task 6 |
| ArenaApp: FEATURED hero card | Task 7 |
| ArenaApp: ALL expandable list | Task 7 |
| SignalApp: terminal form aesthetic | Task 8 |
| SignalApp: keyboard avoidance via visualViewport | Task 8 |
| SignalApp: social links | Task 8 |
| ResumeApp: download button + sections | Task 9 |
| Landscape rotation prompt | Task 9 |
| `prefers-reduced-motion` | Inherited from MotionConfig in App.js root |
| No Redux on mobile | All tasks — local useState only |
| No hidden div event bus on mobile | Tasks 1 + 6 |
| Reuse Lock, Loader, Grain | Task 1 |

**Placeholder scan:** No TBDs, no "implement later", no "similar to above" — all code is complete.

**Type consistency check:**
- `nowPlaying` is always `null | {name, src, art, artist, album, album_art, year}`
- `playing` is always `boolean`
- `howlerRef` is always `React.RefObject` pointing to ReactHowler instance
- `tab` prop in all app components is always the uppercase string matching `APP_META.tabs[]`
- `onBack` in AppShell always calls `setActiveApp(null)` in MobileOS
- `onLaunchApp(id)` always calls `setActiveApp(id)` in MobileOS

---

**Plan complete and saved to `docs/superpowers/plans/2026-05-23-nocturne-mobile-os.md`.**

Two execution options:

**1. Subagent-Driven (recommended)** — Fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
