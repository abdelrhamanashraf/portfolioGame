import React, { useState, useEffect, useRef, useCallback } from "react";

interface SimulatedNanoProps {
  initialContent: string;
  filename: string;
  onExit: (newContent?: string) => void;
}

const SimulatedNano: React.FC<SimulatedNanoProps> = ({ initialContent, filename, onExit }) => {
  const [content, setContent] = useState<string[]>(initialContent.split("\n"));
  const [cursor, setCursor] = useState({ row: 0, col: 0 });
  const [message, setMessage] = useState("");
  const [exiting, setExiting] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, [exiting]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (exiting) {
      if (e.key.toLowerCase() === "y") {
        onExit(content.join("\n"));
      } else if (e.key.toLowerCase() === "n") {
        onExit();
      } else if (e.ctrlKey && e.key === "c") {
        setExiting(false);
        setMessage("Cancelled");
      }
      return;
    }

    if (e.ctrlKey) {
      if (e.key === "x") {
        setExiting(true);
      } else if (e.key === "o") {
        setMessage(`Wrote ${content.length} lines`);
      } else if (e.key === "g") {
        setMessage("Help not implemented in simulation");
      } else if (e.key === "c") {
        setMessage(`line ${cursor.row + 1}/${content.length} (${Math.floor((cursor.row / Math.max(1, content.length)) * 100)}%), col ${cursor.col + 1}`);
      }
      return;
    }

    const currentRow = content[cursor.row] || "";
    
    if (e.key === "ArrowLeft") {
      if (cursor.col > 0) setCursor(prev => ({ ...prev, col: prev.col - 1 }));
      else if (cursor.row > 0) setCursor(prev => ({ row: prev.row - 1, col: (content[prev.row - 1] || "").length }));
    } else if (e.key === "ArrowRight") {
      if (cursor.col < currentRow.length) setCursor(prev => ({ ...prev, col: prev.col + 1 }));
      else if (cursor.row < content.length - 1) setCursor(prev => ({ row: prev.row + 1, col: 0 }));
    } else if (e.key === "ArrowUp") {
      setCursor(prev => ({ row: Math.max(0, prev.row - 1), col: Math.min(prev.col, (content[Math.max(0, prev.row - 1)] || "").length) }));
    } else if (e.key === "ArrowDown") {
      setCursor(prev => ({ row: Math.min(content.length - 1, prev.row + 1), col: Math.min(prev.col, (content[Math.min(content.length - 1, prev.row + 1)] || "").length) }));
    } else if (e.key === "Enter") {
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
    }
  }, [cursor, content, exiting, onExit]);

  const visibleLines = [...content];
  const screenHeight = 20; 
  while (visibleLines.length < screenHeight - 4) {
    visibleLines.push("");
  }

  return (
    <div 
      ref={containerRef}
      className="w-full h-full flex flex-col cursor-text outline-none focus:outline-none" 
      style={{
        background: "#050508",
        color: "#ccc",
        fontFamily: "'VT323', monospace",
        fontSize: "16px",
        lineHeight: "1.5"
      }} 
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={() => containerRef.current?.focus()}
    >
      <div className="h-[24px] flex items-center justify-between px-2 shrink-0 bg-[#ccc] text-black">
        <span>  GNU nano 7.2  </span>
        <span>{filename}</span>
        <span>{content !== initialContent.split("\n") ? "Modified" : ""}</span>
      </div>
      
      <div className="flex-1 overflow-hidden p-2 relative">
        {visibleLines.map((line, rowIdx) => (
          <div key={rowIdx} className="whitespace-pre flex">
            {line === "" ? "\u00A0" : line.split("").map((char, colIdx) => {
              const isCursor = rowIdx === cursor.row && colIdx === cursor.col;
              return (
                <span key={colIdx} style={{
                  background: isCursor ? "#ccc" : "transparent",
                  color: isCursor ? "#000" : "inherit"
                }}>{char}</span>
              );
            })}
            {rowIdx === cursor.row && cursor.col === (content[rowIdx] || "").length && (
              <span style={{ background: "#ccc", color: "#000" }}>{"\u00A0"}</span>
            )}
          </div>
        ))}
      </div>

      <div className="h-[48px] flex flex-col shrink-0">
        <div className="h-[24px] flex items-center justify-center bg-[#050508] text-white">
          {exiting ? "Save modified buffer? (Y)es / (N)o / ^C Cancel" : message}
        </div>
        {!exiting ? (
          <div className="h-[24px] grid grid-cols-6 px-1 bg-[#050508] text-sm" style={{ gap: '2px' }}>
            <div><span className="bg-[#ccc] text-black px-1">^G</span> Help</div>
            <div><span className="bg-[#ccc] text-black px-1">^O</span> Write Out</div>
            <div><span className="bg-[#ccc] text-black px-1">^W</span> Where Is</div>
            <div><span className="bg-[#ccc] text-black px-1">^K</span> Cut</div>
            <div><span className="bg-[#ccc] text-black px-1">^T</span> Execute</div>
            <div><span className="bg-[#ccc] text-black px-1">^C</span> Location</div>
            <div><span className="bg-[#ccc] text-black px-1">^X</span> Exit</div>
            <div><span className="bg-[#ccc] text-black px-1">^R</span> Read File</div>
            <div><span className="bg-[#ccc] text-black px-1">^\</span> Replace</div>
            <div><span className="bg-[#ccc] text-black px-1">^U</span> Paste</div>
            <div><span className="bg-[#ccc] text-black px-1">^J</span> Justify</div>
            <div><span className="bg-[#ccc] text-black px-1">^/</span> Go To Line</div>
          </div>
        ) : (
          <div className="h-[24px] grid grid-cols-6 px-1 bg-[#050508] text-sm" style={{ gap: '2px' }}>
            <div><span className="bg-[#ccc] text-black px-1">Y</span> Yes</div>
            <div><span className="bg-[#ccc] text-black px-1">N</span> No</div>
            <div><span className="bg-[#ccc] text-black px-1">^C</span> Cancel</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulatedNano;
