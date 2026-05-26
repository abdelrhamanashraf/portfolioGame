import { useState } from "react";
import avatar from "@/assets/discord_avatar.png";
import myPic from "@/assets/my_pic.png";

const BOOKMARKS = [
  { name: "GitHub", url: "github.com/abdelrhamanashraf", icon: "🐙" },
  { name: "Portfolio", url: "abdelrhamanashraf.github.io", icon: "🌐" },
  { name: "LinkedIn", url: "linkedin.com/in/abdelrahman-ashraf", icon: "💼" },
  { name: "MDN Docs", url: "developer.mozilla.org", icon: "📖" },
  { name: "npm", url: "npmjs.com", icon: "📦" },
];

interface PageData {
  title: string;
  url: string;
  content: { type: "h1" | "h2" | "p" | "link" | "code" | "list" | "img" | "hr"; text?: string; items?: string[]; href?: string }[];
}

const PAGES: Record<string, PageData> = {
  "abdelrhamanashraf.github.io": {
    title: "Abdelrahman Ashraf — Portfolio",
    url: "https://abdelrhamanashraf.github.io",
    content: [
      { type: "h1", text: "👨‍💻 Abdelrahman Ashraf" },
      { type: "p", text: "Full-Stack Developer & Oracle Database/WebLogic Administrator based in Cairo, Egypt. Passionate about building scalable web apps and secure enterprise systems." },
      { type: "hr" },
      { type: "h2", text: "🛠️ Skills" },
      { type: "list", items: ["JavaScript / TypeScript — 90%", "React / Node.js / Express — 85%", "Oracle DB (11g/12c/19c) — 90%", "Oracle WebLogic 12c — 85%", "AWS / Azure / Docker — 80%", "Python / FastAPI / Django — 70%"] },
      { type: "hr" },
      { type: "h2", text: "🚀 Projects" },
      { type: "link", text: "WebLogic Microservice — Enterprise middleware", href: "github.com/abdelrhamanashraf" },
      { type: "link", text: "Netflix Replica — Full-stack streaming UI", href: "github.com/abdelrhamanashraf" },
      { type: "link", text: "Discord Bot — Utility bot with AI features", href: "github.com/abdelrhamanashraf" },
      { type: "link", text: "Udagram — Udacity cloud-hosted app", href: "github.com/abdelrhamanashraf" },
      { type: "hr" },
      { type: "h2", text: "📬 Contact" },
      { type: "p", text: "📧 contact@abdelrahmanashraf.tech" },
      { type: "p", text: "🐙 github.com/abdelrhamanashraf" },
      { type: "p", text: "💼 linkedin.com/in/abdelrahman-ashraf-a10070222" },
    ],
  },
  "github.com/abdelrhamanashraf": {
    title: "abdelrhamanashraf · GitHub",
    url: "https://github.com/abdelrhamanashraf",
    content: [
      { type: "h1", text: "🐙 abdelrhamanashraf" },
      { type: "p", text: "Full-Stack Developer & Oracle Admin • 23 repos • Cairo, Egypt" },
      { type: "hr" },
      { type: "h2", text: "📌 Pinned Repositories" },
      { type: "code", text: "Discord-Bot ⭐ 1  —  Utility bot with AI, reminders, API integrations\nJavaScript • Discord.js • Node.js" },
      { type: "code", text: "udagram  —  Udacity project 3 — cloud-hosted full-stack app\nTypeScript • AWS • Node.js" },
      { type: "code", text: "pixel-portfolio  —  Interactive pixel-art portfolio website\nReact • TypeScript • Vite" },
      { type: "hr" },
      { type: "h2", text: "💠 Tech Stack" },
      { type: "list", items: ["C, PowerShell, PHP, Python, TypeScript, JavaScript, HTML5, Bash", "AWS, Azure, Firebase, Google Cloud, Docker", "Django, FastAPI, Express.js, React, Next.js, Node.js, Vite, Angular", "Oracle DB, PostgreSQL, MongoDB, SQLite, MS SQL Server"] },
    ],
  },
  "linkedin.com/in/abdelrahman-ashraf": {
    title: "Abdelrahman Ashraf — LinkedIn",
    url: "https://linkedin.com/in/abdelrahman-ashraf-a10070222",
    content: [
      { type: "h1", text: "💼 Abdelrahman Ashraf" },
      { type: "p", text: "Full-Stack Developer & Oracle Admin • Giza, Al Jizah, Egypt • 500+ connections" },
      { type: "hr" },
      { type: "h2", text: "Professional Summary" },
      { type: "p", text: "Full-stack web developer and Oracle Database/WebLogic administrator with strong experience in backend development, database management, and server administration. Skilled in building scalable web applications, deploying microservices, and managing Oracle-based enterprise environments." },
      { type: "hr" },
      { type: "h2", text: "Education" },
      { type: "p", text: "🏢 Udacity" },
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
    { type: "link", text: "🌐 abdelrhamanashraf.github.io — My Portfolio", href: "abdelrhamanashraf.github.io" },
    { type: "link", text: "🐙 github.com/abdelrhamanashraf — My GitHub", href: "github.com/abdelrhamanashraf" },
    { type: "link", text: "💼 LinkedIn — Abdelrahman Ashraf", href: "linkedin.com/in/abdelrahman-ashraf" },
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
          { type: "link", text: "🌐 abdelrhamanashraf.github.io", href: "abdelrhamanashraf.github.io" },
          { type: "link", text: "🐙 github.com/abdelrhamanashraf", href: "github.com/abdelrhamanashraf" },
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
          {url && (
            <button
              type="button"
              onClick={() => window.open(url.startsWith("http") ? url : `https://${url}`, "_blank")}
              className="px-3 hover:bg-[#52525e] transition-colors flex items-center justify-center text-[10px] border-l border-[#5b5b66]"
              style={{ color: "#3fe1b0", fontWeight: "bold", fontFamily: "system-ui, sans-serif" }}
              title="Open this link in your real browser"
            >
              ↗ OPEN
            </button>
          )}
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
      <div className="flex-1 overflow-y-auto bg-white text-[#15141a]">
        {currentPage.url === "https://linkedin.com/in/abdelrahman-ashraf-a10070222" ? (
          /* ── LinkedIn Replica ── */
          <div className="w-full min-h-full bg-[#f3f2ef] pb-10">
            {/* Nav bar fake */}
            <div className="h-12 bg-white flex items-center px-4 border-b border-gray-300 gap-4">
              <span className="text-[#0a66c2] text-3xl font-bold">in</span>
              <div className="bg-[#eef3f8] px-3 py-1.5 rounded flex items-center gap-2 w-64">
                <span className="text-gray-500 text-sm">🔍</span>
                <span className="text-gray-500 text-sm">Search</span>
              </div>
            </div>
            
            <div className="max-w-[780px] mx-auto mt-6 flex flex-col gap-4">
              {/* Profile Card */}
              <div className="bg-white rounded-lg border border-gray-300 overflow-hidden relative">
                <div className="h-48 bg-[#1f2937] relative overflow-hidden">
                  <div className="absolute inset-0 opacity-40 font-mono text-green-400 text-xs p-4 leading-relaxed whitespace-pre" style={{ fontFamily: "'VT323', monospace" }}>
                    {`def request_seen(self, request):\n  fp = self.request_fingerprint(request)\n  if fp in self.fingerprints:\n    return True\n  self.fingerprints.add(fp)\n  if self.file:\n    self.file.write(fp + os.linesep)`}
                  </div>
                </div>
                <div className="px-6 pb-6 relative">
                  <div className="w-36 h-36 rounded-full border-4 border-white absolute -top-20 overflow-hidden bg-gray-200">
                    <img src={myPic} className="w-full h-full object-cover" alt="avatar" />
                  </div>
                  <div className="flex justify-end pt-4" style={{ minHeight: "56px" }}>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                        Abdelrahman Ashraf 
                        <span className="text-gray-500 text-lg">🛡️</span>
                      </h1>
                      <p className="text-gray-800 mt-1">Full-Stack Developer & Oracle Admin</p>
                      <p className="text-gray-500 text-sm mt-1">Giza, Al Jizah, Egypt • <span className="text-[#0a66c2] font-semibold cursor-pointer hover:underline">Contact info</span></p>
                      <p className="text-[#0a66c2] font-semibold text-sm mt-2 cursor-pointer hover:underline">500+ connections</p>
                      
                      <div className="flex gap-2 mt-3">
                        <button className="px-4 py-1.5 bg-[#0a66c2] text-white rounded-full font-semibold text-sm">Open to</button>
                        <button className="px-4 py-1.5 border border-[#0a66c2] text-[#0a66c2] rounded-full font-semibold text-sm">Add profile section</button>
                        <button className="px-4 py-1.5 border border-gray-500 text-gray-600 rounded-full font-semibold text-sm">More</button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded cursor-pointer">
                      <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">U</div>
                      <span className="text-sm font-semibold hover:text-[#0a66c2] hover:underline">Udacity</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Card */}
              <div className="bg-white rounded-lg border border-gray-300 p-6">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <p className="text-sm text-gray-800 leading-relaxed">
                  Full-stack web developer and Oracle Database/WebLogic administrator with strong experience in backend development, database management, and server administration. Skilled in building scalable web applications, deploying microservices, and managing Oracle-based enterprise environments.
                </p>
              </div>
            </div>
          </div>
        ) : currentPage.url === "https://github.com/abdelrhamanashraf" ? (
          /* ── GitHub Replica ── */
          <div className="w-full min-h-full bg-[#0d1117] text-[#c9d1d9] pb-10" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
            {/* GitHub Nav */}
            <div className="h-16 bg-[#010409] flex items-center px-6 gap-4 border-b border-[#21262d]">
              <span className="text-white text-3xl">🐙</span>
              <div className="bg-[#0d1117] border border-[#30363d] px-3 py-1 rounded-md text-sm text-[#8b949e] w-64">
                Search or jump to...
              </div>
              <div className="flex gap-4 text-sm font-semibold ml-2">
                <span className="cursor-pointer hover:text-white">Pull requests</span>
                <span className="cursor-pointer hover:text-white">Issues</span>
                <span className="cursor-pointer hover:text-white">Codespaces</span>
                <span className="cursor-pointer hover:text-white">Marketplace</span>
                <span className="cursor-pointer hover:text-white">Explore</span>
              </div>
            </div>

            {/* Profile Nav Tabs */}
            <div className="flex items-center justify-center gap-6 border-b border-[#21262d] pt-6 px-4">
              <div className="flex items-center gap-2 pb-3 border-b-2 border-[#f78166] text-[#c9d1d9] font-semibold text-sm cursor-pointer">
                <span>📖 Overview</span>
              </div>
              <div className="flex items-center gap-2 pb-3 text-[#c9d1d9] text-sm cursor-pointer hover:border-b-2 hover:border-[#8b949e]">
                <span>📚 Repositories</span>
                <span className="bg-[#161b22] text-[#c9d1d9] text-xs px-2 py-0.5 rounded-full">23</span>
              </div>
              <div className="flex items-center gap-2 pb-3 text-[#c9d1d9] text-sm cursor-pointer hover:border-b-2 hover:border-[#8b949e]">
                <span>🗂️ Projects</span>
              </div>
              <div className="flex items-center gap-2 pb-3 text-[#c9d1d9] text-sm cursor-pointer hover:border-b-2 hover:border-[#8b949e]">
                <span>📦 Packages</span>
              </div>
              <div className="flex items-center gap-2 pb-3 text-[#c9d1d9] text-sm cursor-pointer hover:border-b-2 hover:border-[#8b949e]">
                <span>⭐ Stars</span>
                <span className="bg-[#161b22] text-[#c9d1d9] text-xs px-2 py-0.5 rounded-full">4</span>
              </div>
            </div>

            <div className="max-w-[1280px] mx-auto mt-8 flex gap-8 px-8">
              {/* Left Sidebar */}
              <div className="w-1/4 flex flex-col gap-4">
                <div className="w-full aspect-square rounded-full border border-[#30363d] overflow-hidden bg-gray-800 relative z-10 -mt-12 shadow-xl">
                  <img src={myPic} className="w-full h-full object-cover" alt="avatar" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white leading-tight">abdelrhman ashraf</h1>
                  <h2 className="text-[#8b949e] text-xl font-light">abdelrhamanashraf</h2>
                </div>
                <div className="text-sm text-[#c9d1d9] flex items-center gap-2 mt-2">
                  <span>👥</span> <span className="font-bold text-white hover:text-[#58a6ff] cursor-pointer">2</span> followers · <span className="font-bold text-white hover:text-[#58a6ff] cursor-pointer">3</span> following
                </div>
                <div className="text-sm text-[#c9d1d9] flex items-center gap-2 mt-1">
                  <span>📍</span> cairo
                </div>
              </div>

              {/* Right Content */}
              <div className="w-3/4 flex flex-col gap-6">
                {/* Readme Card */}
                <div className="border border-[#30363d] rounded-md bg-[#0d1117] p-6">
                  <div className="text-xs text-[#8b949e] mb-4">abdelrhamanashraf / README.md</div>
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-[#21262d] pb-2 flex items-center gap-2">💻 Tech Stack:</h2>
                  <div className="flex flex-wrap gap-2">
                    {/* Tech Badges */}
                    {['C', 'POWERSHELL', 'PHP', 'PYTHON', 'TYPESCRIPT', 'JAVASCRIPT', 'HTML5', 'BASH SCRIPT', 'WINDOWS TERMINAL', 'AWS', 'AZURE', 'FIREBASE', 'GOOGLECLOUD', 'BOOTSTRAP', 'ANGULAR.JS', 'DJANGO', 'FASTAPI', 'EXPRESS.JS', 'EXPO', 'JWT', 'JQUERY', 'JINJA', 'JASMINE', 'NEXT', 'NODE.JS', 'REACT', 'VITE', 'MICROSOFT SQL SERVER', 'MONGODB', 'SQLITE', 'POSTGRES', 'CIRCLECI', 'DOCKER'].map(tech => (
                      <span key={tech} className="px-2 py-1 text-xs font-bold text-white rounded shadow-sm" style={{ background: `hsl(${Math.random() * 360}, 60%, 40%)` }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Popular Repositories */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#c9d1d9]">Popular repositories</span>
                    <span className="text-xs text-[#8b949e] cursor-pointer hover:text-[#58a6ff]">Customize your pins</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Repo 1 */}
                    <div className="border border-[#30363d] rounded-md p-4 flex flex-col justify-between h-32 bg-[#0d1117]">
                      <div className="flex justify-between items-start">
                        <span className="text-[#58a6ff] font-semibold text-sm hover:underline cursor-pointer">Discord-Bot</span>
                        <span className="text-xs text-[#8b949e] border border-[#30363d] px-2 py-0.5 rounded-full">Public</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[#8b949e]">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-yellow-300"></div>
                          JavaScript
                        </div>
                        <div className="flex items-center gap-1 hover:text-[#58a6ff] cursor-pointer">
                          ⭐ 1
                        </div>
                      </div>
                    </div>
                    {/* Repo 2 */}
                    <div className="border border-[#30363d] rounded-md p-4 flex flex-col justify-between h-32 bg-[#0d1117]">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <span className="text-[#58a6ff] font-semibold text-sm hover:underline cursor-pointer">udagram</span>
                          <span className="text-[#8b949e] text-xs mt-1">udacity 3 project</span>
                        </div>
                        <span className="text-xs text-[#8b949e] border border-[#30363d] px-2 py-0.5 rounded-full">Public</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[#8b949e]">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          TypeScript
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px" }}>
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
        )}
      </div>
    </div>
  );
};

export default FirefoxApp;
