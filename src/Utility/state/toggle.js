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
} from "./types";

const initialState = {
  theme: localStorage.getItem("color-theme") == "dark",
  lock: true,
  finder: false,
  explorer: false,
  terminal: false,
  readme: false,
  void: false,
  blackbox: false,
  browser: false,
  doom:    false,
  studio:  false,
  arena:   false,
  focusedWindow: null,
  minimizedWindows: [],   // [{ id, title, type }]
};

export default function Toggle(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_THEME:
      return { ...state, theme: !state.theme };
    case TOGGLE_LOCK:
      return { ...state, lock: action.payload };
    case TOGGLE_FINDER:
      return { ...state, finder: !state.finder };
    case TOGGLE_EXPLORER:
      return { ...state, explorer: !state.explorer };
    case TOGGLE_TERMINAL:
      return { ...state, terminal: !state.terminal };
    case SET_EXPLORER:
      return { ...state, explorer: action.data };
    case TOGGLE_README:
      return { ...state, readme: !state.readme };
    case TOGGLE_VOID:
      return { ...state, void: !state.void };
    case TOGGLE_BLACKBOX:
      return { ...state, blackbox: !state.blackbox };
    case TOGGLE_BROWSER:
      return { ...state, browser: !state.browser };
    case TOGGLE_DOOM:
      return { ...state, doom: !state.doom };
    case TOGGLE_STUDIO:
      return { ...state, studio: !state.studio };
    case TOGGLE_ARENA:
      return { ...state, arena: !state.arena };
    case SET_FOCUSED_WINDOW:
      return { ...state, focusedWindow: action.payload };
    case MINIMIZE_WINDOW:
      return {
        ...state,
        minimizedWindows: state.minimizedWindows.some(w => w.id === action.payload.id)
          ? state.minimizedWindows
          : [...state.minimizedWindows, action.payload],
      };
    case RESTORE_WINDOW:
      return {
        ...state,
        minimizedWindows: state.minimizedWindows.filter(w => w.id !== action.payload),
      };
    default:
      return state;
  }
}
