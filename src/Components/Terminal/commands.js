const L = (text, type = "stdout") => ({ text, type });
const BLANK = () => ({ text: "", type: "blank" });

export const BOOT_LINES = [
  { text: "[  OK  ] kernel.nocturne — loaded",            type: "meta",    delay: 0    },
  { text: "[  OK  ] audio.engine — studio.jack @ 48kHz",  type: "meta",    delay: 200  },
  { text: "[  OK  ] archive.worker — 6 projects indexed", type: "meta",    delay: 400  },
  { text: "[  OK  ] signal.contact — ready",              type: "meta",    delay: 600  },
  { text: "[  OK  ] identity — sharma/ayush",             type: "meta",    delay: 800  },
  { text: "",                                             type: "blank",   delay: 950  },
  { text: "NOCTURNE_OS v0.2.0  —  type 'help' for commands", type: "success", delay: 1050 },
  { text: "",                                             type: "blank",   delay: 1100 },
];

export function processCommand(raw, ctx = {}) {
  const input = raw.trim();
  const [cmd, ...argArr] = input.split(/\s+/);
  const args = argArr.join(" ");

  switch ((cmd || "").toLowerCase()) {
    case "whoami":   return cmdWhoami();
    case "help":     return cmdHelp();
    case "ls":       return args.includes("-la") ? cmdLsLa() : cmdLs();
    case "clear":    return { clear: true, lines: [] };
    case "cat":      return cmdCat(args);
    case "cd":       return cmdCd(args);
    case "version":  return cmdVersion();
    case "neofetch": return { lines: cmdNeofetch(ctx) };
    case "ping":     return cmdPing(args || "signal.link");
    case "echo":     return { lines: [L(args, "stdout")] };
    case "contact":  return cmdContact();
    case "open":     return cmdOpen(args, ctx);
    case "play":     return cmdPlay(ctx);
    case "hack":     return cmdHack();
    case "sudo":     return cmdSudo(args);
    case "matrix":   return { lines: [BLANK(), L("there is no matrix.", "stdout"), L("there is only nocturne.", "stdout"), BLANK()] };
    case "coffee":   return cmdCoffee();
    case "exit":
    case "quit":     ctx.close?.(); return { lines: [] };
    case "":         return { lines: [] };
    default:         return { lines: [L(`command not found: ${cmd}`, "error"), L("type 'help' to list commands", "meta")] };
  }
}

function cmdWhoami() {
  return { lines: [
    BLANK(),
    L("nocturne@system — v0.2.0", "success"),
    L("─────────────────────────────────", "muted"),
    L("user       sharma/ayush", "stdout"),
    L("role       developer / musician", "stdout"),
    L("location   india", "stdout"),
    L("stack      react · node · python · audio", "stdout"),
    L("status     available", "success"),
    BLANK(),
  ]};
}

function cmdHelp() {
  return { lines: [
    BLANK(),
    L("NOCTURNE_OS — console v0.2.0", "success"),
    L("─────────────────────────────────", "muted"),
    L("  whoami          identity manifest", "stdout"),
    L("  ls              list desktop entries", "stdout"),
    L("  ls -la          detailed listing", "stdout"),
    L("  cat [file]      read file contents", "stdout"),
    L("  cd [path]       navigate (simulated)", "stdout"),
    L("  clear           clear output", "stdout"),
    L("  version         system version", "stdout"),
    L("  neofetch        system information", "stdout"),
    L("  ping [host]     network check", "stdout"),
    L("  contact         signal information", "stdout"),
    L("  open [app]      launch desktop app", "stdout"),
    L("  echo [text]     echo text", "stdout"),
    L("  help            this message", "stdout"),
    L("─────────────────────────────────", "muted"),
    L("  [classified commands exist]", "muted"),
    BLANK(),
  ]};
}

function cmdLs() {
  return { lines: [
    BLANK(),
    L("readme.txt    archive.sys   terminal://", "stdout"),
    L("studio.jack   blackbox//    signal.link", "stdout"),
    L("void.archive  arena.projects", "stdout"),
    BLANK(),
  ]};
}

function cmdLsLa() {
  const d = new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit" });
  return { lines: [
    BLANK(),
    L("permissions   owner     name                modified", "muted"),
    L("──────────────────────────────────────────────────────", "muted"),
    L(`-rw-r--r--    nocturne  readme.txt          ${d}`, "stdout"),
    L(`-rw-r--r--    nocturne  archive.sys         ${d}`, "stdout"),
    L(`-rwxr-xr-x    nocturne  terminal://         ${d}`, "stdout"),
    L(`-rwxr-xr-x    nocturne  studio.jack         ${d}`, "stdout"),
    L(`----------    system    blackbox//          RESTRICTED`, "error"),
    L(`----------    system    void.archive        INTEGRITY ?`, "meta"),
    L(`-rw-r--r--    nocturne  arena.projects      ${d}`, "stdout"),
    BLANK(),
  ]};
}

function cmdCat(file) {
  const f = (file || "").toLowerCase().replace(/\s+/g, "");
  if (f === "readme.txt" || f === "readme") {
    return { lines: [
      BLANK(),
      L("nocturne_os / readme.txt", "success"),
      L("─────────────────────────────────", "muted"),
      L("hi. i'm ayush sharma.", "stdout"),
      L("developer by day, musician by night.", "stdout"),
      L("i build systems that shouldn't exist.", "stdout"),
      BLANK(),
      L("this desktop is one of them.", "stdout"),
      BLANK(),
      L("→ archive.sys        for projects", "meta"),
      L("→ studio.jack        for music", "meta"),
      L("→ signal.link        to reach me", "meta"),
      BLANK(),
    ]};
  }
  if (f === "blackbox//" || f === "blackbox") {
    return { lines: [
      BLANK(),
      L("[warn] blackbox// — access restricted", "error"),
      L("[sys]  classification: PENDING", "meta"),
      L("[sys]  fragment: 0x7F3A", "meta"),
      L("[sys]  hover the icon to proceed", "meta"),
      BLANK(),
    ]};
  }
  if (f === "void.archive" || f === "void") {
    return { lines: [
      BLANK(),
      L("[warn] void.archive — integrity check failed", "error"),
      L("[sys]  checksum: 0x0003 mismatch", "meta"),
      L("[sys]  contents: CORRUPTED", "error"),
      BLANK(),
    ]};
  }
  if (!file) return { lines: [L("cat: missing operand", "error")] };
  return { lines: [L(`cat: ${file}: no such file`, "error")] };
}

function cmdCd(path) {
  if (!path || path === "~" || path === "/") return { lines: [] };
  if (path === "..") return { lines: [L("already at root", "meta")] };
  return { lines: [
    L(`cd: ${path}: no such directory`, "error"),
    L("[sys] nocturne operates in single-depth mode", "meta"),
  ]};
}

function cmdVersion() {
  return { lines: [
    BLANK(),
    L("NOCTURNE_OS", "success"),
    L("version    0.2.0", "stdout"),
    L("kernel     0.9.1-nocturne", "stdout"),
    L("build      nocturne-phase-c", "stdout"),
    L("author     sharma/ayush", "stdout"),
    BLANK(),
  ]};
}

function cmdNeofetch(ctx) {
  const uptime = ctx.sessionStart
    ? Math.floor((Date.now() - ctx.sessionStart) / 1000)
    : 0;
  const mins = Math.floor(uptime / 60);
  const secs = uptime % 60;
  const uptimeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  const res = `${window.innerWidth}×${window.innerHeight}`;

  const rows = [
    ["    ◆        ",  "OS           NOCTURNE_OS v0.2.0"  ],
    ["   ◆◆◆       ",  "HOST         portfolio.ayush"     ],
    ["  ◆   ◆      ",  "KERNEL       0.9.1-nocturne"      ],
    ["   ◆◆◆       ",  `UPTIME       ${uptimeStr}`        ],
    ["    ◆        ",  "SHELL        nocturne.sh"          ],
    ["             ",  `RESOLUTION   ${res}`              ],
    ["             ",  "THEME        dark [default]"       ],
    ["             ",  "AUDIO        studio.jack / 48kHz"  ],
    ["             ",  "PROJECTS     6 indexed"            ],
  ];

  return [
    BLANK(),
    ...rows.map(([left, right]) => ({ text: "", type: "neofetch", left, right })),
    BLANK(),
  ];
}

function cmdPing(host) {
  return { lines: [
    BLANK(),
    L(`PING ${host} — 56 bytes`, "meta"),
    L(`64 bytes from ${host}: icmp_seq=0 ttl=64 time=11ms`, "stdout"),
    L(`64 bytes from ${host}: icmp_seq=1 ttl=64 time=12ms`, "stdout"),
    L(`64 bytes from ${host}: icmp_seq=2 ttl=64 time=10ms`, "stdout"),
    BLANK(),
    L(`--- ${host} ping statistics ---`, "muted"),
    L("3 packets transmitted, 3 received, 0% packet loss", "success"),
    BLANK(),
  ]};
}

function cmdContact() {
  return { lines: [
    BLANK(),
    L("signal.contact — sharma/ayush", "success"),
    L("─────────────────────────────────", "muted"),
    L("email      ayush.sharma@finmo.net", "stdout"),
    L("github     github.com/ayush-sharma", "stdout"),
    L("status     available for work", "success"),
    BLANK(),
    L("→ open signal.link on the desktop to transmit", "meta"),
    BLANK(),
  ]};
}

function cmdOpen(app, ctx) {
  const a = (app || "").toLowerCase().replace(/[\s/]+/g, "");
  const map = {
    readme:       () => { ctx.openReadme?.();   return "opening readme.txt…";    },
    readmetxt:    () => { ctx.openReadme?.();   return "opening readme.txt…";    },
    archive:      () => { ctx.openExplorer?.(); return "opening archive.sys…";   },
    archivesys:   () => { ctx.openExplorer?.(); return "opening archive.sys…";   },
    studio:       () => { ctx.goToStudio?.();   return "launching studio.jack…"; },
    studiojack:   () => { ctx.goToStudio?.();   return "launching studio.jack…"; },
    void:         () => { ctx.openVoid?.();     return "opening void.archive…";  },
    voidarchive:  () => { ctx.openVoid?.();     return "opening void.archive…";  },
    blackbox:     () => { ctx.openBlackbox?.(); return "opening blackbox//…";    },
    doom:         () => { ctx.openDoom?.();     return "launching doom.exe…";    },
    doomexe:      () => { ctx.openDoom?.();     return "launching doom.exe…";    },
  };

  if (!app) return { lines: [
    L("open: missing argument", "error"),
    L("usage: open [readme|archive|studio|void|blackbox]", "meta"),
  ]};

  if (map[a]) {
    const msg = map[a]();
    return { lines: [L(msg, "meta")] };
  }

  return { lines: [L(`open: '${app}' not found`, "error")] };
}

function cmdPlay(ctx) {
  ctx.togglePlay?.();
  return { lines: [
    L("[audio] studio.jack — toggling playback", "meta"),
    L("[audio] 48kHz / buf 64 / jack running", "stdout"),
  ]};
}

function cmdHack() {
  return { lines: [
    BLANK(),
    L("initiating breach sequence…", "meta"),
    { text: "", type: "hack_progress" },
    L("ACCESS DENIED", "error"),
    L("what were you expecting?", "muted"),
    BLANK(),
  ]};
}

function cmdSudo(args) {
  if (args.includes("rm") && args.includes("-rf")) {
    return { lines: [
      BLANK(),
      L("[warn] nice try.", "error"),
      L("[sys]  nocturne is not a toy.", "meta"),
      L("[sys]  request logged: 0x" + Date.now().toString(16).toUpperCase(), "meta"),
      BLANK(),
    ]};
  }
  return { lines: [
    L("sudo: permission requires biometric auth", "error"),
    L("[sys]  retinal scan: FAILED", "meta"),
    L("[sys]  request denied", "error"),
  ]};
}

function cmdCoffee() {
  return { lines: [
    BLANK(),
    L("☕ brewing…", "stdout"),
    L("[audio] warming up studio.jack", "meta"),
    L("[sys]   temperature: nominal", "meta"),
    L("[sys]   vibe: optimal", "success"),
    BLANK(),
  ]};
}

export const KONAMI_LINES = [
  BLANK(),
  L("↑↑↓↓←→←→BA", "success"),
  L("──────────────────────────────────────", "muted"),
  L("you found the sequence.", "stdout"),
  L("the architect sees you.", "meta"),
  L("no reward. just acknowledgement.", "stdout"),
  L("nocturne was built for people like you.", "success"),
  BLANK(),
  L("[sys] fragment 0x1337 unlocked", "meta"),
  BLANK(),
];
