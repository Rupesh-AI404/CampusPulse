import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock } from "lucide-react";
import type { Opportunity } from "@/data/campus";
import { MatchMeter, MatchSignal } from "./MatchMeter";
import { SaveButton } from "./StudentActions";
import { StatusBadge } from "./StatusBits";
import { usePulse } from "@/lib/pulse-store";
import { cn } from "@/lib/utils";

export function CategoryTag({ children }: { children: React.ReactNode }) {
  return <span className="badge badge-neutral">{children}</span>;
}

export function DeadlineTag({ days, label }: { days: number; label: string }) {
  const urgent = days <= 7;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        urgent ? "text-energy" : "text-muted-foreground",
      )}
    >
      <Clock className="size-3.5" />
      {urgent ? `Closes in ${days} days` : `Closes ${label}`}
    </span>
  );
}

/**
 * Opportunity cards carry controlled hierarchy: a featured lead card reads as
 * an editorial invitation, strong matches gain a growth-toned signal edge,
 * closing-soon gains an amber deadline emphasis. Save and application state
 * are always visible on the card itself.
 */
export function OpportunityCard({
  opportunity: o,
  emphasis = false,
}: {
  opportunity: Opportunity;
  emphasis?: boolean;
}) {
  const { applicationFor } = usePulse();
  const application = applicationFor(o.id);
  const strong = o.match >= 85;
  const urgent = o.daysLeft <= 7;
  const lead = emphasis || !!o.featured;

  return (
    <article
      className={cn(
        "panel group relative flex h-full flex-col p-6 transition-[transform,border-color,background-color] duration-300",
        "hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-raised",
        lead && "panel-signal border-border-strong md:p-8",
      )}
    >
      {/* Whole-card link, kept under the interactive controls */}
      <Link
        to="/opportunity/$id"
        params={{ id: o.id }}
        className="absolute inset-0 rounded-[inherit]"
        aria-label={`Open ${o.title}`}
      />

      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryTag>{o.category}</CategoryTag>
            {o.featured && <span className="badge badge-energy">Featured</span>}
            {strong && !o.featured && <span className="badge badge-growth">Strong match</span>}
            {urgent && <span className="badge badge-energy">Closing soon</span>}
            {application && <StatusBadge status={application.status} />}
          </div>

          <h3
            className={cn(
              "mt-3.5 font-display font-bold tracking-tight transition-colors group-hover:text-primary",
              lead ? "text-2xl leading-[1.12]" : "text-lg leading-snug",
            )}
          >
            {o.title}
          </h3>
          <p
            className={cn(
              "mt-2 leading-relaxed text-muted-foreground",
              lead ? "text-[0.98rem] max-w-md" : "text-sm",
            )}
          >
            {o.tagline}
          </p>
        </div>
        <div className="flex flex-none flex-col items-center gap-3">
          <MatchMeter value={o.match} />
          <SaveButton id={o.id} title={o.title} />
        </div>
      </div>

      {/* Why it matched — the match concept is never just a number */}
      <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5">
        {o.matchReasons.slice(0, lead ? 3 : 2).map((r) => (
          <li key={r.label} className="flex items-center gap-1.5 text-xs text-foreground/70">
            <span className="size-1 rounded-full bg-growth" />
            {r.label}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap items-end justify-between gap-3 border-t border-border pt-4 mt-6">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">
            {o.organizer.name} · {o.mode}
          </span>
          <DeadlineTag days={o.daysLeft} label={o.deadline} />
        </div>
        <div className="flex items-center gap-3">
          <MatchSignal value={o.match} className="hidden sm:inline-flex" />
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
            {application ? "View application" : "View details"}
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
