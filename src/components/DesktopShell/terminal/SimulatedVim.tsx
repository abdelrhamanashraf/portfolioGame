import React, { useState, useEffect, useRef, useCallback } from "react";

interface SimulatedVimProps {
  initialContent: string;
  filename: string;
  onExit: (newContent?: string) => void;
}

type VimMode = "NORMAL" | "INSERT" | "COMMAND";

const SimulatedVim: React.FC<SimulatedVimProps> = ({ initialContent, filename, onExit }) => {
  const [content, setContent] = useState<string[]>(initialContent.split("\n"));
  const [mode, setMode] = useState<VimMode>("NORMAL");
  const [cursor, setCursor] = useState({ row: 0, col: 0 });
  const [commandBuffer, setCommandBuffer] = useState("");
  const [message, setMessage] = useState(`"${filename}"`);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto focus to capture keys
  useEffect(() => {
    containerRef.current?.focus();
  }, [mode]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (mode === "NORMAL") {
      if (e.key === ":") {
        setMode("COMMAND");
        setCommandBuffer("");
        setMessage("");
        return;
      }
      if (e.key === "i") {
        setMode("INSERT");
        setMessage("-- INSERT --");
        return;
      }
      if (e.key === "h" || e.key === "ArrowLeft") {
        setCursor(prev => ({ ...prev, col: Math.max(0, prev.col - 1) }));
      } else if (e.key === "l" || e.key === "ArrowRight") {
        setCursor(prev => ({ ...prev, col: Math.min((content[prev.row] || "").length, prev.col + 1) }));
      } else if (e.key === "k" || e.key === "ArrowUp") {
        setCursor(prev => {
          const newRow = Math.max(0, prev.row - 1);
          return { row: newRow, col: Math.min(prev.col, (content[newRow] || "").length) };
        });
      } else if (e.key === "j" || e.key === "ArrowDown") {
        setCursor(prev => {
          const newRow = Math.min(content.length - 1, prev.row + 1);
          return { row: newRow, col: Math.min(prev.col, (content[newRow] || "").length) };
        });
      }
    } else if (mode === "INSERT") {
      if (e.key === "Escape") {
        setMode("NORMAL");
        setMessage("");
        setCursor(prev => ({ ...prev, col: Math.max(0, prev.col - 1) })); // cursor moves back one
        return;
      }

      const currentRow = content[cursor.row] || "";
      
      if (e.key === "Enter") {
        const newLine = currentRow.slice(cursor.col);
        const updatedRow = currentRow.slice(0, cursor.col);
        const newContent = [...content];
        newContent[cursor.row] = updatedRow;
        newContent.splice(cursor.row + 1, 0, newLine);
        setContent(newContent);
        setCursor(prev => ({ row: prev.row + 1, col: 0 }));
      } else if (e.key === "Backspace") {
        if (cursor.col > 0) {
          const newContent = [...content];
          newContent[cursor.row] = currentRow.slice(0, cursor.col - 1) + currentRow.slice(cursor.col);
          setContent(newContent);
          setCursor(prev => ({ ...prev, col: prev.col - 1 }));
        } else if (cursor.row > 0) {
          const prevRowContent = content[cursor.row - 1];
          const newContent = [...content];
          newContent[cursor.row - 1] = prevRowContent + currentRow;
          newContent.splice(cursor.row, 1);
          setContent(newContent);
          setCursor({ row: cursor.row - 1, col: prevRowContent.length });
        }
      } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        const newContent = [...content];
        newContent[cursor.row] = currentRow.slice(0, cursor.col) + e.key + currentRow.slice(cursor.col);
        setContent(newContent);
        setCursor(prev => ({ ...prev, col: prev.col + 1 }));
      } else if (e.key.startsWith("Arrow")) {
        // Allow arrows in insert mode
        if (e.key === "ArrowLeft") setCursor(prev => ({ ...prev, col: Math.max(0, prev.col - 1) }));
        else if (e.key === "ArrowRight") setCursor(prev => ({ ...prev, col: Math.min(currentRow.length, prev.col + 1) }));
        else if (e.key === "ArrowUp") setCursor(prev => ({ row: Math.max(0, prev.row - 1), col: Math.min(prev.col, (content[Math.max(0, prev.row - 1)] || "").length) }));
        else if (e.key === "ArrowDown") setCursor(prev => ({ row: Math.min(content.length - 1, prev.row + 1), col: Math.min(prev.col, (content[Math.min(content.length - 1, prev.row + 1)] || "").length) }));
      }
    } else if (mode === "COMMAND") {
      if (e.key === "Escape") {
        setMode("NORMAL");
        setCommandBuffer("");
        setMessage("");
      } else if (e.key === "Enter") {
        const cmd = commandBuffer;
        if (cmd === "q!" || cmd === "q") {
          onExit();
        } else if (cmd === "wq" || cmd === "wq!" || cmd === "x") {
          onExit(content.join("\n"));
        } else if (cmd === "w") {
          setMessage(`"${filename}" written`);
          setMode("NORMAL");
          setCommandBuffer("");
        } else {
          setMessage(`E492: Not an editor command: ${cmd}`);
          setMode("NORMAL");
          setCommandBuffer("");
        }
      } else if (e.key === "Backspace") {
        if (commandBuffer.length === 0) {
          setMode("NORMAL");
          setMessage("");
        } else {
          setCommandBuffer(prev => prev.slice(0, -1));
        }
      } else if (e.key.length === 1) {
        setCommandBuffer(prev => prev + e.key);
      }
    }
  }, [mode, cursor, content, commandBuffer, filename, onExit]);

  // Render logic to show ~ for empty lines below content
  const visibleLines = [...content];
  const screenHeight = 20; // roughly
  while (visibleLines.length < screenHeight - 1) {
    visibleLines.push("~");
  }

  return (
    <div 
      ref={containerRef}
      className="w-full h-full flex flex-col cursor-text outline-none focus:outline-none" 
      style={{
        background: "#050508",
        color: "#fff",
        fontFamily: "'VT323', monospace",
        fontSize: "16px",
        lineHeight: "1.5"
      }} 
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={() => containerRef.current?.focus()}
    >
      <div className="flex-1 overflow-hidden p-2 relative">
        {visibleLines.map((line, rowIdx) => (
          <div key={rowIdx} className="whitespace-pre flex" style={{ color: line === "~" && rowIdx >= content.length ? "#55f" : "#ccc" }}>
            {line === "" ? "\u00A0" : line.split("").map((char, colIdx) => {
              const isCursor = rowIdx === cursor.row && colIdx === cursor.col;
              return (
                <span key={colIdx} style={{
                  background: isCursor ? "#fff" : "transparent",
                  color: isCursor ? "#000" : "inherit"
                }}>{char}</span>
              );
            })}
            {/* Cursor at the end of a line */}
            {rowIdx === cursor.row && cursor.col === (content[rowIdx] || "").length && (
              <span style={{ background: "#fff", color: "#000" }}>{"\u00A0"}</span>
            )}
          </div>
        ))}
      </div>
      <div className="h-[24px] flex items-center px-2 shrink-0 bg-[#111]">
        {mode === "COMMAND" ? (
          <span>:{commandBuffer}</span>
        ) : (
          <span className="flex justify-between w-full">
            <span style={{ fontWeight: mode === "INSERT" ? "bold" : "normal" }}>{message}</span>
            <span>{cursor.row + 1},{cursor.col + 1}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default SimulatedVim;
