import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { Provider } from "react-redux";
import ReactHowler from "react-howler";
import store from "./Utility/state/store";
import { ActivityProvider } from "./Utility/ActivityContext";
import axios from "./Utility/Axios/axios";

import Menu from "./Components/Menu";
import Globe from "./Pages/Globe";
import Grain from "./Components/Grain";
import Matrix from "./Components/Matrix";
import Particles from "./Pages/Particles";
import Loader from "./Pages/Loader";
import Resume from "./Pages/Resume";
import ShortcutDrawer from "./Components/ShortcutDrawer";

const Music = React.lazy(() => import("./Pages/Music"));

const PageFallback = () => (
  <div style={{ position: "fixed", inset: 0, background: "var(--bg-void)" }} />
);

// ── Route transition wrapper ───────────────────────────────────────────────────
function RouteTransition({ children }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        style={{ width: "100%", height: "100%" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// ── Inner app (needs to be inside BrowserRouter) ───────────────────────────────
function AppInner() {
  const location = useLocation();

  // ── Music state ─────────────────────────────────────────────────────────────
  const ref            = useRef();
  const [playing,    setPlaying]    = useState(false);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [duration,   setDuration]   = useState(0);
  const [progress,   setProgress]   = useState(0);
  const [seek,       setSeek]       = useState(0);
  const [songs,      setSongs]      = useState([]);
  const [musicStop,  setMusicStop]  = useState(true);

  // ── Other state ─────────────────────────────────────────────────────────────
  const [lock,        setLock]        = useState(true);
  const [finder,      setFinder]      = useState(false);
  const [help,        setHelp]        = useState(false);
  const [booted,      setBooted]      = useState(() => !!sessionStorage.getItem("nocturne_booted"));
  const [mobile,      setMobile]      = useState(false);
  const [shortcuts,   setShortcuts]   = useState(false);
  const [notifications, setNotifications] = useState([]);

  // ── Responsive ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 1000);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Music progress ticker (RAF — no layout thrash) ────────────────────────
  useEffect(() => {
    let raf;
    const tick = () => {
      if (ref.current) setProgress(ref.current.seek());
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── Seek on change ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (ref.current) ref.current.seek((seek / 100) * ref.current.duration());
  }, [seek]);

  // ── musicStop helper ───────────────────────────────────────────────────────
  useEffect(() => {
    setMusicStop(!playing && progress === 0);
  }, [playing, progress]);

  // ── Data fetching ──────────────────────────────────────────────────────────
  useEffect(() => {
    axios.get("/songs").then(res => setSongs(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    axios.get("/notifications").then(res => setNotifications(res.data?.data ?? [])).catch(() => {});
  }, []);

  // ── Global keyboard shortcuts ──────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName;
      const inInput = tag === "INPUT" || tag === "TEXTAREA";

      // ? → shortcut drawer (only when not typing)
      if (e.key === "?" && !inInput && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShortcuts(s => !s);
        return;
      }

      // Esc → close shortcut drawer
      if (e.key === "Escape") {
        setShortcuts(false);
        return;
      }

      // Alt/⌘ + L → lock
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === "l") {
        e.preventDefault();
        localStorage.removeItem("lastlogin");
        setLock(true);
        return;
      }

      // Alt/⌘ + E → archive
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === "e") {
        e.preventDefault();
        document.getElementById("explorerIcon")?.click();
        return;
      }

      // Alt/⌘ + T → terminal
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === "t") {
        e.preventDefault();
        document.getElementById("terminalIcon")?.click();
        return;
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

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

  return (
    <>
      <Grain />
      {!booted && (
        <Loader onDone={() => {
          sessionStorage.setItem("nocturne_booted", "1");
          setBooted(true);
        }} />
      )}

      <Menu setLock={setLock} />

      {/* Hidden music event bus */}
      <div id="music-stop"  className="hidden" onClick={() => { ref.current?.stop();  setPlaying(false); }} />
      <div id="music-pause" className="hidden" onClick={() => { ref.current?.pause(); setPlaying(false); }} />
      <div id="music-play"  className="hidden" onClick={() => { ref.current?.play();  setPlaying(true);  }} />

      <ReactHowler
        ref={ref}
        playing={playing}
        onLoad={() => { setDuration(ref.current.duration()); ref.current.volume(0.5); }}
        loop
        src={nowPlaying?.src ?? "https://rs-bucket-s3.s3.ap-south-1.amazonaws.com/music/sos-rs.mp3"}
      />

      <RouteTransition>
        <Routes location={location}>
          <Route
            path="/"
            element={
              <Globe
                lock={lock}
                setLock={setLock}
                finder={finder}
                setFinder={setFinder}
                help={help}
                setHelp={setHelp}
                nowPlaying={nowPlaying}
                playing={playing}
                setPlaying={setPlaying}
                setNowPlaying={setNowPlaying}
                setPlayStatus={() => {}}
                musicStop={musicStop}
                notifications={notifications}
                progress={progress}
                setProgress={setProgress}
                seek={seek}
                setSeek={setSeek}
                songs={songs}
                duration={duration}
                setDuration={setDuration}
                howlerRef={ref}
                onShortcuts={() => setShortcuts(s => !s)}
              />
            }
          />

          <Route path="/resume"    element={<Resume />} />
          <Route path="/particles" element={<Particles />} />
          <Route path="/matrix"    element={<Matrix />} />
          <Route
            path="/music"
            element={
              <React.Suspense fallback={<PageFallback />}>
                <Music ref={ref} duration={duration} setDuration={setDuration}
                  playing={playing} setPlaying={setPlaying}
                  nowPlaying={nowPlaying} setNowPlaying={setNowPlaying}
                  progress={progress} setProgress={setProgress}
                  seek={seek} setSeek={setSeek} songs={songs}
                />
              </React.Suspense>
            }
          />
          <Route
            path="/music/:id"
            element={
              <React.Suspense fallback={<PageFallback />}>
                <Music ref={ref} duration={duration} setDuration={setDuration}
                  playing={playing} setPlaying={setPlaying}
                  nowPlaying={nowPlaying} setNowPlaying={setNowPlaying}
                  progress={progress} setProgress={setProgress}
                  seek={seek} setSeek={setSeek} songs={songs}
                />
              </React.Suspense>
            }
          />
        </Routes>
      </RouteTransition>

      <ShortcutDrawer open={shortcuts} onClose={() => setShortcuts(false)} />
    </>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Provider store={store}>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <ActivityProvider>
            <AppInner />
          </ActivityProvider>
        </BrowserRouter>
      </MotionConfig>
    </Provider>
  );
}
