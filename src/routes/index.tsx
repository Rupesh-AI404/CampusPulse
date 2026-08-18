import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/campus/SiteChrome";
import { SignalField } from "@/components/campus/SignalField";
import { StageTrack } from "@/components/campus/StageTrack";
import { OpportunityCard } from "@/components/campus/OpportunityCard";
import { journeyStages, opportunities, categories } from "@/data/campus";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Campus Pulse" },
      {
        name: "description",
        content:
          "Campus Pulse helps students discover internships, hackathons, workshops and clubs, then track the journey from discovery to achievement.",
      },
      { property: "og:title", content: "Campus Pulse" },
      {
        property: "og:description",
        content:
          "A student growth companion: discover opportunities, apply with context, and build a record of what you achieved.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [lead, ...rest] = opportunities.slice(0, 3);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero — one statement, one action, one diagram that explains the product */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-canvas" aria-hidden />
        <div className="shell relative grid items-center gap-14 pt-20 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pt-24 lg:pb-28">
          <div>
            <p className="marker animate-rise">For students who want the next step</p>
            <h1 className="mt-6 max-w-xl type-editorial animate-rise">
              Your campus
              <br />
              opportunities,
              <br />
              <span className="text-primary">connected.</span>
            </h1>
            <p className="mt-8 max-w-lg type-lede animate-rise" style={{ animationDelay: "80ms" }}>
              Internships, hackathons, workshops and clubs live in scattered group chats and
              forgotten notice boards. Campus Pulse gathers them into one place — and keeps the
              record of what you did with them.
            </p>

            <div
              className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 animate-rise"
              style={{ animationDelay: "140ms" }}
            >
              <Link to="/explore" className="btn btn-primary group">
                Start exploring
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/dashboard"
                className="underline-sweep text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                See a student journey
              </Link>
            </div>
          </div>

          <div className="animate-rise" style={{ animationDelay: "180ms" }}>
            <SignalField className="w-full text-muted-foreground" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground lg:ml-8">
              Every opportunity on campus becomes a signal. Campus Pulse reads the ones that fit
              you, and carries them through your journey.
            </p>
          </div>
        </div>

        <div className="shell relative">
          <dl className="grid max-w-4xl gap-8 border-t border-border pt-8 sm:grid-cols-3">
            {[
              { k: "24", v: "live opportunities across campus" },
              { k: "9", v: "organisers posting directly" },
              { k: "4", v: "stages tracked from discovery to achievement" },
            ].map((s) => (
              <div key={s.k}>
                <dt className="type-figure text-4xl">{s.k}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Signature section: the journey as one connected system */}
      <section className="shell py-24">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="marker">The Campus Pulse journey</p>
            <h2 className="mt-5 type-heading">
              Progress, not
              <br />
              a list of postings.
            </h2>
          </div>
          <p className="max-w-sm type-lede">
            Every opportunity sits somewhere on the same four-stage line. That line follows you
            across the whole product — explore, dashboard, profile.
          </p>
        </div>

        <StageTrack
          className="mt-16 pt-2"
          items={journeyStages.map((s, i) => ({
            stage: s.stage,
            line: s.line,
            detail: s.detail,
            state: i === 0 ? "done" : i === 1 ? "active" : "upcoming",
          }))}
        />
      </section>

      {/* Discovery preview — asymmetric, lead opportunity carries weight */}
      <section className="shell py-16">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-6">
          <div>
            <p className="marker">Opportunity intelligence</p>
            <h2 className="mt-4 type-heading">Matched to what you are building.</h2>
          </div>
          <Link to="/explore" className="underline-sweep text-sm font-semibold text-primary">
            Explore all opportunities
          </Link>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          {lead && <OpportunityCard opportunity={lead} emphasis />}
          <div className="grid gap-5">
            {rest.map((o) => (
              <OpportunityCard key={o.id} opportunity={o} />
            ))}
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="shell py-20">
        <div className="grid gap-12 border-t border-border pt-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="marker">Community</p>
            <h2 className="mt-5 max-w-md type-heading">
              Built by the societies actually running things.
            </h2>
            <p className="mt-5 max-w-md type-lede">
              Organisers post their own opportunities — no scraping, no third-hand screenshots.
              When a deadline moves, it moves here first.
            </p>
          </div>

          <div className="grid gap-x-10 gap-y-1 sm:grid-cols-2">
            {categories.map((c) => (
              <Link
                key={c.name}
                to="/explore"
                className="group flex items-baseline justify-between gap-4 border-b border-border py-4 transition-colors hover:border-border-strong"
              >
                <span>
                  <span className="font-display text-base font-bold tracking-tight transition-colors group-hover:text-primary">
                    {c.name}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">{c.note}</span>
                </span>
                <span className="type-figure text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                  {c.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Closing action */}
      <section className="shell pb-8">
        <div className="panel panel-signal flex flex-col items-start gap-8 p-10 md:flex-row md:items-center md:justify-between md:p-14">
          <h2 className="max-w-lg type-heading">
            One place to discover.
            <br />
            One record of your growth.
          </h2>
          <Link to="/explore" className="btn btn-primary group">
            Find your next opportunity
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
