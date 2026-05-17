# Coding Conventions

**Analysis Date:** 2026-05-17

## Naming Patterns

**Files:**
- React components use PascalCase: `NavBtn.js`, `ExpandedExplorer.js`, `MusicTaskbar.js`
- Utility files use camelCase: `handleMouse.js`, `datetime.js`, `useContextMenu.js`
- Custom hooks use camelCase with `use` prefix: `useContextMenu.js`
- CSS Modules use camelCase with `.module.css` suffix: `desk.module.css`, `finder.module.css`, `button.module.css`
- State/Redux files use camelCase: `action.js`, `toggle.js`, `store.js`, `types.js`

**Functions:**
- Component functions: PascalCase matching the filename — `const NavBtn = ...`, `const Taskbar = ...`
- Event handlers: camelCase prefixed with `handle` — `handleTooltipClose`, `handleTooltipOpen`, `handleClick`, `handleContextMenu`
- Async data fetchers: camelCase prefixed with `get` — `getData`, `getBlogs`
- Redux action creators: camelCase prefixed with `toggle` or `set` — `toggleTheme`, `toggleLock`, `setExplorer`
- Utility functions: camelCase — `refreshClock`, `refreshBattery`, `isTouchDevice`

**Variables:**
- State variables: camelCase — `nowPlaying`, `musicStop`, `loadingNow`, `notificationMessage`
- Constants/data: camelCase — `items`, `commands`, `initialState`
- Redux action type strings: SCREAMING_SNAKE_CASE — `TOGGLE_EXPLORER`, `TOGGLE_THEME`, `SET_EXPLORER` (defined in `src/Utility/state/types.js`)

**Types:**
- No TypeScript — plain JavaScript (.js) throughout
- No PropTypes used anywhere in the codebase

## Code Style

**Formatting:**
- No Prettier config file present; formatting appears to follow Create React App defaults
- Double quotes for all string literals (JSX and JS)
- 2-space indentation throughout
- Trailing commas in multi-line objects and arrays

**Linting:**
- ESLint configured via `package.json` `eslintConfig` field (no standalone `.eslintrc` file)
- Extends `react-app` and `react-app/jest` presets only
- No custom rules added; CRA defaults enforced

## Import Organization

**Order (observed pattern):**
1. React and React hooks — `import React, { useState, useEffect } from "react"`
2. Third-party libraries — `import Draggable from "react-draggable"`, MUI components, icons
3. Internal pages/components — `import Desktop from "./Pages/Desktop"`
4. Internal utilities and state — `import axios from "./Utility/Axios/axios"`, Redux actions
5. Assets (images, SVGs, CSS) — `import wallpaper from "../Assets/Images/wallpaper.svg"`, `import "./animate.css"`

**Path Aliases:**
- None configured. All imports use relative paths (`../`, `./`)

**Inconsistency note:** Some files import hooks both from `"react"` and separately (e.g., `Terminal.js` imports `useRef` from `"react"` on one line, then `useEffect, useState` on the next line). No enforced import grouping rule.

## State Management

**Local state:**
- `React.useState` and `useState` are both used interchangeably (both patterns appear in `App.js`)
- State setters are passed as props down the tree — prop drilling is common

**Global state:**
- Redux with plain `createStore` (not Redux Toolkit) at `src/Utility/state/store.js`
- Single reducer `Toggle` at `src/Utility/state/toggle.js` manages: `theme`, `lock`, `finder`, `explorer`, `terminal`
- Action creators exported from `src/Utility/state/action.js`
- Type constants defined in `src/Utility/state/types.js`
- `useSelector` and `useDispatch` used in components for Redux access

## Component Structure

**Pattern:** Functional components only — no class components found.

**Typical structure:**
```javascript
import React, { useState, useEffect } from "react";
// third-party imports
// local imports
// asset imports

const ComponentName = ({ prop1, prop2 }) => {
  // hooks
  // event handlers
  // effects
  return (
    <div>...</div>
  );
};

export default ComponentName;
```

**Props:** Destructured directly in function signature — `({ theme, setTheme, lock, setLock })`

**Inconsistency note:** `src/Components/Terminal.js` exports `export default App` despite the component being named differently from the file — the internal function is named `App` but the file is `Terminal.js`.

## Styling Approach

**Mixed styling strategy (three systems used simultaneously):**
1. Tailwind CSS utility classes — primary approach, used everywhere inline in JSX
2. CSS Modules — `styles.task`, `styles.matrix`, `finderstyles.modal` etc. (files: `desk.module.css`, `finder.module.css`, `button.module.css`)
3. Inline `style={{}}` objects — used for dynamic values and values Tailwind can't easily express

**Tailwind config:** `tailwind.config.js` with custom colors (`btn.darkNormal`, `btn.lightNormal`, etc.), custom font families, and dark mode via `"class"` strategy.

**Dark mode:** Controlled by toggling `dark` class on `document.documentElement` and Tailwind's `dark:` prefix.

## Error Handling

**Patterns:**
- No consistent error handling strategy. Most `axios` calls use `.then()` with no `.catch()` — errors are swallowed silently
- Example in `App.js`: `axios.get("/songs").then((res) => setSongs(res.data))` — no catch
- `try/catch` appears only in `src/Utility/handleMouse.js` for touch detection, and `src/Pages/Browser.js`
- Empty catch blocks used: `catch (e) {}` in `handleMouse.js` intentionally suppresses errors
- No global error boundary component present

## Logging

**Framework:** `console.log` used directly

**Production suppression:** `src/index.js` globally overrides `console.log = function () {};` to silence all console output in production builds.

**Development logs:** Extensive `console.log` left throughout source files (e.g., `App.js`, `Globe.js`, `Nav.js`, `ExpandedExplorer.js`, `Viewer.js`) — these are suppressed at runtime by the override in `index.js` but remain in source.

## Comments

**When to Comment:**
- Block comments explaining non-obvious behavior: `// Try, catch to avoid any errors for touch screens`
- Large amounts of commented-out code are present throughout — unused routes, disabled features, old implementations left inline rather than removed
- File-level comments: seen in `useContextMenu.js` (`// useContextMenu.js`)

**JSDoc/TSDoc:**
- Not used anywhere in the codebase

## Function Design

**Size:** Components tend to be large and do many things. `App.js` (393 lines) manages global audio, routing, data fetching, and keyboard shortcuts. `Nav.js` (378 lines) contains inline menu JSX.

**Parameters:** Component props destructured in function signature. Non-component functions use positional parameters.

**Return Values:** Components return JSX. Utility functions return primitives or JSX. No consistent use of early returns for guard clauses.

## Module Design

**Exports:** One default export per file — `export default ComponentName` at the end of every file.

**Barrel Files:** Not used. Each import references the file directly.

**Lazy loading:** `React.lazy()` used in `App.js` for `Music`, `Blog`, and `SingleBlog` routes, wrapped in `<Suspense>`.

---

*Convention analysis: 2026-05-17*
