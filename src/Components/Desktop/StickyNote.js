export default function StickyNote({ text, left, top, rotate = 0 }) {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        pointerEvents: "none",
        zIndex: 2,
        transform: `rotate(${rotate}deg)`,
        fontFamily: "var(--font-data)",
        fontSize: "9.5px",
        lineHeight: "1.75",
        color: "rgba(255,255,255,0.38)",
        borderLeft: "1px solid rgba(255,255,255,0.10)",
        paddingLeft: "8px",
        whiteSpace: "pre",
        userSelect: "none",
        letterSpacing: "0.04em",
      }}
    >
      {text}
    </div>
  );
}
