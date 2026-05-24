import { useState, useRef, useEffect, useCallback } from "react";
import { executeCommand, getPrompt, type CommandOutput } from "../terminal/commands";

interface TerminalAppProps {
  onExit?: () => void;
}

interface HistoryEntry {
  prompt: string;
  command: string;
  output: CommandOutput[];
}

const WELCOME: CommandOutput[] = [
  { text: "╔══════════════════════════════════════════╗", color: "#0ff" },
  { text: "║  Portfolio Shell (psh) v1.0               ║", color: "#0ff" },
  { text: "║  Type 'help' for commands                 ║", color: "#0ff" },
  { text: "╚══════════════════════════════════════════╝", color: "#0ff" },
  { text: "" },
];

const TerminalApp = ({ onExit }: TerminalAppProps) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState("~");
  const [cmdHist, setCmdHist] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current && (scrollRef.current.scrollTop = scrollRef.current.scrollHeight);
  }, [history]);

  const focusInput = useCallback(() => inputRef.current?.focus(), []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed) { setCmdHist(p => [...p, trimmed]); setHistIdx(-1); }

    const output = executeCommand(trimmed, cwd, setCwd);
    if (output.length === 1 && output[0].text === "__CLEAR__") { setHistory([]); setInput(""); return; }
    if (output.length === 1 && output[0].text === "__EXIT__") { onExit?.(); return; }

    setHistory(p => [...p, { prompt: getPrompt(cwd), command: input, output }]);
    setInput("");
  }, [input, cwd, onExit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const ni = histIdx + 1;
      if (ni < cmdHist.length) { setHistIdx(ni); setInput(cmdHist[cmdHist.length - 1 - ni]); }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const ni = histIdx - 1;
      if (ni >= 0) { setHistIdx(ni); setInput(cmdHist[cmdHist.length - 1 - ni]); }
      else { setHistIdx(-1); setInput(""); }
    }
  }, [histIdx, cmdHist]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden cursor-text" style={{ background: "#0a0a0a", fontFamily: "'VT323', monospace" }} onClick={focusInput}>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3" style={{ fontSize: "15px", lineHeight: "1.4" }}>
        {WELCOME.map((l, i) => <div key={`w${i}`} style={{ color: l.color || "#0f0" }}>{l.text || "\u00A0"}</div>)}
        {history.map((entry, i) => (
          <div key={i}>
            <div className="flex"><span style={{ color: "#0f8" }}>{entry.prompt}</span><span style={{ color: "#fff", marginLeft: 8 }}>{entry.command}</span></div>
            {entry.output.map((l, j) => <div key={j} style={{ color: l.color || "#ccc" }}><pre className="whitespace-pre-wrap m-0 font-retro text-[15px]">{l.text || "\u00A0"}</pre></div>)}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="flex items-center">
          <span style={{ color: "#0f8" }}>{getPrompt(cwd)}</span>
          <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none ml-2 text-[15px] font-retro" style={{ color: "#fff", caretColor: "#0f0" }} autoFocus spellCheck={false} autoComplete="off" />
        </form>
      </div>
    </div>
  );
};

export default TerminalApp;
