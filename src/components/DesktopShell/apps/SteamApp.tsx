import { useState, useEffect } from "react";
import steamBanner from "@/assets/steam_banner.png";
import avatar from "@/assets/discord_avatar.png";

// Import user-provided splash arts
import art7Days from "@/assets/7days2dieart.jpg";
import artCS2 from "@/assets/cs2art.jfif";
import artFvF from "@/assets/friendsvsfriendsart.jfif";
import artGunfire from "@/assets/gunfireart.jpg";
import artLN from "@/assets/littlenightmareart.jpg";
import artPartyAnimals from "@/assets/party animalart.jfif";
import artPummelParty from "@/assets/pummelpartyart.png";
import artWWHF from "@/assets/wewerehereforeverart.jfif";

// Import icons
import icon7Days from "@/assets/7days2dieicon.jfif";
import iconFvF from "@/assets/friendvsfriendsicon.png";
import iconGunfire from "@/assets/gunfireicon.png";
import iconLN from "@/assets/littlenightmereicon.png";
import iconPartyAnimals from "@/assets/partyanimalicon.png";
import iconWWHF from "@/assets/wewerehereicon.jfif";

interface SteamAppProps {
  onLaunchGame?: (gameId: string) => void;
}

const FAVORITES = [
  { id: "cs2", name: "Counter-Strike 2", banner: artCS2, icon: artCS2, installed: false, size: 63510, lastPlayed: "May 26, 2025", playTime: "488.9 hours", achievements: "1/1" },
  { id: "fvsf", name: "Friends vs Friends", banner: artFvF, icon: iconFvF, installed: false, size: 15000, lastPlayed: "May 20, 2025", playTime: "4 hours", achievements: "3/10" },
  { id: "party", name: "Party Animals", banner: artPartyAnimals, icon: iconPartyAnimals, installed: false, size: 8000, lastPlayed: "May 15, 2025", playTime: "2 hours", achievements: "2/5" },
  { id: "wwhf", name: "We Were Here Forever", banner: artWWHF, icon: iconWWHF, installed: false, size: 25000, lastPlayed: "May 1, 2025", playTime: "10 hours", achievements: "5/12" },
];

const MAYBE = [
  { id: "ln1", name: "Little Nightmares", banner: artLN, icon: iconLN, installed: false, size: 10000, lastPlayed: "Jan 10, 2024", playTime: "15 hours", achievements: "10/10" },
  { id: "gunfire", name: "Gunfire Reborn", banner: artGunfire, icon: iconGunfire, installed: false, size: 5000, lastPlayed: "Mar 15, 2024", playTime: "5 hours", achievements: "12/40" },
];

const UNCATEGORIZED = [
  { id: "7days", name: "7 Days to Die", banner: art7Days, icon: icon7Days, installed: false, size: 19380, lastPlayed: "Jul 29, 2024", playTime: "42 minutes", achievements: "1/43" },
  { id: "pummel", name: "Pummel Party", banner: artPummelParty, icon: artPummelParty, installed: false, size: 3000, lastPlayed: "Never", playTime: "0 hours", achievements: "0/0" },
];

const ALL_GAMES = [...FAVORITES, ...MAYBE, ...UNCATEGORIZED];
const NAV_TABS = ["STORE", "LIBRARY", "COMMUNITY", "くろセンセイ"];
const DETAIL_TABS = ["Store Page", "DLC", "Community Hub", "Points Shop", "Discussions", "Guides", "Workshop"];

const formatSize = (mb: number) => {
  if (mb >= 1024) return (mb / 1024).toFixed(2) + " GB";
  return mb + " MB";
};

const SteamApp = ({ onLaunchGame }: SteamAppProps) => {
  const [selectedGame, setSelectedGame] = useState("cs2");
  const [activeNav, setActiveNav] = useState("LIBRARY");
  const [activeDetailTab, setActiveDetailTab] = useState("Store Page");
  const [storeFeaturedIdx, setStoreFeaturedIdx] = useState(0);
  
  // Download Manager State
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0); // in MB
  const [downloadSpeed, setDownloadSpeed] = useState(0.2); // MB/s (very slow)
  const [isPaused, setIsPaused] = useState(false);

  // Store carousel auto-advance
  useEffect(() => {
    if (activeNav !== "STORE") return;
    const t = setInterval(() => setStoreFeaturedIdx(i => (i + 1) % ALL_GAMES.length), 5000);
    return () => clearInterval(t);
  }, [activeNav]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (downloadingId && !isPaused) {
      interval = setInterval(() => {
        setDownloadProgress(p => {
          const game = ALL_GAMES.find(g => g.id === downloadingId);
          if (!game) return p;
          
          // Randomize speed slightly
          const speed = 0.1 + Math.random() * 0.3; // 100KB/s to 400KB/s roughly
          setDownloadSpeed(speed);
          
          const newP = p + speed;
          if (newP >= game.size) {
            clearInterval(interval);
            setDownloadingId(null);
            return game.size;
          }
          return newP;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [downloadingId, isPaused]);

  const handleInstall = (id: string) => {
    if (downloadingId === id) return;
    setDownloadingId(id);
    setDownloadProgress(0);
    setIsPaused(false);
    setActiveNav("DOWNLOADS");
  };

  const game = ALL_GAMES.find(g => g.id === selectedGame)!;
  const isDownloading = downloadingId === selectedGame;
  const downloadGameData = ALL_GAMES.find(g => g.id === downloadingId);

  const renderGameList = (title: string, count: number, list: typeof ALL_GAMES) => (
    <>
      <div className="px-3 py-1 mt-2 flex items-center group cursor-pointer" style={{ fontSize: "11px", color: "#8f98a0", fontWeight: "bold", letterSpacing: "0.5px" }}>
        <span className="w-4 text-center">▼</span> 
        <span className="group-hover:text-white uppercase">{title} ({count})</span>
      </div>
      {list.map(g => (
        <button
          key={g.id}
          onClick={() => setSelectedGame(g.id)}
          className="w-full text-left px-3 py-1 flex items-center gap-2 transition-colors"
          style={{
            background: selectedGame === g.id ? "#2a475e" : "transparent",
            color: selectedGame === g.id ? "#fff" : "#8f98a0",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: g.installed || downloadingId === g.id ? "#fff" : "transparent" }} />
          <img src={g.icon} className="w-4 h-4 object-cover rounded-sm" alt="icon" />
          <span className="truncate" style={{ fontSize: "13px" }}>{g.name}</span>
        </button>
      ))}
    </>
  );

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: "#1b2838", color: "#c7d5e0", fontFamily: "sans-serif" }}>

      {/* ── Top Menu Bar ── */}
      <div className="flex items-center px-2 py-1 gap-4" style={{ background: "#171a21", fontSize: "12px", color: "#b8b6b4" }}>
        <span className="hover:text-white cursor-pointer">Steam</span>
        <span className="hover:text-white cursor-pointer">View</span>
        <span className="hover:text-white cursor-pointer">Friends</span>
        <span className="hover:text-white cursor-pointer">Games</span>
        <span className="hover:text-white cursor-pointer">Help</span>
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-6 h-6 rounded bg-[#1a9fff] text-white">📢</div>
          <div className="flex items-center justify-center w-6 h-6 rounded bg-[#2a475e] text-[#b8b6b4]">🔔</div>
          <div className="flex items-center gap-2 bg-[#1b2838] px-2 py-1 rounded">
            <img src={avatar} className="w-5 h-5 rounded" alt="avatar" />
            <span style={{ color: "#1a9fff" }}>くろセンセイ ▾</span>
          </div>
          <span className="text-xl">🗕 🗗 ✖</span>
        </div>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="flex items-center px-4 gap-6 py-2" style={{ background: "#171a21", borderBottom: "1px solid #2a475e" }}>
        <span className="text-2xl" style={{ color: "#8f98a0", cursor: "pointer" }}>← →</span>
        {NAV_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveNav(tab)}
            className="transition-colors uppercase tracking-wider"
            style={{
              color: activeNav === tab || (activeNav === "DOWNLOADS" && tab === "LIBRARY") ? "#1a9fff" : "#b8b6b4",
              fontWeight: "bold",
              fontSize: "18px",
              borderBottom: activeNav === tab || (activeNav === "DOWNLOADS" && tab === "LIBRARY") ? "3px solid #1a9fff" : "3px solid transparent",
              paddingBottom: "4px",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Main Content ── */}
      <div className="flex flex-1 overflow-hidden">
        
        {activeNav === "DOWNLOADS" ? (
          /* ── Downloads Manager ── */
          <div className="flex-1 bg-[#1b2838] flex flex-col p-8">
            <h1 className="text-white text-2xl font-light mb-6">DOWNLOADS</h1>
            
            {/* Global Stats */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col gap-1 text-sm text-[#8f98a0]">
                <div className="flex justify-between w-64"><span className="font-bold text-[#b8b6b4]">NETWORK USAGE</span></div>
                <div className="flex justify-between w-64"><span>CURRENT</span> <span className="text-white">{isPaused || !downloadingId ? "0 bytes/s" : `${downloadSpeed.toFixed(1)} MB/s`}</span></div>
                <div className="flex justify-between w-64"><span>PEAK</span> <span>4.2 MB/s</span></div>
                <div className="flex justify-between w-64"><span>TOTAL</span> <span>325.1 MB</span></div>
                <div className="flex justify-between w-64 mt-2"><span>DISK USAGE</span> <span>15.5 MB/s</span></div>
              </div>
              <div className="flex flex-col items-end gap-1 text-sm text-[#8f98a0]">
                <button 
                  onClick={() => setIsPaused(!isPaused)}
                  className="px-6 py-2 bg-[#2a475e] text-white hover:bg-[#316282] transition-colors rounded mb-2 font-bold"
                >
                  {isPaused ? "▶ RESUME" : "⏸ PAUSE"}
                </button>
                <div>1 ITEM</div>
                <div>IN QUEUE</div>
              </div>
            </div>

            {/* Current Download Item */}
            {downloadGameData && (
              <div className="bg-[#171a21] p-4 flex flex-col gap-4 relative">
                {/* Progress bar background */}
                <div className="absolute top-0 left-0 h-1 bg-[#2a475e] w-full" />
                <div className="absolute top-0 left-0 h-1 bg-[#1a9fff]" style={{ width: `${(downloadProgress / downloadGameData.size) * 100}%` }} />
                
                <div className="flex items-center gap-6 z-10">
                  <div className="w-64 h-32 bg-[#2a475e] flex items-center justify-center relative overflow-hidden">
                    <img src={downloadGameData.banner || steamBanner} alt="game banner" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                    <span className="text-2xl font-bold text-white z-10">{downloadGameData.name}</span>
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="text-white text-lg">{downloadGameData.name}</div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-[#1a9fff] text-white text-xs rounded">▶ PLAY</span>
                      <span className="text-[#8f98a0] text-xs">Auto-Updates Enabled</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-sm text-[#8f98a0] w-64">
                    <div className="text-[#1a9fff] mb-2">{isPaused ? "Paused" : "Downloading"}</div>
                    <div className="flex justify-between w-full"><span>DOWNLOADED</span> <span className="text-white">{formatSize(downloadProgress)} / {formatSize(downloadGameData.size)}</span></div>
                    <div className="flex justify-between w-full"><span>TIME REMAINING</span> <span>{isPaused ? "-" : "More than 1 year"}</span></div>
                    <div className="flex justify-between w-full"><span>DISK USAGE</span> <span>0 bytes/s</span></div>
                  </div>
                </div>
              </div>
            )}
            {!downloadGameData && (
              <div className="flex-1 flex items-center justify-center text-[#8f98a0] text-xl">
                No items downloading.
              </div>
            )}
          </div>
        ) : activeNav === "STORE" ? (
          /* ── Steam Store Page ── */
          <div className="flex-1 overflow-y-auto" style={{ background: "linear-gradient(180deg, #1b2838 0%, #171a21 100%)" }}>
            {/* Store Sub-Nav */}
            <div className="flex items-center gap-6 px-6 py-2" style={{ background: "#171a21", borderBottom: "1px solid #2a475e" }}>
              {["Browse ▾", "Recommendations ▾", "Categories ▾", "Hardware ▾", "Ways to Play ▾", "Special Sections ▾"].map(t => (
                <span key={t} className="text-[#b8b6b4] text-xs hover:text-white cursor-pointer transition-colors">{t}</span>
              ))}
              <div className="flex-1" />
              <div className="flex items-center bg-[#316282] px-3 py-1 rounded" style={{ minWidth: 200 }}>
                <span className="text-[#8f98a0] text-xs flex-1">Search the store</span>
                <span className="text-[#1a9fff]">🔍</span>
              </div>
              <span className="text-[#b8b6b4] text-xs ml-2 cursor-pointer hover:text-white">⭐ Wishlist {ALL_GAMES.length}</span>
            </div>

            {/* Featured & Recommended */}
            <div className="px-8 py-6">
              <h2 className="text-white text-sm font-bold mb-4 tracking-wide" style={{ color: "#fff" }}>FEATURED & RECOMMENDED</h2>
              <div className="flex gap-0 rounded overflow-hidden" style={{ background: "#0a141d", height: 340 }}>
                {/* Large banner */}
                <div className="relative flex-1 cursor-pointer" onClick={() => { setSelectedGame(ALL_GAMES[storeFeaturedIdx].id); setActiveNav("LIBRARY"); }}>
                  <img src={ALL_GAMES[storeFeaturedIdx].banner} className="absolute inset-0 w-full h-full object-cover" alt="featured" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a141d]" />
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-20 bg-[#00000066] hover:bg-[#00000099] text-white text-2xl rounded transition-colors"
                    onClick={(e) => { e.stopPropagation(); setStoreFeaturedIdx(i => (i - 1 + ALL_GAMES.length) % ALL_GAMES.length); }}
                  >‹</button>
                  <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-20 bg-[#00000066] hover:bg-[#00000099] text-white text-2xl rounded transition-colors"
                    onClick={(e) => { e.stopPropagation(); setStoreFeaturedIdx(i => (i + 1) % ALL_GAMES.length); }}
                  >›</button>
                </div>
                {/* Right info panel */}
                <div className="w-72 flex flex-col p-4 justify-between" style={{ background: "#0a141d" }}>
                  <div>
                    <h3 className="text-white text-xl font-bold mb-3">{ALL_GAMES[storeFeaturedIdx].name}</h3>
                    <div className="grid grid-cols-2 gap-1 mb-4">
                      {ALL_GAMES.slice(0, 4).map((g, i) => (
                        <div key={i} className="h-16 bg-[#2a475e] rounded overflow-hidden">
                          <img src={g.banner} className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity" alt="screenshot" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#67c1f5] text-xs mb-1">Now Available</div>
                    <span className="px-2 py-0.5 bg-[#4c6b22] text-[#a4d007] text-xs rounded mr-2">Top Seller</span>
                    <div className="text-white text-lg mt-2">Free to Play</div>
                  </div>
                </div>
              </div>
              {/* Carousel dots */}
              <div className="flex items-center justify-center gap-2 mt-3">
                {ALL_GAMES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStoreFeaturedIdx(i)}
                    className="rounded-full transition-all"
                    style={{ width: storeFeaturedIdx === i ? 10 : 6, height: storeFeaturedIdx === i ? 10 : 6, background: storeFeaturedIdx === i ? "#fff" : "#8f98a0" }}
                  />
                ))}
              </div>
            </div>

            {/* Discounts & Events */}
            <div className="px-8 pb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-sm font-bold tracking-wide">DISCOUNTS & EVENTS</h2>
                <button className="px-4 py-1 border border-[#8f98a0] text-[#8f98a0] text-xs rounded hover:text-white hover:border-white transition-colors">BROWSE MORE</button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {ALL_GAMES.slice(0, 3).map(g => (
                  <div key={g.id} className="rounded overflow-hidden cursor-pointer group" style={{ background: "#0a141d" }} onClick={() => { setSelectedGame(g.id); setActiveNav("LIBRARY"); }}>
                    <div className="h-36 relative overflow-hidden">
                      <img src={g.banner} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={g.name} />
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <div>
                        <div className="text-white text-sm">{g.name}</div>
                        <div className="text-[#8f98a0] text-xs mt-1">WEEKEND DEAL</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-[#4c6b22] text-[#a4d007] px-2 py-1 text-sm font-bold rounded">-75%</span>
                        <div className="text-right">
                          <div className="text-[#8f98a0] text-xs line-through">$29.99</div>
                          <div className="text-[#a4d007] text-sm">$7.49</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Among Friends */}
            <div className="px-8 pb-6">
              <h2 className="text-white text-sm font-bold tracking-wide mb-4">TRENDING AMONG FRIENDS</h2>
              <div className="grid grid-cols-4 gap-3">
                {ALL_GAMES.slice(0, 4).map(g => (
                  <div key={g.id} className="rounded overflow-hidden cursor-pointer group" style={{ background: "#0a141d" }} onClick={() => { setSelectedGame(g.id); setActiveNav("LIBRARY"); }}>
                    <div className="h-28 relative overflow-hidden">
                      <img src={g.banner} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={g.name} />
                    </div>
                    <div className="p-2">
                      <div className="text-white text-xs">{g.name}</div>
                      <div className="text-[#8f98a0] text-xs mt-1">Free to Play</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Sellers */}
            <div className="px-8 pb-8">
              <h2 className="text-white text-sm font-bold tracking-wide mb-4">TOP SELLERS</h2>
              <div className="flex flex-col gap-2">
                {ALL_GAMES.slice(0, 6).map((g, idx) => (
                  <div key={g.id} className="flex items-center gap-4 p-2 rounded cursor-pointer hover:bg-[#2a475e33] transition-colors" onClick={() => { setSelectedGame(g.id); setActiveNav("LIBRARY"); }}>
                    <span className="w-6 text-center text-[#8f98a0] text-sm">{idx + 1}</span>
                    <div className="w-48 h-16 rounded overflow-hidden flex-shrink-0">
                      <img src={g.banner} className="w-full h-full object-cover" alt={g.name} />
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm">{g.name}</div>
                      <div className="flex gap-2 mt-1">
                        <span className="px-1.5 py-0.5 bg-[#4c6b22] text-[#a4d007] text-xs rounded">Top Seller</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-sm">Free to Play</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeNav === "COMMUNITY" ? (
          /* ── Steam Community Page ── */
          <div className="flex-1 overflow-y-auto" style={{ background: "linear-gradient(180deg, #1b2838 0%, #171a21 100%)" }}>
            {/* Community Sub-Nav */}
            <div className="flex items-center gap-6 px-6 py-2" style={{ background: "#171a21", borderBottom: "1px solid #2a475e" }}>
              {["Community Home", "Discussions", "Workshop", "Market", "Broadcasts"].map(t => (
                <span key={t} className="text-[#b8b6b4] text-xs hover:text-white cursor-pointer transition-colors">{t}</span>
              ))}
              <div className="flex-1" />
              <div className="flex items-center bg-[#316282] px-3 py-1 rounded" style={{ minWidth: 180 }}>
                <span className="text-[#8f98a0] text-xs flex-1">Search the community</span>
                <span className="text-[#1a9fff]">🔍</span>
              </div>
              <div className="flex items-center gap-2 ml-3">
                <span className="text-[#8f98a0] text-xs hover:text-white cursor-pointer">Activity</span>
                <span className="text-[#8f98a0] text-xs hover:text-white cursor-pointer">Friends</span>
                <span className="text-[#8f98a0] text-xs hover:text-white cursor-pointer">Inventory</span>
              </div>
            </div>

            {/* Community Hubs Header */}
            <div className="px-8 py-6">
              <h2 className="text-white text-lg font-bold mb-1">COMMUNITY ACTIVITY</h2>
              <p className="text-[#8f98a0] text-xs mb-6">Your friends and the games you follow</p>

              {/* Activity Feed */}
              <div className="flex gap-6">
                {/* Main Feed */}
                <div className="flex-1 flex flex-col gap-4">
                  {/* Post 1 */}
                  <div className="rounded" style={{ background: "#1e2a37" }}>
                    <div className="flex items-center gap-3 p-4 border-b border-[#2a475e44]">
                      <img src={avatar} className="w-8 h-8 rounded" alt="user" />
                      <div>
                        <span className="text-[#1a9fff] text-sm cursor-pointer hover:underline">くろセンセイ</span>
                        <span className="text-[#8f98a0] text-xs ml-2">posted a screenshot</span>
                      </div>
                      <div className="flex-1" />
                      <span className="text-[#8f98a0] text-xs">2 hours ago</span>
                    </div>
                    <div className="relative h-48 overflow-hidden">
                      <img src={ALL_GAMES[0].banner} className="w-full h-full object-cover" alt="screenshot" />
                    </div>
                    <div className="p-4">
                      <div className="text-white text-sm mb-2">Epic moment in {ALL_GAMES[0].name}! 🎮</div>
                      <div className="flex items-center gap-4 text-[#8f98a0] text-xs">
                        <span className="hover:text-white cursor-pointer">👍 24</span>
                        <span className="hover:text-white cursor-pointer">💬 5 comments</span>
                        <span className="hover:text-white cursor-pointer">⭐ Award</span>
                      </div>
                    </div>
                  </div>

                  {/* Post 2 — Achievement */}
                  <div className="rounded" style={{ background: "#1e2a37" }}>
                    <div className="flex items-center gap-3 p-4 border-b border-[#2a475e44]">
                      <img src={avatar} className="w-8 h-8 rounded" alt="user" />
                      <div>
                        <span className="text-[#1a9fff] text-sm cursor-pointer hover:underline">MHC</span>
                        <span className="text-[#8f98a0] text-xs ml-2">earned an achievement in</span>
                        <span className="text-[#1a9fff] text-xs ml-1 cursor-pointer hover:underline">{ALL_GAMES[2].name}</span>
                      </div>
                      <div className="flex-1" />
                      <span className="text-[#8f98a0] text-xs">5 hours ago</span>
                    </div>
                    <div className="flex items-center gap-4 p-4">
                      <div className="w-16 h-16 rounded bg-[#2a475e] flex items-center justify-center text-3xl">🏆</div>
                      <div>
                        <div className="text-[#67c1f5] text-sm font-bold">Party Crasher</div>
                        <div className="text-[#8f98a0] text-xs mt-1">Win 10 matches without losing a round</div>
                        <div className="text-[#8f98a0] text-xs mt-1">Unlocked May 26 @ 3:42pm</div>
                      </div>
                    </div>
                    <div className="px-4 pb-4 flex items-center gap-4 text-[#8f98a0] text-xs">
                      <span className="hover:text-white cursor-pointer">👍 8</span>
                      <span className="hover:text-white cursor-pointer">💬 2 comments</span>
                    </div>
                  </div>

                  {/* Post 3 — Review */}
                  <div className="rounded" style={{ background: "#1e2a37" }}>
                    <div className="flex items-center gap-3 p-4 border-b border-[#2a475e44]">
                      <img src={avatar} className="w-8 h-8 rounded" alt="user" />
                      <div>
                        <span className="text-[#b8b6b4] text-sm cursor-pointer hover:underline">hugemilliards</span>
                        <span className="text-[#8f98a0] text-xs ml-2">recommended</span>
                        <span className="text-[#1a9fff] text-xs ml-1 cursor-pointer hover:underline">{ALL_GAMES[3].name}</span>
                      </div>
                      <div className="flex-1" />
                      <span className="text-[#8f98a0] text-xs">1 day ago</span>
                    </div>
                    <div className="flex gap-4 p-4">
                      <div className="w-24 h-12 rounded overflow-hidden flex-shrink-0">
                        <img src={ALL_GAMES[3].banner} className="w-full h-full object-cover" alt="game" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[#66c0f4] text-lg">👍</span>
                          <span className="text-[#67c1f5] text-sm font-bold">Recommended</span>
                          <span className="text-[#8f98a0] text-xs ml-2">12.5 hrs on record</span>
                        </div>
                        <div className="text-[#b8b6b4] text-xs leading-relaxed">"One of the best co-op experiences I've had. The puzzles are challenging and the atmosphere is incredible. Highly recommended for friends who love adventure games!"</div>
                      </div>
                    </div>
                    <div className="px-4 pb-4 flex items-center gap-4 text-[#8f98a0] text-xs">
                      <span className="hover:text-white cursor-pointer">👍 42</span>
                      <span className="hover:text-white cursor-pointer">👎 3</span>
                      <span className="hover:text-white cursor-pointer">😄 Funny</span>
                      <span className="hover:text-white cursor-pointer">⭐ Award</span>
                    </div>
                  </div>

                  {/* Post 4 — Game Update */}
                  <div className="rounded" style={{ background: "#1e2a37" }}>
                    <div className="flex items-center gap-3 p-4 border-b border-[#2a475e44]">
                      <div className="w-8 h-8 rounded bg-[#2a475e] flex items-center justify-center text-sm">📢</div>
                      <div>
                        <span className="text-[#1a9fff] text-sm cursor-pointer hover:underline">{ALL_GAMES[1].name}</span>
                        <span className="text-[#8f98a0] text-xs ml-2">— Official Update</span>
                      </div>
                      <div className="flex-1" />
                      <span className="text-[#8f98a0] text-xs">2 days ago</span>
                    </div>
                    <div className="relative h-40 overflow-hidden">
                      <img src={ALL_GAMES[1].banner} className="w-full h-full object-cover" alt="update" />
                      <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-[#1e2a37] to-transparent">
                        <div className="text-white text-lg font-bold">Patch Notes v3.2.1</div>
                        <div className="text-[#8f98a0] text-xs mt-1">Balance changes, new maps, and quality of life improvements</div>
                      </div>
                    </div>
                    <div className="px-4 py-3 flex items-center gap-4 text-[#8f98a0] text-xs">
                      <span className="hover:text-white cursor-pointer">👍 156</span>
                      <span className="hover:text-white cursor-pointer">💬 47 comments</span>
                    </div>
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-64 flex-shrink-0 flex flex-col gap-4">
                  {/* Popular Hubs */}
                  <div className="rounded p-4" style={{ background: "#1e2a37" }}>
                    <h3 className="text-white text-sm font-bold mb-3">POPULAR HUBS</h3>
                    {ALL_GAMES.slice(0, 5).map(g => (
                      <div key={g.id} className="flex items-center gap-3 py-2 cursor-pointer hover:bg-[#2a475e33] rounded px-1 transition-colors" onClick={() => { setSelectedGame(g.id); setActiveNav("LIBRARY"); }}>
                        <img src={g.icon} className="w-8 h-8 rounded object-cover" alt="icon" />
                        <div className="flex-1 min-w-0">
                          <div className="text-[#b8b6b4] text-xs truncate">{g.name}</div>
                          <div className="text-[#8f98a0] text-xs">{Math.floor(Math.random() * 50000 + 1000).toLocaleString()} in-game</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Community Artwork */}
                  <div className="rounded p-4" style={{ background: "#1e2a37" }}>
                    <h3 className="text-white text-sm font-bold mb-3">RECENT ARTWORK</h3>
                    <div className="grid grid-cols-2 gap-1">
                      {ALL_GAMES.slice(0, 4).map(g => (
                        <div key={g.id} className="h-16 rounded overflow-hidden cursor-pointer">
                          <img src={g.banner} className="w-full h-full object-cover hover:opacity-80 transition-opacity" alt="artwork" />
                        </div>
                      ))}
                    </div>
                    <div className="text-[#1a9fff] text-xs mt-3 cursor-pointer hover:underline">View all artwork →</div>
                  </div>

                  {/* Workshop */}
                  <div className="rounded p-4" style={{ background: "#1e2a37" }}>
                    <h3 className="text-white text-sm font-bold mb-3">WORKSHOP</h3>
                    <div className="text-[#8f98a0] text-xs mb-2">Recently updated items</div>
                    {ALL_GAMES.slice(0, 3).map(g => (
                      <div key={g.id} className="flex items-center gap-2 py-1.5 cursor-pointer">
                        <div className="w-3 h-3 rounded-full bg-[#4c6b22]" />
                        <span className="text-[#b8b6b4] text-xs hover:text-white truncate">{g.name} Custom Map Pack</span>
                      </div>
                    ))}
                    <div className="text-[#1a9fff] text-xs mt-2 cursor-pointer hover:underline">Browse Workshop →</div>
                  </div>

                  {/* Market */}
                  <div className="rounded p-4" style={{ background: "#1e2a37" }}>
                    <h3 className="text-white text-sm font-bold mb-3">MARKET</h3>
                    <div className="text-[#8f98a0] text-xs mb-2">Popular items</div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#b8b6b4]">CS2 Case Key</span>
                        <span className="text-[#a4d007]">$2.49</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#b8b6b4]">Operation Wildfire Case</span>
                        <span className="text-[#a4d007]">$0.12</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#b8b6b4]">Prisma 2 Case</span>
                        <span className="text-[#a4d007]">$0.08</span>
                      </div>
                    </div>
                    <div className="text-[#1a9fff] text-xs mt-3 cursor-pointer hover:underline">Browse Market →</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeNav === "くろセンセイ" ? (
          /* Profile Page Replica */
          <div className="flex-1 overflow-y-auto bg-[#1b2838] p-8" style={{ background: "linear-gradient(180deg, #1f1122 0%, #171a21 100%)" }}>
            <div className="max-w-4xl mx-auto flex gap-6">
              <div className="w-40 h-40 rounded-xl overflow-hidden shadow-2xl relative p-1" style={{ background: "linear-gradient(45deg, #f09, #0ff)" }}>
                <img src={avatar} className="w-full h-full rounded-lg object-cover" alt="avatar" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-white text-3xl font-light mb-2">くろセンセイ <span className="text-sm">▾</span></div>
                <div className="text-[#8f98a0] text-sm mb-4">abdelrhman ashraf &nbsp; 🇪🇬 Gizeh, Al Jizah, Egypt</div>
                <div className="text-[#8f98a0] text-sm font-mono whitespace-pre leading-tight">
                  . . . :+:. .:..+ . . : . .:: . . :: . .<br/>
                  . . . :###=+#$$$##:..: .:.::"... ! .#. <br/>
                  . . .".'::;;;..  "########$##':.._..::##.
                </div>
                <div className="text-white text-xs mt-2 underline cursor-pointer">View more info</div>
              </div>
              <div className="w-48">
                <div className="text-white text-xl mb-2">Level <span className="inline-block w-8 h-8 text-center leading-8 rounded-full border-2 border-red-500 text-red-500 font-bold">12</span></div>
                <div className="flex items-center gap-2 bg-[#00000033] p-2 rounded mb-4">
                  <div className="w-10 h-10 bg-orange-800 text-white flex items-center justify-center font-bold text-xs">100+</div>
                  <div className="text-xs">
                    <div className="text-white">Power Player</div>
                    <div className="text-[#8f98a0]">406 XP</div>
                  </div>
                </div>
                <button className="bg-[#ffffff11] text-white px-4 py-1 text-sm rounded hover:bg-[#ffffff22]">Edit Profile</button>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto mt-8 flex gap-6">
              <div className="flex-1">
                <div className="bg-[#1b2838] p-4 rounded mb-4">
                  <div className="text-white mb-4">Favorite Game</div>
                  <div className="flex gap-4 p-4 bg-[#00000033] rounded">
                    <div className="w-48 h-24 bg-[#171a21] relative overflow-hidden flex-shrink-0">
                      <img src={artCS2} alt="game" className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-2xl text-white mb-4">Counter-Strike 2</div>
                      <div className="flex gap-8">
                        <div>
                          <div className="text-3xl text-white">489</div>
                          <div className="text-[#8f98a0] text-sm">Hours played</div>
                        </div>
                        <div>
                          <div className="text-3xl text-white">1</div>
                          <div className="text-[#8f98a0] text-sm">Achievements</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-64">
                <div className="text-[#8f98a0] mb-6">
                  <div className="text-white">Currently Offline</div>
                  <div className="text-sm">Last Online 1 hrs, 2 mins ago</div>
                </div>
                
                <div className="mb-6">
                  <div className="text-white mb-2">Badges <span className="text-[#8f98a0]">10</span></div>
                  <div className="flex gap-2">
                    <div className="w-10 h-10 bg-yellow-600 rounded-full"></div>
                    <div className="w-10 h-10 bg-orange-800 flex items-center justify-center text-xs text-white font-bold">100+</div>
                    <div className="w-10 h-10 bg-slate-700 flex items-center justify-center text-xs text-white font-bold border border-slate-500">10</div>
                    <div className="w-10 h-10 bg-pink-800 rounded-full flex items-center justify-center text-xs text-white">2025</div>
                  </div>
                </div>
                
                <div className="text-white mb-2">Games <span className="text-[#8f98a0]">170</span></div>
                <div className="text-white">Inventory</div>
              </div>
            </div>
          </div>
        ) : (
          /* ── Library Nav ── */
          <>
            {/* ── Left Sidebar: Game List ── */}
            <div className="w-64 flex-shrink-0 flex flex-col overflow-y-auto" style={{ background: "#212b36" }}>
              
              {/* Filter */}
              <div className="px-3 py-2 flex items-center justify-between" style={{ background: "#171a21", borderBottom: "1px solid #2a475e" }}>
                <div className="flex items-center bg-[#2a475e] px-2 py-1 rounded w-full">
                  <span className="text-[#8f98a0]">🔍</span>
                  <div className="ml-2 flex-1 text-xs text-[#8f98a0]">Games and Software</div>
                  <span className="text-[#8f98a0]">▼</span>
                </div>
              </div>

              {renderGameList("FAVORITES", FAVORITES.length, FAVORITES)}
              {renderGameList("MAYBE I WILL TRY IT", MAYBE.length, MAYBE)}
              {renderGameList("UNCATEGORIZED", UNCATEGORIZED.length, UNCATEGORIZED)}

              <div className="flex-1" />
              <div className="px-3 py-2 flex items-center gap-2 cursor-pointer" style={{ color: "#b8b6b4", fontSize: "12px", borderTop: "1px solid #2a475e44" }}>
                <span className="text-xl">+</span> Add a Game
              </div>
            </div>

            {/* ── Right Panel: Game Detail ── */}
            <div className="flex-1 flex flex-col overflow-y-auto" style={{ background: "#1b2838" }}>
              {/* Hero Banner Image */}
              <div className="relative overflow-hidden" style={{ height: "350px", background: "#000" }}>
                <img
                  src={game.banner || steamBanner}
                  alt="Game banner"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #1b2838 0%, transparent 40%)" }} />
              </div>

              {/* Install/Play Row */}
              <div className="flex items-center gap-8 px-8 py-4" style={{ background: "#1b2838" }}>
                
                {isDownloading ? (
                  <button
                    onClick={() => setActiveNav("DOWNLOADS")}
                    className="px-8 py-2 transition-all hover:brightness-110 active:scale-95 flex items-center gap-3 rounded"
                    style={{ background: "#2a475e", color: "#fff", fontSize: "18px", fontWeight: "bold" }}
                  >
                    <span className="animate-spin">↻</span> DOWNLOADING...
                  </button>
                ) : game.installed ? (
                  <button
                    className="px-12 py-2 transition-all hover:brightness-110 active:scale-95 rounded flex items-center gap-2"
                    style={{
                      background: "linear-gradient(to right, #4c6b22 0%, #3d591b 100%)",
                      color: "#d2efa9",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    ▶ PLAY
                  </button>
                ) : (
                  <div className="flex">
                    <button
                      onClick={() => handleInstall(game.id)}
                      className="px-8 py-2 transition-all hover:brightness-110 active:scale-95 flex items-center gap-3 rounded-l"
                      style={{ background: "#1a9fff", color: "#fff", fontSize: "18px", fontWeight: "bold" }}
                    >
                      <span className="text-xl">📥</span> INSTALL
                    </button>
                    <button className="px-3 py-2 bg-[#1380cf] hover:bg-[#1a9fff] rounded-r border-l border-[#00000033]">▼</button>
                  </div>
                )}

                <div className="flex items-center gap-8 text-[#8f98a0] text-xs">
                  <div>
                    <div style={{ color: "#b8b6b4", fontSize: "10px" }}>SPACE REQUIRED</div>
                    <div className="text-[#8f98a0] text-sm">{formatSize(game.size)}</div>
                  </div>
                  <div>
                    <div style={{ color: "#b8b6b4", fontSize: "10px" }}>LAST PLAYED</div>
                    <div className="text-[#8f98a0] text-sm">{game.lastPlayed || "Never"}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⏱</span>
                    <div>
                      <div style={{ color: "#b8b6b4", fontSize: "10px" }}>PLAY TIME</div>
                      <div className="text-[#8f98a0] text-sm">{game.playTime || "0 hours"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl text-[#1a9fff]">🏆</span>
                    <div>
                      <div style={{ color: "#b8b6b4", fontSize: "10px" }}>ACHIEVEMENTS</div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#8f98a0] text-sm">{game.achievements || "0/0"}</span>
                        <div className="w-32 h-1 bg-[#2a475e] rounded-full overflow-hidden">
                          <div className="h-full bg-[#1a9fff]" style={{ width: game.achievements ? `${(parseInt(game.achievements.split('/')[0]) / Math.max(1, parseInt(game.achievements.split('/')[1]))) * 100}%` : '0%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1" />
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded bg-[#2a475e] text-white hover:bg-[#316282]">⚙</button>
                  <button className="w-8 h-8 rounded bg-[#2a475e] text-white hover:bg-[#316282]">ℹ</button>
                  <button className="w-8 h-8 rounded bg-[#2a475e] text-white hover:bg-[#316282]">⭐</button>
                </div>
              </div>

              {/* Detail tabs */}
              <div className="flex items-center px-8 gap-6 py-3" style={{ background: "#1b2838", borderBottom: "1px solid #2a475e" }}>
                {DETAIL_TABS.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveDetailTab(tab)}
                    className="transition-colors hover:text-white"
                    style={{
                      color: activeDetailTab === tab ? "#fff" : "#8f98a0",
                      fontSize: "14px",
                    }}
                  >
                    {tab}
                  </button>
                ))}
                <div className="flex-1" />
                <button className="text-[#8f98a0] hover:text-white">•••</button>
              </div>

              {/* Activity area */}
              <div className="flex-1 flex gap-6 p-8 bg-[#171a21] overflow-y-auto">
                <div className="flex-1 flex flex-col gap-6">
                  <h3 className="text-[#8f98a0] font-bold tracking-widest text-sm">ACTIVITY</h3>
                  <div className="p-4 rounded border border-[#2a475e] text-[#8f98a0] bg-[#1b2838] shadow-inner">
                    Say something about this game to your friends...
                  </div>

                  <h3 className="text-[#8f98a0] text-xs font-bold mt-4">RECENT</h3>
                  <div className="bg-[#1b2838] rounded overflow-hidden">
                    <div className="h-40 bg-[#2a475e] relative">
                      <img src={game.banner || steamBanner} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="update" />
                      <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-[#1b2838] to-transparent">
                        <div className="text-[#1a9fff] font-bold mb-1">MAJOR UPDATE</div>
                        <div className="text-white text-xl font-bold">V1.2 Stable is out!</div>
                      </div>
                    </div>
                    <div className="p-6 text-[#b8b6b4] text-sm leading-relaxed">
                      Hello Survivors! Today we are making our V1.2 Crossplay patch available to every platform.
                      Players on Xbox, PlayStation, and PC can now enjoy cross-platform gameplay.
                    </div>
                  </div>
                </div>

                <div className="w-72 flex flex-col gap-6">
                  <h3 className="text-[#8f98a0] font-bold tracking-widest text-sm">FRIENDS WHO PLAY</h3>
                  <div className="bg-[#1b2838] p-4 rounded text-sm text-[#8f98a0]">
                    <div className="mb-4">3 friends have played recently</div>
                    <div className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-[#2a475e] p-1 rounded">
                      <img src={avatar} className="w-8 h-8 rounded" alt="friend" />
                      <div>
                        <div className="text-[#1a9fff]">MHC</div>
                        <div className="text-xs">9.3 hrs played recently</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-[#2a475e] p-1 rounded">
                      <img src={avatar} className="w-8 h-8 rounded" alt="friend" />
                      <div>
                        <div className="text-[#b8b6b4]">hugemilliards</div>
                        <div className="text-xs">2.6 hrs played recently</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 cursor-pointer hover:bg-[#2a475e] p-1 rounded">
                      <img src={avatar} className="w-8 h-8 rounded" alt="friend" />
                      <div>
                        <div className="text-[#b8b6b4]">logisticsDisco</div>
                        <div className="text-xs">Offline</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Bottom Bar ── */}
      <div className="flex items-center justify-between px-4 py-2" style={{ background: "#171a21", fontSize: "12px", color: "#8f98a0", borderTop: "1px solid #2a475e" }}>
        <div className="flex items-center gap-2 cursor-pointer hover:text-white" onClick={() => setActiveNav("DOWNLOADS")}>
          <span className="text-[#1a9fff]">📥</span> 
          <span>Manage Downloads</span>
          {downloadingId && <span className="ml-2 px-2 rounded-full bg-[#1a9fff] text-white text-xs animate-pulse">1</span>}
        </div>
        <span className="cursor-pointer hover:text-white">Friends & Chat 👥</span>
      </div>
    </div>
  );
};

export default SteamApp;
