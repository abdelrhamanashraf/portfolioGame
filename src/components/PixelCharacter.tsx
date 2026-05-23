import { useState, useEffect, useCallback, useRef } from "react";
import frontSprite from "@/assets/front_player.png";
import backSprite from "@/assets/back_player.png";
import sideSprite from "@/assets/side_player.png";
import sideWalk1 from "@/assets/side_walk_1.png";
import sideWalk2 from "@/assets/side_walk_2.png";
import sideWalk3 from "@/assets/side_walk_3.png";
import sideWalk4 from "@/assets/side_walk_4.png";
import frontWalk1 from "@/assets/front_walk_1.png";
import frontWalk2 from "@/assets/front_walk_2.png";
import frontWalk3 from "@/assets/front_walk_3.png";
import frontWalk4 from "@/assets/front_walk_4.png";
import backWalk1 from "@/assets/back_walk_1.png";
import backWalk2 from "@/assets/back_walk_2.png";
import backWalk3 from "@/assets/back_walk_3.png";
import backWalk4 from "@/assets/back_walk_4.png";

type Direction = "down" | "up" | "left" | "right";

interface PixelCharacterProps {
  containerRef: React.RefObject<HTMLDivElement>;
  onReachHotspot?: (hotspot: string) => void;
  onNearHotspot?: (hotspot: string | null) => void;
  characterSize?: number;
  walkCharacterSize?: number;
  frozen?: boolean;
}

const SPEED = 0.8;
const CHARACTER_SIZE = 20;
const WALK_FRAME_DURATION = 150; // ms per frame

// Walkable floor area boundaries (percentage of image)
export const BOUNDS = {
  minX: 2,
  maxX: 98,
  minY: 54,
  maxY: 97,
};

// Obstacle collision boxes (legacy rectangular — now using polygons instead)
export const OBSTACLES: { minX: number; maxX: number; minY: number; maxY: number }[] = [
];

// Polygon obstacle collision shapes (for angled/isometric objects)
export const POLY_OBSTACLES: { points: { x: number; y: number }[] }[] = [
  { points: [{x:94.2,y:50.6}, {x:93.9,y:58.6}, {x:87.7,y:55.9}, {x:87.8,y:47.3}] }, // certificate
  { points: [{x:44.8,y:61}, {x:39.2,y:63.7}, {x:30.8,y:59.1}, {x:32.2,y:52.5}, {x:39.2,y:56.3}, {x:44.5,y:54.3}] }, // desk 1
  { points: [{x:60,y:54.5}, {x:55.4,y:56.6}, {x:48.7,y:53.2}, {x:60,y:48}] }, // desk 2
  { points: [{x:64.5,y:55.8}, {x:77.8,y:63.8}, {x:86.6,y:60.2}, {x:86.6,y:54.3}, {x:73,y:47.2}, {x:65.1,y:50.9}] }, // bed
  { points: [{x:31.5,y:59.6}, {x:28.4,y:61.3}, {x:26.7,y:59.6}, {x:26.3,y:51.6}, {x:32.1,y:51.5}] }, // plant
  { points: [{x:16.1,y:62.8}, {x:13.7,y:64.7}, {x:10.6,y:63.3}, {x:10.4,y:50}, {x:16.6,y:49.5}] }, // plant 2
  { points: [{x:1.3,y:73.5}, {x:9,y:77.5}, {x:16.6,y:73.6}, {x:14.6,y:72.6}, {x:14.9,y:69.3}, {x:13.4,y:68.6}, {x:13.5,y:63.9}, {x:11.2,y:63}, {x:6.5,y:65.3}, {x:6.5,y:68.5}, {x:3,y:70.6}, {x:3.1,y:73.5}] }, // tv
  { points: [{x:22.7,y:77.7}, {x:20.5,y:74.2}, {x:17,y:74.4}, {x:17.1,y:78.2}, {x:20,y:79.7}, {x:21.7,y:79.2}] }, // bean chair
  { points: [{x:26.4,y:60}, {x:18.5,y:63.9}, {x:13.4,y:61.5}, {x:14.1,y:39.4}, {x:27.4,y:34.3}, {x:30.3,y:36.6}, {x:30.7,y:58.4}] }, // shelf
  { points: [{x:45.3,y:59.3}, {x:55.7,y:54.2}, {x:44.6,y:54.2}] }, // desk corner
  { points: [{x:86.5,y:60}, {x:97.9,y:66.2}, {x:97.9,y:54.1}, {x:86.3,y:54.4}] }, // wall right
  { points: [{x:0.1,y:67.6}, {x:10.7,y:63}, {x:10.2,y:54.2}, {x:0.6,y:53.9}] }, // wall left
];

// Point-in-polygon test using ray casting algorithm
function pointInPolygon(px: number, py: number, polygon: { x: number; y: number }[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

// Hotspot proximity zones
const HOTSPOT_ZONES = [
  { name: "about", x: 36, y: 70, radius: 10 },
  { name: "skills", x: 16, y: 78, radius: 10 },
  { name: "projects", x: 74, y: 60, radius: 10 },
  { name: "contact", x: 80, y: 70, radius: 10 },
  { name: "education", x: 90, y: 62, radius: 8 },
  { name: "tv", x: 10, y: 78, radius: 10 },
];

// Walk animation config per direction
type WalkConfig = { type: "frames"; images: string[] };

const WALK_CONFIG: Record<Direction, WalkConfig> = {
  down: { type: "frames", images: [frontWalk1, frontWalk2, frontWalk3, frontWalk4] },
  up: { type: "frames", images: [backWalk1, backWalk2, backWalk3, backWalk4] },
  right: { type: "frames", images: [sideWalk1, sideWalk2, sideWalk3, sideWalk4] },
  left: { type: "frames", images: [sideWalk1, sideWalk2, sideWalk3, sideWalk4] },
};

const IDLE_SPRITES: Record<Direction, string> = {
  down: frontSprite,
  up: backSprite,
  right: sideSprite,
  left: sideSprite,
};

const FLIP: Record<Direction, boolean> = {
  down: false,
  up: false,
  right: false,
  left: true,
};

// Preload all images at module level to prevent flicker
const ALL_IMAGES = [
  frontSprite, backSprite, sideSprite,
  frontWalk1, frontWalk2, frontWalk3, frontWalk4,
  backWalk1, backWalk2, backWalk3, backWalk4,
  sideWalk1, sideWalk2, sideWalk3, sideWalk4,
];

const preloadPromise = Promise.all(
  ALL_IMAGES.map((src) => {
    const img = new Image();
    img.src = src;
    return new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; });
  })
);

const PixelCharacter = ({ containerRef, onReachHotspot, onNearHotspot, characterSize = CHARACTER_SIZE, walkCharacterSize = CHARACTER_SIZE, frozen = false }: PixelCharacterProps) => {
  const [pos, setPos] = useState({ x: 48, y: 75 });
  const [direction, setDirection] = useState<Direction>("down");
  const [isWalking, setIsWalking] = useState(false);
  const [walkFrame, setWalkFrame] = useState(0);
  const keysRef = useRef<Set<string>>(new Set());
  const animFrameRef = useRef<number>(0);
  const walkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [nearHotspot, setNearHotspot] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Wait for all sprites to preload
  useEffect(() => {
    preloadPromise.then(() => setReady(true));
  }, []);
  const checkHotspots = useCallback((x: number, y: number) => {
    for (const zone of HOTSPOT_ZONES) {
      const dist = Math.sqrt((x - zone.x) ** 2 + (y - zone.y) ** 2);
      if (dist < zone.radius) {
        setNearHotspot(zone.name);
        return;
      }
    }
    setNearHotspot(null);
  }, []);

  const collidesWithObstacle = useCallback((x: number, y: number) => {
    const halfW = 2;
    const charLeft = x - halfW;
    const charRight = x + halfW;
    const charBottom = y;
    const charTop = y - characterSize * 0.3;

    // Check rectangular obstacles
    for (const obs of OBSTACLES) {
      if (charRight > obs.minX && charLeft < obs.maxX && charBottom > obs.minY && charTop < obs.maxY) {
        return true;
      }
    }

    // Check polygon obstacles (test center point + feet corners)
    const testPoints = [
      { x, y },
      { x: charLeft, y: charBottom },
      { x: charRight, y: charBottom },
    ];
    for (const poly of POLY_OBSTACLES) {
      for (const pt of testPoints) {
        if (pointInPolygon(pt.x, pt.y, poly.points)) {
          return true;
        }
      }
    }

    return false;
  }, []);

  // Walk frame animation timer - start/stop without resetting on every render
  useEffect(() => {
    if (isWalking && !walkIntervalRef.current) {
      walkIntervalRef.current = setInterval(() => {
        setWalkFrame((f) => f + 1);
      }, WALK_FRAME_DURATION);
    } else if (!isWalking && walkIntervalRef.current) {
      clearInterval(walkIntervalRef.current);
      walkIntervalRef.current = null;
      setWalkFrame(0);
    }
    return () => {
      if (walkIntervalRef.current) {
        clearInterval(walkIntervalRef.current);
        walkIntervalRef.current = null;
      }
    };
  }, [isWalking]);

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(e.key)) {
        e.preventDefault();
        keysRef.current.add(e.key);
      }
      if (e.key === "Enter" || e.key === " ") {
        if (nearHotspot && onReachHotspot) {
          e.preventDefault();
          onReachHotspot(nearHotspot);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [nearHotspot, onReachHotspot]);

  // Game loop
  useEffect(() => {
    let lastTime = 0;
    const gameLoop = (time: number) => {
      if (time - lastTime > 16) {
        lastTime = time;
        const keys = keysRef.current;
        let dx = 0,
          dy = 0;

        if (!frozen && (keys.has("ArrowLeft") || keys.has("a"))) {
          dx -= SPEED;
          setDirection("left");
        }
        if (!frozen && (keys.has("ArrowRight") || keys.has("d"))) {
          dx += SPEED;
          setDirection("right");
        }
        if (!frozen && (keys.has("ArrowUp") || keys.has("w"))) {
          dy -= SPEED;
          setDirection("up");
        }
        if (!frozen && (keys.has("ArrowDown") || keys.has("s"))) {
          dy += SPEED;
          setDirection("down");
        }

        const wantsToMove = !frozen && (dx !== 0 || dy !== 0);

        if (wantsToMove) {
          setPos((prev) => {
            let newX = Math.max(BOUNDS.minX, Math.min(BOUNDS.maxX, prev.x + dx));
            let newY = Math.max(BOUNDS.minY, Math.min(BOUNDS.maxY, prev.y + dy));

            let result = prev;
            if (!collidesWithObstacle(newX, newY)) result = { x: newX, y: newY };
            else if (!collidesWithObstacle(newX, prev.y)) result = { x: newX, y: prev.y };
            else if (!collidesWithObstacle(prev.x, newY)) result = { x: prev.x, y: newY };

            // Only animate walk if position actually changed
            const didMove = result.x !== prev.x || result.y !== prev.y;
            setIsWalking(didMove);

            return result;
          });
        } else {
          setIsWalking(false);
        }
      }
      animFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [collidesWithObstacle]);

  useEffect(() => {
    checkHotspots(pos.x, pos.y);
  }, [pos, checkHotspots]);

  // Report nearHotspot changes to parent
  useEffect(() => {
    onNearHotspot?.(nearHotspot);
  }, [nearHotspot, onNearHotspot]);

  const config = WALK_CONFIG[direction];
  const flip = FLIP[direction];

  // All directions now use frames
  const idleSrc = IDLE_SPRITES[direction];
  const walkFrameSrc = config.images[walkFrame % config.images.length];

  // Group idle sprites (unique values only)
  const IDLE_IMAGES = [frontSprite, backSprite, sideSprite];
  // Group walk sprites by direction
  const WALK_IMAGES = config.images;

  if (!ready) return null;

  return (
    <>
      {/* Character - Idle */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          width: `${characterSize}%`,
          transform: `translate(-50%, -95%)${flip ? " scaleX(-1)" : ""}`,
          willChange: "left, top",
          zIndex: 20,
          display: isWalking ? "none" : "grid",
        }}
      >
        {IDLE_IMAGES.map((src) => (
          <img
            key={src}
            src={src}
            alt="Player character"
            className="w-full h-auto"
            style={{
              gridArea: "1 / 1",
              imageRendering: "pixelated",
              visibility: src === idleSrc ? "visible" : "hidden",
            }}
            draggable={false}
          />
        ))}
      </div>

      {/* Character - Walking */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          width: `${walkCharacterSize}%`,
          transform: `translate(-50%, -95%)${flip ? " scaleX(-1)" : ""}`,
          willChange: "left, top",
          zIndex: 20,
          display: isWalking ? "grid" : "none",
        }}
      >
        {WALK_IMAGES.map((src) => (
          <img
            key={src}
            src={src}
            alt="Player character"
            className="w-full h-auto"
            style={{
              gridArea: "1 / 1",
              imageRendering: "pixelated",
              visibility: src === walkFrameSrc ? "visible" : "hidden",
            }}
            draggable={false}
          />
        ))}
      </div>

      {/* Interaction prompt */}
      {nearHotspot && (
        <div
          className="absolute font-pixel text-[9px] text-warm bg-background/90 px-2 py-1 rounded border border-primary/40 z-30 animate-float"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y - 2}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          Press ENTER
        </div>
      )}

      {/* Shadow */}
      <div
        className="absolute rounded-full bg-black/25 pointer-events-none"
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          width: "5%",
          height: "1.5%",
          transform: "translate(-50%, -50%)",
          zIndex: 19,
        }}
      />
    </>
  );
};

export default PixelCharacter;
