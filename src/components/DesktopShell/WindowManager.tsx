import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { WindowState } from "./Window";

export interface AppDefinition {
  id: string;
  title: string;
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
}

interface WindowManagerContextType {
  windows: WindowState[];
  focusedId: string | null;
  openApp: (app: AppDefinition) => void;
  closeApp: (id: string) => void;
  focusApp: (id: string) => void;
  minimizeApp: (id: string) => void;
  maximizeApp: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, x: number, y: number, w: number, h: number) => void;
}

const WindowManagerContext = createContext<WindowManagerContextType | null>(null);

export function useWindowManager() {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) throw new Error("useWindowManager must be used within WindowManagerProvider");
  return ctx;
}

let nextZIndex = 10;
let instanceCounter = 0;

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const openApp = useCallback((app: AppDefinition) => {
    // Check if already open — if so, focus it
    setWindows((prev) => {
      const existing = prev.find((w) => w.appId === app.id);
      if (existing) {
        setFocusedId(existing.id);
        return prev.map((w) =>
          w.id === existing.id
            ? { ...w, minimized: false, zIndex: ++nextZIndex }
            : w
        );
      }

      // Open new window with slight offset for cascading
      const offset = (instanceCounter % 6) * 30;
      instanceCounter++;
      const newWindow: WindowState = {
        id: `${app.id}-${Date.now()}`,
        appId: app.id,
        title: app.title,
        icon: app.icon,
        x: 60 + offset,
        y: 30 + offset,
        width: app.defaultWidth,
        height: app.defaultHeight,
        zIndex: ++nextZIndex,
        minimized: false,
        maximized: false,
      };

      setFocusedId(newWindow.id);
      return [...prev, newWindow];
    });
  }, []);

  const closeApp = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setFocusedId((prev) => (prev === id ? null : prev));
  }, []);

  const focusApp = useCallback((id: string) => {
    setFocusedId(id);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: ++nextZIndex } : w))
    );
  }, []);

  const minimizeApp = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w))
    );
    setFocusedId((prev) => (prev === id ? null : prev));
  }, []);

  const maximizeApp = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w))
    );
  }, []);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, x, y } : w))
    );
  }, []);

  const resizeWindow = useCallback(
    (id: string, x: number, y: number, w: number, h: number) => {
      setWindows((prev) =>
        prev.map((win) =>
          win.id === id ? { ...win, x, y, width: w, height: h } : win
        )
      );
    },
    []
  );

  return (
    <WindowManagerContext.Provider
      value={{
        windows,
        focusedId,
        openApp,
        closeApp,
        focusApp,
        minimizeApp,
        maximizeApp,
        moveWindow,
        resizeWindow,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
}
