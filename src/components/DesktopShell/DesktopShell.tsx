import { useState, useEffect, useCallback } from "react";
import { WindowManagerProvider, useWindowManager, type AppDefinition } from "./WindowManager";
import Window from "./Window";
import Taskbar from "./Taskbar";
import DesktopIcon from "./DesktopIcon";
import TerminalApp from "./apps/TerminalApp";
import VSCodeApp from "./apps/VSCodeApp";
import SteamApp from "./apps/SteamApp";
import DiscordApp from "./apps/DiscordApp";
import FirefoxApp from "./apps/FirefoxApp";
import ThisPCApp from "./apps/ThisPCApp";

// Pixel-art logo imports
import steamIcon from "@/assets/steam.png";
import discordIcon from "@/assets/discord.png";
import vscodeIcon from "@/assets/vscode.png";
import terminalIcon from "@/assets/terminal.png";
import firefoxIcon from "@/assets/firefox.png";
import thispcIcon from "@/assets/thispc.png";

interface DesktopShellProps {
  open: boolean;
  onClose: () => void;
  onLaunchGame?: (gameId: string) => void;
}

// ─── App Registry ────────────────────────────────────────────
const APPS: AppDefinition[] = [
  { id: "thispc", title: "This PC", icon: thispcIcon, defaultWidth: 680, defaultHeight: 440 },
  { id: "terminal", title: "Terminal", icon: terminalIcon, defaultWidth: 600, defaultHeight: 400 },
  { id: "vscode", title: "VS Code", icon: vscodeIcon, defaultWidth: 720, defaultHeight: 470 },
  { id: "steam", title: "Steam", icon: steamIcon, defaultWidth: 700, defaultHeight: 460 },
  { id: "discord", title: "Discord", icon: discordIcon, defaultWidth: 750, defaultHeight: 470 },
  { id: "firefox", title: "Firefox", icon: firefoxIcon, defaultWidth: 700, defaultHeight: 460 },
];

const DESKTOP_ICONS = [
  { icon: thispcIcon, label: "This PC", appId: "thispc" },
  { icon: terminalIcon, label: "Terminal", appId: "terminal" },
  { icon: vscodeIcon, label: "VS Code", appId: "vscode" },
  { icon: steamIcon, label: "Steam", appId: "steam" },
  { icon: discordIcon, label: "Discord", appId: "discord" },
  { icon: firefoxIcon, label: "Firefox", appId: "firefox" },
];

// ─── Start Menu Items ────────────────────────────────────────
const START_PINNED = [
  { icon: firefoxIcon, label: "Firefox", appId: "firefox" },
  { icon: vscodeIcon, label: "VS Code", appId: "vscode" },
  { icon: steamIcon, label: "Steam", appId: "steam" },
  { icon: discordIcon, label: "Discord", appId: "discord" },
  { icon: terminalIcon, label: "Terminal", appId: "terminal" },
  { icon: thispcIcon, label: "This PC", appId: "thispc" },
];

// ─── Right-click menu items ─────────────────────────────────
const CONTEXT_MENU_ITEMS = [
  { label: "View", icon: "👁️", submenu: true },
  { label: "Sort by", icon: "📊", submenu: true },
  { label: "Refresh", icon: "🔄" },
  { type: "separator" as const },
  { label: "New", icon: "📄", submenu: true },
  { type: "separator" as const },
  { label: "Display settings", icon: "🖥️" },
  { label: "Personalize", icon: "🎨" },
  { type: "separator" as const },
  { label: "Open Terminal", icon: "💻", appId: "terminal" },
];

// ─── Start Menu Component ────────────────────────────────────
function StartMenu({ open, onClose, onLaunchApp }: {
  open: boolean;
  onClose: () => void;
  onLaunchApp: (appId: string) => void;
}) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9990]" onClick={onClose} />

      {/* Start Menu Panel */}
      <div
        className="absolute bottom-11 left-1 z-[9991] rounded-lg overflow-hidden select-none"
        style={{
          width: "320px",
          background: "linear-gradient(180deg, hsl(30 20% 14%) 0%, hsl(30 20% 10%) 100%)",
          border: "1px solid hsl(25 20% 28% / 0.8)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.1)",
          animation: "slideUp 0.15s ease-out",
        }}
      >
        {/* Search bar */}
        <div className="px-3 pt-3 pb-2">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded"
            style={{
              background: "hsl(30 20% 18%)",
              border: "1px solid hsl(25 20% 28% / 0.6)",
            }}
          >
            <span style={{ color: "hsl(30 15% 50%)", fontSize: "12px" }}>🔍</span>
            <span className="font-pixel text-[8px]" style={{ color: "hsl(30 15% 50%)" }}>
              Search apps...
            </span>
          </div>
        </div>

        {/* Pinned section */}
        <div className="px-3 pb-1">
          <div className="flex items-center justify-between mb-2">
            <span className="font-pixel text-[8px]" style={{ color: "hsl(35 30% 75%)" }}>Pinned</span>
            <span className="font-pixel text-[7px] px-1.5 py-0.5 rounded cursor-pointer" style={{ color: "hsl(25 55% 50%)", background: "hsl(25 55% 45% / 0.15)" }}>
              All apps →
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 mb-2">
            {START_PINNED.map(item => (
              <button
                key={item.appId}
                onClick={() => { onLaunchApp(item.appId); onClose(); }}
                className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all hover:bg-white/5"
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-8 h-8 object-contain"
                  style={{ imageRendering: "pixelated" }}
                  draggable={false}
                />
                <span className="font-pixel text-[7px]" style={{ color: "hsl(35 30% 80%)" }}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recommended section */}
        <div className="px-3 pb-2" style={{ borderTop: "1px solid hsl(25 20% 22%)" }}>
          <div className="flex items-center justify-between mt-2 mb-1.5">
            <span className="font-pixel text-[8px]" style={{ color: "hsl(35 30% 75%)" }}>Recommended</span>
          </div>
          {[
            { icon: "📄", name: "resume.pdf", detail: "Recently opened" },
            { icon: "⚛️", name: "App.tsx", detail: "Yesterday" },
            { icon: "{}", name: "package.json", detail: "2 days ago" },
          ].map(item => (
            <div key={item.name} className="flex items-center gap-2.5 py-1.5 px-2 rounded hover:bg-white/5 cursor-pointer transition-colors">
              <span className="text-lg">{item.icon}</span>
              <div>
                <div className="font-pixel text-[8px]" style={{ color: "hsl(35 30% 85%)" }}>{item.name}</div>
                <div className="font-pixel text-[7px]" style={{ color: "hsl(30 15% 45%)" }}>{item.detail}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar - User & Power */}
        <div className="flex items-center justify-between px-3 py-2" style={{ background: "hsl(30 20% 8%)", borderTop: "1px solid hsl(25 20% 22%)" }}>
          <div className="flex items-center gap-2 cursor-pointer hover:bg-white/5 rounded px-2 py-1 transition-colors">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm" style={{ background: "hsl(25 55% 40%)" }}>
              👤
            </div>
            <span className="font-pixel text-[8px]" style={{ color: "hsl(35 30% 80%)" }}>Developer</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-white/10 transition-colors"
            title="Power"
          >
            <span style={{ color: "hsl(30 15% 50%)", fontSize: "14px" }}>⏻</span>
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Right-Click Context Menu ────────────────────────────────
function ContextMenu({ x, y, onClose, onLaunchApp }: {
  x: number;
  y: number;
  onClose: () => void;
  onLaunchApp: (appId: string) => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-[9992]" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
      <div
        className="fixed z-[9993] rounded-lg overflow-hidden select-none py-1"
        style={{
          left: `${x}px`,
          top: `${y}px`,
          minWidth: "200px",
          background: "linear-gradient(180deg, hsl(30 20% 16%) 0%, hsl(30 20% 12%) 100%)",
          border: "1px solid hsl(25 20% 28% / 0.8)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.1)",
          animation: "fadeIn 0.1s ease-out",
        }}
      >
        {CONTEXT_MENU_ITEMS.map((item, i) => {
          if (item.type === "separator") {
            return <div key={i} className="my-1 mx-2" style={{ borderTop: "1px solid hsl(25 20% 22%)" }} />;
          }
          return (
            <button
              key={i}
              onClick={() => {
                if (item.appId) onLaunchApp(item.appId);
                onClose();
              }}
              className="w-full text-left px-3 py-1.5 flex items-center gap-2.5 hover:bg-white/8 transition-colors"
            >
              <span className="text-sm w-5 text-center">{item.icon}</span>
              <span className="font-pixel text-[8px] flex-1" style={{ color: "hsl(35 30% 80%)" }}>{item.label}</span>
              {item.submenu && <span className="text-[10px]" style={{ color: "hsl(30 15% 50%)" }}>▸</span>}
            </button>
          );
        })}
      </div>
    </>
  );
}

// ─── Desktop Content ─────────────────────────────────────────
// Initial icon grid positions (column layout, 16px from edge)
const INITIAL_ICON_POSITIONS: Record<string, { x: number; y: number }> = Object.fromEntries(
  DESKTOP_ICONS.map((item, i) => [item.appId, { x: 16, y: 16 + i * 88 }])
);

function DesktopContent({ onClose, onLaunchGame }: { onClose: () => void; onLaunchGame?: (gameId: string) => void }) {
  const wm = useWindowManager();
  const [startOpen, setStartOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [iconPositions, setIconPositions] = useState<Record<string, { x: number; y: number }>>(INITIAL_ICON_POSITIONS);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const openAppById = useCallback(
    (appId: string) => {
      const app = APPS.find((a) => a.id === appId);
      if (app) wm.openApp(app);
    },
    [wm]
  );

  // Render app content based on appId
  const renderApp = useCallback(
    (appId: string, windowId: string) => {
      switch (appId) {
        case "terminal":
          return <TerminalApp onExit={() => wm.closeApp(windowId)} />;
        case "vscode":
          return <VSCodeApp />;
        case "steam":
          return (
            <SteamApp
              onLaunchGame={(gameId) => {
                onClose();
                setTimeout(() => onLaunchGame?.(gameId), 800);
              }}
            />
          );
        case "discord":
          return <DiscordApp />;
        case "firefox":
          return <FirefoxApp />;
        case "thispc":
          return <ThisPCApp />;
        default:
          return <div className="p-4 text-center text-muted-foreground">Unknown app</div>;
      }
    },
    [wm, onClose, onLaunchGame]
  );

  // Right-click handler for desktop background
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
    setStartOpen(false);
  }, []);

  // ESC to close desktop (only when no windows are open or focused)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (startOpen) { setStartOpen(false); return; }
        if (contextMenu) { setContextMenu(null); return; }
        if (wm.windows.length === 0) { e.preventDefault(); onClose(); }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, wm.windows.length, startOpen, contextMenu]);

  return (
    <>
      {/* Desktop area (handles right-click) */}
      <div
        className="absolute inset-0 z-[1]"
        onContextMenu={handleContextMenu}
        onClick={() => { setStartOpen(false); setContextMenu(null); setSelectedIcon(null); }}
      />

      {/* Desktop icons */}
      {DESKTOP_ICONS.map((item) => (
        <DesktopIcon
          key={item.appId}
          icon={item.icon}
          label={item.label}
          x={iconPositions[item.appId]?.x ?? 16}
          y={iconPositions[item.appId]?.y ?? 16}
          selected={selectedIcon === item.appId}
          onSelect={() => setSelectedIcon(item.appId)}
          onClick={() => { openAppById(item.appId); setSelectedIcon(null); }}
          onDragEnd={(nx, ny) => {
            setIconPositions((prev) => ({ ...prev, [item.appId]: { x: Math.max(0, nx), y: Math.max(0, ny) } }));
          }}
        />
      ))}

      {/* Windows */}
      {wm.windows.map((win) => (
        <Window
          key={win.id}
          state={win}
          focused={wm.focusedId === win.id}
          onFocus={() => wm.focusApp(win.id)}
          onClose={() => wm.closeApp(win.id)}
          onMinimize={() => wm.minimizeApp(win.id)}
          onMaximize={() => wm.maximizeApp(win.id)}
          onMove={(x, y) => wm.moveWindow(win.id, x, y)}
          onResize={(x, y, w, h) => wm.resizeWindow(win.id, x, y, w, h)}
        >
          {renderApp(win.appId, win.id)}
        </Window>
      ))}

      {/* Start Menu */}
      <StartMenu
        open={startOpen}
        onClose={() => setStartOpen(false)}
        onLaunchApp={openAppById}
      />

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onLaunchApp={openAppById}
        />
      )}

      {/* Taskbar — pass start menu toggle */}
      <Taskbar onStartClick={() => { setStartOpen(p => !p); setContextMenu(null); }} startOpen={startOpen} />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-[10000] w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors"
        style={{
          background: "rgba(255,50,50,0.8)",
          color: "#fff",
          border: "1px solid rgba(255,100,100,0.5)",
        }}
        title="Back to room (ESC)"
      >
        ✕
      </button>
    </>
  );
}

// ─── Main Shell ──────────────────────────────────────────────
const DesktopShell = ({ open, onClose, onLaunchGame }: DesktopShellProps) => {
  const [powerOn, setPowerOn] = useState(false);

  useEffect(() => {
    if (open) {
      setPowerOn(false);
      const t = setTimeout(() => setPowerOn(true), 100);
      return () => clearTimeout(t);
    } else {
      setPowerOn(false);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 transition-all duration-500"
      style={{ backgroundColor: powerOn ? "rgba(0,0,0,0.95)" : "rgba(0,0,0,0)" }}
    >
      {/* CSS animations */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* CRT power-on container */}
      <div
        className="w-full h-full relative transition-all duration-500 ease-out overflow-hidden"
        style={{
          transform: powerOn ? "scale(1)" : "scale(0.8, 0.01)",
          opacity: powerOn ? 1 : 0.5,
        }}
      >
        {/* Desktop wallpaper */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, hsl(220 50% 15%) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, hsl(25 40% 12%) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, hsl(240 30% 8%) 0%, hsl(220 40% 5%) 100%)
            `,
          }}
        >
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(hsl(220 50% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(220 50% 50%) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Animated dots (stars) */}
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-twinkle"
              style={{
                left: `${(i * 31.7 + 13) % 100}%`,
                top: `${(i * 23.3 + 7) % 95}%`,
                width: i % 3 === 0 ? 2 : 1,
                height: i % 3 === 0 ? 2 : 1,
                background: `hsl(${(i * 60) % 360} 50% 60% / 0.4)`,
                animationDelay: `${(i * 0.3) % 2}s`,
              }}
            />
          ))}
        </div>

        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-[9998]"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 6px)",
          }}
        />

        {/* Screen vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-[9998]"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
          }}
        />

        {/* Window manager context */}
        <WindowManagerProvider>
          <DesktopContent onClose={onClose} onLaunchGame={onLaunchGame} />
        </WindowManagerProvider>
      </div>
    </div>
  );
};

export default DesktopShell;
