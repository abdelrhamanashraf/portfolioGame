import { useState } from "react";
import steamBanner from "@/assets/steam_banner.png";

interface SteamAppProps {
  onLaunchGame?: (gameId: string) => void;
}

const FAVORITES = [
  { id: "space-shooter", name: "Space Shooter", icon: "🚀", color: "#0ff" },
  { id: "snake", name: "Snake", icon: "🐍", color: "#0f8" },
  { id: "pong", name: "Pong", icon: "🏓", color: "#ff0" },
];

const UNCATEGORIZED = [
  { name: "Pixel Quest", icon: "⚔️" },
  { name: "RetroChat Online", icon: "💬" },
  { name: "CodeForge IDE", icon: "🔧" },
  { name: "Dungeon Crawler", icon: "🏰" },
  { name: "Neon Racer", icon: "🏎️" },
  { name: "Star Commander", icon: "⭐" },
  { name: "Puzzle Master", icon: "🧩" },
  { name: "Bit Blaster", icon: "💥" },
];

const GAME_DETAILS: Record<string, { desc: string; playTime: string; lastPlayed: string; achievements: string }> = {
  "space-shooter": { desc: "Defend the galaxy from waves of alien invaders!", playTime: "2.4 hrs", lastPlayed: "Today", achievements: "5/12" },
  snake: { desc: "Classic snake — eat, grow, survive!", playTime: "1.8 hrs", lastPlayed: "Yesterday", achievements: "3/8" },
  pong: { desc: "Challenge the AI in retro table tennis.", playTime: "0.9 hrs", lastPlayed: "3 days ago", achievements: "2/6" },
};

const NAV_TABS = ["STORE", "LIBRARY", "COMMUNITY"];
const DETAIL_TABS = ["Store Page", "Community Hub", "Discussions", "Guides", "Workshop"];

const SteamApp = ({ onLaunchGame }: SteamAppProps) => {
  const [selectedGame, setSelectedGame] = useState("space-shooter");
  const [activeNav, setActiveNav] = useState("LIBRARY");
  const [activeDetailTab, setActiveDetailTab] = useState("Store Page");
  const detail = GAME_DETAILS[selectedGame];
  const game = FAVORITES.find(g => g.id === selectedGame)!;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: "#1b2838", color: "#c7d5e0", fontFamily: "'VT323', monospace", fontSize: "13px" }}>

      {/* ── Top Menu Bar ── */}
      <div className="flex items-center px-2 py-0.5 gap-4" style={{ background: "#171a21", fontSize: "11px", color: "#8f98a0" }}>
        <span className="hover:text-white cursor-pointer transition-colors">Steam</span>
        <span className="hover:text-white cursor-pointer transition-colors">View</span>
        <span className="hover:text-white cursor-pointer transition-colors">Friends</span>
        <span className="hover:text-white cursor-pointer transition-colors">Games</span>
        <span className="hover:text-white cursor-pointer transition-colors">Help</span>
        <div className="flex-1" />
        <span style={{ color: "#57cbde" }}>👤 Player</span>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="flex items-center px-3 gap-4 py-1" style={{ background: "#171a21", borderBottom: "1px solid #2a475e" }}>
        <span style={{ color: "#8f98a0", cursor: "pointer", fontSize: "16px" }}>← →</span>
        {NAV_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveNav(tab)}
            className="transition-colors"
            style={{
              color: activeNav === tab ? "#fff" : "#8f98a0",
              fontWeight: activeNav === tab ? "bold" : "normal",
              fontSize: "14px",
              textDecoration: activeNav === tab ? "none" : "none",
              borderBottom: activeNav === tab ? "2px solid #57cbde" : "2px solid transparent",
              paddingBottom: "2px",
            }}
          >
            {tab}
          </button>
        ))}
        <div className="flex-1" />
        <span style={{ color: "#8f98a0", fontSize: "12px" }}>👤 Player ▾</span>
      </div>

      {/* ── Main Content ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left Sidebar: Game List ── */}
        <div className="w-52 flex-shrink-0 flex flex-col overflow-y-auto" style={{ background: "#1b2838", borderRight: "1px solid #2a475e" }}>
          {/* HOME button */}
          <div className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-[#2a475e33] transition-colors" style={{ borderBottom: "1px solid #2a475e44" }}>
            <span style={{ fontSize: "16px" }}>🏠</span>
            <span style={{ color: "#fff", fontSize: "13px" }}>HOME</span>
          </div>

          {/* Search */}
          <div className="px-2 py-1.5">
            <div className="flex items-center px-2 py-1 rounded-sm" style={{ background: "#316282", border: "1px solid #4a7a9b" }}>
              <span style={{ color: "#8f98a0", fontSize: "11px" }}>🔍</span>
              <span className="ml-1.5" style={{ color: "#8f98a080", fontSize: "11px" }}>Search...</span>
            </div>
          </div>

          {/* FAVORITES */}
          <div className="px-3 py-1" style={{ fontSize: "10px", color: "#8f98a0", letterSpacing: "0.5px" }}>
            — FAVORITES ({FAVORITES.length})
          </div>
          {FAVORITES.map(g => (
            <button
              key={g.id}
              onClick={() => setSelectedGame(g.id)}
              className="w-full text-left px-3 py-1 flex items-center gap-2 transition-colors"
              style={{
                background: selectedGame === g.id ? "#2a475e" : "transparent",
                color: selectedGame === g.id ? "#fff" : "#8f98a0",
                borderLeft: selectedGame === g.id ? "3px solid #57cbde" : "3px solid transparent",
              }}
            >
              <span>{g.icon}</span>
              <span className="truncate" style={{ fontSize: "12px" }}>{g.name}</span>
            </button>
          ))}

          {/* UNCATEGORIZED */}
          <div className="px-3 py-1 mt-1" style={{ fontSize: "10px", color: "#8f98a0" }}>
            — UNCATEGORIZED ({UNCATEGORIZED.length})
          </div>
          {UNCATEGORIZED.map(g => (
            <div
              key={g.name}
              className="px-3 py-1 flex items-center gap-2 cursor-pointer hover:bg-[#2a475e33] transition-colors"
              style={{ color: "#8f98a0" }}
            >
              <span>{g.icon}</span>
              <span className="truncate" style={{ fontSize: "12px" }}>{g.name}</span>
            </div>
          ))}

          <div className="flex-1" />
          <div className="px-3 py-1.5 flex items-center gap-1 cursor-pointer" style={{ color: "#8f98a0", fontSize: "11px", borderTop: "1px solid #2a475e44" }}>
            <span>＋</span> ADD A GAME
          </div>
        </div>

        {/* ── Right Panel: Game Detail ── */}
        <div className="flex-1 flex flex-col overflow-y-auto" style={{ background: "#1b2838" }}>

          {/* Hero Banner Image */}
          <div className="relative" style={{ height: "140px" }}>
            <img
              src={steamBanner}
              alt="Game banner"
              className="w-full h-full object-cover"
              style={{ imageRendering: "pixelated" }}
              draggable={false}
            />
            {/* Game title overlay */}
            <div className="absolute bottom-2 left-4" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
              <h2 style={{ fontSize: "22px", color: "#fff", fontFamily: "'Press Start 2P', monospace", letterSpacing: "2px" }}>{game.name}</h2>
            </div>
          </div>

          {/* Install/Play row */}
          <div className="flex items-center gap-4 px-4 py-2" style={{ background: "#1b283899", borderBottom: "1px solid #2a475e44" }}>
            {/* PLAY button */}
            <button
              onClick={() => onLaunchGame?.(selectedGame)}
              className="px-6 py-1.5 transition-all hover:brightness-110 active:scale-95"
              style={{
                background: "linear-gradient(180deg, #5ba32b 0%, #4a8a23 100%)",
                color: "#d2efa9",
                border: "1px solid #6cc040",
                fontSize: "14px",
                fontWeight: "bold",
                letterSpacing: "1px",
              }}
            >
              ▶ PLAY
            </button>

            {/* Stats */}
            <div className="flex items-center gap-4" style={{ fontSize: "11px" }}>
              <div>
                <div style={{ color: "#8f98a0", fontSize: "9px" }}>LAST PLAYED</div>
                <div style={{ color: "#fff" }}>{detail.lastPlayed}</div>
              </div>
              <div>
                <div style={{ color: "#8f98a0", fontSize: "9px" }}>PLAY TIME</div>
                <div style={{ color: "#fff" }}>{detail.playTime}</div>
              </div>
              <div>
                <div style={{ color: "#8f98a0", fontSize: "9px" }}>ACHIEVEMENTS</div>
                <div className="flex items-center gap-1">
                  <span style={{ color: "#fff" }}>{detail.achievements}</span>
                  <div className="h-1.5 w-12 rounded-full overflow-hidden" style={{ background: "#1b2838" }}>
                    <div className="h-full rounded-full" style={{ background: "#57cbde", width: "40%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detail tabs */}
          <div className="flex items-center px-4 gap-3 py-1.5" style={{ borderBottom: "1px solid #2a475e44" }}>
            {DETAIL_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveDetailTab(tab)}
                className="transition-colors"
                style={{
                  color: activeDetailTab === tab ? "#fff" : "#8f98a0",
                  fontSize: "11px",
                  borderBottom: activeDetailTab === tab ? "2px solid #57cbde" : "2px solid transparent",
                  paddingBottom: "2px",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Activity area */}
          <div className="flex-1 p-4">
            <div style={{ color: "#8f98a0", fontSize: "12px", fontWeight: "bold", letterSpacing: "1px", marginBottom: "8px" }}>
              ACTIVITY
            </div>
            {/* Activity post box */}
            <div className="px-3 py-2 mb-3" style={{ background: "#2a475e33", border: "1px solid #2a475e55", color: "#8f98a066" }}>
              <span style={{ fontSize: "12px", fontStyle: "italic" }}>Say something about this game to your friends...</span>
            </div>
            {/* Activity entry */}
            <div style={{ color: "#8f98a0", fontSize: "11px", marginBottom: "6px", letterSpacing: "0.5px" }}>RECENT</div>
            <div className="p-3 flex gap-3" style={{ background: "#2a475e22", border: "1px solid #2a475e33" }}>
              <div className="w-16 h-16 flex items-center justify-center flex-shrink-0 text-3xl" style={{ background: "#0a1520" }}>
                {game.icon}
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#57cbde" }}>Achievement Unlocked!</div>
                <div style={{ fontSize: "11px", color: "#fff", marginTop: "2px" }}>First Steps — Complete the tutorial</div>
                <div style={{ fontSize: "10px", color: "#8f98a0", marginTop: "4px" }}>{detail.lastPlayed} • {detail.playTime} on record</div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between px-4 py-1" style={{ background: "#171a21", fontSize: "10px", color: "#8f98a0", borderTop: "1px solid #2a475e44" }}>
            <span>DOWNLOADS: 0 of 0 Items</span>
            <span>FRIENDS & CHAT 👥</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SteamApp;
