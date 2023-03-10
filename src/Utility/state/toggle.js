import {
  TOGGLE_EXPLORER,
  TOGGLE_THEME,
  TOGGLE_LOCK,
  TOGGLE_FINDER,
  SET_EXPLORER,
  TOGGLE_TERMINAL,
} from "./types";

const initialState = {
  theme: localStorage.getItem("color-theme") == "dark",
  lock: true,
  finder: false,
  explorer: false,
  terminal: false,
};

export default function Toggle(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_THEME:
      return {
        ...state,
        theme: !state.theme,
      };
    case TOGGLE_LOCK:
      return {
        ...state,
        lock: action.payload,
      };
    case TOGGLE_FINDER:
      return {
        ...state,
        finder: !state.finder,
      };
    case TOGGLE_EXPLORER:
      return {
        ...state,
        explorer: !state.explorer,
      };
    case TOGGLE_TERMINAL:
      return {
        ...state,
        terminal: !state.terminal,
      };
    case SET_EXPLORER:
      return {
        ...state,
        explorer: action.data,
      };
    default:
      return state;
  }
}
