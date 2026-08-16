import { cn } from "@/lib/utils";

interface MatchMeterProps {
  value: number;
  size?: "sm" | "lg";
  className?: string;
}

const TICKS = 28;

/**
 * The match indicator: a segmented signal dial, not a progress ring.
 * Ticks read as discrete signals picked up from the student's profile.
 * This is the single place a "% match" is rendered.
 */
export function MatchMeter({ value, size = "sm", className }: MatchMeterProps) {
  const px = size === "lg" ? 104 : 46;
  const r = px / 2;
  const inner = size === "lg" ? r - 15 : r - 7;
  const outer = size === "lg" ? r - 3 : r - 1.5;
  const lit = Math.round((value / 100) * TICKS);
  const tone = value >= 85 ? "text-growth" : value >= 70 ? "text-primary" : "text-muted-foreground";

  return (
    <div
      className={cn("relative flex-none", className)}
      style={{ width: px, height: px }}
      aria-label={`${value} percent match`}
    >
      <svg width={px} height={px} viewBox={`0 0 ${px} ${px}`}>
        {Array.from({ length: TICKS }).map((_, i) => {
          const a = (i / TICKS) * Math.PI * 2 - Math.PI / 2;
          const rd = (n: number) => Math.round(n * 1000) / 1000;
          const on = i < lit;
          return (
            <line
              key={i}
              x1={rd(r + Math.cos(a) * inner)}
              y1={rd(r + Math.sin(a) * inner)}
              x2={rd(r + Math.cos(a) * outer)}
              y2={rd(r + Math.sin(a) * outer)}
              stroke="currentColor"
              strokeWidth={size === "lg" ? 2.4 : 1.8}
              strokeLinecap="round"
              className={cn(
                on ? tone : "text-border-strong",
                "transition-colors duration-500",
              )}
              style={{ transitionDelay: `${i * 18}ms` }}
            />
          );
        })}
      </svg>
      <span className="absolute inset-0 grid place-content-center text-center leading-none">
        <span
          className={cn(
            "type-figure",
            tone,
            size === "lg" ? "text-[1.9rem]" : "text-[0.72rem]",
          )}
        >
          {value}
        </span>
        {size === "lg" && (
          <span className="mt-1 text-[0.55rem] font-bold tracking-[0.18em] text-muted-foreground">
            MATCH
          </span>
        )}
      </span>
    </div>
  );
}

/** Compact inline signal bars — used where a full dial is too heavy. */
export function MatchSignal({ value, className }: { value: number; className?: string }) {
  const bars = 10;
  const lit = Math.round((value / 100) * bars);
  const tone = value >= 85 ? "bg-growth" : value >= 70 ? "bg-primary" : "bg-muted-foreground";
  return (
    <span
      className={cn("inline-flex items-end gap-[3px]", className)}
      aria-label={`${value} percent match`}
    >
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={cn("w-[3px] rounded-full", i < lit ? tone : "bg-border-strong")}
          style={{ height: `${5 + i}px` }}
        />
      ))}
    </span>
  );
}
