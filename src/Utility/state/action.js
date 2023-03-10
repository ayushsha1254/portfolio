import {
  TOGGLE_EXPLORER,
  TOGGLE_THEME,
  TOGGLE_LOCK,
  TOGGLE_FINDER,
  SET_EXPLORER,
  TOGGLE_TERMINAL,
} from "./types";

const toggleTheme = () => {
  return {
    type: TOGGLE_THEME,
  };
};

const toggleLock = () => {
  return {
    type: TOGGLE_LOCK,
  };
};

const toggleFinder = () => {
  return {
    type: TOGGLE_FINDER,
  };
};

const toggleExplorer = () => {
  return {
    type: TOGGLE_EXPLORER,
  };
};

const toggleTerminal = () => {
  return {
    type: TOGGLE_TERMINAL,
  };
};

const setExplorer = (data) => {
  return {
    type: SET_EXPLORER,
    data: data,
  };
};

export {
  toggleTheme,
  toggleLock,
  toggleFinder,
  toggleExplorer,
  setExplorer,
  toggleTerminal,
};
