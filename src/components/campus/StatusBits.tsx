import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { statusMeta, type ApplicationStatus } from "@/lib/pulse-store";

const toneClass = {
  primary: "badge-primary",
  growth: "badge-growth",
  energy: "badge-energy",
  neutral: "badge-neutral",
} as const;

export function StatusBadge({
  status,
  className,
}: {
  status: ApplicationStatus;
  className?: string;
}) {
  const meta = statusMeta[status];
  return (
    <span className={cn("badge", toneClass[meta.tone], className)}>
      <span
        className={cn(
          "size-1.5 rounded-full",
          meta.tone === "growth" && "bg-growth",
          meta.tone === "energy" && "bg-energy",
          meta.tone === "primary" && "bg-primary",
          meta.tone === "neutral" && "bg-border-strong",
        )}
        aria-hidden
      />
      {meta.label}
    </span>
  );
}

/**
 * Empty states in the Campus Pulse voice: a quiet signal track, a plain
 * explanation, and exactly one obvious next action.
 */
export function EmptyState({
  title,
  body,
  actionLabel,
  actionTo,
  onAction,
}: {
  title: string;
  body: string;
  actionLabel?: string;
  actionTo?: "/explore" | "/organizer/new" | "/dashboard";
  onAction?: () => void;
}) {
  return (
    <div className="panel panel-signal mt-8 flex flex-col items-start gap-6 p-10 md:flex-row md:items-center md:justify-between">
      <div className="max-w-md">
        <div className="flex items-end gap-1" aria-hidden>
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="w-1 rounded-full bg-border-strong"
              style={{ height: `${5 + ((i * 3) % 9)}px` }}
            />
          ))}
        </div>
        <p className="mt-5 font-display text-lg font-bold tracking-tight">{title}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
      </div>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn btn-primary flex-none">
          {actionLabel}
        </Link>
      )}
      {actionLabel && !actionTo && onAction && (
        <button onClick={onAction} className="btn btn-quiet flex-none">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
