import React, { createContext, useContext, useState, useCallback, useRef } from "react";

const ActivityContext = createContext(null);

const BOOT_EVENTS = [
  "all modules indexed",
  "signal.contact ready",
  "studio.session loaded",
  "archive.worker ready",
  "system boot complete",
];

export function ActivityProvider({ children }) {
  const sessionStart = useRef(Date.now());
  const [events, setEvents] = useState(() =>
    BOOT_EVENTS.map((text, i) => ({
      text,
      time: sessionStart.current - (BOOT_EVENTS.length - i) * 7500,
    }))
  );

  const logEvent = useCallback((text) => {
    setEvents((prev) => [{ text, time: Date.now() }, ...prev].slice(0, 8));
  }, []);

  return (
    <ActivityContext.Provider value={{ events, logEvent, sessionStart: sessionStart.current }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  return useContext(ActivityContext);
}
