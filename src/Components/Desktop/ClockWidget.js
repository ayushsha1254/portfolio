import { useState, useEffect } from "react";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const WORLD_CLOCKS = [
  { city: "LON", tz: "Europe/London" },
  { city: "TYO", tz: "Asia/Tokyo" },
  { city: "NYC", tz: "America/New_York" },
];

export default function ClockWidget() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  const colonDim = now.getSeconds() % 2 === 0;

  const day = DAYS[now.getDay()];
  const date = String(now.getDate()).padStart(2, "0");
  const month = MONTHS[now.getMonth()];

  const offset = -now.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const tzH = String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0");
  const tzM = String(Math.abs(offset) % 60).padStart(2, "0");
  const tzLabel = `UTC${sign}${tzH}:${tzM}`;

  return (
    <div
      style={{
        position: "fixed",
        left: "28px",
        top: "54px",
        width: "180px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "4px",
        padding: "14px 16px 13px",
        zIndex: "var(--z-widget)",
        userSelect: "none",
        pointerEvents: "none",
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
      }}
    >
      {/* Main time */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "44px",
          fontWeight: 400,
          color: "rgba(255,255,255,0.92)",
          lineHeight: 1,
          letterSpacing: "-0.02em",
          display: "flex",
          alignItems: "baseline",
        }}
      >
        {hh}
        <span
          style={{
            opacity: colonDim ? 0.18 : 0.65,
            transition: "opacity 220ms ease",
            margin: "0 1px",
          }}
        >
          :
        </span>
        {mm}
      </div>

      {/* Seconds */}
      <div
        style={{
          fontFamily: "var(--font-data)",
          fontSize: "11px",
          color: "rgba(255,255,255,0.22)",
          marginTop: "5px",
          letterSpacing: "0.05em",
        }}
      >
        :{ss}
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "var(--border-hairline)", margin: "11px 0 9px" }} />

      {/* Date */}
      <div
        style={{
          fontFamily: "var(--font-data)",
          fontSize: "11px",
          color: "rgba(255,255,255,0.62)",
          letterSpacing: "0.09em",
        }}
      >
        {day}  {date}  {month}
      </div>

      {/* Timezone */}
      <div
        style={{
          fontFamily: "var(--font-data)",
          fontSize: "9px",
          color: "rgba(255,255,255,0.20)",
          marginTop: "3px",
          letterSpacing: "0.07em",
        }}
      >
        {tzLabel}
      </div>

      {/* World clock divider */}
      <div style={{ height: "1px", background: "var(--border-hairline)", margin: "10px 0 8px" }} />

      {/* World clocks */}
      {WORLD_CLOCKS.map(({ city, tz }) => {
        const t = now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: tz,
        });
        return (
          <div
            key={city}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-data)",
                fontSize: "9px",
                color: "rgba(255,255,255,0.22)",
                letterSpacing: "0.09em",
              }}
            >
              {city}
            </span>
            <span
              style={{
                fontFamily: "var(--font-data)",
                fontSize: "11px",
                color: "rgba(255,255,255,0.55)",
                letterSpacing: "0.05em",
              }}
            >
              {t}
            </span>
          </div>
        );
      })}
    </div>
  );
}
