export const TOGGLE_THEME = "TOGGLE_THEME";
export const TOGGLE_LOCK = "TOGGLE_LOCK";
export const TOGGLE_FINDER = "TOGGLE_FINDER";
export const TOGGLE_EXPLORER = "TOGGLE_EXPLORER";
export const TOGGLE_TERMINAL = "TOGGLE_TERMINAL";
export const SET_EXPLORER = () => {
  return {
    type: "TOGGLE_EXPLORER",
    data: false,
  };
};
