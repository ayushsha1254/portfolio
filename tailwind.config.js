/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // NOCTURNE_OS background hierarchy
        void: "#050505",
        "bg-base": "#090909",
        surface: "#0e0e0e",
        elevated: "#141414",
        overlay: "#1a1a1a",
        "bg-input": "#111111",
        // Accents
        "accent-red": "#ff3b30",
        "accent-purple": "#7a5cff",
        "accent-green": "#3eff8b",
        "accent-amber": "#f5a623",
        "accent-blue": "#0a84ff",
        // Text
        "text-primary": "#f0f0f0",
        "text-secondary": "#8a8a8a",
        "text-muted": "#3d3d3d",
      },
      fontFamily: {
        display: ["Geist", "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "IBM Plex Mono", "monospace"],
        data: ["IBM Plex Mono", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "glow-red":
          "0 0 20px rgba(255, 59, 48, 0.15), 0 0 60px rgba(255, 59, 48, 0.05)",
        "glow-purple":
          "0 0 20px rgba(122, 92, 255, 0.15), 0 0 60px rgba(122, 92, 255, 0.05)",
        "glow-green":
          "0 0 20px rgba(62, 255, 139, 0.15), 0 0 60px rgba(62, 255, 139, 0.05)",
        "glow-white": "0 0 20px rgba(255, 255, 255, 0.06)",
      },
      zIndex: {
        desktop: "0",
        windows: "10",
        focused: "20",
        dock: "30",
        overlay: "40",
        alert: "50",
        cursor: "90",
        lock: "100",
        boot: "200",
      },
    },
  },
  plugins: [],
};
