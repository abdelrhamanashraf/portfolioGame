import { useState } from "react";

const FILES = [
  {
    name: "about.tsx",
    icon: "⚛️",
    language: "typescriptreact",
    content: `// About Me — Portfolio Component
import React from "react";

interface Developer {
  name: string;
  role: string;
  location: string;
  passions: string[];
}

const developer: Developer = {
  name: "Developer",
  role: "Full-Stack Developer",
  location: "Earth 🌍",
  passions: [
    "Interactive Web Experiences",
    "Pixel Art & Game Dev",
    "Open Source",
    "Retro Computing",
  ],
};

export const AboutMe = () => (
  <section className="about">
    <h1>{developer.name}</h1>
    <p>
      Hey! I'm a passionate {developer.role} who
      loves building interactive web experiences
      and pixel art.
    </p>
    <p>
      I specialize in React, TypeScript, and
      Node.js, with a strong focus on creating
      engaging user interfaces.
    </p>
    <ul>
      {developer.passions.map((p) => (
        <li key={p}>✦ {p}</li>
      ))}
    </ul>
  </section>
);`,
  },
  {
    name: "skills.json",
    icon: "📊",
    language: "json",
    content: `{
  "frontend": {
    "React / Next.js": 90,
    "TypeScript": 85,
    "CSS / Tailwind": 80,
    "HTML5 / Canvas": 90
  },
  "backend": {
    "Node.js / Express": 75,
    "Python / FastAPI": 70,
    "PostgreSQL": 75,
    "REST / GraphQL": 85
  },
  "devops": {
    "Git / GitHub": 90,
    "Docker": 60,
    "AWS": 60,
    "CI/CD": 55
  }
}`,
  },
  {
    name: "projects.ts",
    icon: "🚀",
    language: "typescript",
    content: `// Portfolio Projects
interface Project {
  name: string;
  description: string;
  tech: string[];
  status: "complete" | "in-progress";
  url: string;
}

export const projects: Project[] = [
  {
    name: "Pixel Quest",
    description: "2D adventure game with procedural"
      + " dungeons and pixel-art animations",
    tech: ["JavaScript", "Canvas", "Web Audio"],
    status: "complete",
    url: "github.com/developer/pixel-quest",
  },
  {
    name: "RetroChat",
    description: "Real-time chat app with retro"
      + " terminal aesthetic",
    tech: ["React", "Node.js", "WebSocket"],
    status: "complete",
    url: "github.com/developer/retro-chat",
  },
  {
    name: "CodeForge",
    description: "Online code editor with live"
      + " preview and collaboration",
    tech: ["TypeScript", "Monaco", "WebSocket"],
    status: "in-progress",
    url: "github.com/developer/code-forge",
  },
];`,
  },
  {
    name: "contact.md",
    icon: "📧",
    language: "markdown",
    content: `# Contact Information

## Get In Touch

| Channel  | Link                        |
|----------|-----------------------------|
| Email    | hello@developer.dev         |
| GitHub   | github.com/developer        |
| Twitter  | @developer                  |
| LinkedIn | linkedin.com/in/developer   |
| Website  | developer.dev               |

---

*Feel free to reach out! I'm always happy to
chat about new projects and opportunities.*`,
  },
];

const SYNTAX_COLORS: Record<string, Record<string, string>> = {
  typescriptreact: {
    keyword: "#c586c0", string: "#ce9178", comment: "#6a9955",
    type: "#4ec9b0", func: "#dcdcaa", number: "#b5cea8",
    tag: "#569cd6", attr: "#9cdcfe", default: "#d4d4d4",
  },
  typescript: {
    keyword: "#c586c0", string: "#ce9178", comment: "#6a9955",
    type: "#4ec9b0", func: "#dcdcaa", number: "#b5cea8",
    default: "#d4d4d4",
  },
  json: {
    keyword: "#569cd6", string: "#ce9178", number: "#b5cea8",
    default: "#d4d4d4",
  },
  markdown: {
    keyword: "#569cd6", string: "#ce9178", comment: "#6a9955",
    default: "#d4d4d4",
  },
};

function colorLine(line: string, lang: string): { text: string; color: string }[] {
  const colors = SYNTAX_COLORS[lang] || SYNTAX_COLORS.typescript;
  const parts: { text: string; color: string }[] = [];

  if (line.trimStart().startsWith("//") || line.trimStart().startsWith("*") || line.trimStart().startsWith("#")) {
    return [{ text: line, color: colors.comment || colors.default }];
  }

  const keywords = /\b(import|export|from|const|let|var|interface|type|function|return|if|else|class|new|true|false|null|undefined)\b/g;
  let last = 0;
  let match;

  while ((match = keywords.exec(line)) !== null) {
    if (match.index > last) parts.push({ text: line.slice(last, match.index), color: colors.default });
    parts.push({ text: match[0], color: colors.keyword });
    last = match.index + match[0].length;
  }

  if (last < line.length) parts.push({ text: line.slice(last), color: colors.default });
  if (parts.length === 0) parts.push({ text: line, color: colors.default });
  return parts;
}

const VSCodeApp = () => {
  const [activeFile, setActiveFile] = useState(0);
  const file = FILES[activeFile];
  const lines = file.content.split("\n");

  return (
    <div className="w-full h-full flex flex-col" style={{ background: "#1e1e1e", color: "#d4d4d4", fontFamily: "'VT323', monospace" }}>
      {/* Tab bar */}
      <div className="flex items-center" style={{ background: "#252526", borderBottom: "1px solid #3c3c3c" }}>
        {FILES.map((f, i) => (
          <button
            key={f.name}
            onClick={() => setActiveFile(i)}
            className="px-3 py-1.5 text-[13px] flex items-center gap-1.5 border-r transition-colors"
            style={{
              background: i === activeFile ? "#1e1e1e" : "#2d2d2d",
              color: i === activeFile ? "#fff" : "#888",
              borderColor: "#3c3c3c",
              borderTop: i === activeFile ? "2px solid #007acc" : "2px solid transparent",
            }}
          >
            <span className="text-xs">{f.icon}</span>
            {f.name}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* File explorer sidebar */}
        <div className="w-44 flex-shrink-0 overflow-y-auto" style={{ background: "#252526", borderRight: "1px solid #3c3c3c" }}>
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: "#888" }}>
            Explorer
          </div>
          <div className="px-2 py-1 text-[11px] font-bold" style={{ color: "#ccc" }}>
            📂 PORTFOLIO
          </div>
          {FILES.map((f, i) => (
            <button
              key={f.name}
              onClick={() => setActiveFile(i)}
              className="w-full text-left px-4 py-0.5 text-[13px] flex items-center gap-1.5 transition-colors"
              style={{
                background: i === activeFile ? "#37373d" : "transparent",
                color: i === activeFile ? "#fff" : "#aaa",
              }}
            >
              <span className="text-xs">{f.icon}</span>
              {f.name}
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-auto">
          <div className="p-0">
            {lines.map((line, i) => (
              <div key={i} className="flex hover:bg-[#2a2d2e] text-[14px]" style={{ lineHeight: "20px" }}>
                <span className="w-10 text-right pr-3 select-none flex-shrink-0" style={{ color: "#858585" }}>
                  {i + 1}
                </span>
                <span className="whitespace-pre">
                  {colorLine(line, file.language).map((part, j) => (
                    <span key={j} style={{ color: part.color }}>{part.text}</span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-0.5 text-[11px]" style={{ background: "#007acc", color: "#fff" }}>
        <div className="flex items-center gap-3">
          <span>⚡ Portfolio</span>
          <span>⎇ main</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{file.language}</span>
          <span>Ln {lines.length}</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
};

export default VSCodeApp;
