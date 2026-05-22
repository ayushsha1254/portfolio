# NOCTURNE_OS Mobile — Design Spec
**Date:** 2026-05-23  
**Status:** Approved for implementation  
**Branch:** nocturne-mobile

---

## 1. Goals & Constraints

Build a full NOCTURNE_OS mobile experience for viewports ≤ 1000px. Not a port of the desktop — a purpose-built companion that carries the same identity (cinematic, cyberpunk, information-dense) through mobile-native interaction patterns.

**Non-goals:** Responsive scaling of desktop windows, touch emulation of draggable panels.

---

## 2. Technical Foundation

### Integration point
`App.js` already detects `window.innerWidth <= 1000` and sets `mobile` state. Replace the current plaintext gate with `<MobileOS />`:

```jsx
if (mobile) return (
  <MobileOS
    // Music state (ReactHowler stays singleton in App.js)
    howlerRef={ref}
    playing={playing}       setPlaying={setPlaying}
    nowPlaying={nowPlaying} setNowPlaying={setNowPlaying}
    progress={progress}     setProgress={setProgress}
    seek={seek}             setSeek={setSeek}
    songs={songs}
    duration={duration}     setDuration={setDuration}
  />
);
```

### ReactHowler — singleton
`ReactHowler` lives in `App.js` and must not be duplicated. `MobileOS` receives `howlerRef` and controls playback via `howlerRef.current.play/pause/stop/seek()` directly. No hidden div event bus (`#music-stop/play/pause`) on mobile — those are desktop-only.

### State
`MobileOS` uses local `useState` throughout. No Redux dependency — there are no floating windows, no focus management, no minimised windows to track.

### Boot & lock session
`nocturne_booted` (`sessionStorage`) and `lastlogin` (`localStorage`) are shared keys between desktop and mobile. One cinematic boot per browser session regardless of viewport — intentional.

### Reused components (no rebuild)
| Component | Usage in mobile |
|-----------|----------------|
| `<Lock lock setLock />` | Rendered directly inside MobileOS |
| `<Loader onDone />` | Rendered directly inside MobileOS |
| `<Grain />` | Rendered at MobileOS root |
| `src/styles/tokens.css` | All design tokens |
| `src/Data/main.json` | All portfolio content |
| `src/Data/music.json` | Music catalogue |

### New code
Everything else lives under `src/Mobile/`:

```
src/Mobile/
├── MobileOS.js           ← root, manages lock/boot/home state
├── AmbientHome.js        ← clock, now-playing pill, vitals, swipe handle
├── LauncherSheet.js      ← grouped grid + now-playing bar
├── AppShell.js           ← full-screen wrapper (top nav + tab bar + content)
└── apps/
    ├── ArchiveApp.js
    ├── StudioApp.js
    ├── ArenaApp.js
    ├── SignalApp.js
    └── ResumeApp.js
```

---

## 3. Screen Architecture

```
MobileOS
├── <Loader />              cinematic boot (reused, shared session key)
├── <Lock />                full-screen lock (reused)
└── HomeShell
    ├── AmbientHome         always-on ambient clock screen
    ├── LauncherSheet       swipe-up app grid (rendered over AmbientHome)
    └── AppShell            full-screen app container
        ├── ArchiveApp
        ├── StudioApp
        ├── ArenaApp
        ├── SignalApp
        └── ResumeApp
```

MobileOS state: `{ activeApp: null | "archive"|"studio"|"arena"|"signal"|"resume", launcherOpen: boolean }`

---

## 4. Component Specifications

### MobileOS
- Reads `nocturne_booted` from sessionStorage — renders `<Loader />` if not set
- Reads `lastlogin` from localStorage — renders `<Lock />` if not set or stale
- After both gates pass: renders `<AmbientHome />` + conditionally `<LauncherSheet />` + conditionally `<AppShell />`
- Wraps everything in `<Grain />` for atmospheric consistency

### AmbientHome
- `position: fixed; inset: 0; background: var(--bg-void)`
- **Clock:** Geist 48px `--text-primary`, centered vertically at ~40% height
- **Date:** IBM Plex Mono 11px `--text-muted`, 0.12em tracking, below clock
- **Now-playing pill:** 12px below date. Purple border (`rgba(122,92,255,0.3)`), 40px tall, album art circle (28px) + track name (mono 9px) + `▶` indicator. Tap → opens StudioApp
- **Vitals grid:** 2×2 grid, 16px below pill. Cells: `--bg-elevated`, `--border-hairline`, 8px border-radius. Each cell: label (7px `--text-muted`, 0.12em tracking) + value (9px `--text-secondary`). Content: ARCHIVE (section count), ARENA (project count), SIGNAL (● ready), UPTIME (formatted)
- **Swipe handle area:** Bottom 64px. Centered `↑ LAUNCH` in IBM Plex Mono 8px `--text-muted`. Drag-up gesture (Framer Motion `useDragControls`) triggers LauncherSheet

### LauncherSheet
- Framer Motion `AnimatePresence` + `motion.div` spring: `stiffness 400, damping 34, mass 0.8`
- Enters: `y: "100%" → 0`. Exits: `y: 0 → "100%"`
- Drag handle (22px wide hairline pill) at top — drag-down-past-threshold dismisses
- AmbientHome visible behind at 45% opacity + `blur(6px)` via CSS filter on the home layer
- **Group label:** IBM Plex Mono 8px `--text-muted` 0.14em tracking: `WORK`, `CONNECT`
- **WORK tiles:** ARCHIVE · ARENA · RESUME — 3-col grid
- **CONNECT tiles:** STUDIO · SIGNAL — 2-col grid
- Each tile: `--bg-elevated`, 2px accent top border (type color), 5px border-radius. Label: mono 8px. Live status: mono 7px `--text-muted`
- **Now-playing bar:** Pinned at bottom above safe area. `--bg-elevated`, purple border, album art (20px) + track name (truncated) + play/pause button. Tap → opens StudioApp

### AppShell
Wrapper rendered when `activeApp !== null`:

- **Entry transition:** `x: "100vw" → 0`, duration 0.28s, ease `[0.0, 0.0, 0.2, 1]`
- **Exit transition (back):** `x: 0 → "100vw"`, duration 0.22s, ease `[0.4, 0.0, 1.0, 1.0]`
- **Swipe-right-to-back:** Framer Motion `drag="x"` constrained to `dragConstraints={{ left: 0 }}`. On release past 30% screen width, trigger exit.
- **Top nav bar:** 44px, `--bg-surface`, `--border-hairline` bottom. Left: `←` in `--accent-red` 15px, tap sets `activeApp: null`. Center: app name IBM Plex Mono 10px `--text-muted`. No right action.
- **Accent bar:** 2px below nav bar, type color (matches desktop PERSONALITY map)
- **Content area:** `flex: 1`, `overflow-y: auto`, `-webkit-overflow-scrolling: touch`
- **Scroll fade:** `::after` pseudo sticky element at content bottom — `linear-gradient(transparent, var(--bg-elevated))`, 44px height, `pointer-events: none`
- **Tab bar:** `52px + env(safe-area-inset-bottom)`, `--bg-surface`, `--border-hairline` top. Active tab: 1.5px accent top border + `--text-primary`. Inactive: `--text-muted`. Label: IBM Plex Mono 8px ALL CAPS 0.10em tracking. Tab switch: content cross-fade 150ms opacity.
- **Home indicator:** Centered 36px × 3px pill `rgba(255,255,255,0.15)` rendered inside the tab bar's safe-area padding zone at the very bottom.

---

## 5. App Specifications

All apps are **new components** in `src/Mobile/apps/`. They share data from `src/Data/main.json` and `src/Data/music.json` only — no code reuse from desktop app components (which are built for windowed desktop contexts).

### ArchiveApp — 5 tabs: ABOUT · SKILLS · PROJECTS · CERTS · SIH

**ABOUT**
- Bio paragraph (Inter 13px `--text-secondary`, 1.7 line-height)
- Key stats row (Geist 500, mono labels): role, location, years exp
- Skill chips preview (top 8, color-coded by category)

**SKILLS**
- Chips grouped by category, each group preceded by a mono 8px label
- Category accent colors match desktop: frontend `--accent-purple`, backend `--accent-green`, tools `--accent-amber`

**PROJECTS**
- Vertical list of project rows from `main.json`
- Each row: project name (Geist 13px) + stack tags (mono 8px) — tap to expand inline
- Expanded state: description + GitHub + live links as `--border-default` outlined buttons

**CERTS**
- Compact list rows: cert name + issuer + date. Tap → bottom sheet with cert detail

**SIH**
- Hero image (full-width, border-radius 6px)
- Problem statement (amber left-border card)
- Team avatars (40px circles, horizontal scroll)
- Media grid (2-col)
- Certificate image

### StudioApp — 2 tabs: PLAYER · TRACKS

**PLAYER**
- Album art: 100px circle, centered, dominant-color ambient glow via `box-shadow`
- Track name: Geist 16px `--text-primary`, centered below art
- Artist: IBM Plex Mono 10px `--text-muted`
- Progress scrubber: full-width, 3px track, Framer Motion drag handle, `--accent-purple`
- Controls row: skip-prev · play/pause (24px) · skip-next — centered, 48px touch targets
- Volume: horizontal slider, full-width
- All controls call `howlerRef.current` methods directly (no div event bus)

**TRACKS**
- Scrollable list, each row: track name + duration
- Active track: `--accent-purple` left border + name color `--text-primary`
- Tap to set `nowPlaying` and call `howlerRef.current.play()`

### ArenaApp — 2 tabs: FEATURED · ALL

**FEATURED**
- First/pinned project as a full-width hero card
- Project name: Geist 20px
- Description: Inter 12px `--text-secondary`
- Stack tags, GitHub + live link buttons

**ALL**
- Dense list: name + stack preview + `↗` — same expand pattern as PROJECTS in ArchiveApp

### SignalApp — single screen (no tabs)
- Same terminal-style form aesthetic as desktop Signal.js
- Input fields: bottom-border only, `--accent-green` focus, mono font `>` prefix
- `TRANSMIT_` button with sending/sent/error states
- Web3Forms API (`VITE_WEB3FORMS_KEY`) — same endpoint as desktop
- `padding-bottom: env(safe-area-inset-bottom)` + extra 80px when keyboard visible (use `visualViewport` resize event)
- Social links below form: mono text list, `↗` arrows

### ResumeApp — single screen (no tabs)
- Download button at top: `--border-default` outlined, full-width
- Resume content sections: scrollable, same data as desktop Resume.js
- Section labels: IBM Plex Mono 9px `--accent-red` 0.12em tracking
- Entry rows: title (Geist 13px) + meta (mono 9px `--text-muted`) + description (Inter 11px)

---

## 6. Motion Language

All existing design token spring presets apply. Mobile additions:

| Animation | Spec |
|-----------|------|
| LauncherSheet enter | `y: "100%" → 0`, spring `stiffness 400, damping 34, mass 0.8` |
| LauncherSheet exit | `y: 0 → "100%"`, same spring |
| App push in | `x: "100vw" → 0`, `duration: 0.28s`, ease `[0.0, 0.0, 0.2, 1]` |
| App exit | `x: 0 → "100vw"`, `duration: 0.22s`, ease `[0.4, 0.0, 1.0, 1.0]` |
| Tab content switch | cross-fade `opacity 0 → 1`, 150ms |
| Now-playing pill enter | spring scale from 0.92, `stiffness 480, damping 32` |
| Swipe-back gesture | follows finger live, spring-releases on lift |

`prefers-reduced-motion`: all translate/scale animations collapse to fade-only (inherited from existing `MotionConfig reducedMotion="user"` in App.js root).

---

## 7. Phase Plan

| Phase | Scope | Key deliverables |
|-------|-------|-----------------|
| **Mobile M1** | Shell | `MobileOS.js`, `AmbientHome.js`, `LauncherSheet.js`, App.js integration, boot/lock wiring |
| **Mobile M2** | AppShell + Archive | `AppShell.js`, `ArchiveApp.js` (all 5 tabs) |
| **Mobile M3** | Studio + Arena | `StudioApp.js`, `ArenaApp.js` |
| **Mobile M4** | Signal + Resume + Polish | `SignalApp.js`, `ResumeApp.js`, keyboard avoidance, scroll fades, safe-area insets, cross-browser test |

Each phase ships on its own commit. Design tokens, Grain, Lock, and Loader are used as-is — no changes to existing desktop code.

---

## 8. Out of Scope

- Desktop code changes (zero impact on existing desktop experience)
- Landscape orientation (portrait-only; landscape shows a rotation prompt)
- PWA / installable app manifest
- Push notifications
- Offline mode
