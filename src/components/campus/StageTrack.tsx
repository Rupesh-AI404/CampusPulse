import { cn } from "@/lib/utils";
import type { NodeState } from "./JourneyRail";

export interface StageTrackItem {
  stage: string;
  line?: string;
  detail?: string;
  state: NodeState;
}

/**
 * The Discover → Apply → Participate → Achieve system as one connected
 * horizontal track. Used on the landing page, dashboard and profile so the
 * same shape carries the same meaning everywhere.
 */
export function StageTrack({
  items,
  dense = false,
  className,
}: {
  items: StageTrackItem[];
  dense?: boolean;
  className?: string;
}) {
  return (
    <ol
      className={cn(
        "stage-track grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {items.map((item, i) => (
        <li
          key={item.stage}
          className="relative animate-rise"
          style={{ animationDelay: `${i * 90}ms` }}
        >
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "pulse-node",
                item.state === "active" && "pulse-node-active",
                item.state === "done" && "pulse-node-done",
              )}
            />
            <span className="font-display text-[0.7rem] font-bold tracking-[0.14em] text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>

          {/* signal ticks — progress within the stage */}
          <div className="mt-4 flex items-end gap-1" aria-hidden>
            {Array.from({ length: 14 }).map((_, t) => {
              const filled =
                item.state === "done" ? true : item.state === "active" ? t < 7 : false;
              return (
                <span
                  key={t}
                  className={cn(
                    "w-1 origin-bottom rounded-full animate-tick",
                    filled
                      ? item.state === "done"
                        ? "bg-growth"
                        : "bg-primary"
                      : "bg-border-strong",
                  )}
                  style={{
                    height: `${6 + ((t * 5) % 13)}px`,
                    animationDelay: `${i * 90 + t * 28}ms`,
                  }}
                />
              );
            })}
          </div>

          <h3
            className={cn(
              "mt-4 font-display font-bold tracking-tight",
              dense ? "text-base" : "text-lg",
              item.state === "upcoming" && "text-muted-foreground",
            )}
          >
            {item.stage}
          </h3>
          {item.line && (
            <p className="mt-1.5 text-sm leading-snug text-foreground/80">{item.line}</p>
          )}
          {item.detail && !dense && (
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
