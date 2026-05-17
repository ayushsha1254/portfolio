<!-- refreshed: 2026-05-17 -->
# Architecture

**Analysis Date:** 2026-05-17

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                      Browser Entry Point                     │
│               `src/index.js` (lazy loads App)               │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    App Shell (`src/App.js`)                  │
│   Providers: Redux, BrowserRouter, TerminalContext,         │
│   ParallaxProvider. Global music state. Route definitions.  │
└───────────┬──────────────────────┬──────────────────────────┘
            │                      │
            ▼                      ▼
┌──────────────────┐   ┌────────────────────────────────────┐
│  `Pages/Global`  │   │     Route-level Pages               │
│  (overlay layer) │   │  /            → Global > Globe      │
│  Explorer modal  │   │  /music       → Music               │
│  Terminal modal  │   │  /resume      → Resume              │
│  Finder overlay  │   │  /terminal    → Terminal (page)     │
│  Gallery viewer  │   │  /tetris      → Tetris              │
│  Help modal      │   │  /particles   → Particles           │
│  Cert modal      │   │  /triangles   → Triangle            │
└───────┬──────────┘   │  /browser     → Browser             │
        │              │  /matrix      → Matrix              │
        ▼              └────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                 Redux Store (`Utility/state/`)               │
│  State: { theme, lock, finder, explorer, terminal }         │
└─────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────┐
│  External API (`Utility/Axios/axios.js`)                     │
│  baseURL: process.env.REACT_APP_URL  (songs, notifications, │
│  skills, certifications endpoints)                          │
└──────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| App | Root provider wrapper, route definitions, global music state | `src/App.js` |
| Global | Persistent overlay container: Explorer, Terminal, Finder, Gallery, Help | `src/Pages/Global.js` |
| Globe | Primary home view: animated globe, Nav, Taskbar, Lock screen | `src/Pages/Globe.js` |
| Lock | Fullscreen lock screen shown until user swipes | `src/Pages/Lock.js` |
| Nav | macOS-style top navigation bar, theme toggle, notifications | `src/Components/Nav.js` |
| Taskbar | macOS-style dock at bottom, dispatches Redux toggle actions | `src/Components/Taskbar.js` |
| ExpandedExplorer | Slide-up file-explorer modal with sections (About, Skills, Projects, Certifications, Contact) | `src/Components/ExpandedExplorer.js` |
| Finder | Spotlight-style app launcher overlay | `src/Components/Finder.js` |
| Terminal | Interactive terminal emulator component (react-terminal) | `src/Components/Terminal.js` |
| Music (page) | Music player page with album/song views, ReactHowler | `src/Pages/Music.js` |
| Resume | Full-page resume/CV viewer | `src/Pages/Resume.js` |
| Handler | react-globe.gl animated 3D globe with arc/ring animations | `src/Pages/Handler.js` |
| Particles | tsparticles background canvas on home screen | `src/Pages/Particles.js` |
| Menu | Right-click context menu (theme toggle, lock) | `src/Components/Menu.js` |

## Pattern Overview

**Overall:** macOS desktop simulation SPA — a portfolio website styled as a desktop OS environment.

**Key Characteristics:**
- Single page at `/` hosts the entire desktop experience; other routes are standalone "app windows"
- Global UI overlays (Explorer, Finder, Terminal) controlled exclusively via Redux toggles
- Music state (playback, progress, current song) lives in App-level local state and is passed down as props; audio managed by a single ReactHowler instance in App
- `Global` acts as a portal/overlay layer wrapping the `Globe` home view
- Lazy-loaded routes (Music, Blog, SingleBlog) split bundle to keep initial load light

## Layers

**Entry Layer:**
- Purpose: Bootstrap React, mount root, lazy-load App
- Location: `src/index.js`
- Contains: ReactDOM.createRoot, Suspense fallback (Loader)
- Depends on: React, Pages/Loader

**Application Shell:**
- Purpose: Provider setup, route map, global audio state, keyboard shortcuts
- Location: `src/App.js`
- Contains: All route `<Route>` definitions, ReactHowler, Redux Provider, music state hooks
- Depends on: Redux store, react-router-dom, Pages/*, Components/Menu

**Pages Layer:**
- Purpose: Full-screen views mounted per route; each page is self-contained
- Location: `src/Pages/`
- Contains: Globe, Music, Resume, Terminal (page), Tetris, Triangle, Browser, Particles, Lock, Loader, Loading, Handler, Global
- Depends on: Components layer, Data layer, Utility layer

**Components Layer:**
- Purpose: Reusable UI blocks; stateful modals and panels controlled by props/Redux
- Location: `src/Components/`
- Contains: Nav, Taskbar, Finder, ExpandedExplorer, Terminal, Menu, Matrix, MusicTaskbar, Help, Gallery/Viewer, Explorer/* sub-components
- Depends on: Utility/state (Redux actions), Data layer, Assets

**Data Layer:**
- Purpose: Static JSON content (portfolio content, music catalog)
- Location: `src/Data/`
- Contains: `main.json` (name, bio, education, skills, projects, explorer config), `music.json` (song list with S3 URLs)
- Depends on: Nothing — pure data

**Utility Layer:**
- Purpose: Shared helpers, HTTP client, Redux store
- Location: `src/Utility/`
- Contains: `Axios/axios.js` (configured axios instance), `state/` (Redux store, reducer, actions, types), misc helpers (chars.js, circle.js, handleMouse.js, triangle.js, nigaa.js, SuspendPinch.js)
- Depends on: redux, axios

**Assets Layer:**
- Purpose: Static media — SVGs, PNGs, Lottie JSON, audio references
- Location: `src/Assets/`
- Contains: Icons, Images, Theme, Player, Projects, Skills, Socials, Resume, Lottie, Cursor, sih, tech, folders

## Data Flow

### Home Page Render Path

1. `src/index.js` renders `<App>` lazily with Loader fallback
2. `src/App.js` wraps tree in Redux `<Provider>`, `<BrowserRouter>`, `<TerminalContextProvider>`, `<ParallaxProvider>`
3. Route `/` renders `<Global>` as wrapper with `<Globe>` as child
4. `Globe` reads Redux state via `useSelector`, renders Nav + Taskbar + Lock overlay + Handler (3D globe) + Particles
5. Lock screen is shown until user interaction sets `lock: false` in component state

### Modal/Overlay Toggle Flow

1. User clicks Taskbar icon (e.g., Explorer) → `dispatch(toggleExplorer())` → Redux state `explorer: true`
2. `Global` reads `state.explorer` via `useSelector` → renders `<ExpandedExplorer>`
3. ExpandedExplorer close button → `dispatch(toggleExplorer(false))` → component unmounts

### Music Playback Flow

1. `App.js` fetches `/songs` via axios on mount → `setSongs`
2. User navigates to `/music` → `Music` page receives `songs`, `playing`, `nowPlaying`, `setNowPlaying` as props
3. User selects song → `setNowPlaying(song)` updates App state → ReactHowler `src` prop changes → audio loads and plays
4. Progress tracked by 1-second `setInterval` polling `ref.current.seek()` in App.js

**State Management:**
- Redux manages UI visibility toggles: `{ theme, lock, finder, explorer, terminal }`
- Music playback state lives in `App.js` local state and is passed to children as props
- API-fetched data (songs, notifications, skills, certifications) lives in `App.js` local state

## Key Abstractions

**Redux Toggle Store:**
- Purpose: Single source of truth for which OS-level UI panels are open
- Examples: `src/Utility/state/store.js`, `src/Utility/state/toggle.js`, `src/Utility/state/action.js`
- Pattern: Classic Redux with action creators and a single reducer; no middleware, no slices

**Axios Instance:**
- Purpose: Pre-configured HTTP client with baseURL from env and hardcoded Authorization header
- Examples: `src/Utility/Axios/axios.js`
- Pattern: Single shared instance exported as default; imported in App.js for data fetching

**Global Overlay Layer:**
- Purpose: Mounts persistent modals that must survive route changes or sit above the main view
- Examples: `src/Pages/Global.js`
- Pattern: Wrapper component that renders children (Globe) plus conditional modal components driven by Redux state

**Data JSON Files:**
- Purpose: Content store for portfolio data without a CMS
- Examples: `src/Data/main.json`, `src/Data/music.json`
- Pattern: Imported directly into components via ES module `import data from '../Data/main.json'`

## Entry Points

**Application Entry:**
- Location: `src/index.js`
- Triggers: Browser loads `index.html` → webpack/CRA serves bundle
- Responsibilities: Create React root, wrap App in StrictMode and Suspense, suppress console.log in production

**Route Entry `/`:**
- Location: `src/Pages/Globe.js` (inside `src/Pages/Global.js` wrapper, defined in `src/App.js`)
- Triggers: React Router matches path `/`
- Responsibilities: Render the desktop home screen with Lock, Nav, Taskbar, animated globe, particles

**Route Entry `/music`:**
- Location: `src/Pages/Music.js` (lazy loaded)
- Triggers: Navigation to `/music` or `/music/:id`
- Responsibilities: Music player UI; receives audio state as props from App.js

## Architectural Constraints

- **Threading:** Single-threaded React event loop; no Web Workers used
- **Global state:** Redux store in `src/Utility/state/store.js` is module-level singleton. Music state is local to `src/App.js` but effectively global via prop drilling
- **Circular imports:** `src/Utility/state/types.js` exports both string constants AND a function named `SET_EXPLORER` that returns an action object — this naming collision means the string constant `SET_EXPLORER` from types.js is never used; `action.js` defines its own string inline
- **Mobile:** Mobile detection is stubbed — `setMobile(false)` is always called, so the alert branch never fires
- **Audio:** Single ReactHowler instance in App.js uses `React.createRef()` on every render (not `useRef`), causing ref instability; guarded by try/catch via interval

## Anti-Patterns

### Props Drilled Music State

**What happens:** Music playback state (`playing`, `nowPlaying`, `progress`, `seek`, `duration`, `setPlaying`, `setNowPlaying`, etc.) is managed in `src/App.js` and passed 2-3 levels deep through Globe → Taskbar → MusicTaskbar and also to the Music page route.

**Why it's wrong:** Adding music controls anywhere new requires threading props through every intermediate component.

**Do this instead:** Move music state into Redux or a React Context — see how `explorer`/`finder`/`terminal` toggles cleanly use Redux in `src/Utility/state/`.

### `React.createRef()` Inside Function Component

**What happens:** `src/App.js` line 49 calls `const ref = React.createRef()` inside the function body, not `useRef`.

**Why it's wrong:** `createRef` creates a new ref object on every render, breaking the stable ref that ReactHowler and the `setInterval` depend on.

**Do this instead:** Replace with `const ref = React.useRef()`.

### Hardcoded Authorization Token

**What happens:** `src/Utility/Axios/axios.js` line 14 contains a hardcoded bcrypt hash as the Authorization header value.

**Why it's wrong:** Credentials committed to source; any rotation requires a code change and redeploy.

**Do this instead:** Move to `process.env.REACT_APP_AUTH_TOKEN` and add to `.env`.

## Error Handling

**Strategy:** No centralized error boundary. Errors in lazy-loaded routes surface as blank fallbacks.

**Patterns:**
- API calls use `.then()` chains with no `.catch()` handlers — failed fetches silently leave state as empty arrays
- `console.log` is globally suppressed in `src/index.js` (`console.log = function () {}`)

## Cross-Cutting Concerns

**Logging:** `console.log` suppressed globally at entry; debug logs left throughout components behind this suppression.
**Validation:** None — form inputs (Terminal mail command) do basic null checks inline.
**Authentication:** No user auth. The `lock` state is purely cosmetic (client-side only). API auth uses a static hardcoded token.

---

*Architecture analysis: 2026-05-17*
