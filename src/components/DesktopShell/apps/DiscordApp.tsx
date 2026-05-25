import { useState, useRef, useEffect } from "react";
import discordBanner from "@/assets/discord_banner.png";

const SERVER_ICONS = [
  { id: "main", emoji: "🎮", color: "#5865f2", active: true },
  { id: "s2", emoji: "🎨", color: "#3ba55c" },
  { id: "s3", emoji: "🐱", color: "#ed4245" },
  { id: "s4", emoji: "🎵", color: "#faa61a" },
  { id: "s5", emoji: "⚡", color: "#57f287" },
];

const CHANNELS = [
  { type: "category", name: "INFORMATION" },
  { type: "text", id: "welcome", name: "welcome", unread: false },
  { type: "text", id: "rules", name: "rules", unread: false },
  { type: "category", name: "GENERAL" },
  { type: "text", id: "general", name: "general", unread: false, active: true },
  { type: "text", id: "about-me", name: "about-me", unread: true },
  { type: "text", id: "projects", name: "projects", unread: true },
  { type: "text", id: "contact", name: "contact", unread: false },
  { type: "category", name: "VOICE" },
  { type: "voice", id: "lounge", name: "Lounge", users: 2 },
];

interface Message {
  id: number;
  author: string;
  avatar: string;
  avatarColor: string;
  content: string;
  time: string;
  isBot?: boolean;
  badges?: string[];
  image?: boolean;
}

const MESSAGES: Record<string, Message[]> = {
  general: [
    { id: 1, author: "PortfolioBot", avatar: "🤖", avatarColor: "#5865f2", content: "Welcome to my portfolio server! 👋", time: "Today at 10:00 AM", isBot: true },
    { id: 2, author: "PortfolioBot", avatar: "🤖", avatarColor: "#5865f2", content: "Feel free to check out the channels:", time: "Today at 10:00 AM", isBot: true },
    { id: 3, author: "PortfolioBot", avatar: "🤖", avatarColor: "#5865f2", content: "📌 #about-me — Learn about who I am\n📌 #projects — See my work\n📌 #contact — Ways to reach me", time: "Today at 10:01 AM", isBot: true },
    { id: 4, author: "Visitor", avatar: "👤", avatarColor: "#747f8d", content: "Hey! Cool portfolio!", time: "Today at 10:05 AM" },
    { id: 5, author: "PortfolioBot", avatar: "🤖", avatarColor: "#5865f2", content: "Thanks! Try the Terminal app on the desktop too! 🖥️", time: "Today at 10:05 AM", isBot: true },
  ],
  "about-me": [
    { id: 1, author: "PortfolioBot", avatar: "🤖", avatarColor: "#5865f2", content: "👨‍💻 **About Me**\n\nI'm a Full-Stack Developer passionate about creating interactive web experiences and pixel art.\n\n🛠️ **Tech Stack:**\n• React / Next.js\n• TypeScript\n• Node.js / Express\n• PostgreSQL / AWS / Docker", time: "Today at 9:00 AM", isBot: true },
  ],
  projects: [
    { id: 1, author: "PortfolioBot", avatar: "🤖", avatarColor: "#5865f2", content: "🚀 **My Projects**\n\n**Pixel Quest** — 2D adventure game\nJS, Canvas, Web Audio\n\n**RetroChat** — Real-time chat\nReact, Node.js, WebSocket\n\n**CodeForge** — Online code editor\nTypeScript, Monaco", time: "Today at 9:00 AM", isBot: true },
  ],
  contact: [
    { id: 1, author: "PortfolioBot", avatar: "🤖", avatarColor: "#5865f2", content: "📬 **Contact Information**\n\n📧 Email: hello@developer.dev\n🐙 GitHub: github.com/developer\n🐦 Twitter: @developer\n💼 LinkedIn: linkedin.com/in/developer", time: "Today at 9:00 AM", isBot: true },
  ],
  welcome: [
    { id: 1, author: "PortfolioBot", avatar: "🤖", avatarColor: "#5865f2", content: "Welcome to the Portfolio Server! 🎉\n\nThis is a pixel-art portfolio disguised as a Discord server.\nFeel free to explore!", time: "Today at 8:00 AM", isBot: true },
  ],
  rules: [
    { id: 1, author: "PortfolioBot", avatar: "🤖", avatarColor: "#5865f2", content: "📜 **Server Rules**\n\n1. Be respectful\n2. Have fun exploring\n3. Check out all the apps on the desktop!\n4. Play the retro games on the TV 🎮", time: "Today at 8:00 AM", isBot: true },
  ],
};

const MEMBERS = [
  { name: "PortfolioBot", status: "online", role: "Bot", color: "#5865f2", avatar: "🤖", isBot: true },
  { name: "Developer", status: "online", role: "Admin", color: "#e91e63", avatar: "👨‍💻" },
  { name: "Visitor", status: "online", role: "Member", color: "#3ba55c", avatar: "👤" },
  { name: "Garfield", status: "idle", role: "Member", color: "#faa61a", avatar: "🐱" },
  { name: "PixelFan", status: "dnd", role: "Member", color: "#ed4245", avatar: "🎨" },
  { name: "RetroGamer", status: "offline", role: "Member", color: "#747f8d", avatar: "🕹️" },
];

const STATUS_COLORS: Record<string, string> = { online: "#3ba55c", idle: "#faa61a", dnd: "#ed4245", offline: "#747f8d" };

const DiscordApp = () => {
  const [activeChannel, setActiveChannel] = useState("general");
  const [inputText, setInputText] = useState("");
  const [userMsgs, setUserMsgs] = useState<Record<string, Message[]>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const msgs = [...(MESSAGES[activeChannel] || []), ...(userMsgs[activeChannel] || [])];

  useEffect(() => {
    scrollRef.current && (scrollRef.current.scrollTop = scrollRef.current.scrollHeight);
  }, [msgs.length, activeChannel]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const msg: Message = {
      id: Date.now(), author: "You", avatar: "🧑", avatarColor: "#3ba55c",
      content: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setUserMsgs(p => ({ ...p, [activeChannel]: [...(p[activeChannel] || []), msg] }));
    setInputText("");
  };

  const channelName = CHANNELS.find(c => c.id === activeChannel)?.name || activeChannel;

  return (
    <div className="w-full h-full flex overflow-hidden" style={{ fontFamily: "'VT323', monospace", fontSize: "14px" }}>

      {/* ── Server Icon Bar ── */}
      <div className="w-[52px] flex flex-col items-center py-2 gap-1.5 flex-shrink-0 overflow-y-auto" style={{ background: "#1e1f22" }}>
        {SERVER_ICONS.map(s => (
          <div
            key={s.id}
            className="w-10 h-10 flex items-center justify-center cursor-pointer transition-all duration-150 hover:rounded-xl text-base"
            style={{
              background: s.active ? s.color : "#2b2d31",
              borderRadius: s.active ? "30%" : "50%",
              boxShadow: s.active ? `0 0 8px ${s.color}44` : "none",
            }}
          >
            {s.emoji}
          </div>
        ))}
        <div className="w-8 h-0.5 rounded-full my-0.5" style={{ background: "#35363c" }} />
        <div className="w-10 h-10 flex items-center justify-center cursor-pointer rounded-full hover:rounded-xl hover:bg-[#3ba55c] text-lg transition-all" style={{ background: "#2b2d31", color: "#3ba55c" }}>
          +
        </div>
      </div>

      {/* ── Channel Sidebar ── */}
      <div className="w-[200px] flex flex-col flex-shrink-0" style={{ background: "#2b2d31" }}>
        {/* Server banner */}
        <div className="relative" style={{ height: "80px" }}>
          <img src={discordBanner} alt="Server banner" className="w-full h-full object-cover" style={{ imageRendering: "pixelated" }} draggable={false} />
          <div className="absolute bottom-1 left-2 flex items-center gap-1">
            <span style={{ color: "#fff", fontSize: "13px", fontWeight: "bold", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>Portfolio ▾</span>
          </div>
        </div>

        {/* Channel list */}
        <div className="flex-1 overflow-y-auto px-1.5 py-1">
          {CHANNELS.map((ch, i) => {
            if (ch.type === "category") {
              return (
                <div key={i} className="px-1 pt-3 pb-0.5 flex items-center gap-1" style={{ fontSize: "10px", color: "#949ba4", letterSpacing: "0.5px" }}>
                  <span style={{ fontSize: "8px" }}>▾</span> {ch.name}
                </div>
              );
            }
            if (ch.type === "voice") {
              return (
                <div key={ch.id} className="px-2 py-1 flex items-center gap-1.5 rounded cursor-pointer hover:bg-[#35363c] transition-colors" style={{ color: "#949ba4", fontSize: "13px" }}>
                  <span style={{ fontSize: "12px" }}>🔊</span>
                  <span>{ch.name}</span>
                  <span className="ml-auto" style={{ fontSize: "10px" }}>{ch.users}</span>
                </div>
              );
            }
            return (
              <button
                key={ch.id}
                onClick={() => { setActiveChannel(ch.id!); setTimeout(() => inputRef.current?.focus(), 50); }}
                className="w-full text-left px-2 py-1 flex items-center gap-1.5 rounded transition-colors mb-px"
                style={{
                  background: activeChannel === ch.id ? "#404249" : "transparent",
                  color: activeChannel === ch.id ? "#fff" : ch.unread ? "#f2f3f5" : "#949ba4",
                  fontWeight: ch.unread && activeChannel !== ch.id ? "bold" : "normal",
                  fontSize: "13px",
                }}
              >
                <span style={{ color: "#949ba4", fontSize: "14px" }}>#</span>
                {ch.name}
                {ch.unread && activeChannel !== ch.id && (
                  <span className="ml-auto w-2 h-2 rounded-full" style={{ background: "#fff" }} />
                )}
              </button>
            );
          })}
        </div>

        {/* User panel */}
        <div className="px-1.5 py-1.5 flex items-center gap-2" style={{ background: "#232428" }}>
          <div className="w-8 h-8 flex items-center justify-center rounded-full text-base relative" style={{ background: "#5865f2" }}>
            🧑
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full" style={{ background: "#3ba55c", border: "2px solid #232428" }} />
          </div>
          <div className="flex-1 min-w-0">
            <div style={{ fontSize: "12px", color: "#fff" }} className="truncate">Visitor</div>
            <div style={{ fontSize: "10px", color: "#949ba4" }}>Online</div>
          </div>
          <div className="flex gap-1" style={{ color: "#b5bac1" }}>
            <span className="cursor-pointer text-sm hover:text-white">🎙️</span>
            <span className="cursor-pointer text-sm hover:text-white">🎧</span>
            <span className="cursor-pointer text-sm hover:text-white">⚙️</span>
          </div>
        </div>
      </div>

      {/* ── Chat Area ── */}
      <div className="flex-1 flex flex-col" style={{ background: "#313338" }}>
        {/* Channel header */}
        <div className="px-3 py-1.5 flex items-center gap-2" style={{ background: "#313338", borderBottom: "1px solid #1e1f22", boxShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>
          <span style={{ color: "#949ba4", fontSize: "18px" }}>#</span>
          <span style={{ color: "#fff", fontSize: "14px", fontWeight: "bold" }}>{channelName}</span>
          <div className="flex-1" />
          <div className="flex items-center gap-2" style={{ color: "#b5bac1", fontSize: "14px" }}>
            <span className="cursor-pointer hover:text-white">🔔</span>
            <span className="cursor-pointer hover:text-white">📌</span>
            <span className="cursor-pointer hover:text-white">👥</span>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
          {msgs.map(msg => (
            <div key={msg.id} className="flex gap-3 py-0.5 px-1 rounded hover:bg-[#2e3035] transition-colors">
              <div className="w-9 h-9 flex items-center justify-center text-lg flex-shrink-0 rounded-full mt-0.5" style={{ background: msg.avatarColor }}>
                {msg.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span style={{ color: msg.isBot ? "#5865f2" : "#f2f3f5", fontWeight: "bold", fontSize: "13px" }}>
                    {msg.author}
                  </span>
                  {msg.isBot && (
                    <span className="px-1 rounded-sm" style={{ background: "#5865f2", color: "#fff", fontSize: "9px" }}>BOT</span>
                  )}
                  <span style={{ color: "#949ba4", fontSize: "10px" }}>{msg.time}</span>
                </div>
                <div className="whitespace-pre-wrap" style={{ color: "#dbdee1", fontSize: "13px", lineHeight: "1.35" }}>
                  {msg.content.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
                    part.startsWith("**") && part.endsWith("**")
                      ? <strong key={i} style={{ color: "#fff" }}>{part.slice(2, -2)}</strong>
                      : <span key={i}>{part}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message input */}
        <div className="px-3 py-2">
          <form onSubmit={handleSend} className="flex items-center rounded-lg overflow-hidden" style={{ background: "#383a40" }}>
            <span className="px-3 cursor-pointer text-lg" style={{ color: "#b5bac1" }}>+</span>
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={`Message #${channelName}`}
              className="flex-1 bg-transparent border-none outline-none py-2"
              style={{ color: "#dbdee1", fontSize: "13px", fontFamily: "'VT323', monospace" }}
              spellCheck={false}
              autoComplete="off"
            />
            <div className="flex items-center gap-1.5 px-2" style={{ color: "#b5bac1", fontSize: "14px" }}>
              <span className="cursor-pointer hover:text-white">GIF</span>
              <span className="cursor-pointer hover:text-white">😊</span>
            </div>
          </form>
        </div>
      </div>

      {/* ── Member List ── */}
      <div className="w-[180px] flex-shrink-0 overflow-y-auto p-2" style={{ background: "#2b2d31" }}>
        {/* Online */}
        <div className="px-1 py-1" style={{ fontSize: "10px", color: "#949ba4", letterSpacing: "0.5px" }}>
          ONLINE — {MEMBERS.filter(m => m.status !== "offline").length}
        </div>
        {MEMBERS.filter(m => m.status !== "offline").map(m => (
          <div key={m.name} className="flex items-center gap-2 px-1 py-1 rounded cursor-pointer hover:bg-[#35363c] transition-colors">
            <div className="w-7 h-7 flex items-center justify-center rounded-full text-sm relative" style={{ background: m.color + "33" }}>
              {m.avatar}
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLORS[m.status], border: "2px solid #2b2d31" }} />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span style={{ color: m.color, fontSize: "12px" }}>{m.name}</span>
                {m.isBot && <span style={{ background: "#5865f2", color: "#fff", fontSize: "7px", padding: "0 2px" }}>BOT</span>}
              </div>
              <div style={{ fontSize: "10px", color: "#949ba4" }}>{m.role}</div>
            </div>
          </div>
        ))}
        {/* Offline */}
        <div className="px-1 py-1 mt-2" style={{ fontSize: "10px", color: "#949ba4" }}>
          OFFLINE — {MEMBERS.filter(m => m.status === "offline").length}
        </div>
        {MEMBERS.filter(m => m.status === "offline").map(m => (
          <div key={m.name} className="flex items-center gap-2 px-1 py-1 rounded cursor-pointer hover:bg-[#35363c] transition-colors opacity-50">
            <div className="w-7 h-7 flex items-center justify-center rounded-full text-sm" style={{ background: "#747f8d33" }}>
              {m.avatar}
            </div>
            <span style={{ color: "#949ba4", fontSize: "12px" }}>{m.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscordApp;
