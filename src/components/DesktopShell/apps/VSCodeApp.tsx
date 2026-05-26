import { useState } from "react";

// ── Activity bar icons (far left) ──
const ACTIVITY_ICONS = [
  { id: "explorer", icon: "📁", badge: 0 },
  { id: "search", icon: "🔍", badge: 0 },
  { id: "git", icon: "🔀", badge: 1 },
  { id: "debug", icon: "🐛", badge: 0 },
  { id: "extensions", icon: "🧩", badge: 0 },
];

// ── File tree ──
const FILE_TREE = [
  { name: "PORTFOLIO", type: "root" as const, open: true },
  { name: ".github", type: "folder" as const, indent: 1 },
  { name: "node_modules", type: "folder" as const, indent: 1 },
  { name: "public", type: "folder" as const, indent: 1, badge: 1 },
  { name: "src", type: "folder" as const, indent: 1, open: true },
  { name: "App.tsx", type: "file" as const, indent: 2, icon: "⚛️", fileId: "app" },
  { name: "index.css", type: "file" as const, indent: 2, icon: "#️⃣" },
  { name: "main.tsx", type: "file" as const, indent: 2, icon: "⚛️" },
  { name: ".gitignore", type: "file" as const, indent: 1, icon: "⚙️" },
  { name: "package.json", type: "file" as const, indent: 1, icon: "{}", fileId: "pkg" },
  { name: "README.md", type: "file" as const, indent: 1, icon: "📄", fileId: "readme" },
  { name: "tsconfig.json", type: "file" as const, indent: 1, icon: "{}" },
];

// ── Outline items ──
const OUTLINE_ITEMS = [
  { icon: "📦", name: "imports" },
  { icon: "📝", name: "Developer (interface)" },
  { icon: "⚡", name: "AboutMe (component)" },
  { icon: "🔧", name: "developer (const)" },
];

// ── Tab files ──
const FILES: Record<string, { name: string; icon: string; lang: string; content: string }> = {
  app: {
    name: "App.tsx",
    icon: "⚛️",
    lang: "TypeScript React",
    content: `// Portfolio App — Main Component
import React from "react";
import { GameRoom } from "./components/GameRoom";
import { DesktopShell } from "./components/DesktopShell";

interface AppProps {
  theme: "dark" | "light";
  debug?: boolean;
}

const App: React.FC<AppProps> = ({ theme }) => {
  const [showDesktop, setShowDesktop] = useState(false);
  const isDark = theme === "dark";

  // Initialize game room with pixel art
  useEffect(() => {
    console.log("Portfolio loaded!");
    preloadAssets();
  }, []);

  return (
    <div className={isDark ? "dark" : "light"}>
      <GameRoom
        onOpenDesktop={() => setShowDesktop(true)}
        theme={theme}
      />
      {showDesktop && (
        <DesktopShell
          onClose={() => setShowDesktop(false)}
        />
      )}
    </div>
  );
};

export default App;`,
  },
  pkg: {
    name: "package.json",
    icon: "{}",
    lang: "JSON",
    content: `{
  "name": "pixel-portfolio",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite --port 8080",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.30.0"
  }
}`,
  },
  readme: {
    name: "README.md",
    icon: "📄",
    lang: "Markdown",
    content: `# Pixel Portfolio 🎮

## Abdelrahman Ashraf's Interactive Portfolio

A cozy pixel-art room where you can:
- Walk around with a controllable character
- Interact with objects in the room
- Open a desktop OS with virtual apps
- Play retro games on the TV console

### Tech Stack
- React + TypeScript
- Vite + SWC
- TailwindCSS
- Oracle DB / WebLogic (enterprise exp)

### Contact
- Email: contact@abdelrahmanashraf.tech
- GitHub: github.com/abdelrhamanashraf
- LinkedIn: linkedin.com/in/abdelrahman-ashraf-a10070222

Built with ❤️ and pixels.`,
  },
};

// ── Syntax colors (Monokai-like) ──
function colorLine(line: string): { text: string; color: string }[] {
  const parts: { text: string; color: string }[] = [];
  if (line.trimStart().startsWith("//") || line.trimStart().startsWith("#")) {
    return [{ text: line, color: "#6a9955" }];
  }
  const regex = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b(?:import|export|from|const|let|var|interface|type|function|return|if|else|class|new|true|false|null|undefined|useEffect|useState)\b|\b\d+\b)/g;
  let last = 0;
  let match;
  while ((match = regex.exec(line)) !== null) {
    if (match.index > last) parts.push({ text: line.slice(last, match.index), color: "#d4d4d4" });
    const m = match[0];
    if (m.startsWith('"') || m.startsWith("'") || m.startsWith("`")) parts.push({ text: m, color: "#ce9178" });
    else if (/^\d+$/.test(m)) parts.push({ text: m, color: "#b5cea8" });
    else parts.push({ text: m, color: "#c586c0" });
    last = match.index + m.length;
  }
  if (last < line.length) parts.push({ text: line.slice(last), color: "#d4d4d4" });
  if (parts.length === 0) parts.push({ text: line, color: "#d4d4d4" });
  return parts;
}

// ── Terminal output ──
const TERMINAL_LINES = [
  { text: "$ npm run dev", color: "#fff" },
  { text: "", color: "#fff" },
  { text: "  VITE v5.4.0  ready in 320ms", color: "#0ff" },
  { text: "", color: "#fff" },
  { text: "  ➜  Local:   http://localhost:8080/", color: "#0f0" },
  { text: "  ➜  Network: http://192.168.1.42:8080/", color: "#888" },
  { text: "", color: "#fff" },
  { text: "  Compiled successfully!", color: "#0f0" },
];

const PANEL_TABS = ["PROBLEMS", "OUTPUT", "TERMINAL", "DEBUG CONSOLE"];

const VSCodeApp = () => {
  const [activeFile, setActiveFile] = useState("app");
  const [cursorLine, setCursorLine] = useState(12);
  const [activeSide, setActiveSide] = useState("explorer");
  const [activePanel, setActivePanel] = useState("TERMINAL");
  const file = FILES[activeFile];
  const lines = file.content.split("\n");
  const openTabs = Object.entries(FILES);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: "#1e1e1e", color: "#d4d4d4", fontFamily: "'VT323', monospace" }}>

      {/* ── Tab Bar ── */}
      <div className="flex items-center flex-shrink-0" style={{ background: "#252526", borderBottom: "1px solid #1e1e1e" }}>
        {openTabs.map(([id, f]) => (
          <button
            key={id}
            onClick={() => { setActiveFile(id); setCursorLine(1); }}
            className="px-3 py-1 flex items-center gap-1.5 text-[13px] transition-colors"
            style={{
              background: activeFile === id ? "#1e1e1e" : "#2d2d2d",
              color: activeFile === id ? "#fff" : "#888",
              borderRight: "1px solid #1e1e1e",
              borderTop: activeFile === id ? "1px solid #007acc" : "1px solid transparent",
            }}
          >
            <span style={{ fontSize: "12px" }}>{f.icon}</span>
            {f.name}
          </button>
        ))}
      </div>

      {/* ── Breadcrumb ── */}
      <div className="px-3 py-0.5 flex items-center gap-1" style={{ background: "#1e1e1e", fontSize: "12px", color: "#888", borderBottom: "1px solid #2d2d2d" }}>
        <span>src</span><span style={{ color: "#555" }}>›</span><span style={{ color: "#ddd" }}>{file.name}</span>
      </div>

      {/* ── Main area ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Activity bar */}
        <div className="w-10 flex flex-col items-center py-1 gap-0.5 flex-shrink-0" style={{ background: "#333" }}>
          {ACTIVITY_ICONS.map(a => (
            <button
              key={a.id}
              onClick={() => setActiveSide(a.id)}
              className="w-10 h-10 flex items-center justify-center text-lg relative transition-colors"
              style={{
                color: activeSide === a.id ? "#fff" : "#888",
                borderLeft: activeSide === a.id ? "2px solid #007acc" : "2px solid transparent",
              }}
            >
              {a.icon}
              {a.badge > 0 && (
                <span className="absolute top-1 right-1.5 w-3.5 h-3.5 flex items-center justify-center rounded-full" style={{ background: "#007acc", color: "#fff", fontSize: "8px" }}>
                  {a.badge}
                </span>
              )}
            </button>
          ))}
          <div className="flex-1" />
          <button className="w-10 h-10 flex items-center justify-center text-lg" style={{ color: "#888" }}>⚙️</button>
        </div>

        {/* File explorer sidebar */}
        <div className="w-48 flex-shrink-0 overflow-y-auto" style={{ background: "#252526", borderRight: "1px solid #1e1e1e" }}>
          <div className="px-4 py-1.5" style={{ fontSize: "10px", color: "#bbb", letterSpacing: "1px" }}>
            EXPLORER
          </div>
          {FILE_TREE.map((item, i) => {
            if (item.type === "root") {
              return (
                <div key={i} className="px-2 py-0.5 flex items-center gap-1 cursor-pointer" style={{ fontSize: "11px", color: "#ccc", fontWeight: "bold" }}>
                  <span style={{ fontSize: "8px" }}>▾</span> {item.name}
                </div>
              );
            }
            if (item.type === "folder") {
              return (
                <div key={i} className="flex items-center gap-1 cursor-pointer hover:bg-[#2a2d2e] transition-colors py-px" style={{ paddingLeft: `${(item.indent || 0) * 12 + 8}px`, fontSize: "12px", color: "#ccc" }}>
                  <span style={{ fontSize: "8px" }}>{item.open ? "▾" : "▸"}</span>
                  <span>📁</span> {item.name}
                  {item.badge ? <span className="ml-auto mr-2 w-3.5 h-3.5 flex items-center justify-center rounded-full" style={{ background: "#007acc", color: "#fff", fontSize: "8px" }}>{item.badge}</span> : null}
                </div>
              );
            }
            return (
              <button
                key={i}
                onClick={() => { if (item.fileId) { setActiveFile(item.fileId); setCursorLine(1); } }}
                className="w-full text-left flex items-center gap-1 hover:bg-[#2a2d2e] transition-colors py-px"
                style={{
                  paddingLeft: `${(item.indent || 0) * 12 + 8}px`,
                  fontSize: "12px",
                  color: item.fileId && activeFile === item.fileId ? "#fff" : "#ccc",
                  background: item.fileId && activeFile === item.fileId ? "#37373d" : "transparent",
                }}
              >
                <span style={{ fontSize: "11px" }}>{item.icon}</span> {item.name}
              </button>
            );
          })}

          {/* Outline section */}
          <div className="mt-3 px-4 py-1.5" style={{ fontSize: "10px", color: "#bbb", letterSpacing: "1px", borderTop: "1px solid #1e1e1e" }}>
            OUTLINE
          </div>
          {OUTLINE_ITEMS.map(item => (
            <div key={item.name} className="px-4 py-0.5 flex items-center gap-1 cursor-pointer hover:bg-[#2a2d2e] transition-colors" style={{ fontSize: "11px", color: "#ccc" }}>
              <span>{item.icon}</span> {item.name}
            </div>
          ))}
        </div>

        {/* ── Editor + Terminal ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Code editor */}
          <div className="flex-1 overflow-auto">
            {lines.map((line, i) => {
              const num = i + 1;
              const active = num === cursorLine;
              return (
                <div
                  key={i}
                  className="flex cursor-text"
                  onClick={() => setCursorLine(num)}
                  style={{
                    background: active ? "#264f78" : "transparent",
                    minHeight: "19px",
                  }}
                >
                  <span className="w-12 text-right pr-4 select-none flex-shrink-0" style={{ fontSize: "13px", lineHeight: "19px", color: active ? "#fff" : "#858585" }}>
                    {num}
                  </span>
                  <span className="whitespace-pre" style={{ fontSize: "13px", lineHeight: "19px" }}>
                    {colorLine(line).map((p, j) => (
                      <span key={j} style={{ color: p.color }}>{p.text}</span>
                    ))}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ── Bottom Panel (Terminal) ── */}
          <div className="flex-shrink-0" style={{ height: "130px", borderTop: "1px solid #007acc" }}>
            {/* Panel tabs */}
            <div className="flex items-center px-2" style={{ background: "#252526", borderBottom: "1px solid #1e1e1e" }}>
              {PANEL_TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActivePanel(tab)}
                  className="px-3 py-0.5 transition-colors"
                  style={{
                    color: activePanel === tab ? "#fff" : "#888",
                    fontSize: "11px",
                    borderBottom: activePanel === tab ? "1px solid #007acc" : "1px solid transparent",
                  }}
                >
                  {tab}
                </button>
              ))}
              <div className="flex-1" />
              <span style={{ color: "#888", fontSize: "11px" }}>▷ node</span>
            </div>
            {/* Terminal content */}
            <div className="p-2 overflow-y-auto h-full" style={{ background: "#1e1e1e" }}>
              {TERMINAL_LINES.map((line, i) => (
                <div key={i} style={{ color: line.color, fontSize: "12px", lineHeight: "1.3", fontFamily: "'VT323', monospace" }}>
                  {line.text || "\u00A0"}
                </div>
              ))}
              <span className="animate-pulse inline-block w-1.5 h-3.5 mt-0.5" style={{ background: "#fff" }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Status Bar ── */}
      <div className="flex items-center justify-between px-2 py-px flex-shrink-0" style={{ background: "#007acc", color: "#fff", fontSize: "11px" }}>
        <div className="flex items-center gap-3">
          <span>⎇ main*</span>
          <span>🔄</span>
          <span>⚠ 0  ✕ 0</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Ln {cursorLine}, Col 1</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          <span>LF</span>
          <span>{file.lang}</span>
        </div>
      </div>
    </div>
  );
};

export default VSCodeApp;
