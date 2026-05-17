# Technical Concerns
*Last mapped: 2026-05-17*

## Critical (Fix Before Shipping)

### 1. Hardcoded Auth Token in Source
**File:** `src/Utility/Axios/axios.js:14`
```js
Authorization: "$2a$12$wekFKA74lN1F/NX5ZW3od.VucddlMllPHYUQU8sbOdyVfXLovNIQ2",
```
A bcrypt hash is committed as a hardcoded Authorization header. This is shipped in the public JS bundle. The commented-out code above it shows this was meant to come from `process.env.TOKEN`. Fix: move to `process.env.REACT_APP_AUTH_TOKEN` and remove from source.

### 2. SET_EXPLORER Is a Function, Not a String
**File:** `src/Utility/state/types.js:6–11`
```js
export const SET_EXPLORER = () => { return { type: "TOGGLE_EXPLORER", data: false }; };
```
`SET_EXPLORER` is exported as a function reference. When `action.js` uses `type: SET_EXPLORER`, the reducer receives a function as the action type and always falls through to `default`. The `setExplorer(data)` action creator silently does nothing.

### 3. TOGGLE_LOCK Passes No Payload
**File:** `src/Utility/state/action.js:16–19` and `toggle.js:26–29`
`toggleLock()` dispatches `{ type: TOGGLE_LOCK }` with no payload, but the reducer reads `action.payload` to set lock state. Lock state can never be changed via dispatch — it stays at initial `true` forever.

### 4. Wrong Owner Name Throughout (Content Bug)
**Files:** 15+ files including resume data, SEO meta tags, share link text
The name "Rishit Shivesh" (previous developer) appears in resume content, `<title>` tags, and social share links. This is a forked/copied portfolio that was never fully rebranded to Ayush Sharma.

### 5. External S3 Assets Not Owned by This User
**Files:** Multiple skill icon imports and globe texture assets
Assets reference S3 buckets belonging to "Rishit" — if those buckets are deleted or made private, the deployed site breaks. Self-host all assets.

---

## High (Address in Upcoming Work)

### 6. React.createRef() in Functional Component
**File:** `src/Components/Music/Casette.js` (approximate)
`React.createRef()` is called inside a functional component. This creates a new ref on every render, breaking audio element access. Fix: replace with `useRef()`.

### 7. Global Event Listeners Without Cleanup
**Files:** `src/App.js`, `src/Pages/Lock.js`
`window.addEventListener(...)` called in component body (not inside `useEffect`). Listeners are added on every render and never removed — memory leak + duplicate handler accumulation.

### 8. Invisible Div as Cross-Component Event Bus
**File:** `src/App.js`
Hidden `<div>` elements are clicked programmatically to trigger music control state changes across components. This is a hack that bypasses React's data flow and makes the music controls brittle and untestable.

### 9. Pervasive Direct DOM Manipulation
**Files:** 10+ components
`document.getElementById(...)` and `document.querySelector(...)` used throughout instead of refs or state. Bypasses React's reconciliation and can cause stale reads.

### 10. Raw Axios Imports Bypassing Auth Instance
**Files:** 3 files import `axios` directly instead of `src/Utility/Axios/axios.js`
API calls from these files skip the Authorization header configuration. Inconsistent auth behavior.

---

## Medium (Tech Debt)

### 11. 4,244-Line Dead Code File
**File:** `src/Pages/Triangle.js`
Entire file is commented-out library code. Adds ~170KB to source tree, confuses readers, slows grep. Delete it.

### 12. Blog Component Props Destructuring Broken
**File:** `src/Components/Blog/display.js` (and related)
Props received as positional arguments instead of destructured object. Will fail silently with wrong values if call sites change.

### 13. No Error Boundaries
No `React.ErrorBoundary` anywhere. Any component throw crashes the full app with a blank screen.

### 14. No Error Handling on API Calls
Axios calls have no `.catch()` or `try/catch`. Network failures silently break features with no user feedback.

### 15. Loading Screen Commented Out
`src/Pages/Loading.js` content and the initial loading sequence in `App.js` are commented out. Users see no feedback during initial data fetch.

### 16. Blog Routes Commented Out
Blog feature routes are commented out in `src/App.js`. Blog pages (`Blog.js`, `SingleBlog.js`, `BlogEditor.js`) exist but are unreachable.

---

## Low (Housekeeping)

### 17. Unmaintained Dependencies
- `react-reveal` — unmaintained, CSS animations preferred
- `draft-js` — heavy editor library, imported but blog editor barely used
- `bcryptjs` — in the frontend bundle with no active use (commented out)

### 18. `window.alert` for Mobile Detection
`src/App.js` uses `window.alert('please use desktop')` for mobile users. Should be a proper UI overlay.

### 19. `nigaa.js` Utility
`src/Utility/nigaa.js` — undocumented file with unclear purpose. Review and document or delete.

### 20. No `.env.example`
`.env` variables (`REACT_APP_URL`, `REACT_APP_AUTH_TOKEN`) are undocumented. New developers have no reference.
