import { useRef, useCallback, useEffect, useState } from "react";

interface MobileControlsProps {
  onDirectionChange: (keys: Set<string>) => void;
  onAction: () => void;
  hasNearHotspot: boolean;
}

const MobileControls = ({ onDirectionChange, onAction, hasNearHotspot }: MobileControlsProps) => {
  const keysRef = useRef<Set<string>>(new Set());
  const [activeDir, setActiveDir] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Only show on touch devices
  useEffect(() => {
    const check = () => setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const press = useCallback((key: string) => {
    keysRef.current.add(key);
    setActiveDir(key);
    onDirectionChange(new Set(keysRef.current));
  }, [onDirectionChange]);

  const release = useCallback((key: string) => {
    keysRef.current.delete(key);
    setActiveDir(keysRef.current.size > 0 ? [...keysRef.current][0] : null);
    onDirectionChange(new Set(keysRef.current));
  }, [onDirectionChange]);

  if (!isMobile) return null;

  const btnStyle = (active: boolean) => ({
    background: active ? "rgba(200,170,120,0.4)" : "rgba(60,50,40,0.6)",
    border: `2px solid ${active ? "rgba(200,170,120,0.6)" : "rgba(100,85,65,0.5)"}`,
    color: active ? "#e8d5b7" : "#8a7d6b",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    transition: "all 0.1s",
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-between items-end px-4 pb-4 pointer-events-none" style={{ touchAction: "none" }}>
      {/* D-Pad */}
      <div className="relative pointer-events-auto" style={{ width: 130, height: 130 }}>
        {/* Up */}
        <button
          className="absolute left-1/2 top-0 -translate-x-1/2 w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
          style={btnStyle(activeDir === "ArrowUp")}
          onTouchStart={(e) => { e.preventDefault(); press("ArrowUp"); }}
          onTouchEnd={(e) => { e.preventDefault(); release("ArrowUp"); }}
        >
          ▲
        </button>
        {/* Down */}
        <button
          className="absolute left-1/2 bottom-0 -translate-x-1/2 w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
          style={btnStyle(activeDir === "ArrowDown")}
          onTouchStart={(e) => { e.preventDefault(); press("ArrowDown"); }}
          onTouchEnd={(e) => { e.preventDefault(); release("ArrowDown"); }}
        >
          ▼
        </button>
        {/* Left */}
        <button
          className="absolute top-1/2 left-0 -translate-y-1/2 w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
          style={btnStyle(activeDir === "ArrowLeft")}
          onTouchStart={(e) => { e.preventDefault(); press("ArrowLeft"); }}
          onTouchEnd={(e) => { e.preventDefault(); release("ArrowLeft"); }}
        >
          ◀
        </button>
        {/* Right */}
        <button
          className="absolute top-1/2 right-0 -translate-y-1/2 w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
          style={btnStyle(activeDir === "ArrowRight")}
          onTouchStart={(e) => { e.preventDefault(); press("ArrowRight"); }}
          onTouchEnd={(e) => { e.preventDefault(); release("ArrowRight"); }}
        >
          ▶
        </button>
        {/* Center indicator */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full"
          style={{ background: "rgba(60,50,40,0.3)", border: "1px solid rgba(100,85,65,0.3)" }}
        />
      </div>

      {/* Action Button */}
      <div className="pointer-events-auto flex flex-col items-center gap-2">
        <button
          className="w-16 h-16 rounded-full flex items-center justify-center text-xs font-bold font-pixel"
          style={{
            background: hasNearHotspot
              ? "radial-gradient(circle, rgba(200,170,120,0.5), rgba(160,130,80,0.4))"
              : "rgba(60,50,40,0.6)",
            border: `3px solid ${hasNearHotspot ? "rgba(200,170,120,0.7)" : "rgba(100,85,65,0.5)"}`,
            color: hasNearHotspot ? "#e8d5b7" : "#6b6050",
            boxShadow: hasNearHotspot ? "0 0 20px rgba(200,170,120,0.3)" : "none",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            animation: hasNearHotspot ? "pulse-glow 2s ease-in-out infinite" : "none",
          }}
          onTouchStart={(e) => { e.preventDefault(); onAction(); }}
        >
          {hasNearHotspot ? "ACT" : "●"}
        </button>
        {hasNearHotspot && (
          <span className="font-pixel text-[8px]" style={{ color: "#b8a589" }}>
            TAP
          </span>
        )}
      </div>
    </div>
  );
};

export default MobileControls;
