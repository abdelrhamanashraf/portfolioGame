import { useState, useEffect, useCallback } from "react";
import { WindowManagerProvider, useWindowManager, type AppDefinition } from "./WindowManager";
import Window from "./Window";
import Taskbar from "./Taskbar";
import DesktopIcon from "./DesktopIcon";
import TerminalApp from "./apps/TerminalApp";
import VSCodeApp from "./apps/VSCodeApp";
import SteamApp from "./apps/SteamApp";
import DiscordApp from "./apps/DiscordApp";

interface DesktopShellProps {
  open: boolean;
  onClose: () => void;
  onLaunchGame?: (gameId: string) => void;
}

// ─── App Registry ────────────────────────────────────────────
const APPS: AppDefinition[] = [
  { id: "terminal", title: "Terminal", icon: "💻", defaultWidth: 600, defaultHeight: 400 },
  { id: "vscode", title: "VS Code", icon: "📝", defaultWidth: 700, defaultHeight: 450 },
  { id: "steam", title: "Steam", icon: "🎮", defaultWidth: 600, defaultHeight: 400 },
  { id: "discord", title: "Discord", icon: "💬", defaultWidth: 650, defaultHeight: 420 },
];

const DESKTOP_ICONS = [
  { icon: "💻", label: "Terminal", appId: "terminal" },
  { icon: "📝", label: "VS Code", appId: "vscode" },
  { icon: "🎮", label: "Steam", appId: "steam" },
  { icon: "💬", label: "Discord", appId: "discord" },
];

// ─── Desktop Content ─────────────────────────────────────────
function DesktopContent({ onClose, onLaunchGame }: { onClose: () => void; onLaunchGame?: (gameId: string) => void }) {
  const wm = useWindowManager();

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
        default:
          return <div className="p-4 text-center text-muted-foreground">Unknown app</div>;
      }
    },
    [wm, onClose, onLaunchGame]
  );

  // ESC to close desktop (only when no windows are open or focused)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && wm.windows.length === 0) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, wm.windows.length]);

  return (
    <>
      {/* Desktop icons */}
      <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
        {DESKTOP_ICONS.map((item) => (
          <DesktopIcon
            key={item.appId}
            icon={item.icon}
            label={item.label}
            onClick={() => openAppById(item.appId)}
          />
        ))}
      </div>

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

      {/* Taskbar */}
      <Taskbar />

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
