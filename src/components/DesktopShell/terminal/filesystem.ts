// ─── Virtual Filesystem ──────────────────────────────────────
export interface FSNode {
  type: "file" | "dir";
  content?: string;
  permissions?: string;
  owner?: string;
  size?: number;
  children?: Record<string, FSNode>;
}

export const FILESYSTEM: Record<string, FSNode> = {
  "/": {
    type: "dir",
    children: {
      home: {
        type: "dir",
        children: {
          kuro: {
            type: "dir",
            children: {
              "about.txt": {
                type: "file", permissions: "-rw-r--r--", owner: "kuro", size: 412,
                content: `╔══════════════════════════════════════╗
║          ABOUT ME                    ║
╚══════════════════════════════════════╝

Hey! I'm Abdelrahman Ashraf — a Full-Stack Developer
and Oracle Database/WebLogic Administrator based in
Cairo, Egypt.

I specialize in building scalable web applications,
deploying microservices, and managing Oracle-based
enterprise environments.

Location: Cairo, Egypt 🇪🇬
Role: Full-Stack Developer & Oracle Admin
Status: Open to opportunities ✨`,
              },
              "skills.txt": {
                type: "file", permissions: "-rw-r--r--", owner: "kuro", size: 580,
                content: `╔══════════════════════════════════════╗
║          SKILLS                      ║
╚══════════════════════════════════════╝

Web Development
  JavaScript / TS    ████████████████████ 90%
  React / Next.js    ██████████████████░░ 85%
  Node.js / Express  ██████████████████░░ 85%
  Angular.js         ██████████████░░░░░░ 70%

Backend & Databases
  Oracle DB 11g-19c  ████████████████████ 90%
  PostgreSQL         ███████████████░░░░░ 75%
  MongoDB            ██████████████░░░░░░ 70%
  Python / FastAPI   ██████████████░░░░░░ 70%

Middleware & DevOps
  Oracle WebLogic    ██████████████████░░ 85%
  Docker / K8s       ██████████████░░░░░░ 70%
  AWS / Azure        ████████████████░░░░ 80%
  Git / Linux        ████████████████████ 90%`,
              },
              "contact.txt": {
                type: "file", permissions: "-rw-r--r--", owner: "kuro", size: 310,
                content: `╔══════════════════════════════════════╗
║          CONTACT                     ║
╚══════════════════════════════════════╝

📧 Email    → contact@abdelrahmanashraf.tech
📱 Phone    → +20 127 052 2508
🐙 GitHub   → github.com/abdelrhamanashraf
💼 LinkedIn → linkedin.com/in/abdelrahman-ashraf-a10070222
🌐 Portfolio→ abdelrhamanashraf.github.io
📍 Location → Cairo, Egypt`,
              },
              "education.txt": {
                type: "file", permissions: "-rw-r--r--", owner: "kuro", size: 280,
                content: `🎓 Bachelor's Degree — Computer Science
   Giza, Egypt
   Specialization: Software Engineering

🏅 Certifications & Training:
   ✦ Udacity — Full-Stack Web Development
   ✦ CCNA — Networking Basics
   ✦ Oracle Database Administration`,
              },
              ".bashrc": {
                type: "file", permissions: "-rw-r--r--", owner: "kuro", size: 220,
                content: `# ~/.bashrc
export PS1='\\u@portfolio:\\w\\$ '
export EDITOR=nano
export LANG=en_US.UTF-8
alias ll='ls -la'
alias gs='git status'
alias gp='git push'
alias cls='clear'
alias ..='cd ..'

# nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"`,
              },
              ".gitconfig": {
                type: "file", permissions: "-rw-r--r--", owner: "kuro", size: 120,
                content: `[user]
    name = Abdelrahman Ashraf
    email = contact@abdelrahmanashraf.tech
[core]
    editor = nano
[alias]
    st = status
    co = checkout
    br = branch`,
              },
              ".secret": {
                type: "file", permissions: "-rw-------", owner: "kuro", size: 180,
                content: `🎉 You found the secret file!

Easter egg: Try the Konami code in the room...
↑ ↑ ↓ ↓ ← → ← → B A

Thanks for exploring! 🚀`,
              },
              projects: {
                type: "dir",
                children: {
                  "weblogic-microservice": {
                    type: "dir",
                    children: {
                      "README.md": {
                        type: "file", permissions: "-rw-r--r--", owner: "kuro", size: 340,
                        content: `# WebLogic Microservice 🏗️

Built and deployed a microservice on WebLogic 12c,
connected to Oracle 19c with the latest patches.

Tech: Oracle WebLogic 12c, Oracle DB 19c, JDBC
Status: Complete

Features:
  • WAR deployment on WebLogic
  • JDBC connection configuration
  • Secure middleware environment
  • OPatch-applied Oracle 19c backend`,
                      },
                    },
                  },
                  "netflix-replica": {
                    type: "dir",
                    children: {
                      "README.md": {
                        type: "file", permissions: "-rw-r--r--", owner: "kuro", size: 280,
                        content: `# Netflix Replica 🎬

A Netflix-inspired full-stack streaming UI.

Tech: React, Node.js, Express
Status: Complete

Features:
  • Netflix-style streaming interface
  • Full-stack architecture
  • Responsive design
  • Backend API for content management`,
                      },
                      "package.json": {
                        type: "file", permissions: "-rw-r--r--", owner: "kuro", size: 95,
                        content: `{
  "name": "netflix-replica",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}`,
                      },
                    },
                  },
                  "discord-bot": {
                    type: "dir",
                    children: {
                      "README.md": {
                        type: "file", permissions: "-rw-r--r--", owner: "kuro", size: 310,
                        content: `# Discord Bot 🤖

A utility Discord bot with tons of features
including AI integration.

Tech: JavaScript, Node.js, Discord.js
Status: Active ⭐ 1 star

Features:
  • Notes, reminders, prayer times
  • API integration (Steam, MAL, MovieDB)
  • WhatsApp bridge & file upload
  • AI-powered smart responses`,
                      },
                    },
                  },
                  "udagram": {
                    type: "dir",
                    children: {
                      "README.md": {
                        type: "file", permissions: "-rw-r--r--", owner: "kuro", size: 200,
                        content: `# Udagram ☁️

Udacity project 3 — cloud-hosted full-stack app.

Tech: TypeScript, AWS, Node.js
Status: Complete

Features:
  • AWS deployment (S3, EB, RDS)
  • Full CI/CD pipeline
  • TypeScript backend & frontend`,
                      },
                    },
                  },
                },
              },
              Documents: {
                type: "dir",
                children: {
                  "resume.pdf": { type: "file", permissions: "-rw-r--r--", owner: "kuro", size: 47765, content: "[Binary: PDF document — Abdelrahman_Ashraf_resume.pdf]" },
                  "notes.txt": {
                    type: "file", permissions: "-rw-r--r--", owner: "kuro", size: 95,
                    content: `TODO:
- Finish portfolio pixel art
- Update resume
- Deploy to GitHub Pages
- Oracle 19c patching docs`,
                  },
                },
              },
              Downloads: { type: "dir", children: {} },
              ".ssh": {
                type: "dir",
                children: {
                  "id_rsa.pub": {
                    type: "file", permissions: "-rw-r--r--", owner: "kuro", size: 580,
                    content: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAAB... kuro@portfolio",
                  },
                  "known_hosts": { type: "file", permissions: "-rw-r--r--", owner: "kuro", size: 120, content: "github.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5..." },
                },
              },
            },
          },
        },
      },
      etc: {
        type: "dir",
        children: {
          hostname: { type: "file", permissions: "-rw-r--r--", owner: "root", size: 10, content: "portfolio" },
          "os-release": {
            type: "file", permissions: "-rw-r--r--", owner: "root", size: 160,
            content: `NAME="PortfolioOS"
VERSION="1.0"
ID=portfolioos
PRETTY_NAME="PortfolioOS 1.0 (Pixel)"
HOME_URL="https://abdelrhamanashraf.github.io"`,
          },
          passwd: {
            type: "file", permissions: "-rw-r--r--", owner: "root", size: 120,
            content: `root:x:0:0:root:/root:/bin/bash
kuro:x:1000:1000:Abdelrahman Ashraf:/home/kuro:/bin/bash
guest:x:1001:1001:Guest:/home/guest:/bin/bash`,
          },
          shadow: { type: "file", permissions: "-rw-------", owner: "root", size: 40, content: "Permission denied: insufficient privileges" },
          "resolv.conf": { type: "file", permissions: "-rw-r--r--", owner: "root", size: 50, content: "nameserver 8.8.8.8\nnameserver 8.8.4.4" },
          fstab: { type: "file", permissions: "-rw-r--r--", owner: "root", size: 90, content: "/dev/sda1  /        ext4  defaults  0 1\n/dev/sda2  /home    ext4  defaults  0 2\ntmpfs      /tmp     tmpfs defaults  0 0" },
        },
      },
      var: {
        type: "dir",
        children: {
          log: {
            type: "dir",
            children: {
              "syslog": { type: "file", permissions: "-rw-r-----", owner: "root", size: 2048, content: "May 25 18:00:01 portfolio CRON[1234]: (kuro) CMD (node ~/projects/discord-bot/index.js)\nMay 25 18:05:00 portfolio systemd[1]: Started Portfolio Web Server.\nMay 25 18:05:01 portfolio node[5678]: Server listening on port 3000\nMay 25 18:10:00 portfolio sshd[9012]: Accepted publickey for kuro" },
              "auth.log": { type: "file", permissions: "-rw-r-----", owner: "root", size: 512, content: "May 25 18:00:00 portfolio sudo: kuro : TTY=pts/0 ; PWD=/home/kuro ; USER=root ; COMMAND=/bin/systemctl restart nginx" },
            },
          },
          www: { type: "dir", children: { html: { type: "dir", children: { "index.html": { type: "file", permissions: "-rw-r--r--", owner: "www-data", size: 150, content: "<html><body><h1>Welcome to PortfolioOS</h1></body></html>" } } } } },
        },
      },
      usr: {
        type: "dir",
        children: {
          bin: { type: "dir", children: { node: { type: "file", permissions: "-rwxr-xr-x", owner: "root", size: 48000, content: "[Binary: Node.js v20.11.0]" }, python3: { type: "file", permissions: "-rwxr-xr-x", owner: "root", size: 32000, content: "[Binary: Python 3.12.0]" }, git: { type: "file", permissions: "-rwxr-xr-x", owner: "root", size: 12000, content: "[Binary: git 2.43.0]" } } },
          share: { type: "dir", children: {} },
        },
      },
      bin: {
        type: "dir",
        children: {
          bash: { type: "file", permissions: "-rwxr-xr-x", owner: "root", size: 1200, content: "[Binary: GNU bash 5.2]" },
          ls: { type: "file", permissions: "-rwxr-xr-x", owner: "root", size: 140, content: "[Binary]" },
          cat: { type: "file", permissions: "-rwxr-xr-x", owner: "root", size: 52, content: "[Binary]" },
          nano: { type: "file", permissions: "-rwxr-xr-x", owner: "root", size: 280, content: "[Binary: GNU nano 7.2]" },
          vi: { type: "file", permissions: "-rwxr-xr-x", owner: "root", size: 1100, content: "[Binary: VIM 9.0]" },
        },
      },
      tmp: { type: "dir", children: {} },
      dev: {
        type: "dir",
        children: {
          null: { type: "file", permissions: "crw-rw-rw-", owner: "root", size: 0, content: "" },
          zero: { type: "file", permissions: "crw-rw-rw-", owner: "root", size: 0, content: "" },
          random: { type: "file", permissions: "crw-rw-rw-", owner: "root", size: 0, content: "" },
        },
      },
      proc: {
        type: "dir",
        children: {
          version: { type: "file", permissions: "-r--r--r--", owner: "root", size: 80, content: "PortfolioOS version 1.0.0 (React 18.3 / TypeScript 5.8 / Vite 5.4)" },
          cpuinfo: { type: "file", permissions: "-r--r--r--", owner: "root", size: 200, content: "processor\t: 0\nmodel name\t: TypeScript v5.8 vCPU\ncpu MHz\t\t: 3600.000\ncache size\t: 256 KB\ncpu cores\t: 4" },
          meminfo: { type: "file", permissions: "-r--r--r--", owner: "root", size: 150, content: "MemTotal:       16384000 kB\nMemFree:        12288000 kB\nMemAvailable:   14336000 kB\nBuffers:          512000 kB\nCached:          1024000 kB" },
          uptime: { type: "file", permissions: "-r--r--r--", owner: "root", size: 20, content: "86400.00 345600.00" },
        },
      },
      root: { type: "dir", children: {} },
    },
  },
};

// ─── Path helpers ────────────────────────────────────────────
export function resolvePath(cwd: string, input: string): string {
  if (!input || input === "~") return "/home/kuro";
  if (input === "/") return "/";
  if (input.startsWith("~/")) input = "/home/kuro/" + input.slice(2);
  else if (input === "..") {
    const parts = cwd.split("/").filter(Boolean);
    parts.pop();
    return "/" + parts.join("/") || "/";
  } else if (!input.startsWith("/")) {
    input = cwd === "/" ? `/${input}` : `${cwd}/${input}`;
  }
  const parts = input.split("/").filter(p => p !== "." && p !== "");
  const result: string[] = [];
  for (const part of parts) {
    if (part === "..") result.pop();
    else result.push(part);
  }
  return "/" + result.join("/") || "/";
}

export function getNode(path: string): FSNode | null {
  if (path === "/") return FILESYSTEM["/"];
  const parts = path.split("/").filter(Boolean);
  let node: FSNode = FILESYSTEM["/"];
  for (const part of parts) {
    if (node.type !== "dir" || !node.children?.[part]) return null;
    node = node.children[part];
  }
  return node;
}
