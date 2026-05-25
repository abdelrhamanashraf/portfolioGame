import { useState } from "react";
import GameRoom from "@/components/GameRoom";
import ThemeSelector from "@/components/ThemeSelector";
import type { RoomThemeId } from "@/components/RoomTheme";

const Index = () => {
  const [theme, setTheme] = useState<RoomThemeId>("default");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      {/* Title + Theme Selector */}
      <div className="text-center mb-6 animate-fade-in">
        <h1 className="font-pixel text-primary text-lg md:text-2xl mb-2">
          ✦ Welcome to My Room ✦
        </h1>
        <p className="font-retro text-muted-foreground text-xl md:text-2xl mb-4">
          Use arrow keys to walk • Press ENTER near objects
        </p>
        {/* Theme picker */}
        <div className="flex justify-center">
          <ThemeSelector current={theme} onChange={setTheme} />
        </div>
      </div>

      {/* Interactive Room */}
      <div className="animate-scale-in">
        <GameRoom theme={theme} />
      </div>

      {/* Footer hint */}
      <div className="mt-6 font-pixel text-[10px] text-muted-foreground animate-twinkle">
        🖥️ Computer → Desktop • 📚 Bookshelf • 🖼️ Frames • 🛏️ Bed • 🎓 Certificate • 🎮 TV
      </div>
    </div>
  );
};

export default Index;
