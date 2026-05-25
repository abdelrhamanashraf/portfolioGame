import { useRef, useCallback, useState } from "react";

interface DesktopIconProps {
  icon: string;
  label: string;
  x: number;
  y: number;
  selected?: boolean;
  onClick: () => void;
  onDragEnd: (x: number, y: number) => void;
  onSelect: () => void;
}

const isImageIcon = (icon: string) =>
  icon.includes("/") || icon.includes("\\") || icon.startsWith("data:");

const DRAG_THRESHOLD = 4; // px of movement before it counts as a drag

const DesktopIcon = ({ icon, label, x, y, selected, onClick, onDragEnd, onSelect }: DesktopIconProps) => {
  const dragging = useRef(false);
  const didDrag = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState<{ dx: number; dy: number } | null>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onSelect();
      dragging.current = true;
      didDrag.current = false;
      startMouse.current = { x: e.clientX, y: e.clientY };
      startPos.current = { x, y };
      setDragOffset(null);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [x, y, onSelect]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - startMouse.current.x;
      const dy = e.clientY - startMouse.current.y;
      if (!didDrag.current && Math.abs(dx) + Math.abs(dy) < DRAG_THRESHOLD) return;
      didDrag.current = true;
      setDragOffset({ dx, dy });
    },
    []
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);

      if (didDrag.current) {
        const dx = e.clientX - startMouse.current.x;
        const dy = e.clientY - startMouse.current.y;
        onDragEnd(startPos.current.x + dx, startPos.current.y + dy);
      } else {
        onClick();
      }
      setDragOffset(null);
    },
    [onClick, onDragEnd]
  );

  const displayX = dragOffset ? x + dragOffset.dx : x;
  const displayY = dragOffset ? y + dragOffset.dy : y;

  return (
    <div
      className="absolute select-none"
      style={{
        left: displayX,
        top: displayY,
        zIndex: dragging.current && didDrag.current ? 9999 : 10,
        cursor: dragOffset ? "grabbing" : "default",
        opacity: dragOffset ? 0.85 : 1,
        transition: dragOffset ? "none" : "box-shadow 0.15s",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div
        className={`flex flex-col items-center gap-1.5 p-2 rounded-lg w-20 group transition-all duration-200 ${
          selected ? "bg-white/10 ring-1 ring-primary/40" : "hover:bg-white/5"
        }`}
      >
        {/* Icon */}
        <div
          className="w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_hsl(40_70%_55%/0.4)]"
          style={{
            background: "linear-gradient(135deg, hsl(30 20% 18%) 0%, hsl(30 20% 14%) 100%)",
            border: "1px solid hsl(25 20% 28% / 0.6)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          {isImageIcon(icon) ? (
            <img
              src={icon}
              alt={label}
              className="w-10 h-10 object-contain"
              style={{ imageRendering: "pixelated" }}
              draggable={false}
            />
          ) : (
            <span className="text-3xl">{icon}</span>
          )}
        </div>
        {/* Label */}
        <span
          className="font-pixel text-[7px] leading-tight text-center max-w-full truncate transition-colors"
          style={{
            color: "hsl(35 30% 80%)",
            textShadow: "0 1px 3px rgba(0,0,0,0.8)",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

export default DesktopIcon;
