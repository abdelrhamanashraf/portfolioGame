interface HotspotBaseProps {
  label: string;
  isGlowing?: boolean;
  onClick: () => void;
}

interface RectHotspotProps extends HotspotBaseProps {
  top: string;
  left: string;
  width: string;
  height: string;
  polygonPoints?: never;
}

interface PolyHotspotProps extends HotspotBaseProps {
  polygonPoints: string; // SVG points: "x1,y1 x2,y2 x3,y3 ..."
  top?: never;
  left?: never;
  width?: never;
  height?: never;
}

type HotspotProps = RectHotspotProps | PolyHotspotProps;

const Hotspot = (props: HotspotProps) => {
  const { label, isGlowing, onClick } = props;

  // Polygon mode — SVG-based hotspot that matches irregular shapes
  if ("polygonPoints" in props && props.polygonPoints) {
    const pts = props.polygonPoints.split(" ").map((p) => {
      const [x, y] = p.split(",").map(Number);
      return { x, y };
    });
    const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
    const cy = Math.max(...pts.map((p) => p.y));

    return (
      <div className="absolute inset-0 w-full h-full group" style={{ zIndex: 20, pointerEvents: "none" }}>
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Outer glow layer */}
          {isGlowing && (
            <polygon
              points={props.polygonPoints}
              fill="hsl(40 70% 55% / 0.08)"
              stroke="hsl(40 70% 55% / 0.25)"
              strokeWidth="1"
              className="animate-pulse-glow"
              style={{ pointerEvents: "none" }}
            />
          )}
          {/* Main stroke */}
          <polygon
            points={props.polygonPoints}
            fill="transparent"
            stroke={isGlowing ? "hsl(40 70% 55% / 0.7)" : "transparent"}
            strokeWidth={isGlowing ? "0.4" : "0"}
            style={{ pointerEvents: "auto", cursor: "pointer" }}
            onClick={(e) => { e.stopPropagation(); onClick(); }}
          />
          {/* Hover stroke (always present but invisible until hover) */}
          <polygon
            points={props.polygonPoints}
            fill="transparent"
            stroke="transparent"
            strokeWidth="0.3"
            className="group-hover:[stroke:hsl(40_70%_55%/0.5)]"
            style={{ pointerEvents: "auto", cursor: "pointer", transition: "stroke 0.3s" }}
            onClick={(e) => { e.stopPropagation(); onClick(); }}
          />
        </svg>
        {/* Label tooltip */}
        <div
          className="absolute font-pixel text-[10px] text-warm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-background/80 px-2 py-1 rounded"
          style={{ left: `${cx}%`, top: `${cy + 2}%`, transform: "translateX(-50%)", pointerEvents: "none" }}
        >
          {label}
        </div>
      </div>
    );
  }

  // Rectangle mode — original behavior
  const { top, left, width, height } = props as RectHotspotProps;
  return (
    <button
      onClick={onClick}
      className="hotspot absolute group"
      style={{ top, left, width, height }}
      aria-label={label}
    >
      {/* Glow border when player is nearby */}
      <div
        className={`absolute inset-0 rounded-sm border-2 transition-all duration-300 ${
          isGlowing
            ? "border-warm/70 shadow-[0_0_12px_hsl(40_70%_55%/0.5),inset_0_0_8px_hsl(40_70%_55%/0.15)] animate-pulse-glow"
            : "border-transparent group-hover:border-warm/50"
        }`}
      />
      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 font-pixel text-[10px] text-warm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-background/80 px-2 py-1 rounded">
        {label}
      </div>
    </button>
  );
};

export default Hotspot;
