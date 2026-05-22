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
