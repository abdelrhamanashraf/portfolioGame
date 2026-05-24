interface DesktopIconProps {
  icon: string;
  label: string;
  onClick: () => void;
}

const DesktopIcon = ({ icon, label, onClick }: DesktopIconProps) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 p-2 rounded-lg w-20 group transition-all duration-200 hover:bg-white/5 focus:bg-white/8 focus:outline-none"
    >
      {/* Icon */}
      <div
        className="w-12 h-12 flex items-center justify-center rounded-lg text-3xl transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_hsl(40_70%_55%/0.4)]"
        style={{
          background: "linear-gradient(135deg, hsl(30 20% 18%) 0%, hsl(30 20% 14%) 100%)",
          border: "1px solid hsl(25 20% 28% / 0.6)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        {icon}
      </div>
      {/* Label */}
      <span
        className="font-pixel text-[7px] leading-tight text-center max-w-full truncate transition-colors"
        style={{
          color: "hsl(35 30% 80%)",
          textShadow: "0 1px 3px rgba(0,0,0,0.8)",
        }}
      >
        {label}
      </span>
    </button>
  );
};

export default DesktopIcon;
