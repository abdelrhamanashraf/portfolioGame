import { useRef, useCallback, type ReactNode } from "react";

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
}

interface WindowProps {
  state: WindowState;
  focused: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (x: number, y: number, w: number, h: number) => void;
  children: ReactNode;
}

const MIN_WIDTH = 320;
const MIN_HEIGHT = 200;

const Window = ({
  state,
  focused,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onMove,
  onResize,
  children,
}: WindowProps) => {
  const dragRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);
  const resizeRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origW: number;
    origH: number;
    edge: string;
  } | null>(null);

  // ─── Drag ─────────────────────────────────────────
  const handleDragStart = useCallback(
    (e: React.PointerEvent) => {
      if (state.maximized) return;
      e.preventDefault();
      e.stopPropagation();
      onFocus();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: state.x,
        origY: state.y,
      };
    },
    [state.x, state.y, state.maximized, onFocus]
  );

  const handleDragMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      onMove(dragRef.current.origX + dx, dragRef.current.origY + dy);
    },
    [onMove]
  );

  const handleDragEnd = useCallback(() => {
    dragRef.current = null;
  }, []);

  // ─── Resize ───────────────────────────────────────
  const handleResizeStart = useCallback(
    (edge: string) => (e: React.PointerEvent) => {
      if (state.maximized) return;
      e.preventDefault();
      e.stopPropagation();
      onFocus();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      resizeRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: state.x,
        origY: state.y,
        origW: state.width,
        origH: state.height,
        edge,
      };
    },
    [state.x, state.y, state.width, state.height, state.maximized, onFocus]
  );

  const handleResizeMove = useCallback(
    (e: React.PointerEvent) => {
      if (!resizeRef.current) return;
      const r = resizeRef.current;
      const dx = e.clientX - r.startX;
      const dy = e.clientY - r.startY;

      let newX = r.origX;
      let newY = r.origY;
      let newW = r.origW;
      let newH = r.origH;

      if (r.edge.includes("e")) newW = Math.max(MIN_WIDTH, r.origW + dx);
      if (r.edge.includes("s")) newH = Math.max(MIN_HEIGHT, r.origH + dy);
      if (r.edge.includes("w")) {
        newW = Math.max(MIN_WIDTH, r.origW - dx);
        if (newW > MIN_WIDTH) newX = r.origX + dx;
      }
      if (r.edge.includes("n")) {
        newH = Math.max(MIN_HEIGHT, r.origH - dy);
        if (newH > MIN_HEIGHT) newY = r.origY + dy;
      }

      onResize(newX, newY, newW, newH);
    },
    [onResize]
  );

  const handleResizeEnd = useCallback(() => {
    resizeRef.current = null;
  }, []);

  if (state.minimized) return null;

  const { x, y, width, height, maximized } = state;
  const posStyle = maximized
    ? { left: 0, top: 0, width: "100%", height: "calc(100% - 40px)" }
    : { left: x, top: y, width, height };

  return (
    <div
      className="absolute flex flex-col"
      style={{
        ...posStyle,
        zIndex: state.zIndex,
        transition: maximized ? "all 0.2s ease" : undefined,
      }}
      onPointerDown={onFocus}
    >
      {/* Resize handles (hidden when maximized) */}
      {!maximized && (
        <>
          {/* Edges */}
          <div
            className="absolute -top-1 left-2 right-2 h-2 cursor-n-resize z-50"
            onPointerDown={handleResizeStart("n")}
            onPointerMove={handleResizeMove}
            onPointerUp={handleResizeEnd}
          />
          <div
            className="absolute -bottom-1 left-2 right-2 h-2 cursor-s-resize z-50"
            onPointerDown={handleResizeStart("s")}
            onPointerMove={handleResizeMove}
            onPointerUp={handleResizeEnd}
          />
          <div
            className="absolute top-2 -left-1 bottom-2 w-2 cursor-w-resize z-50"
            onPointerDown={handleResizeStart("w")}
            onPointerMove={handleResizeMove}
            onPointerUp={handleResizeEnd}
          />
          <div
            className="absolute top-2 -right-1 bottom-2 w-2 cursor-e-resize z-50"
            onPointerDown={handleResizeStart("e")}
            onPointerMove={handleResizeMove}
            onPointerUp={handleResizeEnd}
          />
          {/* Corners */}
          <div
            className="absolute -top-1 -left-1 w-3 h-3 cursor-nw-resize z-50"
            onPointerDown={handleResizeStart("nw")}
            onPointerMove={handleResizeMove}
            onPointerUp={handleResizeEnd}
          />
          <div
            className="absolute -top-1 -right-1 w-3 h-3 cursor-ne-resize z-50"
            onPointerDown={handleResizeStart("ne")}
            onPointerMove={handleResizeMove}
            onPointerUp={handleResizeEnd}
          />
          <div
            className="absolute -bottom-1 -left-1 w-3 h-3 cursor-sw-resize z-50"
            onPointerDown={handleResizeStart("sw")}
            onPointerMove={handleResizeMove}
            onPointerUp={handleResizeEnd}
          />
          <div
            className="absolute -bottom-1 -right-1 w-3 h-3 cursor-se-resize z-50"
            onPointerDown={handleResizeStart("se")}
            onPointerMove={handleResizeMove}
            onPointerUp={handleResizeEnd}
          />
        </>
      )}

      {/* Window chrome */}
      <div
        className="rounded-t-lg overflow-hidden"
        style={{
          border: focused
            ? "1px solid hsl(25 55% 45% / 0.6)"
            : "1px solid hsl(25 20% 28% / 0.8)",
          borderBottom: "none",
          boxShadow: focused
            ? "0 8px 32px rgba(0,0,0,0.5), 0 0 20px hsl(25 55% 45% / 0.1)"
            : "0 4px 16px rgba(0,0,0,0.4)",
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center h-8 px-2 select-none"
          style={{
            background: focused
              ? "linear-gradient(180deg, hsl(30 20% 18%) 0%, hsl(30 20% 14%) 100%)"
              : "linear-gradient(180deg, hsl(30 15% 16%) 0%, hsl(30 15% 12%) 100%)",
            cursor: maximized ? "default" : "move",
          }}
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onDoubleClick={onMaximize}
        >
          {/* App icon + title */}
          {state.icon.includes("/") || state.icon.includes("\\") || state.icon.startsWith("data:") ? (
            <img src={state.icon} alt={state.title} className="w-4 h-4 object-contain mr-2 pointer-events-none" style={{ imageRendering: "pixelated" }} draggable={false} />
          ) : (
            <span className="text-sm mr-2 pointer-events-none">{state.icon}</span>
          )}
          <span
            className="font-pixel text-[9px] flex-1 truncate pointer-events-none"
            style={{
              color: focused
                ? "hsl(35 30% 85%)"
                : "hsl(30 15% 50%)",
            }}
          >
            {state.title}
          </span>

          {/* Window controls */}
          <div className="flex items-center gap-1.5 ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
              className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-400 transition-colors flex items-center justify-center group"
              aria-label="Minimize"
            >
              <span className="text-[8px] text-black/0 group-hover:text-black/80 leading-none font-bold">
                −
              </span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMaximize();
              }}
              className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-400 transition-colors flex items-center justify-center group"
              aria-label="Maximize"
            >
              <span className="text-[6px] text-black/0 group-hover:text-black/80 leading-none font-bold">
                □
              </span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors flex items-center justify-center group"
              aria-label="Close"
            >
              <span className="text-[8px] text-black/0 group-hover:text-black/80 leading-none font-bold">
                ×
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div
        className="flex-1 overflow-hidden rounded-b-lg"
        style={{
          border: focused
            ? "1px solid hsl(25 55% 45% / 0.6)"
            : "1px solid hsl(25 20% 28% / 0.8)",
          borderTop: "none",
          background: "hsl(30 25% 10%)",
          boxShadow: focused
            ? "0 8px 32px rgba(0,0,0,0.5), 0 0 20px hsl(25 55% 45% / 0.1)"
            : "0 4px 16px rgba(0,0,0,0.4)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Window;
