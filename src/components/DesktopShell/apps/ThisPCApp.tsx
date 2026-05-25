import { useState } from "react";

interface FsItem {
  name: string;
  type: "drive" | "folder" | "file";
  icon: string;
  size?: string;
  modified?: string;
  children?: FsItem[];
}

const FILE_SYSTEM: FsItem[] = [
  {
    name: "Local Disk (C:)", type: "drive", icon: "💾",
    children: [
      { name: "Program Files", type: "folder", icon: "📁", children: [
        { name: "Steam", type: "folder", icon: "📁", children: [
          { name: "steam.exe", type: "file", icon: "🎮", size: "4.2 MB", modified: "2024-01-15" },
        ]},
        { name: "Discord", type: "folder", icon: "📁", children: [
          { name: "discord.exe", type: "file", icon: "💬", size: "120 MB", modified: "2024-03-20" },
        ]},
        { name: "VS Code", type: "folder", icon: "📁", children: [
          { name: "code.exe", type: "file", icon: "📝", size: "95 MB", modified: "2024-02-10" },
        ]},
      ]},
      { name: "Users", type: "folder", icon: "📁", children: [
        { name: "Developer", type: "folder", icon: "👤", children: [
          { name: "Desktop", type: "folder", icon: "🖥️", children: [
            { name: "portfolio.lnk", type: "file", icon: "🌐", size: "1 KB", modified: "2024-04-01" },
            { name: "notes.txt", type: "file", icon: "📄", size: "2 KB", modified: "2024-04-15" },
          ]},
          { name: "Documents", type: "folder", icon: "📂", children: [
            { name: "resume.pdf", type: "file", icon: "📃", size: "256 KB", modified: "2024-03-01" },
            { name: "cover_letter.docx", type: "file", icon: "📝", size: "45 KB", modified: "2024-03-05" },
          ]},
          { name: "Projects", type: "folder", icon: "📂", children: [
            { name: "pixel-portfolio", type: "folder", icon: "📁", children: [
              { name: "package.json", type: "file", icon: "{}", size: "1 KB", modified: "2024-04-20" },
              { name: "src", type: "folder", icon: "📁", children: [
                { name: "App.tsx", type: "file", icon: "⚛️", size: "3 KB", modified: "2024-04-20" },
                { name: "main.tsx", type: "file", icon: "⚛️", size: "1 KB", modified: "2024-04-20" },
                { name: "index.css", type: "file", icon: "#️⃣", size: "5 KB", modified: "2024-04-20" },
              ]},
              { name: "README.md", type: "file", icon: "📄", size: "2 KB", modified: "2024-04-20" },
            ]},
            { name: "retro-chat", type: "folder", icon: "📁" },
            { name: "pixel-quest", type: "folder", icon: "📁" },
          ]},
          { name: "Downloads", type: "folder", icon: "⬇️", children: [
            { name: "wallpaper.png", type: "file", icon: "🖼️", size: "2.4 MB", modified: "2024-04-10" },
            { name: "font.zip", type: "file", icon: "📦", size: "1.2 MB", modified: "2024-04-12" },
          ]},
        ]},
      ]},
      { name: "Windows", type: "folder", icon: "📁" },
    ],
  },
  {
    name: "Data (D:)", type: "drive", icon: "💿",
    children: [
      { name: "Games", type: "folder", icon: "🎮", children: [
        { name: "Space Shooter", type: "folder", icon: "📁" },
        { name: "Snake", type: "folder", icon: "📁" },
        { name: "Pong", type: "folder", icon: "📁" },
      ]},
      { name: "Media", type: "folder", icon: "🎬", children: [
        { name: "Screenshots", type: "folder", icon: "📁" },
        { name: "Music", type: "folder", icon: "🎵" },
      ]},
    ],
  },
];

const QUICK_ACCESS = [
  { name: "Desktop", icon: "🖥️" },
  { name: "Downloads", icon: "⬇️" },
  { name: "Documents", icon: "📂" },
  { name: "Projects", icon: "💻" },
];

const ThisPCApp = () => {
  const [path, setPath] = useState<string[]>(["This PC"]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");

  // Get current folder contents
  const getCurrentItems = (): FsItem[] => {
    if (path.length === 1) return FILE_SYSTEM; // root: show drives

    let items: FsItem[] = FILE_SYSTEM;
    for (let i = 1; i < path.length; i++) {
      const found = items.find(f => f.name === path[i]);
      if (found?.children) items = found.children;
      else return [];
    }
    return items;
  };

  const items = getCurrentItems();

  const openItem = (item: FsItem) => {
    if (item.type === "drive" || item.type === "folder") {
      setPath([...path, item.name]);
      setSelectedItem(null);
    }
  };

  const goBack = () => {
    if (path.length > 1) {
      setPath(path.slice(0, -1));
      setSelectedItem(null);
    }
  };

  const goTo = (idx: number) => {
    setPath(path.slice(0, idx + 1));
    setSelectedItem(null);
  };

  const navigateQuickAccess = (name: string) => {
    // Navigate to known paths
    const paths: Record<string, string[]> = {
      Desktop: ["This PC", "Local Disk (C:)", "Users", "Developer", "Desktop"],
      Downloads: ["This PC", "Local Disk (C:)", "Users", "Developer", "Downloads"],
      Documents: ["This PC", "Local Disk (C:)", "Users", "Developer", "Documents"],
      Projects: ["This PC", "Local Disk (C:)", "Users", "Developer", "Projects"],
    };
    if (paths[name]) {
      setPath(paths[name]);
      setSelectedItem(null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: "#fff", color: "#1a1a1a", fontFamily: "'VT323', monospace", fontSize: "14px" }}>

      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1" style={{ background: "#f3f3f3", borderBottom: "1px solid #ddd" }}>
        <button onClick={goBack} className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#e5e5e5] transition-colors" style={{ color: path.length > 1 ? "#333" : "#bbb", fontSize: "14px" }}>←</button>
        <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#e5e5e5] transition-colors" style={{ color: "#bbb", fontSize: "14px" }}>→</button>
        <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#e5e5e5] transition-colors" style={{ color: "#333", fontSize: "12px" }}>↑</button>

        {/* Breadcrumb / Address bar */}
        <div className="flex-1 flex items-center px-2 py-0.5 rounded-sm gap-1 mx-1" style={{ background: "#fff", border: "1px solid #ccc" }}>
          {path.map((seg, i) => (
            <span key={i} className="flex items-center gap-0.5">
              {i > 0 && <span style={{ color: "#999", fontSize: "10px" }}>›</span>}
              <button
                onClick={() => goTo(i)}
                className="hover:bg-[#e5f3ff] px-1 rounded transition-colors"
                style={{ color: "#0066cc", fontSize: "12px" }}
              >
                {seg}
              </button>
            </span>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center px-2 py-0.5 rounded-sm w-36" style={{ background: "#fff", border: "1px solid #ccc" }}>
          <span style={{ color: "#999", fontSize: "11px" }}>🔍 Search</span>
        </div>
      </div>

      {/* Ribbon bar */}
      <div className="flex items-center gap-3 px-3 py-1" style={{ background: "#f9f9f9", borderBottom: "1px solid #e0e0e0", fontSize: "11px", color: "#555" }}>
        <span className="cursor-pointer hover:text-black">📋 Copy</span>
        <span className="cursor-pointer hover:text-black">📂 Paste</span>
        <span className="cursor-pointer hover:text-black">✂️ Cut</span>
        <span style={{ color: "#ddd" }}>|</span>
        <span className="cursor-pointer hover:text-black">📝 Rename</span>
        <span className="cursor-pointer hover:text-black">🗑️ Delete</span>
        <div className="flex-1" />
        <button onClick={() => setView("grid")} style={{ color: view === "grid" ? "#0066cc" : "#888" }}>▦</button>
        <button onClick={() => setView("list")} style={{ color: view === "list" ? "#0066cc" : "#888" }}>☰</button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Navigation pane */}
        <div className="w-44 flex-shrink-0 overflow-y-auto py-1 select-none" style={{ background: "#f7f7f7", borderRight: "1px solid #e0e0e0" }}>
          {/* Quick access */}
          <div className="px-2 py-1" style={{ fontSize: "11px", color: "#888" }}>Quick Access</div>
          {QUICK_ACCESS.map(qa => (
            <button
              key={qa.name}
              onClick={() => navigateQuickAccess(qa.name)}
              className="w-full text-left px-3 py-0.5 flex items-center gap-1.5 hover:bg-[#e5f3ff] transition-colors rounded-sm"
              style={{ fontSize: "12px", color: "#333" }}
            >
              <span>{qa.icon}</span> {qa.name}
            </button>
          ))}

          <div className="px-2 py-1 mt-2" style={{ fontSize: "11px", color: "#888" }}>This PC</div>
          {FILE_SYSTEM.map(drive => (
            <button
              key={drive.name}
              onClick={() => setPath(["This PC", drive.name])}
              className="w-full text-left px-3 py-0.5 flex items-center gap-1.5 hover:bg-[#e5f3ff] transition-colors rounded-sm"
              style={{ fontSize: "12px", color: "#333" }}
            >
              <span>{drive.icon}</span> {drive.name}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-2">
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-full" style={{ color: "#999" }}>
              This folder is empty
            </div>
          ) : view === "grid" ? (
            /* Grid view */
            <div className="flex flex-wrap gap-1 content-start">
              {items.map(item => (
                <button
                  key={item.name}
                  onClick={() => setSelectedItem(item.name)}
                  onDoubleClick={() => openItem(item)}
                  className="flex flex-col items-center gap-0.5 p-2 rounded w-20 transition-colors"
                  style={{
                    background: selectedItem === item.name ? "#cce8ff" : "transparent",
                    border: selectedItem === item.name ? "1px solid #99d1ff" : "1px solid transparent",
                  }}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-center leading-tight truncate w-full" style={{ fontSize: "11px", color: "#333" }}>
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            /* List view */
            <table className="w-full" style={{ fontSize: "12px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e0e0e0", color: "#666" }}>
                  <th className="text-left py-1 px-2 font-normal">Name</th>
                  <th className="text-left py-1 px-2 font-normal w-20">Type</th>
                  <th className="text-right py-1 px-2 font-normal w-20">Size</th>
                  <th className="text-left py-1 px-2 font-normal w-24">Modified</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr
                    key={item.name}
                    onClick={() => setSelectedItem(item.name)}
                    onDoubleClick={() => openItem(item)}
                    className="cursor-pointer hover:bg-[#e5f3ff] transition-colors"
                    style={{
                      background: selectedItem === item.name ? "#cce8ff" : "transparent",
                    }}
                  >
                    <td className="py-0.5 px-2 flex items-center gap-1.5">
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </td>
                    <td className="py-0.5 px-2" style={{ color: "#888" }}>
                      {item.type === "drive" ? "Drive" : item.type === "folder" ? "Folder" : "File"}
                    </td>
                    <td className="py-0.5 px-2 text-right" style={{ color: "#888" }}>{item.size || "—"}</td>
                    <td className="py-0.5 px-2" style={{ color: "#888" }}>{item.modified || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-0.5 flex-shrink-0" style={{ background: "#f3f3f3", borderTop: "1px solid #ddd", fontSize: "11px", color: "#666" }}>
        <span>{items.length} items</span>
        {selectedItem && <span>Selected: {selectedItem}</span>}
      </div>
    </div>
  );
};

export default ThisPCApp;
