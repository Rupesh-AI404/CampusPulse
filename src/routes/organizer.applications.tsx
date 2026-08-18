import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/campus/SiteChrome";
import { PageIntro } from "@/components/campus/PageIntro";
import { EmptyState, StatusBadge } from "@/components/campus/StatusBits";
import { MatchSignal } from "@/components/campus/MatchMeter";
import { formatWhen, usePulse } from "@/lib/pulse-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/organizer/applications")({
  validateSearch: (search: Record<string, unknown>): { opportunity?: string } =>
    typeof search['opportunity'] === "string" ? { opportunity: search['opportunity'] } : {},
  head: () => ({
    meta: [
      { title: "Review applications — Campus Pulse organiser" },
      {
        name: "description",
        content:
          "Read every applicant's motivation, skills and match, then accept or reject. The student sees your decision immediately.",
      },
      { property: "og:title", content: "Review applications — Campus Pulse organiser" },
      {
        property: "og:description",
        content: "Accept or reject applicants — students see the decision on their side at once.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReviewApplications,
});

function ReviewApplications() {
  const { opportunity: filterId } = Route.useSearch();
  const navigate = Route.useNavigate();
  const {
    organizerOpportunities,
    organizerApplications,
    getOpportunity,
    setApplicationStatus,
    ready,
  } = usePulse();

  const list = filterId
    ? organizerApplications.filter((a) => a.opportunityId === filterId)
    : organizerApplications;
  const pending = list.filter((a) => a.status === "pending").length;

  const decide = (id: string, name: string, accept: boolean) => {
    setApplicationStatus(id, accept ? "accepted" : "rejected");
    toast[accept ? "success" : "message"](
      accept ? `${name} accepted` : `${name} rejected`,
      { description: "The student's Applications page now shows this decision." },
    );
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <PageIntro
        eyebrow="Organiser · Review"
        title="Applications."
        lede="Each applicant, with why the match was made. Your decision updates the student's side of Campus Pulse instantly."
        aside={
          <p className="text-sm text-muted-foreground">
            {list.length} total
            {pending > 0 && <span className="ml-2 text-energy">{pending} awaiting decision</span>}
          </p>
        }
      />

      <section className="shell">
        <div className="flex flex-wrap gap-2 border-b border-border pb-6">
          <button
            onClick={() => void navigate({ search: {} })}
            aria-pressed={!filterId}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-all",
              !filterId
                ? "border-primary/70 bg-primary/12 text-foreground"
                : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
            )}
          >
            All opportunities
          </button>
          {organizerOpportunities.map((o) => (
            <button
              key={o.id}
              onClick={() => void navigate({ search: { opportunity: o.id } })}
              aria-pressed={filterId === o.id}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all",
                filterId === o.id
                  ? "border-primary/70 bg-primary/12 text-foreground"
                  : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
              )}
            >
              {o.title}
              <span className="text-xs tabular-nums opacity-60">
                {organizerApplications.filter((a) => a.opportunityId === o.id).length}
              </span>
            </button>
          ))}
        </div>

        {ready && list.length === 0 ? (
          <EmptyState
            title="This opportunity hasn't received applications yet."
            body="Applications appear here the moment a student submits one, with their motivation and match signal."
            actionLabel="Create opportunity"
            actionTo="/organizer/new"
          />
        ) : (
          <ul className="mt-8 space-y-5">
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
                        <span className="badge badge-neutral">{o?.title ?? "Removed"}</span>
                      </div>
                      <h2 className="mt-3 font-display text-lg font-bold tracking-tight">
                        {a.studentName}
                      </h2>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        {a.studentYear} · applied {formatWhen(a.appliedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MatchSignal value={a.match} />
                      <span className="type-figure text-sm">{a.match}% match</span>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 border-t border-border pt-5 md:grid-cols-2">
                    <div>
                      <p className="marker">Motivation</p>
                      <p className="mt-3 text-sm leading-relaxed text-foreground/85">
                        {a.motivation}
                      </p>
                      <p className="marker mt-6">Experience</p>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {a.experience}
                      </p>
                      {a.note && (
                        <p className="mt-4 text-xs text-muted-foreground">Note: {a.note}</p>
                      )}
                    </div>
                    <div>
                      <p className="marker">Skills</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {a.studentSkills.map((s) => (
                          <span key={s} className="badge badge-neutral px-3 py-1 text-[0.7rem]">
                            {s}
                          </span>
                        ))}
                      </div>
                      <p className="marker mt-6">Interests</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {a.studentInterests.map((s) => (
                          <span key={s} className="badge badge-primary px-3 py-1 text-[0.7rem]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-5">
                    {a.status === "pending" ? (
                      <>
                        <button
                          className="btn btn-primary px-4 py-2 text-xs"
                          onClick={() => decide(a.id, a.studentName, true)}
                        >
                          <Check className="size-3.5" />
                          Accept
                        </button>
                        <button
                          className="btn btn-quiet px-4 py-2 text-xs"
                          onClick={() => decide(a.id, a.studentName, false)}
                        >
                          <X className="size-3.5" />
                          Reject
                        </button>
                        <span className="text-xs text-muted-foreground">
                          The student is notified on their Applications page.
                        </span>
                      </>
                    ) : (
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs text-muted-foreground">
                          You decided this one. You can still change it.
                        </span>
                        <button
                          className="btn btn-quiet px-3 py-1.5 text-xs"
                          onClick={() => setApplicationStatus(a.id, "pending")}
                        >
                          Undo decision
                        </button>
                        {a.status === "accepted" && (
                          <button
                            className="btn btn-quiet px-3 py-1.5 text-xs"
                            onClick={() => {
                              setApplicationStatus(a.id, "completed");
                              toast.success("Marked completed", {
                                description: `${a.studentName} now has this as evidence on their profile.`,
                              });
                            }}
                          >
                            Mark completed
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <p className="mt-10 text-xs text-muted-foreground">
          Reviewing as College IT Department.{" "}
          <Link to="/organizer/opportunities" className="text-primary">
            Back to my opportunities
          </Link>
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}
