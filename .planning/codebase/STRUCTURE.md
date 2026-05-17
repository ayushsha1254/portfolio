# Directory Structure
*Last mapped: 2026-05-17*

## Root Layout

```
portfolio/
├── public/                  # Static assets served by CRA
├── src/                     # All application source code
│   ├── App.js               # Root component — mounts Redux Provider, Router, global event handlers
│   ├── App.css              # Global root styles
│   ├── index.js             # CRA entry point — renders App into #root
│   ├── index.css            # Body/reset styles
│   ├── Assets/              # Static media (SVG, PNG, JSON, etc.)
│   ├── Components/          # Reusable UI components
│   ├── Pages/               # Route-level page components
│   ├── Data/                # Static JSON data files
│   └── Utility/             # Helpers, hooks, Redux state, Axios instance
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## src/Assets/

Large, categorized static asset directory. Never import from here dynamically — CRA bundles only statically-referenced imports.

```
Assets/
├── Cursor/        # Custom cursor SVGs (main.svg, pointer.svg)
├── Icons/         # App dock / desktop icons (PNG, SVG)
│   ├── blogs/     # Blog share icons
│   └── explorer/  # Explorer sidebar icons
├── Images/        # Wallpapers, UI decorative images
├── Lottie/        # Lottie JSON animation files (loader, loading, social)
├── Player/        # Walkman/cassette player SVG parts
├── Projects/      # Project thumbnail SVGs
├── Resume/        # Resume background/logo SVGs
├── Skills/        # Skill badge SVGs (one per technology)
├── Socials/       # Social platform SVGs
├── Theme/         # macOS UI theme assets (lock screen, wallpaper, cert overlays)
├── folders/       # Desktop folder icons
├── sih/           # SIH project specific assets (team portraits, cert)
└── tech/          # 3 tech SVGs (cpp, js, python) — separate from Skills/
```

## src/Components/

UI building blocks. Mix of feature-scoped subdirectories and flat files.

```
Components/
├── Apps.js               # App grid on desktop
├── Browser.js            # Embedded browser component
├── DeskModal.js          # Desktop right-click context modal
├── ExpandedExplorer.js   # Full-screen Explorer wrapper
├── Explorer.js           # Sidebar Explorer shell
├── Finder.js             # Finder window component
├── Help.js               # Help/about overlay
├── Matrix.js             # Matrix rain canvas effect
├── Menu.js               # Apple menu bar menu
├── MusicTaskbar.js       # Music mini-player in taskbar
├── Nav.js                # Top navigation/menu bar
├── NavBtn.js             # Individual nav button
├── Preview.js            # File preview component
├── SendButton.js         # Contact form send button
├── Taskbar.js            # Bottom dock
├── Terminal.js           # Terminal window component
├── datetime.js           # Clock/date display
├── useContextMenu.js     # Custom hook for right-click context menu
│
├── Blog/                 # Blog display components
│   ├── Nav.js
│   ├── blog.css
│   └── display.js
│
├── Explorer/             # Explorer panel content views
│   ├── About.js
│   ├── Contact.js
│   ├── DisplayPanel.js
│   ├── ExplorerDisplay.js
│   ├── Folders.js
│   ├── MatrixComp.js
│   ├── Pdf.js
│   ├── SIH.js
│   ├── SkillDisplay.js
│   ├── SkillShort.js
│   ├── Socials.js
│   ├── Stack.js
│   ├── Certificates/
│   │   ├── CertCompact.js
│   │   ├── CertModal.js
│   │   ├── Display.js
│   │   └── SingleCertificate.js
│   └── *.css             # Scoped CSS per view
│
├── Gallery/
│   └── Viewer.js         # Photo gallery viewer
│
├── Music/                # Music player sub-components
│   ├── Albums.js
│   ├── Casette.js        # Visual cassette tape animation
│   ├── MusicNavbar.js
│   ├── NewSongs.js
│   └── Songs.js
│
└── Parallax/             # Parallax scroll effect (directory only, no .js files visible)
```

## src/Pages/

Route-level components. Each maps to a URL path registered in App.js.

```
Pages/
├── Blog.js               # Blog listing page
├── BlogEditor.js         # Blog post editor
├── Browser.js            # Browser page wrapper
├── Desktop.js            # Main macOS desktop simulation
├── Global.js             # Global layout wrapper
├── Globe.js              # 3D globe visualization
├── Handler.js            # Route handler / 404
├── Loader.js             # Initial app loader
├── Loading.js            # Loading screen
├── LoadingAnimation.js   # Lottie loading animation
├── Lock.js               # Lock screen (macOS login screen)
├── Music.js              # Music player page
├── Particles.js          # Particle background effect
├── Resume.js             # Resume viewer page
├── SingleBlog.js         # Individual blog post page
├── SingleMusic.js        # Single track page
├── Terminal.js           # Terminal page wrapper
├── Tetris.js             # Tetris mini-game
└── Triangle.js           # ~4,244 lines of DEAD CODE (entirely commented out)
```

## src/Data/

Static content served as JSON. Content changes require code changes and redeploy.

```
Data/
├── main.json    # Portfolio content: personal info, projects, skills, certs, achievements, socials
└── music.json   # Music track listing with metadata
```

## src/Utility/

Helpers and infrastructure. Not UI.

```
Utility/
├── Axios/
│   └── axios.js          # Configured axios instance (has hardcoded auth header — see CONCERNS.md)
├── state/                # Redux store
│   ├── store.js          # createStore with Toggle reducer
│   ├── toggle.js         # Root reducer (theme, lock, finder, explorer, terminal)
│   ├── action.js         # Action creators
│   └── types.js          # Action type constants — SET_EXPLORER is a function not a string (BUG)
├── SuspendPinch.js       # Prevents pinch-zoom on iOS
├── chars.js              # Character set utilities
├── circle.js             # Circle geometry helpers
├── handleMouse.js        # Custom cursor tracking logic
├── nigaa.js              # Utility (undocumented)
└── triangle.js           # Dead code (all commented out library)
```

## Where to Put New Code

| What | Where |
|------|-------|
| New page/route | `src/Pages/NewPage.js` + route in `src/App.js` |
| Reusable UI component | `src/Components/NewComponent.js` |
| Feature sub-components | `src/Components/FeatureName/` subdirectory |
| Static content | `src/Data/main.json` (edit existing JSON) |
| New Redux action | `src/Utility/state/types.js` + `action.js` + `toggle.js` |
| API utilities | `src/Utility/Axios/axios.js` or new file in `src/Utility/` |
| Feature-specific styles | Co-located `.css` or `.module.css` next to component |
| Static media | `src/Assets/[appropriate category]/` |

## Naming Conventions

- Pages: PascalCase (e.g. `Desktop.js`, `SingleBlog.js`)
- Components: PascalCase (e.g. `Taskbar.js`, `NavBtn.js`)
- Utilities/hooks: camelCase (e.g. `handleMouse.js`, `useContextMenu.js`)
- CSS modules: `[component].module.css` co-located with component
- Regular CSS: `[feature].css` or component name
- Assets: lowercase with hyphens or descriptive names
