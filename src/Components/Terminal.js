import { useDispatch } from "react-redux";
import { toggleTerminal } from "../Utility/state/action";

// Phase D: Full NOCTURNE_OS Console implementation
export default function Terminal() {
  const dispatch = useDispatch();

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        zIndex: "var(--z-overlay)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "70%",
          height: "80%",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-default)",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            height: "36px",
            background: "var(--bg-surface)",
            borderBottom: "1px solid var(--border-hairline)",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            justifyContent: "space-between",
            borderRadius: "8px 8px 0 0",
          }}
        >
          <span style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: "12px" }}>
            NOCTURNE_OS — Console
          </span>
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "var(--accent-red)",
              cursor: "pointer",
            }}
            onClick={() => dispatch(toggleTerminal())}
          />
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-green)",
            fontFamily: "var(--font-mono)",
            fontSize: "13px",
          }}
        >
          nocturne@system ∼ $ <span style={{ animation: "blink 1s step-end infinite" }}>_</span>
        </div>
      </div>
    </div>
  );
}
