import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/campus/SiteChrome";
import { PageIntro } from "@/components/campus/PageIntro";
import { OpportunityCard } from "@/components/campus/OpportunityCard";
import { EmptyState } from "@/components/campus/StatusBits";
import { usePulse } from "@/lib/pulse-store";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved opportunities — Campus Pulse" },
      {
        name: "description",
        content:
          "Everything you bookmarked on Campus Pulse, kept in one place so you never lose an opportunity you meant to come back to.",
      },
      { property: "og:title", content: "Saved opportunities — Campus Pulse" },
      {
        property: "og:description",
        content: "Your shortlist: opportunities you saved, ready to apply when you are.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { savedOpportunities, ready } = usePulse();
  const closing = savedOpportunities.filter((o) => o.daysLeft <= 7).length;

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <PageIntro
        eyebrow="Your shortlist"
        title="Saved opportunities."
        lede="Saved here, not lost in a group chat. Remove one any time — nothing is committed until you apply."
        aside={
          <p className="text-sm text-muted-foreground">
            {savedOpportunities.length} saved
            {closing > 0 && <span className="ml-2 text-energy">{closing} closing this week</span>}
          </p>
        }
      />

      <section className="shell">
        {ready && savedOpportunities.length === 0 ? (
          <EmptyState
            title="Nothing saved yet."
            body="When an opportunity looks interesting, hit Save on the card or its page. It waits here until you decide."
            actionLabel="Explore opportunities"
            actionTo="/explore"
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {savedOpportunities.map((o, i) => (
              <div key={o.id} className="animate-rise" style={{ animationDelay: `${i * 60}ms` }}>
                <OpportunityCard opportunity={o} />
              </div>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
