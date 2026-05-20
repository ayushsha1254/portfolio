import {
  TOGGLE_EXPLORER,
  TOGGLE_THEME,
  TOGGLE_LOCK,
  TOGGLE_FINDER,
  SET_EXPLORER,
  TOGGLE_TERMINAL,
  TOGGLE_README,
  TOGGLE_VOID,
  SET_FOCUSED_WINDOW,
  TOGGLE_BLACKBOX,
  TOGGLE_BROWSER,
  MINIMIZE_WINDOW,
  RESTORE_WINDOW,
  TOGGLE_DOOM,
  TOGGLE_STUDIO,
  TOGGLE_ARENA,
  TOGGLE_SIGNAL,
  TOGGLE_RESUME_WIN,
} from "./types";

const toggleTheme = () => ({ type: TOGGLE_THEME });
const toggleLock = () => ({ type: TOGGLE_LOCK });
const toggleFinder = () => ({ type: TOGGLE_FINDER });
const toggleExplorer = () => ({ type: TOGGLE_EXPLORER });
const toggleTerminal = () => ({ type: TOGGLE_TERMINAL });
const toggleReadme = () => ({ type: TOGGLE_README });
const toggleVoid = () => ({ type: TOGGLE_VOID });
const setExplorer = (data) => ({ type: SET_EXPLORER, data });
const setFocusedWindow = (id) => ({ type: SET_FOCUSED_WINDOW, payload: id });
const toggleBlackbox = () => ({ type: TOGGLE_BLACKBOX });
const toggleBrowser    = () => ({ type: TOGGLE_BROWSER });
// payload: { id, title, type }
const toggleDoom       = ()         => ({ type: TOGGLE_DOOM });
const toggleStudio     = ()         => ({ type: TOGGLE_STUDIO });
const toggleArena      = ()         => ({ type: TOGGLE_ARENA });
const toggleSignal     = ()         => ({ type: TOGGLE_SIGNAL });
const toggleResumeWin  = ()         => ({ type: TOGGLE_RESUME_WIN });
const minimizeWindow   = (payload) => ({ type: MINIMIZE_WINDOW, payload });
const restoreWindow    = (id)      => ({ type: RESTORE_WINDOW,  payload: id });

export {
  toggleTheme,
  toggleLock,
  toggleFinder,
  toggleExplorer,
  setExplorer,
  toggleTerminal,
  toggleReadme,
  toggleVoid,
  setFocusedWindow,
  toggleBlackbox,
  toggleBrowser,
  minimizeWindow,
  restoreWindow,
  toggleDoom,
  toggleStudio,
  toggleArena,
  toggleSignal,
  toggleResumeWin,
};
