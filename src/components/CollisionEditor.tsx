import { useState, useRef, useCallback, useEffect } from "react";
import roomImage from "@/assets/room.png";

interface Box {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  label: string;
}

export interface PolygonShape {
  points: { x: number; y: number }[];
  label: string;
}

export interface FurnitureItem {
  id: string;
  label: string;
  left: number;
  top: number;
  width: number;
  src: string;
}

interface CollisionEditorProps {
  obstacles: { minX: number; maxX: number; minY: number; maxY: number }[];
  polygons?: PolygonShape[];
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
  playerCollision: { halfW: number; heightFactor: number };
  spriteSize: number;
  walkSpriteSize: number;
  onSpriteSizeChange?: (size: number) => void;
  onWalkSpriteSizeChange?: (size: number) => void;
  furniture: FurnitureItem[];
  onFurnitureChange?: (furniture: FurnitureItem[]) => void;
  onClose: () => void;
}

type DragMode = "move" | "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | null;
type EditTarget = { type: "obstacle"; idx: number } | { type: "bounds" } | { type: "player" } | { type: "furniture"; idx: number } | null;

const LABELS = [
  "Bookshelf upper", "Bookshelf bottom-left", "Plants bottom", "Desk left + mug",
  "Desk main", "Plants right", "Record player", "Bed", "Right wall upper",
  "Right wall lower", "Box 10", "Box 11", "Box 12", "TV", "Chair",
];

const CollisionEditor = ({ obstacles, polygons: initialPolygons = [], bounds, playerCollision, spriteSize, walkSpriteSize, onSpriteSizeChange, onWalkSpriteSizeChange, furniture, onFurnitureChange, onClose }: CollisionEditorProps) => {
  const [boxes, setBoxes] = useState<Box[]>(
    obstacles.map((o, i) => ({ ...o, label: LABELS[i] || `Box ${i}` }))
  );
  const [boundsBox, setBoundsBox] = useState({ ...bounds });
  const [playerCol, setPlayerCol] = useState({ ...playerCollision });
  const [furnitureItems, setFurnitureItems] = useState<FurnitureItem[]>(furniture);

  const [selected, setSelected] = useState<EditTarget>(null);
  const [dragMode, setDragMode] = useState<DragMode>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [snapshot, setSnapshot] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"obstacles" | "bounds" | "player" | "sprite" | "furniture" | "polygons">("obstacles");
  const [localSpriteSize, setLocalSpriteSize] = useState(spriteSize);
  const [localWalkSize, setLocalWalkSize] = useState(walkSpriteSize);

  // Polygon state
  const [polyShapes, setPolyShapes] = useState<PolygonShape[]>(initialPolygons);
  const [isDrawingPoly, setIsDrawingPoly] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<{ x: number; y: number }[]>([]);
  const [selectedPoly, setSelectedPoly] = useState<number | null>(null);
  const [draggingVertex, setDraggingVertex] = useState<{ polyIdx: number; vertIdx: number } | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const getPercent = useCallback((clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { px: 0, py: 0 };
    return {
      px: ((clientX - rect.left) / rect.width) * 100,
      py: ((clientY - rect.top) / rect.height) * 100,
    };
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, target: EditTarget, mode: DragMode) => {
      e.stopPropagation();
      e.preventDefault();
      setSelected(target);
      setDragMode(mode);
      const { px, py } = getPercent(e.clientX, e.clientY);
      setDragStart({ x: px, y: py });

      if (target?.type === "obstacle") {
        setSnapshot({ ...boxes[target.idx] });
      } else if (target?.type === "bounds") {
        setSnapshot({ ...boundsBox });
      } else if (target?.type === "furniture") {
        setSnapshot({ ...furnitureItems[target.idx] });
      }
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [boxes, boundsBox, furnitureItems, getPercent]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (dragMode === null || !selected || !snapshot) return;
      const { px, py } = getPercent(e.clientX, e.clientY);
      const dx = px - dragStart.x;
      const dy = py - dragStart.y;

      if (selected.type === "furniture") {
        const item = { ...snapshot };
        if (dragMode === "move") {
          item.left = Math.max(0, Math.min(95, item.left + dx));
          item.top = Math.max(0, Math.min(95, item.top + dy));
        } else if (dragMode === "e" || dragMode === "w") {
          item.width = Math.max(2, Math.min(50, item.width + (dragMode === "e" ? dx : -dx)));
          if (dragMode === "w") item.left = Math.max(0, item.left + dx);
        }
        const updated = furnitureItems.map((f, i) => i === selected.idx ? item : f);
        setFurnitureItems(updated);
        onFurnitureChange?.(updated);
        return;
      }

      const applyDrag = (b: any) => {
        const result = { ...b };
        if (dragMode === "move") {
          const w = result.maxX - result.minX;
          const h = result.maxY - result.minY;
          result.minX = Math.max(0, Math.min(100 - w, result.minX + dx));
          result.minY = Math.max(0, Math.min(100 - h, result.minY + dy));
          result.maxX = result.minX + w;
          result.maxY = result.minY + h;
        } else {
          if (dragMode.includes("w")) result.minX = Math.max(0, Math.min(result.maxX - 1, result.minX + dx));
          if (dragMode.includes("e")) result.maxX = Math.max(result.minX + 1, Math.min(100, result.maxX + dx));
          if (dragMode.includes("n")) result.minY = Math.max(0, Math.min(result.maxY - 1, result.minY + dy));
          if (dragMode.includes("s")) result.maxY = Math.max(result.minY + 1, Math.min(100, result.maxY + dy));
        }
        return result;
      };

      if (selected.type === "obstacle") {
        setBoxes((prev) => {
          const updated = [...prev];
          updated[selected.idx] = applyDrag(snapshot);
          return updated;
        });
      } else if (selected.type === "bounds") {
        setBoundsBox(applyDrag(snapshot));
      }
    },
    [dragMode, selected, snapshot, dragStart, getPercent, furnitureItems, onFurnitureChange]
  );

  const handlePointerUp = useCallback(() => {
    setDragMode(null);
    setSnapshot(null);
  }, []);

  // Polygon helpers
  const finishPolygon = useCallback(() => {
    if (drawingPoints.length >= 3) {
      setPolyShapes((prev) => [...prev, { points: [...drawingPoints], label: `Polygon ${prev.length}` }]);
    }
    setDrawingPoints([]);
    setIsDrawingPoly(false);
  }, [drawingPoints]);

  const handleCanvasClickForPoly = useCallback((e: React.MouseEvent) => {
    if (activeTab !== "polygons" || !isDrawingPoly) return;
    e.stopPropagation();
    const { px, py } = getPercent(e.clientX, e.clientY);
    // Close polygon if clicking near first point
    if (drawingPoints.length >= 3) {
      const first = drawingPoints[0];
      if (Math.abs(px - first.x) < 1.5 && Math.abs(py - first.y) < 1.5) {
        finishPolygon();
        return;
      }
    }
    setDrawingPoints((prev) => [...prev, { x: px, y: py }]);
  }, [activeTab, isDrawingPoly, drawingPoints, getPercent, finishPolygon]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (activeTab === "polygons") {
      const { px, py } = getPercent(e.clientX, e.clientY);
      setMousePos({ x: px, y: py });
    }
    if (draggingVertex && containerRef.current) {
      const { px, py } = getPercent(e.clientX, e.clientY);
      setPolyShapes((prev) => {
        const updated = [...prev];
        const poly = { ...updated[draggingVertex.polyIdx] };
        poly.points = [...poly.points];
        poly.points[draggingVertex.vertIdx] = { x: Math.max(0, Math.min(100, px)), y: Math.max(0, Math.min(100, py)) };
        updated[draggingVertex.polyIdx] = poly;
        return updated;
      });
    }
  }, [activeTab, draggingVertex, getPercent]);

  const deletePolygon = () => {
    if (selectedPoly === null) return;
    setPolyShapes((prev) => prev.filter((_, i) => i !== selectedPoly));
    setSelectedPoly(null);
  };

  const deleteVertex = (polyIdx: number, vertIdx: number) => {
    setPolyShapes((prev) => {
      const updated = [...prev];
      const poly = { ...updated[polyIdx] };
      if (poly.points.length <= 3) return prev; // Min 3 vertices
      poly.points = poly.points.filter((_, i) => i !== vertIdx);
      updated[polyIdx] = poly;
      return updated;
    });
  };

  const addVertexOnEdge = (polyIdx: number, afterVertIdx: number) => {
    setPolyShapes((prev) => {
      const updated = [...prev];
      const poly = { ...updated[polyIdx] };
      const p1 = poly.points[afterVertIdx];
      const p2 = poly.points[(afterVertIdx + 1) % poly.points.length];
      const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
      poly.points = [...poly.points.slice(0, afterVertIdx + 1), mid, ...poly.points.slice(afterVertIdx + 1)];
      updated[polyIdx] = poly;
      return updated;
    });
  };

  const exportCode = () => {
    const obstaclesCode = `export const OBSTACLES = [\n${boxes
      .map((b) => `  { minX: ${Math.round(b.minX)}, maxX: ${Math.round(b.maxX)}, minY: ${Math.round(b.minY)}, maxY: ${Math.round(b.maxY)} }, // ${b.label}`)
      .join("\n")}\n];`;

    const boundsCode = `export const BOUNDS = {\n  minX: ${Math.round(boundsBox.minX)},\n  maxX: ${Math.round(boundsBox.maxX)},\n  minY: ${Math.round(boundsBox.minY)},\n  maxY: ${Math.round(boundsBox.maxY)},\n};`;

    const playerCode = `const CHARACTER_SIZE = ${localSpriteSize};\n// Player collision: halfW=${playerCol.halfW}, heightFactor=${playerCol.heightFactor}`;

    const furnitureCode = `// Furniture positions\n${furnitureItems.map(
      (f) => `// ${f.label}: left="${f.left.toFixed(1)}%" top="${f.top.toFixed(1)}%" width="${f.width.toFixed(1)}%"`
    ).join("\n")}`;

    const polygonsCode = polyShapes.length > 0
      ? `export const POLY_OBSTACLES = [\n${polyShapes.map((p) =>
          `  { points: [${p.points.map((pt) => `{x:${Math.round(pt.x * 10) / 10},y:${Math.round(pt.y * 10) / 10}}`).join(", ")}] }, // ${p.label}`
        ).join("\n")}\n];`
      : "";

    const code = `${boundsCode}\n\n${obstaclesCode}\n\n${polygonsCode ? polygonsCode + "\n\n" : ""}${playerCode}\n\n${furnitureCode}`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const deleteBox = () => {
    if (selected?.type !== "obstacle") return;
    setBoxes((prev) => prev.filter((_, i) => i !== selected.idx));
    setSelected(null);
  };

  const addBox = () => {
    setBoxes((prev) => [
      ...prev,
      { minX: 40, maxX: 55, minY: 40, maxY: 55, label: `Box ${prev.length}` },
    ]);
    setSelected({ type: "obstacle", idx: boxes.length });
  };

  const cursorFor = (mode: DragMode) => {
    const map: Record<string, string> = {
      move: "move", n: "n-resize", s: "s-resize", e: "e-resize", w: "w-resize",
      ne: "ne-resize", nw: "nw-resize", se: "se-resize", sw: "sw-resize",
    };
    return mode ? map[mode] || "default" : "default";
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") deleteBox();
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const renderResizeHandles = (target: EditTarget) => (
    <>
      <div className="absolute -top-1 left-2 right-2 h-2 cursor-n-resize" onPointerDown={(e) => handlePointerDown(e, target, "n")} />
      <div className="absolute -bottom-1 left-2 right-2 h-2 cursor-s-resize" onPointerDown={(e) => handlePointerDown(e, target, "s")} />
      <div className="absolute top-2 -left-1 bottom-2 w-2 cursor-w-resize" onPointerDown={(e) => handlePointerDown(e, target, "w")} />
      <div className="absolute top-2 -right-1 bottom-2 w-2 cursor-e-resize" onPointerDown={(e) => handlePointerDown(e, target, "e")} />
      {(["nw", "ne", "sw", "se"] as const).map((corner) => (
        <div
          key={corner}
          className="absolute w-3 h-3 bg-white border-2 border-primary rounded-sm"
          style={{
            cursor: `${corner}-resize`,
            ...(corner.includes("n") ? { top: -5 } : { bottom: -5 }),
            ...(corner.includes("w") ? { left: -5 } : { right: -5 }),
          }}
          onPointerDown={(e) => handlePointerDown(e, target, corner)}
        />
      ))}
    </>
  );

  const isBoundsSelected = selected?.type === "bounds";
  const selectedObstacleIdx = selected?.type === "obstacle" ? selected.idx : null;
  const selectedFurnitureIdx = selected?.type === "furniture" ? selected.idx : null;

  const playerX = 48;
  const playerY = 75;
  const playerBoxLeft = playerX - playerCol.halfW;
  const playerBoxWidth = playerCol.halfW * 2;
  const playerBoxTop = playerY - 12 * playerCol.heightFactor;
  const playerBoxHeight = 12 * playerCol.heightFactor;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex flex-col items-center justify-center p-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-3 bg-background border border-border rounded-lg px-4 py-2 shadow-lg flex-wrap">
        <span className="font-pixel text-xs text-primary">Collision Editor</span>
        <div className="w-px h-6 bg-border" />

        {(["obstacles", "polygons", "bounds", "player", "sprite", "furniture"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); if (tab !== "polygons") { setIsDrawingPoly(false); setDrawingPoints([]); } }}
            className={`px-3 py-1 text-xs rounded capitalize ${
              activeTab === tab ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:opacity-90"
            }`}
          >
            {tab === "obstacles" ? "🧱 Boxes" : tab === "polygons" ? "✏️ Polygons" : tab === "bounds" ? "🟩 Bounds" : tab === "player" ? "🧑 Player" : tab === "sprite" ? "🖼️ Sprite" : "🪑 Furniture"}
          </button>
        ))}

        <div className="w-px h-6 bg-border" />

        {activeTab === "obstacles" && (
          <>
            <button onClick={addBox} className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:opacity-90">+ Add Box</button>
            <button onClick={deleteBox} disabled={selectedObstacleIdx === null} className="px-3 py-1 text-xs bg-destructive text-destructive-foreground rounded hover:opacity-90 disabled:opacity-40">Delete</button>
            {selectedObstacleIdx !== null && (
              <label className="text-xs text-muted-foreground flex items-center gap-1">
                Label:
                <input
                  type="text"
                  value={boxes[selectedObstacleIdx].label}
                  onChange={(e) => {
                    setBoxes((prev) => {
                      const updated = [...prev];
                      updated[selectedObstacleIdx] = { ...updated[selectedObstacleIdx], label: e.target.value };
                      return updated;
                    });
                  }}
                  className="w-32 px-2 py-0.5 text-xs bg-muted border border-border rounded text-foreground"
                  placeholder="Name this box..."
                />
              </label>
            )}
            <div className="w-px h-6 bg-border" />
          </>
        )}

        {activeTab === "player" && (
          <>
            <label className="text-xs text-muted-foreground flex items-center gap-1">
              Half-W:
              <input type="number" value={playerCol.halfW} onChange={(e) => setPlayerCol((p) => ({ ...p, halfW: Number(e.target.value) }))} className="w-14 px-1 py-0.5 text-xs bg-muted border border-border rounded" step={0.5} min={1} max={20} />
            </label>
            <label className="text-xs text-muted-foreground flex items-center gap-1">
              Height:
              <input type="number" value={playerCol.heightFactor} onChange={(e) => setPlayerCol((p) => ({ ...p, heightFactor: Number(e.target.value) }))} className="w-14 px-1 py-0.5 text-xs bg-muted border border-border rounded" step={0.1} min={0.1} max={2} />
            </label>
            <div className="w-px h-6 bg-border" />
          </>
        )}

        {activeTab === "sprite" && (
          <>
            <label className="text-xs text-muted-foreground flex items-center gap-1">
              Idle (%):
              <input type="range" value={localSpriteSize} onChange={(e) => { const v = Number(e.target.value); setLocalSpriteSize(v); onSpriteSizeChange?.(v); }} className="w-20" step={1} min={5} max={50} />
              <input type="number" value={localSpriteSize} onChange={(e) => { const v = Number(e.target.value); setLocalSpriteSize(v); onSpriteSizeChange?.(v); }} className="w-12 px-1 py-0.5 text-xs bg-muted border border-border rounded" step={1} min={5} max={50} />
            </label>
            <label className="text-xs text-muted-foreground flex items-center gap-1">
              Walk (%):
              <input type="range" value={localWalkSize} onChange={(e) => { const v = Number(e.target.value); setLocalWalkSize(v); onWalkSpriteSizeChange?.(v); }} className="w-20" step={1} min={5} max={50} />
              <input type="number" value={localWalkSize} onChange={(e) => { const v = Number(e.target.value); setLocalWalkSize(v); onWalkSpriteSizeChange?.(v); }} className="w-12 px-1 py-0.5 text-xs bg-muted border border-border rounded" step={1} min={5} max={50} />
            </label>
            <div className="w-px h-6 bg-border" />
          </>
        )}

        {activeTab === "furniture" && selectedFurnitureIdx !== null && (
          <>
            <label className="text-xs text-muted-foreground flex items-center gap-1">
              Left:
              <input type="range" value={furnitureItems[selectedFurnitureIdx].left} min={0} max={100} step={0.5}
                onChange={(e) => { const v = Number(e.target.value); const updated = furnitureItems.map((f, i) => i === selectedFurnitureIdx ? { ...f, left: v } : f); setFurnitureItems(updated); onFurnitureChange?.(updated); }}
                className="w-16" />
              <input type="number" value={Math.round(furnitureItems[selectedFurnitureIdx].left * 10) / 10}
                onChange={(e) => { const v = Number(e.target.value); const updated = furnitureItems.map((f, i) => i === selectedFurnitureIdx ? { ...f, left: v } : f); setFurnitureItems(updated); onFurnitureChange?.(updated); }}
                className="w-12 px-1 py-0.5 text-xs bg-muted border border-border rounded" step={0.5} />
            </label>
            <label className="text-xs text-muted-foreground flex items-center gap-1">
              Top:
              <input type="range" value={furnitureItems[selectedFurnitureIdx].top} min={0} max={100} step={0.5}
                onChange={(e) => { const v = Number(e.target.value); const updated = furnitureItems.map((f, i) => i === selectedFurnitureIdx ? { ...f, top: v } : f); setFurnitureItems(updated); onFurnitureChange?.(updated); }}
                className="w-16" />
              <input type="number" value={Math.round(furnitureItems[selectedFurnitureIdx].top * 10) / 10}
                onChange={(e) => { const v = Number(e.target.value); const updated = furnitureItems.map((f, i) => i === selectedFurnitureIdx ? { ...f, top: v } : f); setFurnitureItems(updated); onFurnitureChange?.(updated); }}
                className="w-12 px-1 py-0.5 text-xs bg-muted border border-border rounded" step={0.5} />
            </label>
            <label className="text-xs text-muted-foreground flex items-center gap-1">
              Size:
              <input type="range" value={furnitureItems[selectedFurnitureIdx].width} min={2} max={30} step={0.5}
                onChange={(e) => { const v = Number(e.target.value); const updated = furnitureItems.map((f, i) => i === selectedFurnitureIdx ? { ...f, width: v } : f); setFurnitureItems(updated); onFurnitureChange?.(updated); }}
                className="w-20" />
              <input type="number" value={Math.round(furnitureItems[selectedFurnitureIdx].width * 10) / 10}
                onChange={(e) => { const v = Number(e.target.value); const updated = furnitureItems.map((f, i) => i === selectedFurnitureIdx ? { ...f, width: v } : f); setFurnitureItems(updated); onFurnitureChange?.(updated); }}
                className="w-12 px-1 py-0.5 text-xs bg-muted border border-border rounded" step={0.5} min={2} max={30} />
              <span className="text-[10px]">%</span>
            </label>
            <div className="w-px h-6 bg-border" />
          </>
        )}

        {activeTab === "polygons" && (
          <>
            {isDrawingPoly ? (
              <>
                <span className="text-xs text-green-400 animate-pulse">● Drawing ({drawingPoints.length} pts)</span>
                <button onClick={finishPolygon} disabled={drawingPoints.length < 3} className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:opacity-90 disabled:opacity-40">✓ Finish</button>
                <button onClick={() => { setDrawingPoints([]); setIsDrawingPoly(false); }} className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded hover:opacity-90">✕ Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => { setIsDrawingPoly(true); setSelectedPoly(null); }} className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:opacity-90">+ Draw Polygon</button>
                <button onClick={deletePolygon} disabled={selectedPoly === null} className="px-3 py-1 text-xs bg-destructive text-destructive-foreground rounded hover:opacity-90 disabled:opacity-40">Delete</button>
              </>
            )}
            {selectedPoly !== null && !isDrawingPoly && (
              <>
                <label className="text-xs text-muted-foreground flex items-center gap-1">
                  Label:
                  <input
                    type="text"
                    value={polyShapes[selectedPoly].label}
                    onChange={(e) => {
                      setPolyShapes((prev) => {
                        const updated = [...prev];
                        updated[selectedPoly] = { ...updated[selectedPoly], label: e.target.value };
                        return updated;
                      });
                    }}
                    className="w-32 px-2 py-0.5 text-xs bg-muted border border-border rounded text-foreground"
                  />
                </label>
                <span className="text-xs text-muted-foreground">{polyShapes[selectedPoly].points.length} vertices</span>
              </>
            )}
            <div className="w-px h-6 bg-border" />
          </>
        )}

        <button onClick={exportCode} className="px-3 py-1 text-xs bg-accent text-accent-foreground rounded hover:opacity-90">
          {copied ? "✓ Copied!" : "📋 Copy All"}
        </button>
        <button onClick={onClose} className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded hover:opacity-90 ml-2">✕ Close</button>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="relative max-w-4xl w-full select-none"
        onPointerMove={(e) => { handlePointerMove(e); handleCanvasMouseMove(e); }}
        onPointerUp={(e) => { handlePointerUp(); setDraggingVertex(null); }}
        onClick={(e) => { if (activeTab === "polygons") { if (isDrawingPoly) handleCanvasClickForPoly(e); else { setSelectedPoly(null); setSelected(null); } } else { setSelected(null); } }}
      >
        <img src={roomImage} alt="Room" className="w-full h-auto rounded-lg" draggable={false} />

        {/* Furniture items */}
        {furnitureItems.map((item, i) => {
          const isSelected = selectedFurnitureIdx === i;
          return (
            <div
              key={item.id}
              className="absolute"
              style={{
                left: `${item.left}%`, top: `${item.top}%`, width: `${item.width}%`,
                zIndex: isSelected ? 12 : 11,
                cursor: activeTab === "furniture" ? "move" : "default",
                pointerEvents: activeTab === "furniture" ? "auto" : "none",
                outline: isSelected ? "2px solid #0ff" : activeTab === "furniture" ? "1px dashed #0ff8" : "none",
              }}
              onPointerDown={(e) => { if (activeTab === "furniture") handlePointerDown(e, { type: "furniture", idx: i }, "move"); }}
              onClick={(e) => { if (activeTab === "furniture") { e.stopPropagation(); setSelected({ type: "furniture", idx: i }); } }}
            >
              <img src={item.src} alt={item.label} className="w-full h-auto" style={{ imageRendering: "pixelated" }} draggable={false} />
              {activeTab === "furniture" && (
                <span className="absolute -top-5 left-0 px-1 text-[10px] font-bold text-cyan-300 bg-black/70">{item.label}</span>
              )}
              {isSelected && (
                <>
                  <div className="absolute top-0 -left-1 bottom-0 w-2 cursor-w-resize" onPointerDown={(e) => handlePointerDown(e, { type: "furniture", idx: i }, "w")} />
                  <div className="absolute top-0 -right-1 bottom-0 w-2 cursor-e-resize" onPointerDown={(e) => handlePointerDown(e, { type: "furniture", idx: i }, "e")} />
                </>
              )}
            </div>
          );
        })}

        {/* Walkable bounds */}
        <div
          className="absolute"
          style={{
            left: `${boundsBox.minX}%`, top: `${boundsBox.minY}%`,
            width: `${boundsBox.maxX - boundsBox.minX}%`, height: `${boundsBox.maxY - boundsBox.minY}%`,
            border: isBoundsSelected ? "2px solid #0f0" : "2px dashed lime",
            backgroundColor: isBoundsSelected ? "rgba(0, 255, 0, 0.1)" : "transparent",
            zIndex: activeTab === "bounds" ? 10 : 1,
            cursor: activeTab === "bounds" ? cursorFor("move") : "default",
            pointerEvents: activeTab === "bounds" ? "auto" : "none",
          }}
          onPointerDown={(e) => { if (activeTab === "bounds") handlePointerDown(e, { type: "bounds" }, "move"); }}
          onClick={(e) => { if (activeTab === "bounds") { e.stopPropagation(); setSelected({ type: "bounds" }); } }}
        >
          <span className="absolute -top-5 left-0 px-1 text-[10px] font-bold text-green-400 bg-black/60">WALKABLE BOUNDS</span>
          {isBoundsSelected && renderResizeHandles({ type: "bounds" })}
        </div>

        {/* Player collision */}
        {activeTab === "player" && (
          <div className="absolute pointer-events-none" style={{ left: `${playerBoxLeft}%`, top: `${playerBoxTop}%`, width: `${playerBoxWidth}%`, height: `${playerBoxHeight}%`, border: "2px solid cyan", backgroundColor: "rgba(0, 255, 255, 0.15)", zIndex: 15 }}>
            <span className="absolute -top-5 left-0 px-1 text-[10px] font-bold text-cyan-400 bg-black/60">PLAYER COLLISION ({playerCol.halfW}w × {playerCol.heightFactor}h)</span>
          </div>
        )}

        {/* Obstacle boxes */}
        {boxes.map((box, i) => {
          const isSelected = selectedObstacleIdx === i;
          const w = box.maxX - box.minX;
          const h = box.maxY - box.minY;
          return (
            <div key={i} className="absolute" style={{ left: `${box.minX}%`, top: `${box.minY}%`, width: `${w}%`, height: `${h}%`, zIndex: isSelected ? 10 : 5, pointerEvents: activeTab === "obstacles" ? "auto" : "none" }}>
              <div
                className="absolute inset-0"
                style={{ border: isSelected ? "2px solid #ff0" : "2px solid red", backgroundColor: isSelected ? "rgba(255, 255, 0, 0.2)" : "rgba(255, 0, 0, 0.15)", cursor: activeTab === "obstacles" ? cursorFor("move") : "default" }}
                onPointerDown={(e) => handlePointerDown(e, { type: "obstacle", idx: i }, "move")}
                onClick={(e) => { e.stopPropagation(); setSelected({ type: "obstacle", idx: i }); }}
              >
                <span className="absolute top-0 left-0 px-1 text-[10px] font-bold leading-tight" style={{ color: isSelected ? "#ff0" : "#fff", backgroundColor: isSelected ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.5)" }}>
                  {i}: {box.label}
                </span>
              </div>
              {isSelected && renderResizeHandles({ type: "obstacle", idx: i })}
            </div>
          );
        })}
        {/* Polygon SVG overlay */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ zIndex: activeTab === "polygons" ? 30 : 2 }}
        >
          {/* Existing polygons */}
          {polyShapes.map((poly, pi) => {
            const isSelPoly = selectedPoly === pi;
            const pointsStr = poly.points.map((p) => `${p.x},${p.y}`).join(" ");
            return (
              <g key={pi}>
                <polygon
                  points={pointsStr}
                  fill={isSelPoly ? "rgba(255, 0, 200, 0.25)" : "rgba(255, 0, 200, 0.12)"}
                  stroke={isSelPoly ? "#f0f" : "#f0c"}
                  strokeWidth={isSelPoly ? "0.4" : "0.25"}
                  style={{ pointerEvents: activeTab === "polygons" && !isDrawingPoly ? "auto" : "none", cursor: "pointer" }}
                  onClick={(e) => { e.stopPropagation(); setSelectedPoly(pi); setSelected(null); }}
                />
                {/* Label */}
                {activeTab === "polygons" && (
                  <text
                    x={poly.points.reduce((s, p) => s + p.x, 0) / poly.points.length}
                    y={poly.points.reduce((s, p) => s + p.y, 0) / poly.points.length}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isSelPoly ? "#f0f" : "#fff"}
                    fontSize="1.8"
                    fontWeight="bold"
                    style={{ pointerEvents: "none" }}
                  >
                    {poly.label}
                  </text>
                )}
                {/* Vertex handles */}
                {isSelPoly && activeTab === "polygons" && !isDrawingPoly && poly.points.map((pt, vi) => (
                  <g key={vi}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="0.8"
                      fill="#fff"
                      stroke="#f0f"
                      strokeWidth="0.2"
                      style={{ pointerEvents: "auto", cursor: "grab" }}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setDraggingVertex({ polyIdx: pi, vertIdx: vi });
                      }}
                    />
                    {/* Edge midpoint — click to add vertex */}
                    {(() => {
                      const next = poly.points[(vi + 1) % poly.points.length];
                      return (
                        <circle
                          cx={(pt.x + next.x) / 2}
                          cy={(pt.y + next.y) / 2}
                          r="0.5"
                          fill="#f0f"
                          fillOpacity="0.5"
                          stroke="#fff"
                          strokeWidth="0.15"
                          style={{ pointerEvents: "auto", cursor: "copy" }}
                          onClick={(e) => { e.stopPropagation(); addVertexOnEdge(pi, vi); }}
                        />
                      );
                    })()}
                    {/* Right-click to delete vertex */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="1.2"
                      fill="transparent"
                      style={{ pointerEvents: "auto" }}
                      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); deleteVertex(pi, vi); }}
                    />
                  </g>
                ))}
              </g>
            );
          })}

          {/* Drawing preview */}
          {isDrawingPoly && drawingPoints.length > 0 && (
            <g>
              <polyline
                points={[...drawingPoints, ...(mousePos ? [mousePos] : [])].map((p) => `${p.x},${p.y}`).join(" ")}
                fill="rgba(0, 255, 100, 0.1)"
                stroke="#0f8"
                strokeWidth="0.3"
                strokeDasharray="1 0.5"
              />
              {drawingPoints.map((pt, i) => (
                <circle key={i} cx={pt.x} cy={pt.y} r={i === 0 ? "1" : "0.6"} fill={i === 0 ? "#0f8" : "#fff"} stroke="#0f8" strokeWidth="0.2" />
              ))}
              {/* Close indicator on first point */}
              {drawingPoints.length >= 3 && mousePos && (
                (() => {
                  const first = drawingPoints[0];
                  const near = Math.abs(mousePos.x - first.x) < 1.5 && Math.abs(mousePos.y - first.y) < 1.5;
                  return near ? <circle cx={first.x} cy={first.y} r="1.5" fill="rgba(0,255,100,0.3)" stroke="#0f8" strokeWidth="0.3" /> : null;
                })()
              )}
            </g>
          )}
        </svg>
      </div>

      <div className="mt-3 text-xs text-muted-foreground font-pixel text-center">
        {activeTab === "obstacles" && "Click to select • Drag to move • Drag corners/edges to resize • Delete key to remove"}
        {activeTab === "polygons" && (isDrawingPoly
          ? "Click to place vertices • Click first point to close • Finish button to complete"
          : "Click polygon to select • Drag vertices to reshape • Click edge midpoints to add • Right-click vertex to remove")}
        {activeTab === "bounds" && "Click the green box to select • Drag to move • Drag corners/edges to resize the walkable area"}
        {activeTab === "player" && "Adjust Half-W (horizontal radius) and Height factor for the player collision box"}
        {activeTab === "sprite" && "Adjust the character sprite size (% of container width)"}
        {activeTab === "furniture" && "Click to select • Drag to move • Drag edges to resize • Use inputs for precise values"}
        {" • "}<span className="text-primary">Copy All</span> to export
      </div>
    </div>
  );
};

export default CollisionEditor;