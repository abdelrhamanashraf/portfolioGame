import { useState, useRef, useCallback } from "react";
import roomImage from "@/assets/room.png";
import chairImage from "@/assets/beanbagchair .png";
import tvImage from "@/assets/tv.png";
import Hotspot from "./Hotspot";
import EducationDialog from "./EducationDialog";
import TVScreen from "./TVScreen";
import DesktopShell from "./DesktopShell/DesktopShell";
import PixelCharacter, { OBSTACLES, BOUNDS, POLY_OBSTACLES } from "./PixelCharacter";
import CollisionEditor, { type FurnitureItem } from "./CollisionEditor";

type Section = "education" | "tv" | "computer" | null;

const INITIAL_FURNITURE: FurnitureItem[] = [
  { id: "tv", label: "TV & Console", left: 0, top: 61, width: 17, src: tvImage },
  { id: "chair", label: "Bean Bag Chair", left: 4.4, top: 68.4, width: 30, src: chairImage },
];

const GameRoom = () => {
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

  const isFrozen = isZooming || showTV || isDesktopZooming || showDesktop;

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
          src={roomImage}
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
            className="absolute pointer-events-none"
            style={{
              left: `${item.left}%`,
              top: `${item.top}%`,
              width: `${item.width}%`,
              imageRendering: "pixelated" as const,
              zIndex: 10,
            }}
            draggable={false}
          />
        ))}

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
          polygonPoints="38.3,52.9 44.5,59.2 52.5,55.4 55,54.7 55,61.5 60.1,59.6 60.2,52.6 52.7,47.9 47.4,50.7"
          isGlowing={nearHotspot === "computer"}
          onClick={() => handleHotspot("computer")}
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
