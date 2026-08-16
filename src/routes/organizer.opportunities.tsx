import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Plus, Archive, Inbox } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader, SiteFooter } from "@/components/campus/SiteChrome";
import { PageIntro } from "@/components/campus/PageIntro";
import { EmptyState } from "@/components/campus/StatusBits";
import { formatWhen, usePulse } from "@/lib/pulse-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/organizer/opportunities")({
  head: () => ({
    meta: [
      { title: "My opportunities — Campus Pulse organiser" },
      {
        name: "description",
        content:
          "Manage the opportunities you published on Campus Pulse: edit details, watch applications arrive, archive what has closed.",
      },
      { property: "og:title", content: "My opportunities — Campus Pulse organiser" },
      {
        property: "og:description",
        content: "Edit, review and archive the opportunities you run for students.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrganizerOpportunities,
});

function OrganizerOpportunities() {
  const { organizerOpportunities, applicationsForOpportunity, setOpportunityStatus, ready } =
    usePulse();
  const [confirming, setConfirming] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <PageIntro
        eyebrow="Organiser"
        title="My opportunities."
        lede="Everything you have opened to campus, with the applications each one attracted."
        aside={
          <Link to="/organizer/new" className="btn btn-primary">
            <Plus className="size-4" />
            Create opportunity
          </Link>
        }
      />

      <section className="shell">
        {ready && organizerOpportunities.length === 0 ? (
          <EmptyState
            title="You haven't published an opportunity yet."
            body="Publish your first one — students will see it in Explore with a match signal straight away."
            actionLabel="Create opportunity"
            actionTo="/organizer/new"
          />
        ) : (
          <ul className="space-y-5">
            {organizerOpportunities.map((o, i) => {
              const apps = applicationsForOpportunity(o.id);
              const pending = apps.filter((a) => a.status === "pending").length;
              const closed = o.daysLeft <= 0;
              return (
                <li
                  key={o.id}
                  className="panel animate-rise p-6"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-6">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="badge badge-neutral">{o.category}</span>
                        <span className={cn("badge", closed ? "badge-energy" : "badge-growth")}>
                          {closed ? "Closed" : "Open"}
                        </span>
                        {pending > 0 && (
                          <span className="badge badge-primary">{pending} to review</span>
                        )}
                      </div>
                      <h2 className="mt-3 font-display text-lg font-bold tracking-tight">
                        {o.title}
                      </h2>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        Created {formatWhen(o.createdAt)} · closes {o.deadline} · {o.seats}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to="/opportunity/$id"
                        params={{ id: o.id }}
                        className="btn btn-quiet px-3 py-2 text-xs"
                      >
                        View
                      </Link>
                      <Link
                        to="/organizer/edit/$id"
                        params={{ id: o.id }}
                        className="btn btn-quiet px-3 py-2 text-xs"
                      >
                        <Pencil className="size-3.5" />
                        Edit
                      </Link>
                      <Link
                        to="/organizer/applications"
                        search={{ opportunity: o.id }}
                        className="btn btn-primary px-3 py-2 text-xs"
                      >
                        <Inbox className="size-3.5" />
                        {apps.length} application{apps.length === 1 ? "" : "s"}
                      </Link>
                    </div>
                  </div>

                  {confirming === o.id ? (
                    <div className="mt-5 flex flex-wrap items-center gap-3 rounded-md border border-energy/40 bg-energy/5 p-4">
                      <p className="text-sm text-foreground">
                        Archive “{o.title}”? Students stop seeing it. Its {apps.length} application
                        {apps.length === 1 ? "" : "s"} stay on record.
                      </p>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-quiet px-3 py-2 text-xs"
                          onClick={() => setConfirming(null)}
                        >
                          Keep it live
                        </button>
                        <button
                          className="btn btn-primary px-3 py-2 text-xs"
                          onClick={() => {
                            setOpportunityStatus(o.id, "archived");
                            setConfirming(null);
                            toast("Opportunity archived", {
                              description: `${o.title} is no longer visible to students.`,
                            });
                          }}
                        >
                          Archive it
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirming(o.id)}
                      className="mt-5 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-energy"
                    >
                      <Archive className="size-3.5" />
                      Archive this opportunity
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
