import { useState, useRef, useCallback } from "react";
import roomDefault from "@/assets/room.png";
import roomSunny from "@/assets/room_sunny.png";
import roomRainy from "@/assets/room_rainy.png";
import roomSnowy from "@/assets/room_snowy.png";
import roomRgb from "@/assets/room_rgb.png";
import chairImage from "@/assets/beanbagchair .png";
import tvImage from "@/assets/tv.png";
import Hotspot from "./Hotspot";
import EducationDialog from "./EducationDialog";
import TVScreen from "./TVScreen";
import DesktopShell from "./DesktopShell/DesktopShell";
import PixelCharacter, { OBSTACLES, BOUNDS, POLY_OBSTACLES } from "./PixelCharacter";
import CollisionEditor, { type FurnitureItem } from "./CollisionEditor";
import RoomTheme, { type RoomThemeId, getThemeFilter } from "./RoomTheme";

type Section = "education" | "tv" | "computer" | "bed" | null;

const ROOM_IMAGES: Record<RoomThemeId, string> = {
  default: roomDefault,
  sunny: roomSunny,
  rainy: roomRainy,
  snowy: roomSnowy,
  rgb: roomRgb,
};

const INITIAL_FURNITURE: FurnitureItem[] = [
  { id: "tv", label: "TV & Console", left: 0, top: 61, width: 17, src: tvImage },
  { id: "chair", label: "Bean Bag Chair", left: 4.4, top: 68.4, width: 30, src: chairImage },
];

interface GameRoomProps {
  theme?: RoomThemeId;
}

const GameRoom = ({ theme = "default" }: GameRoomProps) => {
  const [activeSection, setActiveSection] = useState<Section>(null);
  const [nearHotspot, setNearHotspot] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showTV, setShowTV] = useState(false);
  const [showDesktop, setShowDesktop] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [isDesktopZooming, setIsDesktopZooming] = useState(false);
  const [spriteSize, setSpriteSize] = useState(20);
  const [walkSpriteSize, setWalkSpriteSize] = useState(8.9);
  const [furniture, setFurniture] = useState<FurnitureItem[]>(INITIAL_FURNITURE);
  const [pendingGameLaunch, setPendingGameLaunch] = useState<string | null>(null);
  const [isSleeping, setIsSleeping] = useState(false);
  const [sleepPhase, setSleepPhase] = useState<"off" | "fading" | "dark" | "waking">("off");
  const containerRef = useRef<HTMLDivElement>(null);

  const handleHotspot = (name: string) => {
    if (name === "tv") {
      setIsZooming(true);
      setTimeout(() => {
        setShowTV(true);
      }, 700);
      return;
    }
    if (name === "computer") {
      setIsDesktopZooming(true);
      setTimeout(() => {
        setShowDesktop(true);
      }, 700);
      return;
    }
    if (name === "bed") {
      // Trigger sleep sequence: mount overlay transparent, then darken
      setIsSleeping(true);
      setSleepPhase("fading");
      // Delay the dark phase so the CSS transition actually animates
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSleepPhase("dark");
        });
      });
      setTimeout(() => setSleepPhase("waking"), 3500);
      setTimeout(() => {
        setSleepPhase("off");
        setIsSleeping(false);
      }, 5200);
      return;
    }
    setActiveSection(name as Section);
  };

  const handleCloseTV = () => {
    setShowTV(false);
    setPendingGameLaunch(null);
    setTimeout(() => setIsZooming(false), 50);
  };

  const handleCloseDesktop = () => {
    setShowDesktop(false);
    setTimeout(() => setIsDesktopZooming(false), 50);
  };

  // Steam → TV bridge: launch a specific game on the TV
  const handleLaunchGame = useCallback((gameId: string) => {
    setShowDesktop(false);
    setIsDesktopZooming(false);
    setPendingGameLaunch(gameId);
    // Open TV with a slight delay for transition
    setTimeout(() => {
      setIsZooming(true);
      setTimeout(() => setShowTV(true), 700);
    }, 300);
  }, []);

  const isFrozen = isZooming || showTV || isDesktopZooming || showDesktop || isSleeping;

  return (
    <div className="relative w-full max-w-4xl mx-auto select-none">
      {/* Room Image — zoom container */}
      <div
        className="relative transition-all duration-700 ease-in-out"
        ref={containerRef}
        style={{
          opacity: isZooming || isDesktopZooming ? 0 : 1,
          transform: isZooming || isDesktopZooming ? "scale(1.1)" : "scale(1)",
        }}
      >
        <img
          src={ROOM_IMAGES[theme]}
          alt="Cozy pixel art room"
          className="w-full h-auto rounded-lg"
          draggable={false}
        />

        {/* Furniture items */}
        {furniture.map((item) => (
          <img
            key={item.id}
            src={item.src}
            alt={item.label}
            className="absolute pointer-events-none transition-[filter] duration-500"
            style={{
              left: `${item.left}%`,
              top: `${item.top}%`,
              width: `${item.width}%`,
              imageRendering: "pixelated" as const,
              zIndex: 10,
              filter: getThemeFilter(theme),
            }}
            draggable={false}
          />
        ))}

        {/* Room theme overlay (weather/lighting) */}
        <RoomTheme theme={theme} />

        {/* Hotspots - positioned relative to the image */}

        {/* Certificate / Education — polygon hotspot */}
        <Hotspot
          label="Education"
          polygonPoints="88.1,60.6 92.9,63.2 93.2,55.7 88.4,53.5"
          isGlowing={nearHotspot === "education"}
          onClick={() => setActiveSection("education")}
        />

        {/* TV & Console — polygon hotspot */}
        <Hotspot
          label="Play Games"
          polygonPoints="16.8,74 8.5,78.8 0.1,74 2.5,72.5 1.7,71.4 6,69 5.5,67.4 5.8,64.3 9.8,62.4 10.9,62.9 13.3,63.8 13.5,68.6 14.5,69.5 14.6,72.7"
          isGlowing={nearHotspot === "tv"}
          onClick={() => handleHotspot("tv")}
        />

        {/* Computer Desk — polygon hotspot */}
        <Hotspot
          label="Desktop"
          polygonPoints="51,54.8 48.2,53.3 43.5,55.9 45.5,57.6 42.2,55.2 46.5,53.3 46.5,46.9 44.8,45.7 44.3,45.9 43.3,45.1 39.6,47.2 38.4,48.2 38.4,52.6 42.2,55.4 45.8,57.5"
          isGlowing={nearHotspot === "computer"}
          onClick={() => handleHotspot("computer")}
        />

        {/* Bed — polygon hotspot */}
        <Hotspot
          label="Sleep"
          polygonPoints="78.6,69.9 63.8,61.1 64.2,51.9 73.6,47.9 86.4,54.9 86.4,66.1"
          isGlowing={nearHotspot === "bed"}
          onClick={() => handleHotspot("bed")}
        />

        {/* Player Character */}
        <PixelCharacter containerRef={containerRef} onReachHotspot={handleHotspot} onNearHotspot={setNearHotspot} characterSize={spriteSize} walkCharacterSize={walkSpriteSize} frozen={isFrozen} />
      </div>

      {/* Education Dialog */}
      <EducationDialog
        open={activeSection === "education"}
        onOpenChange={(o) => !o && setActiveSection(null)}
      />

      {/* TV Screen overlay */}
      <TVScreen open={showTV} onClose={handleCloseTV} initialGame={pendingGameLaunch} />

      {/* Desktop Shell overlay */}
      <DesktopShell open={showDesktop} onClose={handleCloseDesktop} onLaunchGame={handleLaunchGame} />

      {/* Sleep / Blackout overlay */}
      {sleepPhase !== "off" && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
          style={{
            backgroundColor:
              sleepPhase === "dark" ? "rgba(0,0,0,0.95)" : "rgba(0,0,0,0)",
            transition: "background-color 1.5s ease-in-out",
          }}
        >
          {sleepPhase === "dark" && (
            <div
              className="flex flex-col items-center gap-3 animate-float"
              style={{ animation: "fadeIn 0.8s ease-out, float 3s ease-in-out infinite" }}
            >
              <span className="font-pixel text-4xl text-primary/80" style={{ textShadow: "0 0 20px hsl(25 55% 45% / 0.6)" }}>💤</span>
              <span className="font-pixel text-lg text-warm/60" style={{ letterSpacing: "0.3em" }}>Z z z . . .</span>
            </div>
          )}
        </div>
      )}

      {/* Editor toggle — dev only */}
      {import.meta.env.DEV && (
        <button
          onClick={() => setShowEditor(true)}
          className="absolute top-2 right-2 z-40 px-2 py-1 text-[10px] font-pixel bg-primary text-primary-foreground rounded hover:opacity-90"
        >
          🔧 Edit Collisions
        </button>
      )}

      {/* Collision Editor — dev only */}
      {import.meta.env.DEV && showEditor && (
        <CollisionEditor
          obstacles={OBSTACLES}
          polygons={POLY_OBSTACLES.map((p, i) => ({ ...p, label: `Polygon ${i}` }))}
          bounds={BOUNDS}
          playerCollision={{ halfW: 6, heightFactor: 0.5 }}
          spriteSize={spriteSize}
          walkSpriteSize={walkSpriteSize}
          onSpriteSizeChange={setSpriteSize}
          onWalkSpriteSizeChange={setWalkSpriteSize}
          furniture={furniture}
          onFurnitureChange={setFurniture}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
};

export default GameRoom;
