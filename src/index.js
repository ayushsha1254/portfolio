// Self-hosted fonts (no CDN, no S3)
import "@fontsource/geist/400.css";
import "@fontsource/geist/500.css";
import "@fontsource/geist/600.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/ibm-plex-mono/400.css";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/tokens.css";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <div className="lg:block hidden">
      <App />
    </div>
    <div className="lg:hidden block text-white font-mono text-sm p-8">
      NOCTURNE_OS — desktop experience only. Please visit on a larger screen.
    </div>
  </React.StrictMode>
);
