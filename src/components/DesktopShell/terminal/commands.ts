import { resolvePath, getNode, type FSNode } from "./filesystem";

export interface CommandOutput {
  text: string;
  color?: string;
  isApp?: string;
  appProps?: any;
}

const NEOFETCH = `\x1b[cyan]       ████████████       \x1b[reset]  kuro@portfolio
\x1b[cyan]     ██            ██     \x1b[reset]  ─────────────────
\x1b[cyan]   ██    ██    ██    ██   \x1b[reset]  OS: PortfolioOS 1.0 (Pixel)
\x1b[cyan]  ██    ████  ████    ██  \x1b[reset]  Host: Browser VM
\x1b[cyan]  ██                  ██  \x1b[reset]  Kernel: React 18.3
\x1b[cyan]  ██   ██        ██   ██  \x1b[reset]  Shell: psh 1.0
\x1b[cyan]   ██    ████████    ██   \x1b[reset]  DE: PixelDesktop
\x1b[cyan]     ██            ██     \x1b[reset]  WM: WindowManager
\x1b[cyan]       ████████████       \x1b[reset]  Theme: Retro Warm
\x1b[cyan]                          \x1b[reset]  Terminal: xterm-pixel
\x1b[cyan]  ██  ██  ██  ██  ██  ██ \x1b[reset]  CPU: TypeScript 5.8 vCPU
                              Memory: 4096MiB / 16384MiB`;

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
    { text: "  df           Report file system disk space usage", color: "#aaa" },
    { text: "  nano <file>  Edit a file in nano (simulated)", color: "#aaa" },
    { text: "  vi <file>    Edit a file in vi (simulated)", color: "#aaa" },
    { text: "  sudo <cmd>   Execute a command as superuser", color: "#aaa" },
    { text: "  echo <text>  Print text", color: "#aaa" },
    { text: "  date         Show current date", color: "#aaa" },
    { text: "  clear        Clear terminal", color: "#aaa" },
    { text: "  history      Show command history", color: "#aaa" },
    { text: "  exit         Close terminal", color: "#aaa" },
    { text: "" },
    { text: "  Tip: Try 'neofetch' for system info!", color: "#666" },
  ],

  whoami: () => [
    { text: "kuro", color: "#0f8" },
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
      if (node.type === "dir" && node.children && node.children["README.md"]) {
        const title = node.children["README.md"].content?.split("\n").find((l) => l.startsWith("#"))?.replace("# ", "") || name;
        lines.push({ text: `  📁 ${title}`, color: "#0f8" });
        lines.push({ text: `     cat projects/${name}/README.md`, color: "#666" });
      } else if (node.type === "file") {
        const title = node.content?.split("\n").find((l) => l.startsWith("#"))?.replace("# ", "") || name;
        lines.push({ text: `  📄 ${title}`, color: "#0f8" });
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
        text = text.replace(/\x1b\\[cyan\\]/g, "").replace(/\x1b\\[reset\\]/g, "");
      }
      return { text, color };
    });
  },

  ls: (args, cwd) => {
    const isAll = args.includes("-a") || args.includes("-la") || args.includes("-al");
    const isLong = args.includes("-l") || args.includes("-la") || args.includes("-al");
    const targetArg = args.find(a => !a.startsWith("-"));
    
    const target = targetArg ? resolvePath(cwd, targetArg) : cwd;
    const node = getNode(target);
    if (!node) return [{ text: `ls: cannot access '${targetArg || target}': No such file or directory`, color: "#f44" }];
    
    if (node.type !== "dir") {
      if (isLong) {
        return [{ text: `${node.permissions || '-rw-r--r--'} 1 ${node.owner || 'kuro'} ${node.owner || 'kuro'} ${node.size || 0} ${targetArg || target}`, color: "#fff" }];
      }
      return [{ text: targetArg || target, color: "#fff" }];
    }

    let entries = Object.entries(node.children || {});
    if (!isAll) {
      entries = entries.filter(([name]) => !name.startsWith("."));
    }
    
    if (entries.length === 0) return [{ text: "(empty directory)", color: "#666" }];

    if (isLong) {
      const output: CommandOutput[] = [{ text: `total ${entries.length * 4}`, color: "#ccc" }];
      if (isAll) {
        output.push({ text: `drwxr-xr-x 1 ${node.owner || 'kuro'} ${node.owner || 'kuro'} 4096 .`, color: "#55f" });
        output.push({ text: `drwxr-xr-x 1 ${node.owner || 'kuro'} ${node.owner || 'kuro'} 4096 ..`, color: "#55f" });
      }
      entries.forEach(([name, child]) => {
        const perms = child.permissions || (child.type === "dir" ? "drwxr-xr-x" : "-rw-r--r--");
        const owner = child.owner || "kuro";
        const size = child.size || (child.type === "dir" ? 4096 : 0);
        const color = child.type === "dir" ? "#55f" : name.startsWith(".") ? "#666" : "#fff";
        output.push({ text: `${perms} 1 ${owner} ${owner} ${String(size).padStart(6, ' ')} ${name}`, color });
      });
      return output;
    }

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
    if (node.permissions && !node.permissions.includes("r") && node.owner === "root") {
      return [{ text: `cat: ${args[0]}: Permission denied`, color: "#f44" }];
    }

    return (node.content || "").split("\n").map((line) => ({ text: line }));
  },

  pwd: (_args, cwd) => [{ text: cwd, color: "#0f8" }],

  df: () => [
    { text: "Filesystem      1K-blocks      Used Available Use% Mounted on", color: "#ccc" },
    { text: "udev              8192000         0   8192000   0% /dev", color: "#fff" },
    { text: "tmpfs             1638400      1024   1637376   1% /run", color: "#fff" },
    { text: "/dev/sda1       102400000  48300000  54100000  48% /", color: "#fff" },
    { text: "/dev/sda2        51200000    102400  51097600   1% /home", color: "#fff" },
    { text: "tmpfs             8192000         0   8192000   0% /dev/shm", color: "#fff" },
    { text: "tmpfs                5120         4      5116   1% /run/lock", color: "#fff" },
  ],

  nano: (args, cwd) => {
    if (!args[0]) return [{ text: "nano: missing file operand", color: "#f44" }];
    const path = resolvePath(cwd, args[0]);
    const node = getNode(path);
    
    if (node && node.type === "dir") return [{ text: `nano: ${args[0]} is a directory`, color: "#f44" }];
    
    return [
      { 
        text: "__NANO__", 
        isApp: "nano", 
        appProps: { 
          filename: args[0], 
          initialContent: node?.content || "" 
        } 
      }
    ];
  },

  vi: (args, cwd) => {
    if (!args[0]) return [{ text: "vi: missing file operand", color: "#f44" }];
    const path = resolvePath(cwd, args[0]);
    const node = getNode(path);
    
    if (node && node.type === "dir") return [{ text: `vi: ${args[0]} is a directory`, color: "#f44" }];
    
    return [
      { 
        text: "__VIM__", 
        isApp: "vim", 
        appProps: { 
          filename: args[0], 
          initialContent: node?.content || "" 
        } 
      }
    ];
  },

  vim: (args, cwd, setCwd) => COMMANDS.vi(args, cwd, setCwd),

  sudo: (args, cwd, setCwd) => {
    if (args.length === 0) return [{ text: "usage: sudo <command>", color: "#f44" }];
    return [
      { text: "[sudo] password for kuro: ", color: "#fff" },
      { text: "kuro is not in the sudoers file. This incident will be reported.", color: "#f44" }
    ];
  },

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
  let cmd = parts[0].toLowerCase();
  let args = parts.slice(1);

  // aliases
  if (cmd === "ll") {
    cmd = "ls";
    args = ["-la", ...args];
  } else if (cmd === "cls") {
    cmd = "clear";
  }

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
  const path = cwd.startsWith("/home/kuro") 
    ? cwd.replace("/home/kuro", "~") 
    : cwd;
  return `kuro@portfolio:${path}$`;
}
