import { useState, useEffect } from "react";
import { useWindowManager } from "./WindowManager";

const Taskbar = () => {
  const { windows, focusedId, focusApp, minimizeApp } = useWindowManager();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");

  return (
    <div
      className="absolute bottom-0 left-0 right-0 h-10 flex items-center px-2 gap-1 select-none"
      style={{
        background: "linear-gradient(180deg, hsl(30 20% 16%) 0%, hsl(30 20% 10%) 100%)",
        borderTop: "1px solid hsl(25 20% 28% / 0.8)",
        zIndex: 9999,
      }}
    >
      {/* Start / Home button */}
      <button
        className="h-7 px-3 rounded font-pixel text-[9px] flex items-center gap-1.5 transition-colors"
        style={{
          background: "linear-gradient(180deg, hsl(25 55% 45%) 0%, hsl(25 55% 35%) 100%)",
          color: "hsl(35 40% 92%)",
          border: "1px solid hsl(25 55% 55% / 0.5)",
        }}
      >
        <span className="text-sm">⌂</span>
        <span>START</span>
      </button>

      {/* Separator */}
      <div className="w-px h-6 mx-1" style={{ background: "hsl(25 20% 28%)" }} />

      {/* Open app tabs */}
      <div className="flex-1 flex items-center gap-1 overflow-x-auto">
        {windows.map((win) => (
          <button
            key={win.id}
            onClick={() => {
              if (focusedId === win.id && !win.minimized) {
                minimizeApp(win.id);
              } else {
                focusApp(win.id);
                if (win.minimized) minimizeApp(win.id);
              }
            }}
            className="h-7 px-3 rounded font-pixel text-[8px] flex items-center gap-1.5 truncate max-w-[160px] transition-all"
            style={{
              background:
                focusedId === win.id && !win.minimized
                  ? "hsl(30 20% 22%)"
                  : "hsl(30 20% 14%)",
              color:
                focusedId === win.id && !win.minimized
                  ? "hsl(35 30% 85%)"
                  : "hsl(30 15% 50%)",
              border:
                focusedId === win.id && !win.minimized
                  ? "1px solid hsl(25 55% 45% / 0.4)"
                  : "1px solid hsl(25 20% 28% / 0.5)",
              opacity: win.minimized ? 0.6 : 1,
            }}
          >
            <span className="text-xs">{win.icon}</span>
            <span className="truncate">{win.title}</span>
          </button>
        ))}
      </div>

      {/* System tray */}
      <div className="flex items-center gap-3 px-2">
        {/* Status indicators */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px]" style={{ color: "hsl(120 40% 45%)" }}>●</span>
          <span className="font-retro text-xs" style={{ color: "hsl(30 15% 50%)" }}>
            Online
          </span>
        </div>

        {/* Separator */}
        <div className="w-px h-5" style={{ background: "hsl(25 20% 28%)" }} />

        {/* Clock */}
        <div
          className="font-pixel text-[10px] px-2 py-1 rounded"
          style={{
            color: "hsl(35 30% 75%)",
            background: "hsl(30 20% 12%)",
            border: "1px solid hsl(25 20% 22%)",
          }}
        >
          {hours}:{minutes}
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
