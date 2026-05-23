import { useState, useRef } from "react";
import roomImage from "@/assets/room.png";
import chairImage from "@/assets/chair.png";
import tvImage from "@/assets/tv.png";
import Hotspot from "./Hotspot";
import InfoDialog from "./InfoDialog";
import EducationDialog from "./EducationDialog";
import TVScreen from "./TVScreen";
import PixelCharacter, { OBSTACLES, BOUNDS, POLY_OBSTACLES } from "./PixelCharacter";
import CollisionEditor, { type FurnitureItem } from "./CollisionEditor";

type Section = "about" | "projects" | "skills" | "contact" | "education" | "tv" | null;

const INITIAL_FURNITURE: FurnitureItem[] = [
  { id: "tv", label: "TV & Console", left: 0, top: 58, width: 10, src: tvImage },
  { id: "chair", label: "Bean Bag Chair", left: 17, top: 73, width: 6, src: chairImage },
];

const GameRoom = () => {
  const [activeSection, setActiveSection] = useState<Section>(null);
  const [nearHotspot, setNearHotspot] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showTV, setShowTV] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [spriteSize, setSpriteSize] = useState(20);
  const [walkSpriteSize, setWalkSpriteSize] = useState(8.9);
  const [furniture, setFurniture] = useState<FurnitureItem[]>(INITIAL_FURNITURE);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleHotspot = (name: string) => {
    if (name === "tv") {
      // Smooth zoom into TV, then open TV screen
      setIsZooming(true);
      setTimeout(() => {
        setShowTV(true);
      }, 700);
      return;
    }
    setActiveSection(name as Section);
  };

  const handleCloseTV = () => {
    setShowTV(false);
    setTimeout(() => setIsZooming(false), 50);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto select-none">
      {/* Room Image — zoom container */}
      <div
        className="relative transition-all duration-700 ease-in-out"
        ref={containerRef}
        style={{
          opacity: isZooming ? 0 : 1,
          transform: isZooming ? "scale(1.1)" : "scale(1)",
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
        {/* Computer / About Me */}
        <Hotspot
          label="About Me"
          top="38%"
          left="32%"
          width="10%"
          height="14%"
          isGlowing={nearHotspot === "about"}
          onClick={() => setActiveSection("about")}
        />

        {/* Bookshelf / Skills */}
        <Hotspot
          label="Skills"
          top="18%"
          left="12%"
          width="12%"
          height="42%"
          isGlowing={nearHotspot === "skills"}
          onClick={() => setActiveSection("skills")}
        />

        {/* Wall Frames / Projects */}
        <Hotspot
          label="Projects"
          top="20%"
          left="66%"
          width="16%"
          height="22%"
          isGlowing={nearHotspot === "projects"}
          onClick={() => setActiveSection("projects")}
        />

        {/* Bed / Contact */}
        <Hotspot
          label="Contact"
          top="42%"
          left="62%"
          width="16%"
          height="18%"
          isGlowing={nearHotspot === "contact"}
          onClick={() => setActiveSection("contact")}
        />

        {/* Certificate / Education — polygon hotspot matches isometric shape */}
        <Hotspot
          label="Education"
          polygonPoints="94.2,50.6 93.9,58.6 87.7,55.9 87.8,47.3"
          isGlowing={nearHotspot === "education"}
          onClick={() => setActiveSection("education")}
        />

        {/* TV & Console */}
        <Hotspot
          label="Play Games"
          top="62%"
          left="1%"
          width="16%"
          height="22%"
          isGlowing={nearHotspot === "tv"}
          onClick={() => handleHotspot("tv")}
        />

        {/* Player Character */}
        <PixelCharacter containerRef={containerRef} onReachHotspot={handleHotspot} onNearHotspot={setNearHotspot} characterSize={spriteSize} walkCharacterSize={walkSpriteSize} frozen={isZooming || showTV} />
      </div>

      {/* Dialogs */}
      <InfoDialog
        open={activeSection === "about"}
        onOpenChange={(o) => !o && setActiveSection(null)}
        title="ABOUT ME"
        icon="🖥️"
      >
        <p>Hey there! I'm a developer who loves building cool things.</p>
        <p>I work with modern web technologies and have a passion for creating interactive, pixel-perfect experiences.</p>
        <div className="flex gap-2 flex-wrap mt-2">
          <span className="bg-primary/20 text-primary px-3 py-1 rounded font-pixel text-[10px]">React</span>
          <span className="bg-primary/20 text-primary px-3 py-1 rounded font-pixel text-[10px]">TypeScript</span>
          <span className="bg-primary/20 text-primary px-3 py-1 rounded font-pixel text-[10px]">Node.js</span>
        </div>
      </InfoDialog>

      <InfoDialog
        open={activeSection === "skills"}
        onOpenChange={(o) => !o && setActiveSection(null)}
        title="SKILLS"
        icon="📚"
      >
        <div className="space-y-3">
          {[
            { name: "Frontend", level: 90, icon: "⚡" },
            { name: "Backend", level: 75, icon: "🔧" },
            { name: "Design", level: 70, icon: "🎨" },
            { name: "DevOps", level: 60, icon: "☁️" },
          ].map((skill) => (
            <div key={skill.name}>
              <div className="flex justify-between mb-1">
                <span>{skill.icon} {skill.name}</span>
                <span className="text-muted-foreground">{skill.level}%</span>
              </div>
              <div className="h-3 bg-muted rounded-sm overflow-hidden">
                <div
                  className="h-full bg-primary rounded-sm transition-all duration-1000"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </InfoDialog>

      <InfoDialog
        open={activeSection === "projects"}
        onOpenChange={(o) => !o && setActiveSection(null)}
        title="PROJECTS"
        icon="🖼️"
      >
        <div className="space-y-4">
          {[
            { name: "Pixel Quest", desc: "A 2D adventure game built with Canvas API", tech: "JS • Canvas", url: "#" },
            { name: "RetroChat", desc: "Real-time chat app with retro aesthetics", tech: "React • WebSocket", url: "#" },
            { name: "CodeForge", desc: "Online code editor with live preview", tech: "TS • Monaco", url: "#" },
          ].map((project) => (
            <a key={project.name} href={project.url} target="_blank" rel="noopener noreferrer" className="block bg-muted/50 p-3 rounded border border-border hover:border-primary/50 transition-colors cursor-pointer">
              <h3 className="font-pixel text-[11px] text-primary">{project.name}</h3>
              <p className="text-muted-foreground text-base mt-1">{project.desc}</p>
              <span className="text-[10px] font-pixel text-accent mt-1 inline-block">{project.tech}</span>
            </a>
          ))}
        </div>
      </InfoDialog>

      <InfoDialog
        open={activeSection === "contact"}
        onOpenChange={(o) => !o && setActiveSection(null)}
        title="CONTACT"
        icon="💤"
      >
        <p>Let's connect! Feel free to reach out.</p>
        <div className="space-y-2 mt-2">
          {[
            { icon: "📧", label: "hello@developer.dev", url: "mailto:hello@developer.dev" },
            { icon: "🐙", label: "github.com/developer", url: "https://github.com/developer" },
            { icon: "🐦", label: "@developer", url: "https://twitter.com/developer" },
          ].map((contact) => (
            <a key={contact.label} href={contact.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-muted/50 p-2 rounded border border-border hover:border-primary/50 transition-colors cursor-pointer">
              <span className="text-xl">{contact.icon}</span>
              <span>{contact.label}</span>
            </a>
          ))}
        </div>
      </InfoDialog>

      {/* Education Dialog */}
      <EducationDialog
        open={activeSection === "education"}
        onOpenChange={(o) => !o && setActiveSection(null)}
      />

      {/* TV Screen overlay */}
      <TVScreen open={showTV} onClose={handleCloseTV} />

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
          polygons={POLY_OBSTACLES}
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
