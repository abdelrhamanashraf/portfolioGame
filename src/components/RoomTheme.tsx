import { useMemo, useEffect, useRef } from "react";

export type RoomThemeId = "default" | "sunny" | "rainy" | "snowy" | "rgb";

interface RoomThemeProps {
  theme: RoomThemeId;
}

// ─── Window area (percentage coordinates within the room image) ──
// These define where rain/snow particles are confined to (inside the glass)
const WINDOW = { left: 34, top: 30, width: 25, height: 25 };

// ─── Rain Sound (Web Audio API) ──────────────────────────────
function useRainSound(active: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ source: AudioBufferSourceNode; gain: GainNode } | null>(null);

  useEffect(() => {
    if (active) {
      // Create or resume AudioContext
      const ctx = ctxRef.current ?? new AudioContext();
      ctxRef.current = ctx;

      if (ctx.state === "suspended") ctx.resume();

      // Generate noise buffer
      const sampleRate = ctx.sampleRate;
      const bufferSize = sampleRate * 2; // 2 seconds looped
      const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
      }

      // Noise source → bandpass filter → gain → output
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.value = 800;
      bandpass.Q.value = 0.5;

      // Additional lowpass for softness
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = 2000;

      const gain = ctx.createGain();
      gain.gain.value = 0; // Start silent

      source.connect(bandpass);
      bandpass.connect(lowpass);
      lowpass.connect(gain);
      gain.connect(ctx.destination);

      source.start();
      // Fade in
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1.5);

      nodesRef.current = { source, gain };
    } else {
      // Fade out and stop
      const nodes = nodesRef.current;
      const ctx = ctxRef.current;
      if (nodes && ctx) {
        nodes.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
        setTimeout(() => {
          try { nodes.source.stop(); } catch { /* already stopped */ }
          nodesRef.current = null;
        }, 1600);
      }
    }

    return () => {
      const nodes = nodesRef.current;
      if (nodes) {
        try { nodes.source.stop(); } catch { /* ok */ }
        nodesRef.current = null;
      }
    };
  }, [active]);
}

// ─── Rain Particles (window only) ────────────────────────────
function RainOverlay() {
  const drops = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: `${(i * 2.1 + Math.random() * 1) % 100}%`,
        delay: `${(Math.random() * 0.8).toFixed(2)}s`,
        duration: `${(0.35 + Math.random() * 0.2).toFixed(2)}s`,
        opacity: 0.4 + Math.random() * 0.4,
        width: Math.random() > 0.6 ? 2 : 1,
      })),
    []
  );

  return (
    <>
      <style>{`
        @keyframes rain-window {
          0% { transform: translateY(-5px); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translateY(${WINDOW.height}vh); opacity: 0.3; }
        }
      `}</style>
      {/* Rain streaks — confined to window */}
      <div
        className="absolute overflow-hidden pointer-events-none"
        style={{
          left: `${WINDOW.left}%`,
          top: `${WINDOW.top}%`,
          width: `${WINDOW.width}%`,
          height: `${WINDOW.height}%`,
          zIndex: 2,
        }}
      >
        {drops.map((d) => (
          <div
            key={d.id}
            className="absolute"
            style={{
              left: d.left,
              top: "-5px",
              width: `${d.width}px`,
              height: "12px",
              background: `linear-gradient(180deg, transparent, rgba(180,210,255,${d.opacity}))`,
              borderRadius: "0 0 1px 1px",
              animation: `rain-window ${d.duration} ${d.delay} linear infinite`,
            }}
          />
        ))}
      </div>
    </>
  );
}

// ─── Snow Particles (window only) ────────────────────────────
function SnowOverlay() {
  const flakes = useMemo(
    () =>
      Array.from({ length: 35 }, (_, i) => ({
        id: i,
        left: `${(i * 3 + Math.random() * 2) % 100}%`,
        delay: `${(Math.random() * 3).toFixed(2)}s`,
        duration: `${(2.5 + Math.random() * 3).toFixed(2)}s`,
        size: 2 + Math.random() * 3,
        drift: (Math.random() - 0.5) * 20,
        opacity: 0.5 + Math.random() * 0.4,
      })),
    []
  );

  return (
    <>
      <style>{`
        @keyframes snow-window {
          0% { transform: translateY(-5px) translateX(0px); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translateY(${WINDOW.height * 3}px) translateX(var(--drift)); opacity: 0.2; }
        }
      `}</style>
      {/* Snowflakes — confined to window */}
      <div
        className="absolute overflow-hidden pointer-events-none"
        style={{
          left: `${WINDOW.left}%`,
          top: `${WINDOW.top}%`,
          width: `${WINDOW.width}%`,
          height: `${WINDOW.height}%`,
          zIndex: 2,
        }}
      >
        {flakes.map((f) => (
          <div
            key={f.id}
            className="absolute rounded-full"
            style={{
              left: f.left,
              top: "-5px",
              width: f.size,
              height: f.size,
              background: `rgba(255,255,255,${f.opacity})`,
              boxShadow: `0 0 ${f.size}px rgba(255,255,255,0.3)`,
              animation: `snow-window ${f.duration} ${f.delay} linear infinite`,
              "--drift": `${f.drift}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  );
}

// ─── Sunny Overlay (subtle light rays in window) ─────────────
function SunnyOverlay() {
  return (
    <>
      <style>{`
        @keyframes sun-ray-pulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.3; }
        }
      `}</style>
      {/* Warm light beam coming from window */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${WINDOW.left + 5}%`,
          top: `${WINDOW.top + WINDOW.height}%`,
          width: `${WINDOW.width - 5}%`,
          height: "45%",
          background: "linear-gradient(180deg, rgba(255,220,130,0.15) 0%, rgba(255,200,100,0.03) 60%, transparent 100%)",
          clipPath: "polygon(10% 0%, 90% 0%, 120% 100%, -20% 100%)",
          animation: "sun-ray-pulse 4s ease-in-out infinite",
          zIndex: 2,
        }}
      />
      {/* Subtle dust particles in sunbeam */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none animate-float"
          style={{
            left: `${WINDOW.left + 8 + (i * 3.5) % (WINDOW.width - 10)}%`,
            top: `${WINDOW.top + WINDOW.height + 5 + (i * 7) % 30}%`,
            width: 2,
            height: 2,
            background: `rgba(255,220,150,${0.2 + (i % 3) * 0.08})`,
            animationDelay: `${(i * 0.4) % 3}s`,
            zIndex: 2,
          }}
        />
      ))}
    </>
  );
}

// ─── RGB Overlay (subtle glow cycling) ───────────────────────
function RGBOverlay() {
  return (
    <>
      <style>{`
        @keyframes rgb-glow {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
      `}</style>
      {/* Subtle LED strip glow at ceiling line */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "5%",
          top: "12%",
          width: "90%",
          height: "3%",
          background: "linear-gradient(90deg, rgba(255,0,120,0.12), rgba(0,200,255,0.12), rgba(120,255,0,0.1), rgba(200,0,255,0.12))",
          animation: "rgb-glow 5s linear infinite",
          filter: "blur(10px)",
          zIndex: 2,
        }}
      />
    </>
  );
}

// ─── Furniture theme filter ──────────────────────────────────
export function getThemeFilter(theme: RoomThemeId): string {
  switch (theme) {
    case "sunny":
      return "brightness(1.08) saturate(1.1)";
    case "rainy":
      return "brightness(0.95) saturate(0.9) hue-rotate(5deg)";
    case "snowy":
      return "brightness(1.05) saturate(0.85) hue-rotate(-5deg)";
    case "rgb":
      return "brightness(0.85) saturate(1.2) contrast(1.05)";
    default:
      return "none";
  }
}

// ─── Main Component ──────────────────────────────────────────
const RoomTheme = ({ theme }: RoomThemeProps) => {
  useRainSound(theme === "rainy");

  if (theme === "default") return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg" style={{ zIndex: 5 }}>
      {theme === "rainy" && <RainOverlay />}
      {theme === "snowy" && <SnowOverlay />}
      {theme === "sunny" && <SunnyOverlay />}
      {theme === "rgb" && <RGBOverlay />}
    </div>
  );
};

export default RoomTheme;
