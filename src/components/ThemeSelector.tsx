import type { RoomThemeId } from "./RoomTheme";

interface ThemeSelectorProps {
  current: RoomThemeId;
  onChange: (theme: RoomThemeId) => void;
}

const THEMES: { id: RoomThemeId; icon: string; label: string; color: string }[] = [
  { id: "default", icon: "🌙", label: "Night", color: "hsl(220 40% 30%)" },
  { id: "sunny", icon: "☀️", label: "Sunny", color: "hsl(40 90% 50%)" },
  { id: "rainy", icon: "🌧️", label: "Rainy", color: "hsl(210 50% 45%)" },
  { id: "snowy", icon: "❄️", label: "Snow", color: "hsl(200 40% 70%)" },
  { id: "rgb", icon: "🌈", label: "RGB", color: "hsl(300 70% 55%)" },
];

const ThemeSelector = ({ current, onChange }: ThemeSelectorProps) => {
  return (
    <div
      className="flex items-center gap-1 px-3 py-1.5 rounded-full select-none"
      style={{
        background: "hsl(30 20% 12% / 0.85)",
        border: "1px solid hsl(25 20% 25% / 0.6)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
      }}
    >
      <span
        className="font-pixel text-[8px] mr-1 hidden sm:inline"
        style={{ color: "hsl(30 15% 50%)" }}
      >
        Theme
      </span>
      {THEMES.map((t) => {
        const isActive = current === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className="relative flex items-center justify-center rounded-full transition-all duration-200"
            style={{
              width: isActive ? 36 : 30,
              height: isActive ? 36 : 30,
              background: isActive
                ? `linear-gradient(135deg, ${t.color}, hsl(30 20% 15%))`
                : "hsl(30 20% 16%)",
              border: isActive
                ? `2px solid ${t.color}`
                : "1px solid hsl(25 20% 22% / 0.5)",
              boxShadow: isActive
                ? `0 0 12px ${t.color}40, inset 0 0 6px ${t.color}20`
                : "none",
              transform: isActive ? "scale(1.1)" : "scale(1)",
            }}
            title={t.label}
          >
            <span
              className="text-sm"
              style={{ filter: isActive ? "drop-shadow(0 0 4px white)" : "none" }}
            >
              {t.icon}
            </span>
            {/* Active dot indicator */}
            {isActive && (
              <div
                className="absolute -bottom-1 w-1 h-1 rounded-full"
                style={{ background: t.color, boxShadow: `0 0 4px ${t.color}` }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ThemeSelector;
