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
  externalKeys?: Set<string>;
}

const SPEED = 0.8;
const CHARACTER_SIZE = 20;
const WALK_FRAME_DURATION = 150; // ms per frame

// Walkable floor area boundaries (percentage of image)
export const BOUNDS = {
  minX: 1,
  maxX: 97,
  minY: 59,
  maxY: 99,
};

// Obstacle collision boxes (rectangular)
export const OBSTACLES: { minX: number; maxX: number; minY: number; maxY: number }[] = [
  { minX: 37, maxX: 52, minY: 44, maxY: 58 }, // Bookshelf upper
  { minX: 60, maxX: 72, minY: 47, maxY: 57 }, // Music setup
  { minX: 18, maxX: 30, minY: 44, maxY: 59 }, // Skills shelf
];

// Polygon obstacle collision shapes (for angled/isometric objects)
export const POLY_OBSTACLES: { points: { x: number; y: number }[] }[] = [
  { points: [{x:88.1,y:60.6}, {x:92.9,y:63.2}, {x:93.2,y:55.7}, {x:88.4,y:53.5}] }, // certificate
  { points: [{x:78.6,y:69.9}, {x:63.8,y:61.1}, {x:64.2,y:51.9}, {x:73.6,y:47.9}, {x:86.4,y:54.9}, {x:86.4,y:66.1}] }, // bed
  { points: [{x:60.1,y:59.6}, {x:60.2,y:52.6}, {x:52.7,y:47.9}, {x:47.4,y:50.7}, {x:52.3,y:55.6}, {x:55,y:54.7}, {x:55,y:61.5}, {x:51.1,y:59.1}, {x:46.5,y:62.5}, {x:44.6,y:59.6}, {x:44.7,y:66.5}, {x:39.3,y:69.3}, {x:30.6,y:64.8}, {x:30.8,y:56.7}, {x:39.1,y:61.1}, {x:31.2,y:56.5}, {x:38.3,y:52.9}, {x:44.5,y:59.2}, {x:52.5,y:55.4}, {x:55.5,y:61.5}] }, // desk
  { points: [{x:31.1,y:65.6}, {x:27,y:65.7}, {x:26.7,y:55.1}, {x:30.7,y:55.1}] }, // plant
  { points: [{x:26.4,y:65.5}, {x:18.3,y:70}, {x:14.1,y:68.9}, {x:14.5,y:43.5}, {x:27,y:37.8}, {x:29.9,y:39.4}, {x:30.2,y:54.5}] }, // shelf
  { points: [{x:16.8,y:74}, {x:8.5,y:78.8}, {x:0.1,y:74}, {x:2.5,y:72.5}, {x:1.7,y:71.4}, {x:6,y:69}, {x:5.5,y:67.4}, {x:5.8,y:64.3}, {x:9.8,y:62.4}, {x:10.9,y:62.9}, {x:13.3,y:63.8}, {x:13.5,y:68.6}, {x:14.5,y:69.5}, {x:14.6,y:72.7}] }, // tv
  { points: [{x:15.3,y:77.2}, {x:17.4,y:76.1}, {x:18.5,y:76.3}, {x:18.9,y:75.2}, {x:20,y:74.2}, {x:21.4,y:73.5}, {x:23.2,y:73.3}, {x:24.6,y:74.1}, {x:25.9,y:76.3}, {x:26.4,y:78.8}, {x:25.9,y:80.7}, {x:24.8,y:82.4}, {x:22.7,y:83.4}, {x:20.7,y:83.5}, {x:18.7,y:83.5}, {x:16.6,y:82.9}, {x:14.9,y:82.1}, {x:13.9,y:80.8}, {x:13.7,y:79.2}] }, // chair
  { points: [{x:86.4,y:66}, {x:97.2,y:71.7}, {x:97.4,y:59.5}, {x:86.2,y:59}] }, // wall right
  { points: [{x:53.3,y:60.6}, {x:44.8,y:64.8}, {x:45,y:60.1}] }, // desk corner
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
  { name: "education", x: 85, y: 67, radius: 10, label: "🎓 Education" },
  { name: "tv", x: 9, y: 75, radius: 10, label: "🎮 TV" },
  { name: "computer", x: 48, y: 68, radius: 10, label: "💻 Desktop" },
  { name: "bed", x: 75, y: 72, radius: 10, label: "🛏️ Sleep" },
  { name: "music", x: 66, y: 60, radius: 8, label: "🎵 Music" },
  { name: "skills", x: 24, y: 62, radius: 8, label: "🛠️ Skills" },
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

const PixelCharacter = ({ containerRef, onReachHotspot, onNearHotspot, characterSize = CHARACTER_SIZE, walkCharacterSize = CHARACTER_SIZE, frozen = false, externalKeys }: PixelCharacterProps) => {
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

  // Keyboard input — skip when frozen so WASD works in Terminal/other apps
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (frozen) return; // Don't capture keys while Desktop Shell is open
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
  }, [nearHotspot, onReachHotspot, frozen]);

  // Game loop
  useEffect(() => {
    let lastTime = 0;
    const gameLoop = (time: number) => {
      if (time - lastTime > 16) {
        lastTime = time;
        const keys = keysRef.current;
        // Merge external (touch) keys
        const allKeys = new Set(keys);
        if (externalKeys) externalKeys.forEach(k => allKeys.add(k));
        let dx = 0,
          dy = 0;

        if (!frozen && (allKeys.has("ArrowLeft") || allKeys.has("a"))) {
          dx -= SPEED;
          setDirection("left");
        }
        if (!frozen && (allKeys.has("ArrowRight") || allKeys.has("d"))) {
          dx += SPEED;
          setDirection("right");
        }
        if (!frozen && (allKeys.has("ArrowUp") || allKeys.has("w"))) {
          dy -= SPEED;
          setDirection("up");
        }
        if (!frozen && (allKeys.has("ArrowDown") || allKeys.has("s"))) {
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
          className="absolute font-pixel text-[9px] text-warm bg-background/90 px-3 py-1.5 rounded border border-primary/40 z-30 animate-float flex flex-col items-center gap-0.5"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y - 2}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <span className="text-primary text-[10px]">{HOTSPOT_ZONES.find(z => z.name === nearHotspot)?.label ?? nearHotspot}</span>
          <span className="text-[8px] opacity-70">Press ENTER</span>
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
