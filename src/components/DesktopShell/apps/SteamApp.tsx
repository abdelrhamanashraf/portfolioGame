import { useState } from "react";

interface SteamAppProps {
  onLaunchGame?: (gameId: string) => void;
}

const GAMES = [
  {
    id: "space-shooter",
    name: "Space Shooter",
    icon: "🚀",
    description: "Defend the galaxy from waves of alien invaders! Classic arcade action with retro pixel graphics.",
    tags: ["Arcade", "Shooter", "Retro"],
    playTime: "2.4 hrs",
    lastPlayed: "Today",
    color: "#0ff",
  },
  {
    id: "snake",
    name: "Snake",
    icon: "🐍",
    description: "The classic snake game! Eat food, grow longer, and avoid hitting yourself. Speed increases as you score.",
    tags: ["Classic", "Puzzle", "Casual"],
    playTime: "1.8 hrs",
    lastPlayed: "Yesterday",
    color: "#0f8",
  },
  {
    id: "pong",
    name: "Pong",
    icon: "🏓",
    description: "Challenge the AI in this timeless table tennis game. Control your paddle and be the first to score 7!",
    tags: ["Sports", "Classic", "PvE"],
    playTime: "0.9 hrs",
    lastPlayed: "3 days ago",
    color: "#ff0",
  },
];

const SteamApp = ({ onLaunchGame }: SteamAppProps) => {
  const [selectedGame, setSelectedGame] = useState(0);
  const game = GAMES[selectedGame];

  return (
    <div className="w-full h-full flex" style={{ background: "#1b2838", color: "#c7d5e0", fontFamily: "'VT323', monospace" }}>
      {/* Library sidebar */}
      <div className="w-48 flex-shrink-0 flex flex-col" style={{ background: "#171a21", borderRight: "1px solid #2a475e" }}>
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: "#8f98a0" }}>
          🎮 Library
        </div>
        {GAMES.map((g, i) => (
          <button
            key={g.id}
            onClick={() => setSelectedGame(i)}
            className="w-full text-left px-3 py-2 text-[13px] flex items-center gap-2 transition-colors"
            style={{
              background: i === selectedGame ? "#2a475e" : "transparent",
              color: i === selectedGame ? "#fff" : "#8f98a0",
              borderLeft: i === selectedGame ? "3px solid #1a9fff" : "3px solid transparent",
            }}
          >
            <span>{g.icon}</span>
            <span className="truncate">{g.name}</span>
          </button>
        ))}
        <div className="flex-1" />
        <div className="px-3 py-2 text-[10px]" style={{ color: "#556677" }}>
          3 games installed
        </div>
      </div>

      {/* Game detail */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Hero banner */}
        <div className="h-32 relative flex items-end p-4" style={{
          background: `linear-gradient(135deg, ${game.color}15 0%, #1b283800 50%), linear-gradient(180deg, #1b2838 0%, #0a1520 100%)`,
        }}>
          <div className="absolute top-3 right-3 text-6xl opacity-20">{game.icon}</div>
          <div>
            <h2 className="font-pixel text-base mb-1" style={{ color: game.color }}>{game.name}</h2>
            <div className="flex gap-2">
              {game.tags.map(t => (
                <span key={t} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "#2a475e", color: "#8f98a0" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <p className="text-sm leading-relaxed">{game.description}</p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 rounded" style={{ background: "#2a475e33" }}>
              <div className="text-[10px]" style={{ color: "#8f98a0" }}>Play Time</div>
              <div className="text-sm font-bold">{game.playTime}</div>
            </div>
            <div className="p-2 rounded" style={{ background: "#2a475e33" }}>
              <div className="text-[10px]" style={{ color: "#8f98a0" }}>Last Played</div>
              <div className="text-sm font-bold">{game.lastPlayed}</div>
            </div>
          </div>

          {/* Play button */}
          <button
            onClick={() => onLaunchGame?.(game.id)}
            className="w-full py-2.5 rounded font-pixel text-sm transition-all hover:brightness-110 active:scale-[0.98]"
            style={{
              background: "linear-gradient(180deg, #5ba32b 0%, #4a8a23 100%)",
              color: "#d2efa9",
              border: "1px solid #6cc040",
              boxShadow: "0 0 10px rgba(91,163,43,0.3)",
            }}
          >
            ▶ PLAY
          </button>
        </div>
      </div>
    </div>
  );
};

export default SteamApp;
