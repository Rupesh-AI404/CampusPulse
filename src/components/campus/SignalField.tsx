/**
 * Campus Pulse hero signature.
 *
 * An abstract ecosystem diagram: opportunity nodes on the left send signals
 * along curved paths, they converge on the student node, and one outbound
 * path continues into the journey. No blobs, no glass, no decoration —
 * the composition IS the explanation of the product.
 */
const sources = [
  { y: 30, label: "Internship", delay: "0s" },
  { y: 88, label: "Hackathon", delay: "1.1s" },
  { y: 146, label: "Workshop", delay: "2.2s" },
  { y: 204, label: "Competition", delay: "3.3s" },
  { y: 262, label: "Club", delay: "4.4s" },
];

const OUT = { x: 300, y: 146 };

export function SignalField({ className }: { className?: string }) {
  return (
    <svg
      viewBox="-48 0 568 292"
      className={className}
      role="img"
      aria-label="Campus opportunities sending signals to a student, continuing into a journey"
      overflow="visible"
    >
      {/* faint measurement rules — structure, not ornament */}
      {[0, 73, 146, 219, 292].map((y) => (
        <line
          key={y}
          x1="0"
          x2="520"
          y1={y}
          y2={y}
          stroke="currentColor"
          className="text-border"
          strokeWidth="1"
        />
      ))}

      {sources.map((s) => (
        <g key={s.label}>
          <path
            d={`M 62 ${s.y} C 150 ${s.y}, 190 ${OUT.y}, ${OUT.x - 22} ${OUT.y}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-border-strong"
          />
          <path
            d={`M 62 ${s.y} C 150 ${s.y}, 190 ${OUT.y}, ${OUT.x - 22} ${OUT.y}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="signal-path text-primary"
            style={{ animationDelay: s.delay }}
          />
          <circle cx="62" cy={s.y} r="3" className="fill-primary/70" />
          <text
            x={52}
            y={s.y}
            textAnchor="end"
            dominantBaseline="central"
            paintOrder="stroke fill"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
            className="fill-current stroke-background text-foreground text-[clamp(10px,2.4vw,14px)] font-semibold tracking-[0.08em] uppercase"
            style={{ letterSpacing: "0.08em" }}
          >
            {s.label}
          </text>
        </g>
      ))}

      {/* Student node — the convergence point */}
      <circle
        cx={OUT.x}
        cy={OUT.y}
        r="26"
        className="fill-surface stroke-border-strong"
        strokeWidth="1"
      />
      <circle cx={OUT.x} cy={OUT.y} r="7" className="fill-primary" />
      <circle cx={OUT.x} cy={OUT.y} r="14" className="fill-none stroke-primary/35" strokeWidth="1" />
      <text
        x={OUT.x}
        y={OUT.y + 44}
        textAnchor="middle"
        className="fill-current text-[9.5px] font-bold text-foreground"
        style={{ letterSpacing: "0.14em" }}
      >
        YOU
      </text>

      {/* Outbound journey — four progression markers */}
      <path
        d={`M ${OUT.x + 30} ${OUT.y} L 500 ${OUT.y}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-border-strong"
      />
      <path
        d={`M ${OUT.x + 30} ${OUT.y} L 500 ${OUT.y}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="signal-path text-growth"
      />
      {["Discover", "Apply", "Participate", "Achieve"].map((stage, i) => {
        const x = OUT.x + 42 + i * 50;
        const reached = i <= 1;
        return (
          <g key={stage}>
            <rect
              x={x - 1.5}
              y={OUT.y - 18}
              width="3"
              height="12"
              rx="1.5"
              className={reached ? "fill-growth" : "fill-border-strong"}
            />
            <circle
              cx={x}
              cy={OUT.y}
              r="4.5"
              className={
                reached ? "fill-growth stroke-background" : "fill-background stroke-border-strong"
              }
              strokeWidth="2"
            />
            <text
              x={x}
              y={OUT.y + 22}
              textAnchor="middle"
              className={`fill-current text-[8px] font-semibold ${
                reached ? "text-foreground" : "text-muted-foreground"
              }`}
              style={{ letterSpacing: "0.06em" }}
            >
              {stage.slice(0, 3).toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
