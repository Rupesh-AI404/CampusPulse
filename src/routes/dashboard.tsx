import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/campus/SiteChrome";
import { PageIntro, StageChip } from "@/components/campus/PageIntro";
import { JourneyRail } from "@/components/campus/JourneyRail";
import { StageTrack } from "@/components/campus/StageTrack";
import { OpportunityCard } from "@/components/campus/OpportunityCard";
import { journeyStages, studentProfile } from "@/data/campus";
import { formatWhen, statusMeta, usePulse } from "@/lib/pulse-store";
import { Link as RouterLink } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your journey — Campus Pulse" },
      {
        name: "description",
        content:
          "A personal growth centre: where you are on the campus journey, what is coming up, and what to explore next.",
      },
      { property: "og:title", content: "Your journey — Campus Pulse" },
      {
        property: "og:description",
        content: "Progress over information — your campus journey from discovery to achievement.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { publicOpportunities, savedOpportunities, myApplications, getOpportunity } = usePulse();

  const accepted = myApplications.filter((a) => a.status === "accepted" || a.status === "completed");
  const pending = myApplications.filter((a) => a.status === "pending");
  const appliedIds = new Set(myApplications.map((a) => a.opportunityId));

  // Where the student actually is on the journey, derived from their activity.
  const stageNow =
    accepted.length > 0 ? "Achieve" : myApplications.length > 0 ? "Apply" : savedOpportunities.length > 0 ? "Apply" : "Discover";
  const currentIndex = journeyStages.findIndex((s) => s.stage === stageNow);

  const upcoming = [...savedOpportunities, ...myApplications.map((a) => getOpportunity(a.opportunityId))]
    .filter((o): o is NonNullable<typeof o> => Boolean(o))
    .filter((o, i, arr) => arr.findIndex((x) => x.id === o.id) === i)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 4);

  const recommended = publicOpportunities
    .filter((o) => !appliedIds.has(o.id))
    .sort((a, b) => b.match - a.match)
    .slice(0, 2);

  // Activity is generated from real actions, never hardcoded.
  const activity = [
    ...myApplications.map((a) => {
      const o = getOpportunity(a.opportunityId);
      return {
        key: `app-${a.id}`,
        eyebrow: a.status === "pending" ? "Apply" : a.status === "rejected" ? "Apply" : "Achieve",
        title: `${o?.title ?? "Opportunity"} — ${statusMeta[a.status].label}`,
        detail: statusMeta[a.status].help,
        meta: formatWhen(a.appliedAt),
        state: (a.status === "pending" ? "active" : a.status === "rejected" ? "upcoming" : "done") as
          | "active"
          | "upcoming"
          | "done",
        sort: new Date(a.appliedAt).getTime(),
      };
    }),
    ...savedOpportunities.slice(0, 4).map((o) => ({
      key: `save-${o.id}`,
      eyebrow: "Discover",
      title: `${o.title} saved`,
      detail: `Closes ${o.deadline} · ${o.commitment}. Nothing committed until you apply.`,
      meta: "Saved",
      state: "upcoming" as const,
      sort: 0,
    })),
  ].sort((a, b) => b.sort - a.sort);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <PageIntro
        eyebrow={`Good to see you, ${studentProfile.name.split(" ")[0]}`}
        title={
          myApplications.length === 0
            ? "Your journey starts with one opportunity."
            : pending.length > 0
              ? `${pending.length} application${pending.length === 1 ? "" : "s"} under review.`
              : "Your record is growing."
        }
        lede={
          myApplications.length === 0
            ? "Nothing submitted yet. Save what interests you, then apply — everything you do shows up here."
            : "Saved, applied, decided — the whole picture, in the order it matters."
        }
        aside={<StageChip stage={`Current stage — ${stageNow}`} />}
      />

      {/* The journey is the visual centre of the dashboard */}
      <section className="shell">
        <div className="panel panel-signal p-8 md:p-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="marker">Your campus journey</p>
              <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight">
                Currently transmitting from{" "}
                <span className="text-primary">{studentProfile.stageNow}</span>
              </h2>
            </div>
            <dl className="flex flex-wrap gap-8">
              {[
                { label: "Saved", value: savedOpportunities.length },
                { label: "Applications", value: myApplications.length },
                { label: "Under review", value: pending.length },
                { label: "Accepted", value: accepted.length },
              ].map((f) => (
                <div key={f.label}>
                  <dd className="type-figure text-2xl">{f.value}</dd>
                  <dt className="mt-1 text-xs text-muted-foreground">{f.label}</dt>
                </div>
              ))}
            </dl>
          </div>

          <StageTrack
            className="mt-12"
            dense
            items={journeyStages.map((s, i) => ({
              stage: s.stage,
              line: s.line,
              state: i < currentIndex ? "done" : i === currentIndex ? "active" : "upcoming",
            }))}
          />
        </div>
      </section>

      <div className="shell mt-20 grid gap-16 lg:grid-cols-[1.25fr_0.75fr]">
        {/* Living timeline */}
        <section>
          <div className="flex items-baseline justify-between border-b border-border pb-5">
            <h2 className="type-section">Activity</h2>
            <span className="text-xs text-muted-foreground">{activity.length} events</span>
          </div>
          {activity.length === 0 ? (
            <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
              Nothing yet. The moment you save or apply to something, it appears on this timeline.{" "}
              <RouterLink to="/explore" className="text-primary">
                Explore opportunities
              </RouterLink>
              .
            </p>
          ) : (
            <JourneyRail className="mt-8" items={activity} />
          )}
        </section>

        {/* Upcoming + skills in motion */}
        <aside className="space-y-14">
          <div>
            <div className="flex items-baseline justify-between border-b border-border pb-4">
              <h2 className="type-section">Coming up</h2>
              <span className="text-xs text-muted-foreground">{upcoming.length} tracked</span>
            </div>
            {upcoming.length === 0 && (
              <p className="mt-6 text-sm text-muted-foreground">
                No deadlines tracked yet — saving an opportunity puts it here.
              </p>
            )}
            <div className="mt-6 space-y-5">
              {upcoming.map((o) => (
                <Link
                  key={o.id}
                  to="/opportunity/$id"
                  params={{ id: o.id }}
                  className="group flex items-start justify-between gap-4 border-b border-border pb-5 transition-colors hover:border-border-strong"
                >
                  <div>
                    <p className="font-display text-sm font-bold tracking-tight transition-colors group-hover:text-primary">
                      {o.title}
                    </p>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {o.deadline} · {o.commitment}
                    </p>
                    <p
                      className={cn(
                        "mt-2.5 text-xs font-semibold",
                        o.daysLeft <= 7 ? "text-energy" : "text-muted-foreground",
                      )}
                    >
                      {o.daysLeft} days left
                    </p>
                  </div>
                  <ArrowUpRight className="mt-1 size-4 flex-none text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="type-section">Skills you are moving</h2>
            <div className="mt-6 space-y-6">
              {studentProfile.skills.slice(0, 3).map((s) => (
                <div key={s.name}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-medium">{s.name}</span>
                    <span className="type-figure text-xs text-muted-foreground">{s.level}</span>
                  </div>
                  <div className="mt-2.5 flex items-end gap-1" aria-hidden>
                    {Array.from({ length: 20 }).map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "flex-1 rounded-full",
                          i < Math.round(s.level / 5) ? "bg-growth" : "bg-border-strong",
                        )}
                        style={{ height: `${5 + ((i * 4) % 9)}px` }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/profile"
              className="underline-sweep mt-8 inline-block text-sm font-semibold text-primary"
            >
              See your full profile
            </Link>
          </div>
        </aside>
      </div>

      {/* Personally selected recommendations */}
      <section className="shell mt-24">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-6">
          <div>
            <p className="marker">Because of what you have done</p>
            <h2 className="mt-4 type-heading">Worth your next step.</h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Picked from your React and design-systems signals, not from what is trending.
          </p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {recommended.map((o) => (
            <OpportunityCard key={o.id} opportunity={o} />
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
