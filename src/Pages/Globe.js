import React, { useEffect, useState, useRef, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setExplorer,
  toggleExplorer,
  toggleTerminal,
  toggleReadme,
  toggleVoid,
  toggleBlackbox,
  toggleBrowser,
  toggleDoom,
  toggleStudio,
  toggleArena,
  toggleSignal,
  toggleResumeWin,
  setFocusedWindow,
} from "../Utility/state/action";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import MenuBar from "../Components/MenuBar";
import Dock from "../Components/Dock";
import AmbientCanvas from "../Components/AmbientCanvas";
import DesktopIcon from "../Components/Desktop/DesktopIcon";
import Window from "../Components/Window/Window";
import NoteWidget from "../Components/Desktop/NoteWidget";
import SocialLinks from "../Components/Desktop/SocialLinks";
import ProfileStat from "../Components/Desktop/ProfileStat";
import ClockWidget from "../Components/Desktop/ClockWidget";
import ContextMenu from "../Components/Desktop/ContextMenu";
import Lock from "./Lock";
import WelcomeDoc from "../Components/Desktop/WelcomeDoc";

const Music        = React.lazy(() => import("../Pages/Music"));
const Arena        = React.lazy(() => import("../Components/Arena/Arena"));
const Signal       = React.lazy(() => import("../Components/Signal/Signal"));
const Resume       = React.lazy(() => import("../Pages/Resume"));
const Archive      = React.lazy(() => import("../Components/Archive/Archive"));
const Terminal     = React.lazy(() => import("../Components/Terminal/Terminal"));
const Browser      = React.lazy(() => import("../Components/Browser/Browser"));
const DoomWindow   = React.lazy(() => import("../Components/Desktop/DoomWindow"));
const ReadmeWindow = React.lazy(() => import("../Components/Desktop/ReadmeWindow"));
const VoidWindow   = React.lazy(() => import("../Components/Desktop/VoidWindow"));
const BlackboxWindow = React.lazy(() => import("../Components/Desktop/BlackboxWindow"));
import {
  GlassProfile,
  GlassReadme,
  GlassArchive,
  GlassTerminal,
  GlassBlackbox,
  GlassVoid,
  GlassSignal,
  GlassArena,
  GlassStudio,
  GlassDoom,
} from "../Components/Desktop/GlassIcons";

// ─── Desktop entity layout ───────────────────────────────────────────────────

// All icons stacked in a single right column — left edge at (100vw - 96px)
// Icon width 68px → right edge at (100vw - 28px) — 28px dock-rail margin
const DESKTOP_ICONS = [
  // SYSTEM group
  { id: "profile",  label: "profile.doc",   Icon: GlassProfile,  left: "calc(100% - 96px)", top: "9%",  action: "welcome"  },
  { id: "readme",   label: "readme.txt",    Icon: GlassReadme,   left: "calc(100% - 96px)", top: "18%", action: "readme"   },
  { id: "archive",  label: "archive.sys",   Icon: GlassArchive,  left: "calc(100% - 96px)", top: "27%", action: "explorer" },
  { id: "terminal", label: "terminal://",   Icon: GlassTerminal, left: "calc(100% - 96px)", top: "36%", action: "terminal" },
  // SIGNAL group
  { id: "blackbox", label: "blackbox//",    Icon: GlassBlackbox, left: "calc(100% - 96px)", top: "48%", action: "blackbox" },
  { id: "void",     label: "void.archive",  Icon: GlassVoid,     left: "calc(100% - 96px)", top: "57%", action: "void"     },
  { id: "signal",   label: "signal.link",   Icon: GlassSignal,   left: "calc(100% - 96px)", top: "66%", action: "signal"   },
  { id: "arena",    label: "arena.projects",Icon: GlassArena,    left: "calc(100% - 96px)", top: "75%", action: "arena"    },
  // STUDIO + ARCADE group (same row, two columns)
  { id: "doom",     label: "doom.exe",      Icon: GlassDoom,     left: "calc(100% - 192px)", top: "83%", action: "doom"    },
  { id: "studio",   label: "studio.jack",   Icon: GlassStudio,   left: "calc(100% - 96px)",  top: "83%", action: "studio"  },
];

// ─────────────────────────────────────────────────────────────────────────────

const Globe = ({
  theme,
  lock,
  setLock,
  nowPlaying,
  playing,
  setPlayStatus,
  musicStop,
  // music control props for Studio window
  setPlaying,
  setNowPlaying,
  progress,
  setProgress,
  seek,
  setSeek,
  songs,
  duration,
  setDuration,
  howlerRef,
  onShortcuts,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((s) => s);
  const [ctxMenu, setCtxMenu] = useState({ open: false, x: 0, y: 0 });
  const [showWelcome, setShowWelcome] = useState(false);
  const prevLock = useRef(true);

  // Show welcome doc once per session, after the first lock dismiss
  useEffect(() => {
    if (prevLock.current === true && lock === false) {
      if (!sessionStorage.getItem("nocturne_welcome_shown")) {
        sessionStorage.setItem("nocturne_welcome_shown", "1");
        setTimeout(() => setShowWelcome(true), 350);
      }
    }
    prevLock.current = lock;
  }, [lock]);

  useEffect(() => {
    if (lock) dispatch(setExplorer(false));
  }, [lock]);

  // Mouse tracking
  const rawMx = useMotionValue(0.5);
  const rawMy = useMotionValue(0.5);

  useEffect(() => {
    const handler = (e) => {
      rawMx.set(e.clientX / window.innerWidth);
      rawMy.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [rawMx, rawMy]);

  // Gradient spring — heavy liquid
  const gradMx = useSpring(rawMx, { stiffness: 50, damping: 18 });

  // Cursor-driven gradient — center brought onto screen for visibility
  const gradientBg = useTransform(
    gradMx,
    (x) =>
      `radial-gradient(ellipse 130% 75% at ${50 + (x - 0.5) * 18}% 0%, rgba(122,92,255,0.26) 0%, transparent 60%),
       radial-gradient(ellipse 65% 75% at -2% 102%, rgba(255,59,48,0.16) 0%, transparent 52%),
       radial-gradient(ellipse 45% 55% at 102% 100%, rgba(62,255,139,0.05) 0%, transparent 48%)`
  );

  // Context menu
  const handleDesktopContextMenu = (e) => {
    e.preventDefault();
    setCtxMenu({ open: true, x: e.clientX, y: e.clientY });
  };

  const handleCtxAction = (key) => {
    if (key === "terminal") dispatch(toggleTerminal());
    if (key === "void") {
      if (!state.void) dispatch(setFocusedWindow("void"));
      dispatch(toggleVoid());
    }
  };

  // Icon double-click handlers
  const handleIconAction = (action) => {
    switch (action) {
      case "welcome":
        setShowWelcome(true);
        break;
      case "readme":
        if (!state.readme) dispatch(setFocusedWindow("readme"));
        dispatch(toggleReadme());
        break;
      case "explorer":
        dispatch(toggleExplorer());
        break;
      case "terminal":
        dispatch(toggleTerminal());
        break;
      case "studio":
        if (!state.studio) dispatch(setFocusedWindow("studio"));
        dispatch(toggleStudio());
        break;
      case "void":
        if (!state.void) dispatch(setFocusedWindow("void"));
        dispatch(toggleVoid());
        break;
      case "blackbox":
        if (!state.blackbox) dispatch(setFocusedWindow("blackbox"));
        dispatch(toggleBlackbox());
        break;
      case "doom":
        if (!state.doom) dispatch(setFocusedWindow("doom"));
        dispatch(toggleDoom());
        break;
      case "arena":
        if (!state.arena) dispatch(setFocusedWindow("arena"));
        dispatch(toggleArena());
        break;
      case "signal":
        if (!state.signal) dispatch(setFocusedWindow("signal"));
        dispatch(toggleSignal());
        break;
      default:
        break;
    }
  };

  return (
    <>
      {lock && (
        <Suspense fallback={<div style={{ position: "fixed", inset: 0, background: "var(--bg-void)" }} />}>
          <div style={{ position: "fixed", inset: 0, zIndex: "var(--z-lock)" }}>
            <Lock lock={lock} setLock={setLock} playing={playing} nowPlaying={nowPlaying} />
          </div>
        </Suspense>
      )}

      <div
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          background: "var(--bg-base)",
        }}
        onContextMenu={handleDesktopContextMenu}
      >

        {/* Breathing atmospheric depth gradient — cursor-driven */}
        <motion.div
          aria-hidden="true"
          animate={{ opacity: [1, 0.65, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            background: gradientBg,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />


        {/* Subtle grid — technical DAW aesthetic */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
            `,
            backgroundSize: "44px 44px",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Ambient particle layer */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}>
          <AmbientCanvas />
        </div>


        {/* ── Desktop entity layer ── */}
        <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none" }}>
          {/* Cluster labels — right column, aligned with icon strip */}
          <div style={{ position: "absolute", left: "calc(100% - 100px)", top: "7%",  fontFamily: "var(--font-data)", fontSize: "8px", color: "rgba(255,255,255,0.10)", letterSpacing: "0.16em", pointerEvents: "none" }}>SYSTEM</div>
          <div style={{ position: "absolute", left: "calc(100% - 100px)", top: "45%", fontFamily: "var(--font-data)", fontSize: "8px", color: "rgba(255,255,255,0.10)", letterSpacing: "0.16em", pointerEvents: "none" }}>SIGNAL</div>
          <div style={{ position: "absolute", left: "calc(100% - 196px)", top: "81%", fontFamily: "var(--font-data)", fontSize: "8px", color: "rgba(255,255,255,0.10)", letterSpacing: "0.16em", pointerEvents: "none" }}>ARCADE</div>
          <div style={{ position: "absolute", left: "calc(100% - 100px)", top: "81%", fontFamily: "var(--font-data)", fontSize: "8px", color: "rgba(255,255,255,0.10)", letterSpacing: "0.16em", pointerEvents: "none" }}>STUDIO</div>

          {DESKTOP_ICONS.map(({ id, label, Icon, left, top, action }) => (
            <div key={id} style={{ pointerEvents: "all" }}>
              <DesktopIcon
                icon={<Icon />}
                label={label}
                left={left}
                top={top}
                active={
                  (id === "profile"  && showWelcome)    ||
                  (id === "readme"   && state.readme)   ||
                  (id === "archive"  && state.explorer) ||
                  (id === "terminal" && state.terminal) ||
                  (id === "void"     && state.void)     ||
                  (id === "blackbox" && state.blackbox) ||
                  (id === "doom"     && state.doom)     ||
                  (id === "studio"   && state.studio)   ||
                  (id === "arena"    && state.arena)
                }
                onDoubleClick={() => handleIconAction(action)}
              />
            </div>
          ))}
        </div>

        {/* ── Windows layer ── */}
        <Window
          id="readme"
          type="readme"
          title="readme.txt"
          open={state.readme}
          onClose={() => dispatch(toggleReadme())}
          initialX={140}
          initialY={52}
          width={500}
        >
          <ReadmeWindow open={state.readme} />
        </Window>

        <Window
          id="void"
          type="void"
          title="0x"
          open={state.void}
          onClose={() => dispatch(toggleVoid())}
          initialX={620}
          initialY={80}
          width={440}
        >
          <VoidWindow open={state.void} />
        </Window>

        <Window
          id="blackbox"
          type="void"
          title="blackbox//"
          open={state.blackbox}
          onClose={() => dispatch(toggleBlackbox())}
          initialX={320}
          initialY={110}
          width={460}
        >
          <BlackboxWindow open={state.blackbox} />
        </Window>

        <Window
          id="archive"
          type="archive"
          title="archive.sys"
          open={state.explorer}
          onClose={() => dispatch(toggleExplorer())}
          initialX={Math.max(40, Math.round((window.innerWidth  - Math.min(920, window.innerWidth  - 80)) / 2))}
          initialY={Math.max(52, Math.round((window.innerHeight - Math.min(580, window.innerHeight - 120)) / 2))}
          width={Math.min(920, window.innerWidth  - 80)}
          height={Math.min(580, window.innerHeight - 120)}
        >
          <Archive />
        </Window>

        <Window
          id="terminal"
          type="terminal"
          title="terminal://"
          open={state.terminal}
          onClose={() => dispatch(toggleTerminal())}
          initialX={160}
          initialY={70}
          width={640}
          height={474}
        >
          <Terminal />
        </Window>

        <Window
          id="browser"
          type="signal"
          title="browser//"
          open={state.browser}
          onClose={() => dispatch(toggleBrowser())}
          initialX={80}
          initialY={52}
          width={860}
          height={554}
        >
          <Browser />
        </Window>

        <Window
          id="doom"
          type="void"
          title="doom.exe"
          open={state.doom}
          onClose={() => dispatch(toggleDoom())}
          initialX={Math.max(40, Math.round((window.innerWidth  - Math.min(960, window.innerWidth  - 80)) / 2))}
          initialY={Math.max(52, Math.round((window.innerHeight - Math.min(660, window.innerHeight - 120)) / 2))}
          width={Math.min(960, window.innerWidth  - 80)}
          height={Math.min(660, window.innerHeight - 120)}
        >
          <DoomWindow />
        </Window>

        <Window
          id="studio"
          type="studio"
          title="studio.jack"
          open={state.studio}
          onClose={() => {
            dispatch(toggleStudio());
            howlerRef.current?.stop();
            setPlaying(false);
            setProgress(0);
          }}
          initialX={Math.max(40, Math.round((window.innerWidth  - Math.min(1080, window.innerWidth  - 80)) / 2))}
          initialY={Math.max(52, Math.round((window.innerHeight - Math.min(620, window.innerHeight - 120)) / 2))}
          width={Math.min(1080, window.innerWidth  - 80)}
          height={Math.min(620, window.innerHeight - 120)}
        >
          <Music
            ref={howlerRef}
            windowed
            playing={playing}
            setPlaying={setPlaying}
            nowPlaying={nowPlaying}
            setNowPlaying={setNowPlaying}
            progress={progress}
            setProgress={setProgress}
            seek={seek}
            setSeek={setSeek}
            songs={songs}
            duration={duration}
            setDuration={setDuration}
          />
        </Window>

        <Window
          id="arena"
          type="arena"
          title="arena.projects"
          open={state.arena}
          onClose={() => dispatch(toggleArena())}
          initialX={Math.max(40, Math.round((window.innerWidth  - Math.min(960, window.innerWidth  - 80)) / 2))}
          initialY={Math.max(52, Math.round((window.innerHeight - Math.min(580, window.innerHeight - 120)) / 2))}
          width={Math.min(960, window.innerWidth  - 80)}
          height={Math.min(580, window.innerHeight - 120)}
        >
          <Arena />
        </Window>

        <Window
          id="resumeWin"
          type="archive"
          title="resume.pdf"
          open={state.resumeWin}
          onClose={() => dispatch(toggleResumeWin())}
          initialX={Math.max(40, Math.round((window.innerWidth  - Math.min(820, window.innerWidth  - 80)) / 2))}
          initialY={Math.max(52, Math.round((window.innerHeight - Math.min(600, window.innerHeight - 120)) / 2))}
          width={Math.min(820, window.innerWidth  - 80)}
          height={Math.min(600, window.innerHeight - 120)}
        >
          <Resume windowed />
        </Window>

        <Window
          id="signal"
          type="signal"
          title="signal.link"
          open={state.signal}
          onClose={() => dispatch(toggleSignal())}
          initialX={Math.max(40, Math.round((window.innerWidth  - Math.min(720, window.innerWidth  - 80)) / 2))}
          initialY={Math.max(52, Math.round((window.innerHeight - Math.min(520, window.innerHeight - 120)) / 2))}
          width={Math.min(720, window.innerWidth  - 80)}
          height={Math.min(520, window.innerHeight - 120)}
        >
          <Signal />
        </Window>

        {/* MenuBar */}
        <MenuBar setLock={setLock} onShortcuts={onShortcuts} />

        {/* Window zone marker */}
        <div
          id="window-zone"
          style={{
            position: "absolute",
            top: "36px",
            bottom: "48px",
            left: 0,
            right: 0,
            zIndex: "var(--z-windows)",
            pointerEvents: "none",
          }}
        />

        {/* Desktop widgets — left column */}
        <ClockWidget />
        <NoteWidget />
        <SocialLinks />
        <ProfileStat />

        {/* Dock */}
        <Dock
          nowPlaying={nowPlaying}
          playing={playing}
          setPlayStatus={setPlayStatus}
          musicStop={musicStop}
        />

        {/* Context menu */}
        <ContextMenu
          x={ctxMenu.x}
          y={ctxMenu.y}
          open={ctxMenu.open}
          onClose={() => setCtxMenu((m) => ({ ...m, open: false }))}
          onAction={handleCtxAction}
        />

        <Window
          id="welcome"
          type="readme"
          title="profile.doc"
          open={showWelcome}
          onClose={() => setShowWelcome(false)}
          initialX={Math.max(40, Math.round((window.innerWidth  - 960) / 2))}
          initialY={Math.max(52, Math.round((window.innerHeight - 580) / 2))}
          width={960}
          height={580}
        >
          <WelcomeDoc />
        </Window>

      </div>
    </>
  );
};

export default Globe;
