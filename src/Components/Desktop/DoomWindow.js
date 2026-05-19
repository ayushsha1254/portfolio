import { useRef } from "react";

export default function DoomWindow() {
  const iframeRef = useRef(null);

  const focusIframe = () => {
    iframeRef.current?.focus();
  };

  return (
    <div
      style={{ width: "100%", height: "100%", outline: "none" }}
      onClick={focusIframe}
      onMouseEnter={focusIframe}
    >
      <iframe
        ref={iframeRef}
        src="/doom/index.html"
        title="DOOM"
        allow="autoplay; fullscreen"
        tabIndex={0}
        style={{
          width:      "100%",
          height:     "100%",
          border:     "none",
          display:    "block",
          background: "#050505",
          outline:    "none",
        }}
      />
    </div>
  );
}
