import { Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useDragControls, useAnimation, useMotionValue } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { minimizeWindow, restoreWindow, setFocusedWindow } from "../../Utility/state/action";
import { useResize, RESIZE_HANDLES } from "../../Utility/useResize";
import WindowControls from "./WindowControls";
import ErrorBoundary from "../ErrorBoundary";

const WindowFallback = () => (
  <div style={{
    width: "100%", height: "100%",
    background: "var(--bg-elevated)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "var(--font-mono)", fontSize: "10px",
    color: "var(--text-muted)", letterSpacing: "0.08em",
  }}>
    LOADING_
  </div>
);

const PERSONALITY = {
  terminal: { border: "var(--accent-green)",  shadow: "0 0 0 1px rgba(62,255,139,0.15), 0 16px 48px rgba(0,0,0,0.7)"  },
  archive:  { border: "var(--border-default)", shadow: "0 16px 48px rgba(0,0,0,0.7)"                                    },
  studio:   { border: "var(--accent-purple)",  shadow: "0 0 0 1px rgba(122,92,255,0.15), 0 16px 48px rgba(0,0,0,0.7)" },
  arena:    { border: "var(--accent-red)",     shadow: "0 0 0 1px rgba(255,59,48,0.15), 0 16px 48px rgba(0,0,0,0.7)"  },
  signal:   { border: "var(--accent-amber)",   shadow: "0 0 0 1px rgba(245,166,35,0.12), 0 16px 48px rgba(0,0,0,0.7)" },
  readme:   { border: "var(--border-subtle)",  shadow: "0 16px 48px rgba(0,0,0,0.65)"                                  },
  void:     { border: "var(--border-hairline)",shadow: "0 12px 32px rgba(0,0,0,0.5)"                                   },
};

export default function Window({
  id,
  type     = "archive",
  title,
  open,
  onClose,
  initialX = 140,
  initialY = 60,
  width    = 520,
  height   = 400,
  children,
}) {
  const dispatch      = useDispatch();
  const focusedWindow = useSelector((s) => s.focusedWindow);
  const minimized     = useSelector((s) => s.minimizedWindows.some((w) => w.id === id));
  const focused       = focusedWindow === id;

  const dragControls  = useDragControls();
  const x             = useMotionValue(initialX);
  const y             = useMotionValue(initialY);
  const { size, sRef, forceSize, onHandleDown } = useResize(width, height, x, y);
  const innerControls = useAnimation();
  const p             = PERSONALITY[type] || PERSONALITY.archive;

  const savedRef      = useRef({ x: initialX, y: initialY, w: width, h: height });
  const prevMinimized = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const animating     = useRef(false);
  const windowRef     = useRef(null);

  // ── Open entry animation ──────────────────────────────────────────────────
  useEffect(() => {
    if (open) {
      innerControls.set({ opacity: 0, scale: 0.96 });
      innerControls.start({ opacity: 1, scale: 1, transition: { type: "spring", stiffness: 500, damping: 35, mass: 0.8 } });
    }
  }, [open]);  // eslint-disable-line

  // ── Clean up minimized state when window closes ───────────────────────────
  useEffect(() => {
    if (!open && minimized) dispatch(restoreWindow(id));
  }, [open]);  // eslint-disable-line

  // ── Restore animation when minimized→false ────────────────────────────────
  useEffect(() => {
    if (!minimized && prevMinimized.current && open) {
      // Fly back from dock position
      x.set(savedRef.current.x);
      y.set(savedRef.current.y);
      forceSize(savedRef.current.w, savedRef.current.h);
      innerControls.set({ opacity: 0, scale: 0.08, y: 60 });
      innerControls.start({
        opacity: 1, scale: 1, y: 0,
        transition: { type: "spring", stiffness: 420, damping: 32 },
      });
      dispatch(setFocusedWindow(id));
    }
    prevMinimized.current = minimized;
  }, [minimized]);  // eslint-disable-line

  // ── Minimize ─────────────────────────────────────────────────────────────
  const handleMinimize = async () => {
    if (animating.current || minimized) return;
    animating.current = true;

    const sx = x.get(), sy = y.get();
    savedRef.current = { x: sx, y: sy, w: size.w, h: size.h };

    // Fly toward dock center (bottom of screen)
    const dockCenterX = window.innerWidth  / 2 - sx - size.w / 2;
    const dockBottomY = window.innerHeight - sy + 20;

    const ease = [0.4, 0, 0.8, 1];
    await Promise.all([
      innerControls.start({
        scale: 0.05,
        opacity: 0,
        x: dockCenterX,
        y: dockBottomY,
        transition: { duration: 0.38, ease },
      }),
    ]);

    // Reset inner position so restore starts clean
    innerControls.set({ scale: 0.05, opacity: 0, x: 0, y: 0 });
    dispatch(minimizeWindow({ id, title, type }));
    animating.current = false;
  };

  // ── Fullscreen ────────────────────────────────────────────────────────────
  const handleFullscreen = () => {
    const MENU_H = 36;
    const DOCK_H = 48;

    if (!isFullscreen) {
      savedRef.current = { x: x.get(), y: y.get(), w: size.w, h: size.h };
      const spring = { type: "spring", stiffness: 280, damping: 28 };
      animate(x, 0,                             spring);
      animate(y, MENU_H,                        spring);
      forceSize(window.innerWidth, window.innerHeight - MENU_H - DOCK_H);
      setIsFullscreen(true);
    } else {
      const spring = { type: "spring", stiffness: 280, damping: 28 };
      animate(x, savedRef.current.x, spring);
      animate(y, savedRef.current.y, spring);
      forceSize(savedRef.current.w, savedRef.current.h);
      setIsFullscreen(false);
    }

    // Re-focus any iframe inside (e.g. DOOM) after animation settles
    setTimeout(() => {
      windowRef.current?.querySelector("iframe")?.focus();
    }, 420);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={windowRef}
          drag={!isFullscreen}
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          style={{
            x,
            y,
            position:  "absolute",
            width:     size.w,
            top:  0,
            left: 0,
            zIndex: focused ? "var(--z-focused)" : "var(--z-windows)",
          }}
          exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.18, ease: "easeIn" } }}
          onPointerDown={() => { if (!focused) dispatch(setFocusedWindow(id)); }}
        >
          {/* Inner — handles visibility animation (open/close/minimize) */}
          <motion.div animate={innerControls} style={{ width: "100%", originX: 0.5, originY: 0.5 }}>
            <div
              style={{
                height:            size.h,
                display:           "flex",
                flexDirection:     "column",
                background:        "var(--bg-elevated)",
                backdropFilter:    "blur(20px) saturate(130%)",
                WebkitBackdropFilter: "blur(20px) saturate(130%)",
                border:            `1px solid ${focused ? p.border : "var(--border-hairline)"}`,
                borderRadius:      isFullscreen ? "0" : "6px",
                overflow:          "hidden",
                boxShadow:         focused ? p.shadow : "0 8px 24px rgba(0,0,0,0.4)",
                transition:        "border-color 200ms, box-shadow 200ms, border-radius 300ms",
              }}
            >
              {/* Type accent bar */}
              <div style={{
                height:     "2px",
                background: p.border,
                opacity:    focused ? 0.80 : 0.22,
                transition: "opacity 200ms",
                flexShrink: 0,
              }} />

              {/* Title bar */}
              <div
                onPointerDown={(e) => {
                  if (isFullscreen) return;
                  dispatch(setFocusedWindow(id));
                  dragControls.start(e);
                }}
                style={{
                  height:       "32px",
                  background:   "var(--bg-surface)",
                  borderBottom: "1px solid var(--border-hairline)",
                  display:      "flex",
                  alignItems:   "center",
                  padding:      "0 12px",
                  cursor:       isFullscreen ? "default" : "grab",
                  userSelect:   "none",
                  flexShrink:   0,
                }}
              >
                <WindowControls
                  onClose={onClose}
                  onMinimize={handleMinimize}
                  onFullscreen={handleFullscreen}
                  isFullscreen={isFullscreen}
                />
                <span style={{
                  flex:          1,
                  textAlign:     "center",
                  fontFamily:    "var(--font-data)",
                  fontSize:      "10px",
                  color:         "var(--text-muted)",
                  letterSpacing: "0.08em",
                  marginRight:   "38px",
                }}>
                  {title}
                </span>
              </div>

              {/* Content area */}
              <div
                onPointerDown={(e) => e.stopPropagation()}
                style={{ flex: 1, overflow: "auto", scrollbarWidth: "thin", minHeight: 0 }}
              >
                <ErrorBoundary>
                  <Suspense fallback={<WindowFallback />}>
                    {children}
                  </Suspense>
                </ErrorBoundary>
              </div>
            </div>
          </motion.div>

          {/* Resize handles — outside inner to avoid clipping */}
          {!isFullscreen && RESIZE_HANDLES.map((h, i) => (
            <div
              key={i}
              onPointerDown={(e) => onHandleDown(e, h.dirs)}
              style={{ position: "absolute", zIndex: 10, ...h.css }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
