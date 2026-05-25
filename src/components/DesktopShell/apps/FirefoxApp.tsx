import { useState } from "react";

const BOOKMARKS = [
  { name: "GitHub", url: "github.com/developer", icon: "🐙" },
  { name: "Portfolio", url: "developer.dev", icon: "🌐" },
  { name: "MDN Docs", url: "developer.mozilla.org", icon: "📖" },
  { name: "Stack Overflow", url: "stackoverflow.com", icon: "📚" },
  { name: "npm", url: "npmjs.com", icon: "📦" },
];

interface PageData {
  title: string;
  url: string;
  content: { type: "h1" | "h2" | "p" | "link" | "code" | "list" | "img" | "hr"; text?: string; items?: string[]; href?: string }[];
}

const PAGES: Record<string, PageData> = {
  "developer.dev": {
    title: "Developer Portfolio",
    url: "https://developer.dev",
    content: [
      { type: "h1", text: "👨‍💻 Welcome to My Portfolio" },
      { type: "p", text: "I'm a Full-Stack Developer passionate about creating interactive web experiences, pixel art, and retro games." },
      { type: "hr" },
      { type: "h2", text: "🛠️ Skills" },
      { type: "list", items: ["React / Next.js — 90%", "TypeScript — 85%", "Node.js / Express — 75%", "PostgreSQL — 75%", "Docker / AWS — 60%"] },
      { type: "hr" },
      { type: "h2", text: "🚀 Featured Projects" },
      { type: "link", text: "Pixel Quest — 2D adventure game", href: "github.com/developer" },
      { type: "link", text: "RetroChat — Real-time chat app", href: "github.com/developer" },
      { type: "link", text: "CodeForge — Online code editor", href: "github.com/developer" },
      { type: "hr" },
      { type: "h2", text: "📬 Contact" },
      { type: "p", text: "📧 hello@developer.dev" },
      { type: "p", text: "🐙 github.com/developer" },
      { type: "p", text: "🐦 @developer" },
    ],
  },
  "github.com/developer": {
    title: "developer (Developer) · GitHub",
    url: "https://github.com/developer",
    content: [
      { type: "h1", text: "🐙 developer" },
      { type: "p", text: "Full-Stack Developer • Pixel Art Enthusiast • Retro Game Creator" },
      { type: "hr" },
      { type: "h2", text: "📌 Pinned Repositories" },
      { type: "code", text: "pixel-quest ⭐ 142  —  2D adventure game with procedural dungeons\nJavaScript • Canvas • Web Audio" },
      { type: "code", text: "retro-chat ⭐ 89  —  Real-time chat with retro terminal aesthetic\nReact • Node.js • WebSocket" },
      { type: "code", text: "code-forge ⭐ 67  —  Online code editor with live preview\nTypeScript • Monaco • WebSocket" },
      { type: "code", text: "pixel-portfolio ⭐ 203  —  This interactive pixel-art portfolio!\nReact • TypeScript • Vite" },
      { type: "hr" },
      { type: "p", text: "🟢 1,247 contributions in the last year" },
    ],
  },
  "developer.mozilla.org": {
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    content: [
      { type: "h1", text: "📖 MDN Web Docs" },
      { type: "p", text: "Resources for developers, by developers." },
      { type: "hr" },
      { type: "h2", text: "Web Technologies" },
      { type: "link", text: "HTML — Structuring the web", href: "developer.mozilla.org" },
      { type: "link", text: "CSS — Styling the web", href: "developer.mozilla.org" },
      { type: "link", text: "JavaScript — Dynamic client-side scripting", href: "developer.mozilla.org" },
      { type: "link", text: "Web APIs — Interfaces for building the web", href: "developer.mozilla.org" },
    ],
  },
};

const HOME_PAGE: PageData = {
  title: "New Tab",
  url: "",
  content: [
    { type: "h1", text: "🦊 Firefox" },
    { type: "p", text: "Search the web or enter an address" },
    { type: "hr" },
    { type: "h2", text: "⭐ Top Sites" },
    { type: "link", text: "🌐 developer.dev — My Portfolio", href: "developer.dev" },
    { type: "link", text: "🐙 github.com/developer — My GitHub", href: "github.com/developer" },
    { type: "link", text: "📖 MDN Web Docs", href: "developer.mozilla.org" },
  ],
};

const FirefoxApp = () => {
  const [url, setUrl] = useState("");
  const [currentPage, setCurrentPage] = useState<PageData>(HOME_PAGE);
  const [inputUrl, setInputUrl] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [tabs] = useState([{ id: 1, title: "New Tab" }]);

  const navigate = (target: string) => {
    const page = PAGES[target];
    if (page) {
      setCurrentPage(page);
      setUrl(page.url);
      setInputUrl(page.url);
      setHistory(prev => [...prev.slice(0, histIdx + 1), target]);
      setHistIdx(prev => prev + 1);
    }
  };

  const handleGo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
    if (PAGES[clean]) {
      navigate(clean);
    } else {
      setCurrentPage({
        title: "Page not found",
        url: `https://${clean}`,
        content: [
          { type: "h1", text: "🔍 Page Not Found" },
          { type: "p", text: `The page "${clean}" could not be found.` },
          { type: "p", text: "Try one of these instead:" },
          { type: "link", text: "🌐 developer.dev", href: "developer.dev" },
          { type: "link", text: "🐙 github.com/developer", href: "github.com/developer" },
        ],
      });
      setUrl(`https://${clean}`);
    }
  };

  const goBack = () => {
    if (histIdx > 0) {
      const prev = history[histIdx - 1];
      setHistIdx(histIdx - 1);
      const page = PAGES[prev];
      if (page) { setCurrentPage(page); setUrl(page.url); setInputUrl(page.url); }
    }
  };

  const goForward = () => {
    if (histIdx < history.length - 1) {
      const next = history[histIdx + 1];
      setHistIdx(histIdx + 1);
      const page = PAGES[next];
      if (page) { setCurrentPage(page); setUrl(page.url); setInputUrl(page.url); }
    }
  };

  const goHome = () => {
    setCurrentPage(HOME_PAGE);
    setUrl("");
    setInputUrl("");
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: "#2b2a33", color: "#fbfbfe", fontFamily: "'VT323', monospace" }}>

      {/* Tab bar */}
      <div className="flex items-center px-1 pt-1 gap-0.5" style={{ background: "#1c1b22" }}>
        {tabs.map(t => (
          <div key={t.id} className="flex items-center gap-1.5 px-3 py-1 rounded-t-md max-w-[200px]" style={{ background: "#2b2a33", color: "#fbfbfe", fontSize: "12px" }}>
            <span className="truncate">{currentPage.title || t.title}</span>
            <span className="text-[10px] cursor-pointer hover:text-red-400 ml-1">✕</span>
          </div>
        ))}
        <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#52525e] transition-colors" style={{ color: "#fbfbfe", fontSize: "14px" }}>+</button>
      </div>

      {/* Navigation bar */}
      <div className="flex items-center gap-1.5 px-2 py-1" style={{ background: "#2b2a33", borderBottom: "1px solid #1c1b22" }}>
        <button onClick={goBack} className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#52525e] transition-colors" style={{ color: histIdx > 0 ? "#fbfbfe" : "#5b5b66", fontSize: "14px" }}>←</button>
        <button onClick={goForward} className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#52525e] transition-colors" style={{ color: histIdx < history.length - 1 ? "#fbfbfe" : "#5b5b66", fontSize: "14px" }}>→</button>
        <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#52525e] transition-colors" style={{ color: "#fbfbfe", fontSize: "14px" }}>🔄</button>
        <button onClick={goHome} className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#52525e] transition-colors" style={{ color: "#fbfbfe", fontSize: "14px" }}>🏠</button>

        {/* URL bar */}
        <form onSubmit={handleGo} className="flex-1 flex items-center rounded-md overflow-hidden" style={{ background: "#42414d", border: "1px solid #5b5b66" }}>
          <span className="px-2" style={{ color: url ? "#3fe1b0" : "#5b5b66", fontSize: "12px" }}>{url ? "🔒" : "🔍"}</span>
          <input
            type="text"
            value={inputUrl}
            onChange={e => setInputUrl(e.target.value)}
            placeholder="Search or enter address"
            className="flex-1 bg-transparent border-none outline-none py-1 text-[13px]"
            style={{ color: "#fbfbfe", fontFamily: "'VT323', monospace" }}
            spellCheck={false}
          />
        </form>

        <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#52525e] transition-colors" style={{ color: "#fbfbfe", fontSize: "14px" }}>☰</button>
      </div>

      {/* Bookmarks bar */}
      <div className="flex items-center gap-1 px-3 py-0.5" style={{ background: "#2b2a33", borderBottom: "1px solid #42414d", fontSize: "11px" }}>
        {BOOKMARKS.map(b => (
          <button
            key={b.name}
            onClick={() => navigate(b.url)}
            className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-[#52525e] transition-colors truncate"
            style={{ color: "#bfbfc9", maxWidth: "120px" }}
          >
            <span>{b.icon}</span>
            <span className="truncate">{b.name}</span>
          </button>
        ))}
      </div>

      {/* Page content */}
      <div className="flex-1 overflow-y-auto p-4" style={{ background: "#f9f9fb" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          {currentPage.content.map((block, i) => {
            switch (block.type) {
              case "h1":
                return <h1 key={i} style={{ fontSize: "22px", color: "#15141a", fontFamily: "'Press Start 2P', monospace", marginBottom: "12px", lineHeight: 1.4 }}>{block.text}</h1>;
              case "h2":
                return <h2 key={i} style={{ fontSize: "16px", color: "#15141a", fontWeight: "bold", marginTop: "16px", marginBottom: "8px" }}>{block.text}</h2>;
              case "p":
                return <p key={i} style={{ fontSize: "14px", color: "#5b5b66", lineHeight: 1.5, marginBottom: "6px" }}>{block.text}</p>;
              case "hr":
                return <hr key={i} style={{ border: "none", borderTop: "1px solid #ddd", margin: "12px 0" }} />;
              case "link":
                return (
                  <div key={i} className="py-1">
                    <button
                      onClick={() => block.href && navigate(block.href)}
                      className="hover:underline transition-colors"
                      style={{ color: "#0060df", fontSize: "14px", textAlign: "left" }}
                    >
                      {block.text}
                    </button>
                  </div>
                );
              case "code":
                return (
                  <pre key={i} className="p-3 rounded my-2 overflow-x-auto" style={{ background: "#f0f0f4", border: "1px solid #ddd", color: "#15141a", fontSize: "12px", lineHeight: 1.4 }}>
                    {block.text}
                  </pre>
                );
              case "list":
                return (
                  <ul key={i} style={{ paddingLeft: "20px", marginBottom: "8px" }}>
                    {block.items?.map((item, j) => (
                      <li key={j} style={{ fontSize: "14px", color: "#5b5b66", lineHeight: 1.6 }}>• {item}</li>
                    ))}
                  </ul>
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default FirefoxApp;
