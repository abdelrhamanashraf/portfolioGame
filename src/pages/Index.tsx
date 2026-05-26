import { useState } from "react";
import GameRoom from "@/components/GameRoom";
import ThemeSelector from "@/components/ThemeSelector";
import type { RoomThemeId } from "@/components/RoomTheme";

const Index = () => {
  const [theme, setTheme] = useState<RoomThemeId>("default");

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#1a1612" }}>
      {/* ═══ TOP SHELL (thin bar) ═══ */}
      <div
        className="w-full flex items-center justify-between px-4 py-1.5 flex-shrink-0"
        style={{
          background: "linear-gradient(180deg, #3a3028 0%, #2d261f 100%)",
          borderBottom: "2px solid #1a1612",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ background: "#4ade80", boxShadow: "0 0 6px #4ade80" }}
          />
          <span className="font-pixel text-[7px] tracking-widest" style={{ color: "#8a7d6b" }}>POWER</span>
        </div>
        <span className="font-pixel text-[9px]" style={{ color: "#c9b896", letterSpacing: "0.25em" }}>
          ✦ PORTFOLIO BOY ✦
        </span>
        <div className="flex gap-0.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-1 h-3 rounded-full" style={{ background: "#1a1612", border: "1px solid #3a3028" }} />
          ))}
        </div>
      </div>

      {/* ═══ MAIN AREA ═══ */}
      <div className="flex-1 flex w-full relative" style={{ background: "#2d261f" }}>
        {/* Thin left edge decoration */}
        <div
          className="hidden md:flex flex-col items-center justify-center flex-shrink-0"
          style={{
            width: 28,
            background: "linear-gradient(180deg, #2d261f 0%, #251f19 100%)",
            borderRight: "2px solid #1a1612",
          }}
        >
          <div className="flex flex-col gap-20">
            {[0, 1].map(i => (
              <div key={i} className="w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ background: "#1a1612", border: "1.5px solid #3a3028" }}>
                <div className="w-1.5 h-0.5 rounded" style={{ background: "#4a4035", transform: `rotate(${i * 90 + 45}deg)` }} />
              </div>
            ))}
          </div>
        </div>

        {/* ── SCREEN (The Room) — constrained to fit viewport ── */}
        <div className="flex-1 flex items-center justify-center relative">
          <div style={{ width: "100%", maxWidth: "min(1100px, calc((100vh - 120px) * 1.78))", margin: "0 auto" }}>
            <div
              className="relative"
              style={{
                border: "3px solid #1a1612",
                boxShadow: "inset 0 0 15px rgba(0,0,0,0.4)",
              }}
            >
              <GameRoom theme={theme} />

              {/* Overlay: Welcome text */}
              <div
                className="absolute top-0 left-0 right-0 z-30 flex flex-col items-center pt-2 pb-4 pointer-events-none"
                style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)" }}
              >
                <h1 className="font-pixel text-xs md:text-base mb-0.5" style={{ color: "#e8d5b7", textShadow: "0 2px 6px rgba(0,0,0,0.7)" }}>
                  ✦ Welcome to My Room ✦
                </h1>
                <p className="font-retro text-sm md:text-base hidden md:block" style={{ color: "#b8a589", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                  Use arrow keys to walk • Press ENTER near objects
                </p>
                <p className="font-retro text-xs md:hidden" style={{ color: "#b8a589", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                  Use D-pad to walk • Tap ACT near objects
                </p>
              </div>

              {/* CRT scanline overlay */}
              <div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                  background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
                  mixBlendMode: "multiply",
                }}
              />
            </div>
          </div>
        </div>

        {/* Thin right edge decoration */}
        <div
          className="hidden md:flex flex-col items-center justify-center flex-shrink-0"
          style={{
            width: 28,
            background: "linear-gradient(180deg, #2d261f 0%, #251f19 100%)",
            borderLeft: "2px solid #1a1612",
          }}
        >
          <div className="flex flex-col gap-20">
            {[0, 1].map(i => (
              <div key={i} className="w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ background: "#1a1612", border: "1.5px solid #3a3028" }}>
                <div className="w-1.5 h-0.5 rounded" style={{ background: "#4a4035", transform: `rotate(${i * 90 + 45}deg)` }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ BOTTOM SHELL (thin bar) ═══ */}
      <div
        className="w-full flex items-center justify-between px-4 py-1.5 flex-shrink-0"
        style={{
          background: "linear-gradient(180deg, #2d261f 0%, #251f19 100%)",
          borderTop: "2px solid #1a1612",
        }}
      >
        <div className="flex gap-3 items-center">
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-7 h-1.5 rounded-full" style={{ background: "#1a1612", border: "1px solid #3a3028" }} />
            <span className="font-pixel text-[5px]" style={{ color: "#6b6050" }}>SELECT</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-7 h-1.5 rounded-full" style={{ background: "#1a1612", border: "1px solid #3a3028" }} />
            <span className="font-pixel text-[5px]" style={{ color: "#6b6050" }}>START</span>
          </div>
        </div>
        <span className="font-retro text-[10px]" style={{ color: "#5a5040", letterSpacing: "0.1em" }}>
          MODEL PB-2025
        </span>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-2 rounded-sm" style={{ background: "#1a1612", border: "1px solid #3a3028" }} />
          <span className="font-pixel text-[5px]" style={{ color: "#6b6050" }}>LINK</span>
        </div>
      </div>

      {/* ═══ FIXED THEME SELECTOR (right side, vertical) ═══ */}
      <div
        className="fixed right-2 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-1.5 px-1.5 py-3 rounded-xl"
        style={{
          background: "rgba(45,38,31,0.92)",
          border: "1px solid rgba(74,64,53,0.7)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}
      >
        <span className="font-pixel text-[6px] tracking-wider mb-1" style={{ color: "#8a7d6b" }}>THEME</span>
        <ThemeSelector current={theme} onChange={setTheme} />
      </div>
    </div>
  );
};

export default Index;
