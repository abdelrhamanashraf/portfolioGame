// ─── Virtual Filesystem ──────────────────────────────────────
interface FSNode {
  type: "file" | "dir";
  content?: string;
  children?: Record<string, FSNode>;
}

const FILESYSTEM: Record<string, FSNode> = {
  "~": {
    type: "dir",
    children: {
      "about.txt": {
        type: "file",
        content: `╔══════════════════════════════════════╗
║          ABOUT ME                    ║
╚══════════════════════════════════════╝

Hey! I'm a passionate Full-Stack Developer who loves
building interactive web experiences and pixel art.

I specialize in React, TypeScript, and Node.js, with
a strong focus on creating engaging user interfaces
that push the boundaries of what's possible on the web.

When I'm not coding, you'll find me playing retro
games, designing pixel art, or contributing to
open-source projects.

Location: Earth 🌍
Role: Full-Stack Developer
Status: Open to opportunities ✨`,
      },
      "skills.txt": {
        type: "file",
        content: `╔══════════════════════════════════════╗
║          SKILLS                      ║
╚══════════════════════════════════════╝

Frontend
  React / Next.js    ████████████████████ 90%
  TypeScript         ██████████████████░░ 85%
  CSS / Tailwind     ████████████████░░░░ 80%
  HTML5 / Canvas     ████████████████████ 90%

Backend
  Node.js / Express  ███████████████░░░░░ 75%
  Python / FastAPI   ██████████████░░░░░░ 70%
  PostgreSQL / SQL   ███████████████░░░░░ 75%
  REST / GraphQL     ██████████████████░░ 85%

DevOps & Tools
  Git / GitHub       ████████████████████ 90%
  Docker             ████████████░░░░░░░░ 60%
  AWS / EC2 / S3     ████████████░░░░░░░░ 60%
  CI/CD              ██████████░░░░░░░░░░ 55%`,
      },
      "contact.txt": {
        type: "file",
        content: `╔══════════════════════════════════════╗
║          CONTACT                     ║
╚══════════════════════════════════════╝

📧 Email    → hello@developer.dev
🐙 GitHub   → github.com/developer
🐦 Twitter  → @developer
💼 LinkedIn → linkedin.com/in/developer
🌐 Website  → developer.dev

Feel free to reach out! I'm always happy to
chat about new projects and opportunities.`,
      },
      "education.txt": {
        type: "file",
        content: `╔══════════════════════════════════════╗
║          EDUCATION                   ║
╚══════════════════════════════════════╝

🎓 Bachelor of Science in Computer Science
   University Name
   2020 — 2024
   GPA: 3.8 / 4.0
   Specialization: Software Engineering

🏅 Certifications:
   ✦ AWS Cloud Practitioner (2024)
   ✦ React Developer Certificate — Meta (2023)
   ✦ Full Stack Web Dev — freeCodeCamp (2022)`,
      },
      projects: {
        type: "dir",
        children: {
          "pixel-quest.md": {
            type: "file",
            content: `# Pixel Quest 🎮

A 2D adventure game built with vanilla JavaScript
and HTML5 Canvas.

Tech: JavaScript, Canvas API, Web Audio
Status: Complete
Link: github.com/developer/pixel-quest

Features:
  • Procedurally generated dungeons
  • Pixel-art character animations
  • Retro soundtrack & SFX
  • Inventory & crafting system`,
          },
          "retro-chat.md": {
            type: "file",
            content: `# RetroChat 💬

A real-time chat application with a retro terminal
aesthetic and WebSocket-powered messaging.

Tech: React, Node.js, WebSocket, MongoDB
Status: Complete
Link: github.com/developer/retro-chat

Features:
  • Real-time messaging with typing indicators
  • Custom emoji support
  • Channel system with permissions
  • Message search & history`,
          },
          "code-forge.md": {
            type: "file",
            content: `# CodeForge ⚡

An online code editor with live preview,
syntax highlighting, and collaboration features.

Tech: TypeScript, Monaco Editor, WebSocket
Status: In Progress
Link: github.com/developer/code-forge

Features:
  • Multi-language support (JS, TS, Python)
  • Real-time collaborative editing
  • Integrated terminal
  • Git integration`,
          },
        },
      },
      ".secret": {
        type: "file",
        content: `🎉 You found the secret file!

Easter egg: Try the Konami code in the room...
↑ ↑ ↓ ↓ ← → ← → B A

Thanks for exploring! You're clearly someone
who likes digging into systems. I appreciate
that kind of curiosity. 🚀`,
      },
    },
  },
};

// ─── Path Resolution ─────────────────────────────────────────
function resolvePath(cwd: string, input: string): string {
  if (input === "~" || input === "") return "~";
  if (input.startsWith("~/")) input = input;
  else if (input === "..") {
    const parts = cwd.split("/").filter(Boolean);
    parts.pop();
    return parts.length === 0 ? "~" : parts.join("/");
  } else if (input.startsWith("/")) return input;
  else input = cwd === "~" ? `~/${input}` : `${cwd}/${input}`;

  // Normalize path
  const parts = input.split("/").filter((p) => p !== ".");
  const result: string[] = [];
  for (const part of parts) {
    if (part === "..") result.pop();
    else result.push(part);
  }
  return result.join("/") || "~";
}

function getNode(path: string): FSNode | null {
  const parts = path.split("/").filter(Boolean);
  let node: FSNode = FILESYSTEM["~"];
  if (parts[0] === "~") parts.shift();

  for (const part of parts) {
    if (node.type !== "dir" || !node.children?.[part]) return null;
    node = node.children[part];
  }
  return node;
}

// ─── Command Output ──────────────────────────────────────────
export interface CommandOutput {
  text: string;
  color?: string;
}

// ─── Neofetch ASCII ──────────────────────────────────────────
const NEOFETCH = `\x1b[cyan]       ████████████       \x1b[reset]  guest@portfolio
\x1b[cyan]     ██            ██     \x1b[reset]  ─────────────────
\x1b[cyan]   ██    ██    ██    ██   \x1b[reset]  OS: PortfolioOS 1.0
\x1b[cyan]  ██    ████  ████    ██  \x1b[reset]  Host: Browser VM
\x1b[cyan]  ██                  ██  \x1b[reset]  Kernel: React 18.3
\x1b[cyan]  ██   ██        ██   ██  \x1b[reset]  Shell: psh 1.0
\x1b[cyan]   ██    ████████    ██   \x1b[reset]  DE: PixelDesktop
\x1b[cyan]     ██            ██     \x1b[reset]  WM: WindowManager
\x1b[cyan]       ████████████       \x1b[reset]  Theme: Retro Warm
\x1b[cyan]                          \x1b[reset]  Terminal: xterm-pixel
\x1b[cyan]  ██  ██  ██  ██  ██  ██ \x1b[reset]  CPU: TypeScript 5.8
                              Memory: ∞`;

// ─── Command Registry ────────────────────────────────────────
type CommandHandler = (
  args: string[],
  cwd: string,
  setCwd: (cwd: string) => void
) => CommandOutput[];

const COMMANDS: Record<string, CommandHandler> = {
  help: () => [
    { text: "Available commands:", color: "#0ff" },
    { text: "" },
    { text: "  help         Show this help message", color: "#aaa" },
    { text: "  whoami       Display user info", color: "#aaa" },
    { text: "  about        About me", color: "#aaa" },
    { text: "  skills       Show technical skills", color: "#aaa" },
    { text: "  projects     List projects", color: "#aaa" },
    { text: "  contact      Contact information", color: "#aaa" },
    { text: "  education    Education & certifications", color: "#aaa" },
    { text: "  neofetch     System info", color: "#aaa" },
    { text: "  ls [dir]     List directory contents", color: "#aaa" },
    { text: "  cd <dir>     Change directory", color: "#aaa" },
    { text: "  cat <file>   Read file contents", color: "#aaa" },
    { text: "  pwd          Print working directory", color: "#aaa" },
    { text: "  echo <text>  Print text", color: "#aaa" },
    { text: "  date         Show current date", color: "#aaa" },
    { text: "  clear        Clear terminal", color: "#aaa" },
    { text: "  history      Show command history", color: "#aaa" },
    { text: "  exit         Close terminal", color: "#aaa" },
    { text: "" },
    { text: "  Tip: Try 'neofetch' for system info!", color: "#666" },
  ],

  whoami: () => [
    { text: "guest", color: "#0f8" },
    { text: "Role: Visitor", color: "#aaa" },
    { text: "Access: read-only", color: "#aaa" },
  ],

  about: () => {
    const node = getNode("~/about.txt");
    if (!node?.content) return [{ text: "Error reading about.txt", color: "#f44" }];
    return node.content.split("\n").map((line) => ({ text: line, color: "#0f8" }));
  },

  skills: () => {
    const node = getNode("~/skills.txt");
    if (!node?.content) return [{ text: "Error reading skills.txt", color: "#f44" }];
    return node.content.split("\n").map((line) => ({ text: line, color: "#0ff" }));
  },

  projects: () => {
    const dir = getNode("~/projects");
    if (!dir?.children) return [{ text: "No projects found", color: "#f44" }];
    const lines: CommandOutput[] = [
      { text: "Projects:", color: "#ff0" },
      { text: "" },
    ];
    Object.entries(dir.children).forEach(([name, node]) => {
      if (node.type === "file") {
        const title = node.content?.split("\n").find((l) => l.startsWith("#"))?.replace("# ", "") || name;
        lines.push({ text: `  📁 ${title}`, color: "#0f8" });
        lines.push({ text: `     cat projects/${name}`, color: "#666" });
      }
    });
    return lines;
  },

  contact: () => {
    const node = getNode("~/contact.txt");
    if (!node?.content) return [{ text: "Error reading contact.txt", color: "#f44" }];
    return node.content.split("\n").map((line) => ({ text: line, color: "#0ff" }));
  },

  education: () => {
    const node = getNode("~/education.txt");
    if (!node?.content) return [{ text: "Error reading education.txt", color: "#f44" }];
    return node.content.split("\n").map((line) => ({ text: line, color: "#ff0" }));
  },

  neofetch: () => {
    return NEOFETCH.split("\n").map((line) => {
      // Parse our simple color codes
      let text = line;
      let color = "#0f8";
      if (text.includes("\x1b[cyan]")) {
        color = "#0ff";
        text = text.replace(/\x1b\[cyan\]/g, "").replace(/\x1b\[reset\]/g, "");
      }
      return { text, color };
    });
  },

  ls: (args, cwd) => {
    const target = args[0] ? resolvePath(cwd, args[0]) : cwd;
    const node = getNode(target);
    if (!node) return [{ text: `ls: cannot access '${args[0] || target}': No such file or directory`, color: "#f44" }];
    if (node.type !== "dir") return [{ text: args[0] || target, color: "#fff" }];

    const entries = Object.entries(node.children || {});
    if (entries.length === 0) return [{ text: "(empty directory)", color: "#666" }];

    return entries.map(([name, child]) => ({
      text: child.type === "dir" ? `📁 ${name}/` : `📄 ${name}`,
      color: child.type === "dir" ? "#55f" : name.startsWith(".") ? "#666" : "#fff",
    }));
  },

  cd: (args, cwd, setCwd) => {
    const target = args[0] || "~";
    const newPath = resolvePath(cwd, target);
    const node = getNode(newPath);

    if (!node) return [{ text: `cd: no such file or directory: ${target}`, color: "#f44" }];
    if (node.type !== "dir") return [{ text: `cd: not a directory: ${target}`, color: "#f44" }];

    setCwd(newPath);
    return [];
  },

  cat: (args, cwd) => {
    if (!args[0]) return [{ text: "cat: missing file operand", color: "#f44" }];
    const path = resolvePath(cwd, args[0]);
    const node = getNode(path);

    if (!node) return [{ text: `cat: ${args[0]}: No such file or directory`, color: "#f44" }];
    if (node.type === "dir") return [{ text: `cat: ${args[0]}: Is a directory`, color: "#f44" }];

    return (node.content || "").split("\n").map((line) => ({ text: line }));
  },

  pwd: (_args, cwd) => [{ text: cwd.replace("~", "/home/guest"), color: "#0f8" }],

  echo: (args) => [{ text: args.join(" ") }],

  date: () => [{ text: new Date().toString(), color: "#ff0" }],

  clear: () => [{ text: "__CLEAR__" }],

  history: () => [{ text: "Command history not persisted in this session.", color: "#666" }],

  exit: () => [{ text: "__EXIT__" }],
};

// ─── Execute Command ─────────────────────────────────────────
export function executeCommand(
  input: string,
  cwd: string,
  setCwd: (cwd: string) => void
): CommandOutput[] {
  const trimmed = input.trim();
  if (!trimmed) return [];

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  const handler = COMMANDS[cmd];
  if (!handler) {
    return [
      { text: `psh: command not found: ${cmd}`, color: "#f44" },
      { text: `Type 'help' for available commands.`, color: "#666" },
    ];
  }

  return handler(args, cwd, setCwd);
}

export function getPrompt(cwd: string): string {
  const path = cwd === "~" ? "~" : cwd.replace("~", "~");
  return `guest@portfolio:${path}$`;
}
