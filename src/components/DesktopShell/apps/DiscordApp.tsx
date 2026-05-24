import { useState } from "react";

const CHANNELS = [
  { id: "general", name: "general", icon: "#" },
  { id: "about-me", name: "about-me", icon: "#" },
  { id: "contact", name: "contact", icon: "#" },
];

interface Message {
  id: number;
  author: string;
  avatar: string;
  content: string;
  time: string;
  isBot?: boolean;
}

const MESSAGES: Record<string, Message[]> = {
  general: [
    { id: 1, author: "PortfolioBot", avatar: "🤖", content: "Welcome to my portfolio server! 👋", time: "Today at 10:00 AM", isBot: true },
    { id: 2, author: "PortfolioBot", avatar: "🤖", content: "Feel free to check out the channels:", time: "Today at 10:00 AM", isBot: true },
    { id: 3, author: "PortfolioBot", avatar: "🤖", content: "📌 #about-me — Learn about who I am\n📌 #contact — Ways to reach me", time: "Today at 10:01 AM", isBot: true },
    { id: 4, author: "Visitor", avatar: "👤", content: "Hey! Cool portfolio!", time: "Today at 10:05 AM" },
    { id: 5, author: "PortfolioBot", avatar: "🤖", content: "Thanks! Check out the other channels for more info. You can also explore the Terminal app on the desktop for an interactive experience! 🖥️", time: "Today at 10:05 AM", isBot: true },
  ],
  "about-me": [
    { id: 1, author: "PortfolioBot", avatar: "🤖", content: "👨‍💻 **About Me**", time: "Today at 9:00 AM", isBot: true },
    { id: 2, author: "PortfolioBot", avatar: "🤖", content: "I'm a Full-Stack Developer passionate about creating interactive web experiences and pixel art.", time: "Today at 9:00 AM", isBot: true },
    { id: 3, author: "PortfolioBot", avatar: "🤖", content: "**🛠️ Tech Stack:**\n• React / Next.js\n• TypeScript\n• Node.js / Express\n• PostgreSQL\n• AWS / Docker", time: "Today at 9:01 AM", isBot: true },
    { id: 4, author: "PortfolioBot", avatar: "🤖", content: "**🎮 Fun Facts:**\n• I love retro games\n• This entire portfolio is a pixel-art room!\n• I built 3 playable games in the TV console", time: "Today at 9:02 AM", isBot: true },
  ],
  contact: [
    { id: 1, author: "PortfolioBot", avatar: "🤖", content: "📬 **Contact Information**", time: "Today at 9:00 AM", isBot: true },
    { id: 2, author: "PortfolioBot", avatar: "🤖", content: "📧 **Email:** hello@developer.dev\n🐙 **GitHub:** github.com/developer\n🐦 **Twitter:** @developer\n💼 **LinkedIn:** linkedin.com/in/developer", time: "Today at 9:00 AM", isBot: true },
    { id: 3, author: "PortfolioBot", avatar: "🤖", content: "Feel free to reach out! I'm always open to new projects and opportunities. ✨", time: "Today at 9:01 AM", isBot: true },
  ],
};

const DiscordApp = () => {
  const [activeChannel, setActiveChannel] = useState("general");
  const messages = MESSAGES[activeChannel] || [];

  return (
    <div className="w-full h-full flex" style={{ background: "#36393f", color: "#dcddde", fontFamily: "'VT323', monospace" }}>
      {/* Server sidebar */}
      <div className="w-16 flex flex-col items-center py-2 gap-2" style={{ background: "#202225" }}>
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg hover:rounded-xl transition-all cursor-pointer" style={{ background: "#5865f2" }}>
          P
        </div>
        <div className="w-8 h-0.5 rounded-full" style={{ background: "#36393f" }} />
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg opacity-40 hover:opacity-100 hover:rounded-xl transition-all cursor-pointer" style={{ background: "#36393f" }}>
          +
        </div>
      </div>

      {/* Channel list */}
      <div className="w-44 flex flex-col" style={{ background: "#2f3136" }}>
        <div className="px-3 py-3 font-bold text-sm flex items-center" style={{ borderBottom: "1px solid #202225", color: "#fff" }}>
          Portfolio Server
        </div>
        <div className="px-2 py-2">
          <div className="text-[10px] font-bold uppercase px-1 mb-1" style={{ color: "#8e9297" }}>
            Text Channels
          </div>
          {CHANNELS.map(ch => (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch.id)}
              className="w-full text-left px-2 py-1 rounded text-sm flex items-center gap-1.5 transition-colors"
              style={{
                background: activeChannel === ch.id ? "#393c43" : "transparent",
                color: activeChannel === ch.id ? "#fff" : "#8e9297",
              }}
            >
              <span style={{ color: "#72767d" }}>{ch.icon}</span>
              {ch.name}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        {/* User area */}
        <div className="px-2 py-2 flex items-center gap-2" style={{ background: "#292b2f" }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm relative" style={{ background: "#5865f2" }}>
            👤
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2" style={{ background: "#3ba55c", borderColor: "#292b2f" }} />
          </div>
          <div>
            <div className="text-xs font-bold" style={{ color: "#fff" }}>Visitor</div>
            <div className="text-[10px]" style={{ color: "#b9bbbe" }}>Online</div>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Channel header */}
        <div className="px-4 py-2 flex items-center gap-2" style={{ background: "#36393f", borderBottom: "1px solid #202225", boxShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>
          <span style={{ color: "#72767d" }}>#</span>
          <span className="font-bold text-sm" style={{ color: "#fff" }}>{activeChannel}</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className="flex gap-3 hover:bg-[#32353b] rounded px-1 py-1 transition-colors">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0" style={{ background: msg.isBot ? "#5865f2" : "#747f8d" }}>
                {msg.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-sm" style={{ color: msg.isBot ? "#5865f2" : "#fff" }}>
                    {msg.author}
                    {msg.isBot && <span className="ml-1 text-[9px] px-1 py-0.5 rounded" style={{ background: "#5865f2", color: "#fff" }}>BOT</span>}
                  </span>
                  <span className="text-[10px]" style={{ color: "#72767d" }}>{msg.time}</span>
                </div>
                <div className="text-sm whitespace-pre-wrap" style={{ color: "#dcddde" }}>
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
        <div className="px-4 py-3">
          <div className="rounded-lg px-4 py-2 text-sm" style={{ background: "#40444b", color: "#72767d" }}>
            Message #{activeChannel}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscordApp;
