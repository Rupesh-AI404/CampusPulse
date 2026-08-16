import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Inbox, Plus } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/campus/SiteChrome";
import { PageIntro } from "@/components/campus/PageIntro";
import { EmptyState, StatusBadge } from "@/components/campus/StatusBits";
import { formatWhen, organizerProfile, usePulse } from "@/lib/pulse-store";

export const Route = createFileRoute("/organizer/")({
  head: () => ({
    meta: [
      { title: "Organiser dashboard — Campus Pulse" },
      {
        name: "description",
        content:
          "Everything you have published on Campus Pulse: live opportunities, applications received and applicants still waiting for a decision.",
      },
      { property: "og:title", content: "Organiser dashboard — Campus Pulse" },
      {
        property: "og:description",
        content: "Publish opportunities, review applicants, and decide — all in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrganizerDashboard,
});

function OrganizerDashboard() {
  const { organizerOpportunities, organizerApplications, getOpportunity, ready } = usePulse();

  const live = organizerOpportunities.filter((o) => o.status === "published" && o.daysLeft > 0);
  const pending = organizerApplications.filter((a) => a.status === "pending");
  const accepted = organizerApplications.filter((a) => a.status === "accepted");
  const recent = organizerApplications.slice(0, 4);

  const figures = [
    { label: "Opportunities published", value: organizerOpportunities.length },
    { label: "Currently open", value: live.length },
    { label: "Applications received", value: organizerApplications.length },
    { label: "Waiting on you", value: pending.length, urgent: pending.length > 0 },
    { label: "Accepted applicants", value: accepted.length },
  ];

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <PageIntro
        eyebrow={organizerProfile.name}
        title={
          pending.length > 0
            ? `${pending.length} applicant${pending.length === 1 ? "" : "s"} waiting on a decision.`
            : "Nothing waiting on you right now."
        }
        lede="Your side of the ecosystem: what you have opened to campus, who responded, and what still needs your judgement."
        aside={
          <div className="flex flex-wrap gap-3">
            <Link to="/organizer/new" className="btn btn-primary">
              <Plus className="size-4" />
              Create opportunity
            </Link>
            <Link to="/organizer/applications" className="btn btn-quiet">
              <Inbox className="size-4" />
              Review applications
            </Link>
          </div>
        }
      />

      <section className="shell">
        <div className="panel panel-signal p-8 md:p-10">
          <p className="marker">Live numbers, derived from your actual activity</p>
          <dl className="mt-8 grid gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {figures.map((f) => (
              <div key={f.label}>
                <dd
                  className={
                    "type-figure text-3xl " + (f.urgent ? "text-energy" : "text-foreground")
                  }
                >
                  {f.value}
                </dd>
                <dt className="mt-2 text-xs leading-snug text-muted-foreground">{f.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="shell mt-20 grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <section>
          <div className="flex items-baseline justify-between border-b border-border pb-5">
            <h2 className="type-section">Your opportunities</h2>
            <Link to="/organizer/opportunities" className="underline-sweep text-sm text-primary">
              Manage all
            </Link>
          </div>

          {ready && organizerOpportunities.length === 0 ? (
            <EmptyState
              title="You haven't published an opportunity yet."
              body="Create one and it appears in Explore for students immediately, with a match signal generated from their profile."
              actionLabel="Create opportunity"
              actionTo="/organizer/new"
            />
          ) : (
            <ul className="mt-6 space-y-5">
              {organizerOpportunities.slice(0, 4).map((o) => {
                const count = organizerApplications.filter((a) => a.opportunityId === o.id).length;
                return (
                  <li key={o.id} className="border-b border-border pb-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-display text-base font-bold tracking-tight">{o.title}</p>
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          {o.category} · closes {o.deadline} · {o.seats}
                        </p>
                      </div>
                      <Link
                        to="/organizer/applications"
                        search={{ opportunity: o.id }}
                        className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                      >
                        {count} application{count === 1 ? "" : "s"}
                        <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5" />
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <aside>
          <div className="flex items-baseline justify-between border-b border-border pb-5">
            <h2 className="type-section">Latest applicants</h2>
            <span className="text-xs text-muted-foreground">{organizerApplications.length} total</span>
          </div>
          {recent.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">
              No applications received yet. They appear here the moment a student applies.
            </p>
          ) : (
            <ul className="mt-6 space-y-5">
              {recent.map((a) => (
                <li key={a.id} className="border-b border-border pb-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-display text-sm font-bold tracking-tight">
                        {a.studentName}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {getOpportunity(a.opportunityId)?.title} · {formatWhen(a.appliedAt)}
                      </p>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Link
            to="/organizer/applications"
            className="underline-sweep mt-8 inline-block text-sm font-semibold text-primary"
          >
            Open the review queue
          </Link>
        </aside>
      </div>

      <SiteFooter />
    </div>
  );
}
