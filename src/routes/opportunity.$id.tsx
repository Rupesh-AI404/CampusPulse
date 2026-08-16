import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, MapPin, Users } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/campus/SiteChrome";
import { MatchInsight } from "@/components/campus/MatchInsight";
import { MatchSignal } from "@/components/campus/MatchMeter";
import { StageTrack } from "@/components/campus/StageTrack";
import { CategoryTag, DeadlineTag } from "@/components/campus/OpportunityCard";
import { getOpportunity } from "@/data/campus";
import { ApplyPanel, SaveButton } from "@/components/campus/StudentActions";
import { StatusBadge } from "@/components/campus/StatusBits";
import { usePulse } from "@/lib/pulse-store";

export const Route = createFileRoute("/opportunity/$id")({
  loader: ({ params }) => ({ opportunity: getOpportunity(params.id) ?? null }),
  head: ({ loaderData }) => {
    if (!loaderData?.opportunity) {
      return {
        meta: [{ title: "Opportunity not found — Campus Pulse" }, { name: "robots", content: "noindex" }],
      };
    }
    const { opportunity } = loaderData;
    if (!opportunity) return { meta: [{ title: "Opportunity — Campus Pulse" }] };
    return {
      meta: [
        { title: `${opportunity.title} — Campus Pulse` },
        { name: "description", content: opportunity.tagline },
        { property: "og:title", content: `${opportunity.title} — Campus Pulse` },
        { property: "og:description", content: opportunity.tagline },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: OpportunityDetail,
});

function OpportunityDetail() {
  const { id } = Route.useParams();
  const { getOpportunity: getLive, publicOpportunities, applicationFor, ready } = usePulse();
  const o = getLive(id);
  const application = o ? applicationFor(o.id) : undefined;

  if (!o) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="shell py-24">
          {ready ? (
            <>
              <h1 className="type-heading">This opportunity is no longer listed.</h1>
              <p className="mt-4 max-w-md type-lede">
                The organiser may have archived it. Everything currently open is in Explore.
              </p>
              <Link to="/explore" className="btn btn-primary mt-8">
                Back to exploring
              </Link>
            </>
          ) : (
            <div className="loading-track h-40 rounded-md" />
          )}
        </div>
        <SiteFooter />
      </div>
    );
  }

  const related = publicOpportunities.filter((x) => x.id !== o.id).slice(0, 2);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="shell pt-10">
        <Link
          to="/explore"
          className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          Back to exploring
        </Link>
      </div>

      {/* Editorial masthead */}
      <header className="shell pt-10 pb-12">
        <div className="flex flex-wrap items-center gap-2.5">
          <CategoryTag>{o.category}</CategoryTag>
          <span className="badge badge-neutral">{o.mode}</span>
          {o.featured && <span className="badge badge-energy">Featured</span>}
          {o.match >= 85 && <span className="badge badge-growth">Strong match</span>}
          {application && <StatusBadge status={application.status} />}
        </div>
        <h1 className="mt-6 max-w-3xl type-heading animate-rise">{o.title}</h1>
        <p
          className="mt-6 max-w-2xl font-display text-xl leading-snug font-semibold tracking-tight text-foreground/80 animate-rise"
          style={{ animationDelay: "70ms" }}
        >
          {o.tagline}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-6 text-sm text-muted-foreground">
          <span>{o.organizer.name}</span>
          <span>{o.commitment}</span>
          <span>{o.seats}</span>
          <DeadlineTag days={o.daysLeft} label={o.deadline} />
        </div>
      </header>

      <div className="shell grid gap-16 lg:grid-cols-[1.35fr_0.65fr]">
        {/* Story */}
        <div>
          <p className="marker">The story</p>
          <div className="mt-6 max-w-2xl space-y-5">
            {o.story.map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "font-display text-2xl leading-[1.22] font-bold tracking-tight"
                    : "text-[1rem] leading-[1.75] text-muted-foreground"
                }
              >
                {p}
              </p>
            ))}
          </div>

          <div className="mt-14 border-t border-border pt-10">
            <p className="marker">What you walk away with</p>
            <ul className="mt-6 space-y-3.5">
              {o.outcomes.map((out) => (
                <li key={out} className="flex items-start gap-3 text-[0.98rem]">
                  <Check className="mt-1 size-4 flex-none text-growth" />
                  <span>{out}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Journey position — memorable, one connected system */}
          <div className="mt-14 border-t border-border pt-10">
            <p className="marker">Where this sits on your journey</p>
            <div className="panel panel-signal mt-6 p-6 md:p-8">
              <StageTrack
                dense
                items={[
                  {
                    stage: "Discover",
                    line: "You found it here.",
                    state: "done",
                  },
                  {
                    stage: "Apply",
                    line: `Submit before ${o.deadline}.`,
                    state: "active",
                  },
                  {
                    stage: "Participate",
                    line: `${o.commitment} · ${o.location}`,
                    state: "upcoming",
                  },
                  {
                    stage: "Achieve",
                    line: `${o.skills.slice(0, 2).join(" and ")} become evidence.`,
                    state: "upcoming",
                  },
                ]}
              />
            </div>
          </div>

          <div className="mt-14 border-t border-border pt-10">
            <p className="marker">Skills in play</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {o.skills.map((s) => (
                <span key={s} className="badge badge-neutral px-3 py-1 text-[0.72rem]">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-14 border-t border-border pt-10">
            <p className="marker">Organiser</p>
            <div className="mt-6 flex items-start gap-4">
              <span className="grid size-12 flex-none place-items-center rounded-md border border-border-strong bg-surface font-display text-sm font-bold">
                {o.organizer.initials}
              </span>
              <div>
                <p className="font-display text-base font-bold tracking-tight">
                  {o.organizer.name}
                </p>
                <p className="text-xs text-muted-foreground">{o.organizer.role}</p>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {o.organizer.about}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decision assistant */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="panel panel-signal p-6">
            <MatchInsight value={o.match} reasons={o.matchReasons} size="lg" />

            <dl className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
              <Row icon={<MapPin className="size-3.5" />} label="Where" value={o.location} />
              <Row icon={<Users className="size-3.5" />} label="Places" value={o.seats} />
              <Row label="Commitment" value={o.commitment} />
            </dl>

            <div className="mt-6 border-t border-border pt-5">
              <DeadlineTag days={o.daysLeft} label={o.deadline} />
              <div className="mt-4 space-y-2">
                <ApplyPanel opportunity={o} />
                <SaveButton id={o.id} title={o.title} variant="full" />
              </div>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Applying adds this to Applications and your journey. Saving is reversible.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <p className="marker">Students also considered</p>
            <div className="mt-5 space-y-4">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to="/opportunity/$id"
                  params={{ id: r.id }}
                  className="group block border-b border-border pb-4 transition-colors hover:border-border-strong"
                >
                  <p className="font-display text-sm font-bold tracking-tight transition-colors group-hover:text-primary">
                    {r.title}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <MatchSignal value={r.match} />
                    <span className="text-xs text-muted-foreground">
                      {r.match}% · {r.category}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <SiteFooter />
    </div>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="flex items-center gap-2 text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="max-w-[60%] text-right">{value}</dd>
    </div>
  );
}
