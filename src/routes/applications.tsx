import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/campus/SiteChrome";
import { PageIntro } from "@/components/campus/PageIntro";
import { EmptyState, StatusBadge } from "@/components/campus/StatusBits";
import { MatchSignal } from "@/components/campus/MatchMeter";
import {
  formatWhen,
  statusMeta,
  usePulse,
  type ApplicationStatus,
} from "@/lib/pulse-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/applications")({
  head: () => ({
    meta: [
      { title: "My applications — Campus Pulse" },
      {
        name: "description",
        content:
          "Track every Campus Pulse application in one place: what you applied to, when, and whether the organiser has decided yet.",
      },
      { property: "og:title", content: "My applications — Campus Pulse" },
      {
        property: "og:description",
        content: "Under review, accepted, or not this time — every application and its next step.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ApplicationsPage,
});

const filters: (ApplicationStatus | "all")[] = ["all", "pending", "accepted", "rejected", "completed"];

function ApplicationsPage() {
  const { myApplications, getOpportunity, ready } = usePulse();
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");

  const list = myApplications.filter((a) => (filter === "all" ? true : a.status === filter));
  const pending = myApplications.filter((a) => a.status === "pending").length;

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <PageIntro
        eyebrow="Stage two — Apply"
        title="Every application, and where it stands."
        lede="One row per application. When an organiser decides, the status here changes — you do not have to chase anyone."
        aside={
          <p className="text-sm text-muted-foreground">
            {myApplications.length} submitted
            {pending > 0 && <span className="ml-2 text-primary">{pending} under review</span>}
          </p>
        }
      />

      <section className="shell">
        {myApplications.length > 0 && (
          <div className="flex flex-wrap gap-2 border-b border-border pb-6">
            {filters.map((f) => {
              const count =
                f === "all"
                  ? myApplications.length
                  : myApplications.filter((a) => a.status === f).length;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all",
                    filter === f
                      ? "border-primary/70 bg-primary/12 text-foreground"
                      : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
                  )}
                >
                  {f === "all" ? "All" : statusMeta[f].label}
                  <span className="text-xs tabular-nums opacity-60">{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {ready && myApplications.length === 0 ? (
          <EmptyState
            title="You haven't applied to an opportunity yet."
            body="Find something that fits, read the story, then apply. Your applications and their decisions will appear here."
            actionLabel="Explore opportunities"
            actionTo="/explore"
          />
        ) : (
          <ul className="mt-8 space-y-4">
            {list.map((a, i) => {
              const o = getOpportunity(a.opportunityId);
              return (
                <li
                  key={a.id}
                  className="panel animate-rise p-6"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={a.status} />
                        {o && <span className="badge badge-neutral">{o.category}</span>}
                      </div>
                      <h2 className="mt-3 font-display text-lg font-bold tracking-tight">
                        {o?.title ?? "Opportunity withdrawn"}
                      </h2>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        {o?.organizer.name ?? "—"} · applied {formatWhen(a.appliedAt)}
                        {o && ` · closes ${o.deadline}`}
                      </p>
                      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                        {statusMeta[a.status].help}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center gap-2.5">
                        <MatchSignal value={a.match} />
                        <span className="type-figure text-sm">{a.match}%</span>
                      </div>
                      {o && (
                        <Link
                          to="/opportunity/$id"
                          params={{ id: o.id }}
                          className="group inline-flex items-center gap-1 text-sm font-semibold text-primary"
                        >
                          {a.status === "accepted" ? "See what happens next" : "View opportunity"}
                          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5" />
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 border-t border-border pt-5">
                    <p className="marker">What you told them</p>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/80">
                      {a.motivation}
                    </p>
                    <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {a.experience}
                    </p>
                  </div>
                </li>
              );
            })}
            {list.length === 0 && (
              <li className="py-10 text-sm text-muted-foreground">
                No applications with that status yet.
              </li>
            )}
          </ul>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
