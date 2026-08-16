import { cn } from "@/lib/utils";

export type NodeState = "done" | "active" | "upcoming";

export interface RailItem {
  key: string;
  eyebrow: string;
  title: string;
  detail: string;
  meta?: string;
  state?: NodeState;
}

/**
 * The Campus Pulse vertical pulse rail — a living timeline. Each entry is a
 * node on one continuous signal line, with the active node still transmitting.
 */
export function JourneyRail({ items, className }: { items: RailItem[]; className?: string }) {
  return (
    <ol className={cn("pulse-rail space-y-8", className)}>
      {items.map((item, i) => (
        <li
          key={item.key}
          className="group relative flex gap-5 animate-rise"
          style={{ animationDelay: `${i * 90}ms` }}
        >
          <span
            className={cn(
              "pulse-node mt-1.5",
              item.state === "active" && "pulse-node-active",
              item.state === "done" && "pulse-node-done",
            )}
          />
          <div
            className={cn(
              "min-w-0 flex-1 rounded-md px-4 py-3 -my-1 transition-colors",
              "hover:bg-surface/70",
              item.state === "active" && "bg-surface/60",
            )}
          >
            <div className="flex items-baseline justify-between gap-4">
              <span
                className={cn(
                  "text-[0.68rem] font-bold uppercase tracking-[0.13em]",
                  item.state === "active"
                    ? "text-primary"
                    : item.state === "done"
                      ? "text-growth"
                      : "text-muted-foreground",
                )}
              >
                {item.eyebrow}
              </span>
              {item.meta && (
                <span className="text-xs tabular-nums text-muted-foreground">{item.meta}</span>
              )}
            </div>
            <h3 className="mt-1.5 font-display text-[1.05rem] font-bold leading-snug tracking-tight">
              {item.title}
            </h3>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {item.detail}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
