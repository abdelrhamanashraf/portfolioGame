import GameRoom from "@/components/GameRoom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      {/* Title */}
      <div className="text-center mb-6 animate-fade-in">
        <h1 className="font-pixel text-primary text-lg md:text-2xl mb-2">
          ✦ Welcome to My Room ✦
        </h1>
        <p className="font-retro text-muted-foreground text-xl md:text-2xl">
          Use arrow keys to walk • Press ENTER near objects
        </p>
      </div>

      {/* Interactive Room */}
      <div className="animate-scale-in">
        <GameRoom />
      </div>

      {/* Footer hint */}
      <div className="mt-6 font-pixel text-[10px] text-muted-foreground animate-twinkle">
        🖥️ Computer • 📚 Bookshelf • 🖼️ Frames • 🛏️ Bed • 🎓 Certificate
      </div>
    </div>
  );
};

export default Index;
