# Technology Stack

**Analysis Date:** 2026-05-17

## Languages

**Primary:**
- JavaScript (ES2022+) - All application code in `src/`

**Secondary:**
- JSON - Static data files in `src/Data/`
- CSS - Component-level stylesheets (e.g., `src/Components/music.css`)

## Runtime

**Environment:**
- Node.js v22.22.0

**Package Manager:**
- npm (lockfile version 2)
- Lockfile: `package-lock.json` — present

## Frameworks

**Core:**
- React 18.2.0 - UI rendering, component tree (`src/App.js`, `src/index.js`)
- React Router DOM 6.4.3 - Client-side routing (`src/App.js`)
- Redux 4.2.0 + React Redux 8.0.5 - Global state (`src/Utility/state/`)

**Build/Dev:**
- Create React App (react-scripts 5.0.1) - Build toolchain, dev server, test runner
- Tailwind CSS 3.2.1 - Utility-first styling (`tailwind.config.js`)
- PostCSS 8.4.18 + Autoprefixer 10.4.13 - CSS processing (`postcss.config.js`)

**Testing:**
- Jest (via react-scripts) - Test runner
- React Testing Library 13.4.0 - Component testing (`src/App.test.js`, `src/setupTests.js`)
- @testing-library/jest-dom 5.16.5 - Custom matchers

## Key Dependencies

**Critical:**
- `axios` 1.2.2 - HTTP client for backend API calls (`src/Utility/Axios/axios.js`)
- `react-howler` 5.2.0 - Audio playback wrapper around Howler.js (`src/App.js`, `src/Pages/Music.js`)
- `react-globe.gl` 2.22.7 + `globe.gl` 2.26.9 - Interactive 3D globe (`src/Pages/Handler.js`)
- `three` 0.146.0 + `@react-three/fiber` 8.9.1 - WebGL / 3D rendering
- `react-redux` 8.0.5 + `redux` 4.2.0 - Global UI state management
- `react-router-dom` 6.4.3 - Routing

**UI Libraries:**
- `@mui/material` 5.10.13 + `@emotion/react` 11.10.5 + `@emotion/styled` 11.10.5 - MUI component library
- `@headlessui/react` 1.7.4 - Accessible headless UI components
- `flowbite` 1.5.4 - Tailwind component library (loaded via CDN-like script in `public/index.html`)
- `tailwindcss` 3.2.1 - Utility CSS framework
- `swiper` 8.4.5 - Touch/swipe slider
- `react-icons` 4.6.0 - Icon library
- `react-toastify` 9.1.1 - Toast notifications

**Animation / Visual Effects:**
- `tsparticles` 2.5.3 + `react-particles` 2.5.3 - Particle effects (`src/Pages/Particles.js`)
- `lottie-web` 5.10.0 + `react-lottie` 1.2.3 - Lottie animations (`src/Assets/Lottie/`)
- `atropos` 1.0.2 - 3D tilt card effects
- `react-reveal` 1.2.2 - Scroll reveal animations
- `react-scroll-parallax` 3.3.2 + `react-parallax-hover` 2.0.2 + `react-parallax-mouse` 2.0.1 - Parallax effects
- `parallax-js` 3.1.0 - Parallax library
- `typewriter-effect` 2.19.0 - Typewriter text effect

**Content & Docs:**
- `react-pdf` 6.2.0 + `@react-pdf-viewer/core` 3.9.0 + `pdfjs-dist` 2.16.105 - PDF rendering (`src/Components/Explorer/Pdf.js`)
- `draft-js` 0.11.7 + `react-draft-wysiwyg` 1.15.0 + `draftjs-to-html` 0.9.1 - Rich text editing (`src/Pages/BlogEditor.js`)
- `react-helmet` 6.1.0 - Document head management

**Utilities:**
- `moment` 2.29.4 + `react-moment` 1.1.3 - Date formatting
- `react-palette` 1.0.2 + `extract-colors` 2.0.4 - Color extraction from images
- `contrast-color` 1.0.1 - Accessible color contrast calculation
- `react-draggable` 4.4.5 - Draggable component positioning
- `fitty` 2.3.6 - Auto-fitting text
- `react-terminal` 1.3.0 + `terminal-in-react` 4.3.1 - Terminal emulator components
- `react-tetris` 0.3.0 - Tetris game component (`src/Pages/Tetris.js`)
- `react-confetti` 6.1.0 - Confetti animation
- `react-dotenv` 0.1.3 - Runtime environment variable injection (`public/env.js`)
- `bcryptjs` 2.4.3 - Password hashing (commented-out in axios config)
- `battery` 1.0.1 - Battery API access (commented-out in Blog.js)

## Configuration

**Environment:**
- Runtime env vars injected via `public/env.js` (currently empty: `window.env = {}`)
- `REACT_APP_URL` — backend base URL read by `src/Utility/Axios/axios.js` via `process.env.REACT_APP_URL`
- No `.env` file detected in the repo; variables must be set in the deployment environment

**Build:**
- `tailwind.config.js` — dark mode: `class`, custom colors, custom fonts, custom cursor
- `postcss.config.js` — Tailwind + Autoprefixer plugins
- `package.json` `eslintConfig` — extends `react-app` and `react-app/jest`
- `public/index.html` — loads jQuery 3.6.3 from CDN, pdf.js worker from cdnjs, `env.js`, and flowbite bundle

**Dark Mode:**
- Driven by `localStorage` key `"color-theme"` (`"dark"` / `"light"`)
- Class-based (`document.documentElement.classList`) toggled in `src/App.js` and `public/index.html`

## Platform Requirements

**Development:**
- Node.js >=16 (tested on v22)
- npm install; npm start (CRA dev server on port 3000)

**Production:**
- Static SPA build via `npm run build` (outputs to `build/`)
- Deployment target: not specified in repo; compatible with any static hosting (Netlify, Vercel, S3, etc.)
- Backend API required at `REACT_APP_URL` for songs, notifications, skills, certifications, and blogs

---

*Stack analysis: 2026-05-17*
